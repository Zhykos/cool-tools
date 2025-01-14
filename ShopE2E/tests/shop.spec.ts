import { test, expect, type Page, type Locator, type APIRequestContext, type APIResponse } from '@playwright/test';
import { comparePdfToSnapshot } from 'pdf-visual-diff'

test('Full shop test', async ({ page, request }) => {
  // Shop scenario

  await goHome(page);
  await goToShopFromHome(page);
  await addUser(page);
  const userUUID: string = await selectUser(page);
  await selectProduct(page, userUUID);
  const pdfURL: string = await createOrder(page);
  await openPDF(pdfURL, request);

  // Check external tools

  await checkZipkin(page);
  await checkPrometheus(page);

  // TODO
  // Check grafana dashboards
  // Check papermerge
  // Check email
  // Check excalidraw
});

async function goHome(page: Page): Promise<void> {
  await page.goto('http://localhost:5173/');

  await expect(page).toHaveTitle("Vite App");
  await expect(page).toHaveScreenshot();
}

async function goToShopFromHome(page: Page): Promise<void> {
  await page.getByTestId("shop-link").click();

  await expect(page).toHaveTitle("Shop");
  await expect(page.getByTestId("product-list-title")).toHaveText("Select a product to put it on your basket", { timeout: 5000 });
  await expect(page).toHaveScreenshot({ fullPage: true });
}

async function addUser(page: Page): Promise<void> {
  await expect(page.getByTestId("user-list-title")).toHaveText("No user: create a new one above");

  await page.getByTestId("username-input").fill("John Doe");
  await page.getByTestId("create-user-button").click();
  await expect(page.getByTestId("user-list-title")).toHaveText("Click on a user to select it", { timeout: 5000 });
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });

  const userListItemsLocator: Locator = page.getByRole('listitem').filter({ hasText: "John Doe" });
  await expect(userListItemsLocator).toHaveCount(1);
  await expect(userListItemsLocator).toHaveText(/John Doe\([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\)/);
}

async function selectUser(page: Page): Promise<string> {
  await expect(page.getByTestId("selected-user")).toHaveText("User not selected yet (select one below)");

  const userListItemsLocator: Locator = page.getByRole('listitem').filter({ hasText: "John Doe" });
  const listItemID: string | null = await userListItemsLocator.getAttribute("data-testid");
  expect(listItemID).not.toBeNull();

  const itemUUID: string = (listItemID as string).split(':')[1];
  const linkID = `${(listItemID as string).split(':')[0]}-link:${itemUUID}`;

  const userItemLocator: Locator = page.getByTestId(linkID);
  await expect(userItemLocator).toHaveCount(1);
  await expect(userItemLocator).toContainText("John Doe");

  await userItemLocator.click();

  await expect(page.getByTestId("selected-user")).toHaveText(/\{"uuid":"[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}","name":"John Doe"\}/);
  await expect(page.getByTestId("selected-user")).toContainText(itemUUID);

  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.03 });

  return itemUUID;
}

async function selectProduct(page: Page, userUUID: string): Promise<void> {
  await expect(page.getByRole('listitem').filter({ hasNotText: "John Doe" })).toHaveCount(10);

  await expect(page.getByTestId("basket")).toHaveText("Select user and product (select them above)");

  await page.getByTestId("product-link:Zulu-346").click();

  await expect(page.getByTestId("basket")).toHaveText(/\{"basketId":\d+,"userId":"[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}","productId":"1d9f5cd4-d25e-4bc0-8459-694b359bf388"}/);
  await expect(page.getByTestId("basket")).toContainText(userUUID);

  await page.mouse.wheel(0, 1000);

  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.03 });
}

async function createOrder(page: Page): Promise<string> {
  await expect(page.getByTestId("pdf-link")).toHaveCount(0);

  await page.getByTestId("create-order").click();

  await expect(page.getByTestId("pdf-div")).toHaveText(/Download PDF: http:\/\/localhost:9005\/invoice\/[0-9a-f]+\/download/, { timeout: 20_000 });

  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.04 });

  return await page.getByTestId("pdf-link").innerText();
}

async function openPDF(pdfURL: string, request: APIRequestContext): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 5000)); // Arbitrary wait for the PDF to be generated ; XXX better way to wait for the PDF to be generated

  const response: APIResponse = await request.get(pdfURL);
  expect(response.status()).toBe(200);

  const pdfBuffer = await response.body();
  expect(pdfBuffer.length).toBeGreaterThan(0);

  const pdfEqual: boolean = await comparePdfToSnapshot(pdfBuffer, './tests/resources/snapshots/pdf', "invoice");
  expect(pdfEqual).toBe(true);
}

async function checkZipkin(page: Page): Promise<void> {
  await page.goto('http://localhost:9411/');
  await expect(page).toHaveTitle("Zipkin");

  // Set language to English

  await page.getByTestId("change-language-button").click();
  await expect(page).toHaveScreenshot();
  
  await page.getByTestId("language-list-item-en").click();
  await expect(page).toHaveScreenshot();

  // Set time range to last 15 minutes and limit to 100 traces

  await page.getByTestId("settings-button").click();
  await expect(page).toHaveScreenshot();

  await page.getByTestId("query-limit").fill("100");
  await expect(page).toHaveScreenshot();

  await expect(page.getByText("Last 15 minutes")).toHaveCount(1);

  // Filter traces

  await page.getByText("Run Query").click();

  await page.getByPlaceholder("Service filters").click();
  await page.keyboard.insertText("shop-frontend");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.04 });

  const bigTraceSuccess: boolean = await retry(page);
  expect(bigTraceSuccess).toBe(true);

  await page.getByText("Expand All").click();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.04 });
}

async function retry(page: Page): Promise<boolean> {
  // await expect(async () => {
  //   console.log("Waiting for traces to appear");

  
  //   await page.getByText("Run Query").click();
  //   await page.waitForLoadState();

  //   const allRowsShop: Locator = page.getByText("shop-frontend:");
  //   expect(allRowsShop).toHaveCount(7);

  //   const allRowsShopClick: Locator = page.getByText("shop-frontend: click");
  //   expect(allRowsShopClick).toHaveCount(4);

  //   const bigTraceRow: Locator = page.getByText(/^2\d$/);
  //   expect(bigTraceRow).toHaveCount(1);
  // }).toPass({ intervals: [5_000, 10_000, 15_000, 20_000] });

  let success = false;
  let retries = 0;
  const maxRetries = 20;

  while (retries <= maxRetries && !success) {
    console.log("Waiting for traces to appear, retry", retries);

    try {
      await page.getByText("Run Query").click();
      await page.waitForLoadState();
      
      const allRowsShop: Locator = page.getByText("shop-frontend:");
      // expect(allRowsShop).toHaveCount(7);
      const allRowsShopCount: number = await allRowsShop.count();
      if (allRowsShopCount !== 7) {
        throw new Error(`Expected 7 rows, got ${allRowsShopCount}`);
      }
      
      const allRowsShopClick: Locator = page.getByText("shop-frontend: click");
      // expect(allRowsShopClick).toHaveCount(4);
      const allRowsShopClickCount: number = await allRowsShopClick.count();
      if (allRowsShopClickCount !== 4) {
        throw new Error(`Expected 4 rows, got ${allRowsShopClickCount}`);
      }
      
      const bigTraceRow: Locator = page.getByText(/^2\d$/);
      // expect(bigTraceRow).toHaveCount(1);
      const bigTraceRowCount: number = await bigTraceRow.count();
      if (bigTraceRowCount !== 1) {
        throw new Error(`Expected 1 row, got ${bigTraceRowCount}`);
      }

      console.log("Traces found");

      success = true;
    } catch (e) {
      console.error("Error while retry", retries, e.message);
      await new Promise(resolve => setTimeout(resolve, 5_000));
    }

    retries++;
  }

  return success;
}

async function checkPrometheus(page: Page): Promise<void> {
  // await page.goto('http://localhost:9090/');
  // await expect(page).toHaveTitle("Prometheus");

  // await page.getByTestId("graph").click();
  // await expect(page).toHaveScreenshot();

  // await page.getByTestId("expression").fill("rate(http_server_requests_seconds_count{uri=\"/basket\"}[5m])");
  // await expect(page).toHaveScreenshot();

  // await page.getByTestId("execute").click();
  // await expect(page).toHaveScreenshot();

  // await page.getByTestId("graph").click();
  // await expect(page).toHaveScreenshot();
}