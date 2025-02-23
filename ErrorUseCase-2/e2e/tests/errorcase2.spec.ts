import { test, expect, type Page, type Locator } from '@playwright/test';

test('Full ErrorCase2 test', async ({ page }) => {
  console.log("Starting test");

  // Scenario

  await callAPI();

  // Check external tools

  await checkGrafana(page);
});

async function callAPI(): Promise<void> {
  const res1: Response = await fetch('http://localhost:8000');
  expect(res1.status).toBe(200);
  expect(await res1.text()).toBe("Hello world");

  const res2: Response = await fetch('http://localhost:8000/foo');
  expect(res2.status).toBe(200);
  expect(await res2.text()).toBe("Hello world");
}

async function checkGrafana(page: Page): Promise<void> {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle("Grafana");
  await expect(page).toHaveScreenshot();

  await page.getByTestId("data-testid Toggle menu").click();
  await expect(page).toHaveScreenshot();

  await page.getByLabel("Expand section Explore").click();
  await page.getByTestId("data-testid Nav menu item").filter({ hasText: "Logs" }).click();
  await expect(page).toHaveTitle("Grafana Logs Drilldown - Explore - Grafana");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });

  await expect(page.getByText("Listening on http://0.0.0.0:8000/")).toBeVisible();
  await expect(page.getByText("Received request for http://localhost:8000/")).toHaveCount(2);
  await expect(page.getByText("Received request for http://localhost:8000/foo")).toBeVisible();

  await page.getByTestId("data-testid Show logs").click();
  await expect(page).toHaveTitle("Logs - Grafana Logs Drilldown - Explore - Grafana");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });

  await expect(page.getByText("Logs (3)")).toBeVisible();
  await expect(page.getByText("Received request for http://localhost:8000/foo")).toBeVisible();
  
  await page.keyboard.press("PageDown");
  await page.keyboard.press("PageDown");
  await page.keyboard.press("PageDown");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });

  await page.getByText("http://localhost:8000/foo").click();
  await page.keyboard.press("PageDown");
  await page.keyboard.press("PageDown");
  await page.keyboard.press("PageDown");
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });

  await page.getByText(/Trace: [0-9a-f]+/).click();
  await expect(page).toHaveTitle("Explore - Tempo - Grafana");

  expect(await checkGrafanaTempo(page)).toBe(true);
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.01 });

  await page.getByTestId("data-testid Toggle menu").click();
  await page.getByTestId("data-testid Nav menu item").filter({ hasText: "Metrics" }).click();
  await expect(page).toHaveTitle("Select metric - Metrics - Explore - Grafana");

  expect(await checkGrafanaMetrics(page)).toBe(true);
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.01 });
}

async function checkGrafanaTempo(page: Page): Promise<boolean> {
  let success = false;
  let retries = 0;
  const maxRetries = 20;

  while (retries <= maxRetries && !success) {
    console.log("Waiting for Tempo dashboard to load, retry", retries);

    try {
      await page.getByTestId("data-testid RefreshPicker run button").click();
      await page.waitForLoadState();
      
      const labelToFind: Locator = page.getByText("unknown_service: GET");
      const labelToFindCount: number = await labelToFind.count();
      if (labelToFindCount !== 1) {
        console.log("Reloading page");

        await page.reload({ waitUntil: "load" });
        await page.waitForLoadState();

        const labelToFindAgain: Locator = page.getByText("unknown_service: GET");
        const labelToFindCountAgain: number = await labelToFindAgain.count();

        if (labelToFindCountAgain !== 1) {
          throw new Error(`Expected 1 label, got ${labelToFindCountAgain}`);
        }
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

async function checkGrafanaMetrics(page: Page): Promise<boolean> {
  let success = false;
  let retries = 0;
  const maxRetries = 20;

  while (retries <= maxRetries && !success) {
    console.log("Waiting for Metrics dashboard to load, retry", retries);

    try {
      await page.getByTestId("data-testid RefreshPicker run button").click();
      await page.waitForLoadState();
      
      const labelToFind: Locator = page.getByTestId("uplot-main-div");
      const labelToFindCount: number = await labelToFind.count();
      if (labelToFindCount === 0) {
        console.log("Reloading page");

        await page.reload({ waitUntil: "load" });
        await page.waitForLoadState();

        const labelToFindAgain: Locator = page.getByTestId("uplot-main-div");
        const labelToFindCountAgain: number = await labelToFindAgain.count();

        if (labelToFindCountAgain === 0) {
          throw new Error(`Expected at least 1 uplot, got ${labelToFindCountAgain}`);
        }
      }

      console.log("Uplot found");

      success = true;
      await new Promise(resolve => setTimeout(resolve, 5_000)); // Because we want to see all the metrics
    } catch (e) {
      console.error("Error while retry", retries, e.message);
      await new Promise(resolve => setTimeout(resolve, 5_000));
    }

    retries++;
  }

  return success;
}
