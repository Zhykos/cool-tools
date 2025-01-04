import { test, expect, type Page, Locator } from '@playwright/test';

test('Full shop test', async ({ page }) => {
  await goHome(page);
  await goToShopFromHome(page);
  await addUser(page)
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

  const userListItemsLocator: Locator = page
    .getByTestId("user-list")
    .filter({ has: page.getByRole('listitem') });
  await expect(userListItemsLocator).toHaveCount(1);
  await expect(userListItemsLocator).toHaveText(/John Doe\([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\)/i);
}