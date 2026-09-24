import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test("sign-in explains a refused API proxy and recovers with the real owner key", async ({ page }) => {
  await page.route("**/api/session", route => route.fulfill({ status: 500, body: "", contentType: "text/plain" }));
  await page.goto("/");
  await page.getByLabel("Owner key").fill("unavailable-api-check");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toContainText("Start Aura with npm run dev");
  await page.unroute("**/api/session");
  const key = readFileSync(".env", "utf8").split(/\r?\n/).find(line => line.startsWith("AURA_OWNER_KEY="))!.slice("AURA_OWNER_KEY=".length);
  await page.getByLabel("Owner key").fill(key);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Challenge account" })).toBeVisible();
  await expect(page.getByText("$500.00").first()).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByLabel("Owner key")).toBeVisible();
});
