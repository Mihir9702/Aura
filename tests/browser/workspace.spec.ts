import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test("owner workspace: live API, navigation, audited Entry Halt and responsive layout", async ({
  page,
}) => {
  const env = readFileSync(".env", "utf8");
  const key = env
    .split(/\r?\n/)
    .find((line) => line.startsWith("AURA_OWNER_KEY="))!
    .slice("AURA_OWNER_KEY=".length);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByLabel("Owner key").fill(key);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("heading", { name: "Challenge account" }),
  ).toBeVisible();
  await expect(page.getByText("$500.00").first()).toBeVisible();
  await expect(page.getByText("Live", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "test-results/aura-overview.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Strategy pods", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Strategy pods", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("rowheader", { name: /^Momentum/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("rowheader", { name: /^Swing Trend/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Research", exact: true }).click();
  await expect(
    page.getByRole("rowheader", { name: "Research league" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Operations", exact: true }).click();
  await page.getByRole("button", { name: "Halt entries", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Reason for the audit log")
    .fill("Browser verification: entry halt");
  await dialog.getByRole("button", { name: "Halt entries" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Entry halt is on.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Lift halt", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lift halt", exact: true }).click();
  await dialog
    .getByLabel("Reason for the audit log")
    .fill("Browser verification complete: lift entry halt");
  await dialog.getByRole("button", { name: "Lift halt" }).click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Halt entries", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Entry halt lifted").first()).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("body")).toBeVisible();
  const width = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: innerWidth,
  }));
  expect(width.scroll).toBeLessThanOrEqual(width.client);
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByLabel("Owner key")).toBeVisible();
});
