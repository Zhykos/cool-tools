import { test, expect, type Page, type Locator } from "@playwright/test";

test("Full ErrorUseCase test", async ({ page }) => {
  console.log("Starting test");

  // Scenario

  await goHome(page);
  await goToTodoListFromHome(page);
  await addTodoItem(page);
  await addTodoErrorItem(page);

  // Check external tools

  await checkZipkin(page);
  await checkSeq(page);
});

async function goHome(page: Page): Promise<void> {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle("Welcome to Qwik");
  await expect(page).toHaveScreenshot({ fullPage: true });
}

async function goToTodoListFromHome(page: Page): Promise<void> {
  await page.getByText("Todo App").click();

  await expect(page).toHaveTitle("Qwik Todo List");
  await expect(page.getByText("No items found")).toBeVisible({
    timeout: 100_000,
  });
  await expect(page).toHaveScreenshot({ fullPage: true });
}

async function addTodoItem(page: Page): Promise<void> {
  await expect(page.getByText("Clean the house")).not.toBeVisible();

  await page.getByTestId("input-todo-item").fill("Clean the house");
  await page.getByTestId("create-todo-button").click();
  await expect(page.getByText("Clean the house")).toBeVisible();

  await expect(page).toHaveScreenshot({ fullPage: true });
}

async function addTodoErrorItem(page: Page): Promise<void> {
  await expect(page.getByText("yyy")).not.toBeVisible();

  await page.getByTestId("input-todo-item").fill("yyy");
  await page.getByTestId("create-todo-button").click();
  await expect(page.getByText("yyy")).not.toBeVisible();

  await expect(page).toHaveScreenshot({ fullPage: true });
}

async function checkZipkin(page: Page): Promise<void> {
  await page.goto("http://localhost:9411/");
  await expect(page).toHaveTitle("Zipkin");
  await expect(page).toHaveScreenshot();

  // Set language to English

  await page.getByTestId("change-language-button").click();
  await page.getByTestId("language-list-item-en").click();

  // Set time range to last 15 minutes and limit to 100 traces

  await page.getByTestId("settings-button").click();
  await page.getByTestId("query-limit").fill("100");
  await expect(page.getByText("Last 15 minutes")).toHaveCount(1);

  // Filter traces

  const bigTraceSuccess: boolean = await findTraces(page);
  expect(bigTraceSuccess).toBe(true);

  await page.getByText("Expand All").click();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.03 });
}

async function findTraces(page: Page): Promise<boolean> {
  let success = false;
  let retries = 0;
  const maxRetries = 20;

  while (retries <= maxRetries && !success) {
    console.log("Waiting for traces to appear, retry", retries);

    try {
      await page.getByText("Run Query").click();
      await page.waitForLoadState();

      const allRowsShop: Locator = page.getByText("error-case-195-frontend:");
      const allRowsShopCount: number = await allRowsShop.count();
      if (allRowsShopCount !== 4) {
        throw new Error(`Expected 4 rows, got ${allRowsShopCount}`);
      }

      const allRowsShopClick: Locator = page.getByText(
        "error-case-195-frontend: create todo item",
      );
      const allRowsShopClickCount: number = await allRowsShopClick.count();
      if (allRowsShopClickCount !== 2) {
        throw new Error(`Expected 2 rows, got ${allRowsShopClickCount}`);
      }

      console.log("Traces found");

      success = true;
    } catch (e) {
      console.error("Error while retry", retries, e.message);
      await new Promise((resolve) => setTimeout(resolve, 5_000));
    }

    retries++;
  }

  return success;
}

async function checkSeq(page: Page): Promise<void> {
  await page.goto("http://localhost:5341/");
  await expect(page).toHaveTitle("Events — Seq");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });

  await page.getByText(/Added todo item: \{"id":"[a-f0-9]+"\}/).click();
  await expect(page.getByText("error-case-195-frontend")).toBeVisible();
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });
}
