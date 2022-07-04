import { test, expect } from "@playwright/test";

test.setTimeout(35e3);

test("go to /", async ({ page }) => {
  await page.goto("/");

  await page.waitForSelector(`text=Hidash`);
});

test("test 404", async ({ page }) => {
  const res = await page.goto("/not-found");
  expect(res?.status()).toBe(404);
});

test("add a customer", async ({ page, browser }) => {
  const nonce = `${Math.random()}`;

  await page.goto("/customer/new");
  await page.fill(`[name=name]`, nonce);
  await page.selectOption("select#status", "LEAD");
  await page.click(`button[type=submit]`);
  await page.waitForLoadState("networkidle");
  await page.reload();

  expect(await page.content()).toContain(nonce);

  const ssrContext = await browser.newContext({
    javaScriptEnabled: false,
  });
  const ssrPage = await ssrContext.newPage();
  await ssrPage.goto("/");

  expect(await ssrPage.content()).toContain(nonce);
});

test("server-side rendering test", async ({ page, browser }) => {
  // add a customer
  const nonce = `${Math.random()}`;

  await page.goto("/customer/new");
  await page.fill(`[name=name]`, nonce);
  await page.selectOption("select#status", "LEAD");
  await page.click(`button[type=submit]`);
  await page.waitForLoadState("networkidle");

  // load the page without js
  const ssrContext = await browser.newContext({
    javaScriptEnabled: false,
  });
  const ssrPage = await ssrContext.newPage();
  await ssrPage.goto("/");
  expect(await ssrPage.content()).toContain(nonce);
});
