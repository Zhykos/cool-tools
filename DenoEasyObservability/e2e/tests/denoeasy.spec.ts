import { test, expect } from '@playwright/test';

test('Full Deno Easy Telemetry test', async ({ page }) => {
  console.log("Starting test");

  // Scenario

  await callAPI();
});

async function callAPI(): Promise<void> {
  const res1: Response = await fetch('http://localhost:8000');
  expect(res1.status).toBe(200);
  expect(await res1.text()).toBe("Hello world");

  const res2: Response = await fetch('http://localhost:8000/foo');
  expect(res2.status).toBe(200);
  expect(await res2.text()).toBe("Hello world");
}
