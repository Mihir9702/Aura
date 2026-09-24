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
  await page.getByRole("button", { name: "Enter workspace" }).click();
  await expect(
    page.getByRole("heading", { name: "The long view." }),
  ).toBeVisible();
  await expect(page.getByText("$500.00").first()).toBeVisible();
  await expect(
    page.getByText("Workspace connected", { exact: false }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/aura-overview.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Strategy Pods", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Momentum", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Swing Trend", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Research", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Research League" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "System health", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Activate Entry Halt", exact: true })
    .click();
  await page
    .getByLabel("Reason for the audit record")
    .fill("Browser verification: entry halt");
  await page.getByRole("button", { name: "Confirm control change" }).click();
  await expect(
    page.getByRole("button", { name: "Release Entry Halt", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Release Entry Halt", exact: true })
    .click();
  await page
    .getByLabel("Reason for the audit record")
    .fill("Browser verification complete: release entry halt");
  await page.getByRole("button", { name: "Confirm control change" }).click();
  await expect(
    page.getByRole("button", { name: "Activate Entry Halt", exact: true }),
  ).toBeVisible();
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
