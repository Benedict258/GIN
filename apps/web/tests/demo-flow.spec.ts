import { test, expect } from "@playwright/test";

const HERO_COPY = "Build the intelligence layer before the galaxy builds over you.";

test.describe("GIN demo surface", () => {
  test("renders hero plus pack access gating", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(HERO_COPY)).toBeVisible();
    await expect(page.getByText("Shared Pack View")).toBeVisible();
    await expect(page.getByText("Contributor Credits")).toBeVisible();
    await expect(page.getByText("Demo Narrative")).toBeVisible();
  });

  test("shows locked panel callouts when not connected", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Advisor Snapshots")).toBeVisible();
    await expect(page.getByText("Connect your contributor wallet through EVE Frontier to sync progress.")).toBeVisible();
  });
});
