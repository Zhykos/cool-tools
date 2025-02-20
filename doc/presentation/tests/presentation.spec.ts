import { test, expect, type Page } from '@playwright/test';

test('Full Presentation test', async ({ page }) => {
  console.log("Starting test");

  // Scenario

  await checkPresentation(page);
});

async function checkPresentation(page: Page): Promise<void> {
  await page.goto('http://localhost:3026/');

  await expect(page).toHaveTitle("Reveal Vite");
  await expect(page).toHaveScreenshot({ fullPage: true });
}
