import { test, expect, type Page, type Locator, type APIRequestContext, type APIResponse } from '@playwright/test';
import { readFileSync } from 'fs';
import { comparePdfToSnapshot } from 'pdf-visual-diff'
// import { DockerComposeEnvironment, Wait, type StartedDockerComposeEnvironment } from 'testcontainers';

// let testContainer: StartedDockerComposeEnvironment | null = null;

// test.beforeAll(async () => {
//   testContainer = await new DockerComposeEnvironment("./tests/resources", "docker-compose.yml")
//       .withWaitStrategy("front-shop-1", Wait.forListeningPorts())
//       //.withStartupTimeout(300_000)
//       .up();
// });

// test.afterAll(async () => {
//   if (testContainer) {
//     await testContainer.down({ removeVolumes: true });
//   }
// });

test('Full shop test', async ({ page, request }) => {
  console.log("Starting test");

  // Shop scenario

  await goHome(page);
  await goToShopFromHome(page);
  await addUser(page);
  const userUUID: string = await selectUser(page);
  await selectProduct(page, userUUID);
  const shopPdfURL: string = await createOrder(page);
  await openAndCheckPDF(shopPdfURL, request);

  // Check external tools

  await checkZipkin(page);
  await checkPrometheus(page);
  await checkPapermerge(page);
  const emailPdfURL: string = await checkEmails(page);
  await openAndCheckPDF(emailPdfURL, request);
  await checkExcalidraw(page);
  await checkKong(page);
  await checkGrafana(page);
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

async function openAndCheckPDF(pdfURL: string, request: APIRequestContext): Promise<void> {
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

  const bigTraceSuccess: boolean = await findTraces(page);
  expect(bigTraceSuccess).toBe(true);

  await page.getByText("Expand All").click();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.04 });
}

async function findTraces(page: Page): Promise<boolean> {
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
  await page.goto('http://localhost:9090/');
  await expect(page).toHaveTitle("Prometheus Time Series Collection and Processing Server");
  await expect(page).toHaveScreenshot();

  await page.getByTitle("Open metrics explorer").click();
  await expect(page.getByText("Metrics Explorer")).toBeVisible({ timeout: 5000 });
  await expect(page).toHaveScreenshot({maxDiffPixelRatio: 0.5});

  await page.getByLabel("Close").click();

  await page.getByRole("textbox").first().fill("http_server_active_requests");
  await page.getByText("Execute").click();
  await expect(page).toHaveScreenshot({maxDiffPixelRatio: 0.04});
}

async function checkPapermerge(page: Page): Promise<void> {
  await page.goto('http://localhost:12000/');
  await expect(page).toHaveTitle("Papermerge DMS");
  await expect(page).toHaveScreenshot();

  await page.getByPlaceholder("Username or email").fill("admin");
  await page.locator("input").nth(1).fill("admin");
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForLoadState();
  await expect(page.getByText(/invoice-[a-f0-9]+/)).toBeVisible({ timeout: 5000 });
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });

  await expect(page.getByText(/invoice-[a-f0-9]+/)).toHaveCount(1);
  await page.getByText(/invoice-[a-f0-9]+/).click();

  await page.waitForLoadState();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });
}

async function checkEmails(page: Page): Promise<string> {
  await page.goto('http://localhost:9000/');
  await expect(page).toHaveTitle("Inbucket");
  await expect(page).toHaveScreenshot();

  await page.goto('http://localhost:9000/monitor');
  await expect(page).toHaveTitle("Inbucket Monitor");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });

  await expect(page.getByText("<noreply@zhykos.fr>")).toHaveCount(1);
  await page.getByText("<noreply@zhykos.fr>").click();

  await page.waitForLoadState();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });

  return `http://localhost:9000${await page.getByText("invoice.pdf").getAttribute("href")}`;
}

async function checkExcalidraw(page: Page): Promise<void> {
  await page.goto('http://localhost:3030/');
  await expect(page).toHaveTitle("Excalidraw | Hand-drawn look & feel • Collaborative • Secure");
  await expect(page).toHaveScreenshot();
}

async function checkKong(page: Page): Promise<void> {
  await page.goto('http://localhost:8002/');
  await expect(page).toHaveTitle("Kong Manager OSS");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });

  await page.getByText("Gateway Services").click();
  await page.waitForLoadState();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });
  await expect(page.getByTestId("users")).toHaveCount(2);

  await page.getByTestId("users").first().click();
  await page.waitForLoadState();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02, fullPage: true });
  
  await page.getByRole('link', { name: 'Routes' }).click();
  await page.waitForLoadState();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });
  await expect(page.getByTestId("users")).toHaveCount(2);

  await page.getByTestId("users").first().click();
  await page.waitForLoadState();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02, fullPage: true });
}

async function checkGrafana(page: Page): Promise<void> {
  await page.goto('http://localhost:3000/login');
  await expect(page).toHaveTitle("Grafana");
  await expect(page).toHaveScreenshot(); // Screenshot 28

  await page.getByPlaceholder("email or username").fill("admin");
  await page.getByPlaceholder("password").fill("password");
  await page.getByText('Log in').click();

  await page.waitForLoadState();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.03 }); // Screenshot 29

  await page.goto('http://localhost:3000/connections/add-new-connection');
  await expect(page.getByText(" Google Analytics")).toBeVisible({ timeout: 5000 });
  await expect(page).toHaveScreenshot(); // Screenshot 30

  await page.getByPlaceholder("Search all").fill("loki");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 }); // Screenshot 31

  await page.getByPlaceholder("Search all").fill("prometheus");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 }); // Screenshot 32

  await page.goto('http://localhost:3000/connections/datasources/loki');
  await expect(page.getByText("Loki Data Source - Native Plugin")).toBeVisible({ timeout: 5000 });
  await expect(page).toHaveScreenshot(); // Screenshot 33

  await page.getByText("Create a Loki data source").click();
  await page.waitForLoadState();
  await expect(page).toHaveScreenshot(); // Screenshot 34

  await page.getByPlaceholder("http://localhost:3100").fill("http://loki:3100");
  await page.getByRole('button', { name: 'Save & test' }).click();
  await expect(page).toHaveScreenshot({fullPage: true}); // Screenshot 35

  await page.goto('http://localhost:3000/connections/datasources/prometheus');
  await expect(page.getByText("Prometheus Data Source - Native Plugin")).toBeVisible({ timeout: 5000 });
  await expect(page).toHaveScreenshot(); // Screenshot 36

  await page.getByText("Create a Prometheus data source").click();
  await page.waitForLoadState();
  await expect(page).toHaveScreenshot(); // Screenshot 37

  await page.getByPlaceholder("http://localhost:9090").fill("http://prometheus:9090");
  await page.getByRole('button', { name: 'Save & test' }).click();
  await expect(page).toHaveScreenshot({fullPage: true}); // Screenshot 38

  await page.goto('http://localhost:3000/connections/datasources');
  await expect(page).toHaveScreenshot(); // Screenshot 39

  await page.goto('http://localhost:3000/dashboard/import');
  await expect(page).toHaveScreenshot(); // Screenshot 40

  const grafanaDashboardContent: string = readFileSync('./tests/resources/grafana-dashboard.json', { encoding: 'utf8', flag: 'r' });
  await page.getByTestId("data-testid-import-dashboard-textarea").fill(grafanaDashboardContent);
  await expect(page).toHaveScreenshot(); // Screenshot 41

  await page.getByTestId('data-testid-load-dashboard').click();
  await page.waitForLoadState();
  await expect(page).toHaveScreenshot(); // Screenshot 42

  await page.getByTestId('data-testid Data source picker select container').nth(0).locator("input").fill("Prometheus");
  await page.keyboard.press("Enter");
  await page.getByTestId('data-testid Data source picker select container').nth(1).locator("input").fill("Loki");
  await page.keyboard.press("Enter");
  await expect(page).toHaveScreenshot(); // Screenshot 43

  await page.getByRole('button', { name: 'Import' }).click();
  await page.waitForLoadState();
  const loadedDashboard: boolean = await checkGrafanaDashboard(page);
  expect(loadedDashboard).toBe(true);
  await expect(page).toHaveScreenshot({fullPage: true, maxDiffPixelRatio: 0.02}); // Screenshot 44
}

async function checkGrafanaDashboard(page: Page): Promise<boolean> {
  let success = false;
  let retries = 0;
  const maxRetries = 20;

  while (retries <= maxRetries && !success) {
    console.log("Waiting for Grafana dashboard to load, retry", retries);

    try {
      await page.getByTestId("data-testid RefreshPicker run button").click();
      await page.waitForLoadState();
      
      const getUserLabel: Locator = page.getByText("GET /user");
      const getUserLabelCount: number = await getUserLabel.count();
      if (getUserLabelCount !== 1) {
        throw new Error(`Expected 1 label, got ${getUserLabelCount}`);
      }

      console.log("Label found");

      success = true;
    } catch (e) {
      console.error("Error while retry", retries, e.message);
      await new Promise(resolve => setTimeout(resolve, 5_000));
    }

    retries++;
  }

  return success;
}