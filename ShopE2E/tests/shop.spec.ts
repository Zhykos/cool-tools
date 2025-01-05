import { test, expect, type Page, type Locator } from '@playwright/test';

test('Full shop test', async ({ page }) => {
  await goHome(page);
  await goToShopFromHome(page);
  await addUser(page);
  const userUUID: string = await selectUser(page);
  await selectProduct(page, userUUID);
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