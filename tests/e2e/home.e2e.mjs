// E2E for the homepage: key patient scenarios on 390 and 1440 px.
// Run against a running server: BASE_URL=http://localhost:4321/ npm run test:e2e
// Playwright and Chromium come from the studio tools (veon_pw.mjs), nothing is installed into the site.
import { test } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const studio = [process.env.VEON_WEB_STUDIO, path.join(os.homedir(), "Desktop", "VEON-WEB-STUDIO"), path.join(os.homedir(), "Documents", "ai-web-studio")]
  .filter(Boolean)
  .find((p) => fs.existsSync(path.join(p, "quality", "scripts", "veon_pw.mjs")));
if (!studio) throw new Error("VEON studio not found: set VEON_WEB_STUDIO");
const { loadPlaywright, launchBrowser } = await import(pathToFileURL(path.join(studio, "quality", "scripts", "veon_pw.mjs")).href);
const BASE = process.env.BASE_URL || "http://localhost:4321/";
const { chromium } = loadPlaywright();
const browser = await launchBrowser(chromium);
const open = async (width, opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width, height: width >= 1000 ? 900 : 844 }, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: "networkidle" });
  return { ctx, page, errors };
};

test.after(() => browser.close());

test("one H1, lang uk, sections in concept order, no JS errors", async () => {
  const { ctx, page, errors } = await open(1440);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal((await page.locator("h1").innerText()).trim(), "Ужгородська міська багатопрофільна клінічна лікарня");
  assert.equal(await page.getAttribute("html", "lang"), "uk");
  const ids = await page.$$eval("main > section", (s) => s.map((x) => x.id));
  assert.deepEqual(ids, ["hero", "zapys", "pidrozdily", "oplata", "napriamy", "likari", "proiekty", "novyny", "kontakty"]);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test("С1 phone 390: registry call is one tap in the first screen", async () => {
  const { ctx, page } = await open(390);
  const btn = page.locator(".reg .btn--primary");
  assert.equal(await btn.getAttribute("href"), "tel:+380312662096");
  const box = await btn.boundingBox();
  assert.ok(box && box.y + box.height <= 844, "call button inside the first screen");
  const rows = await page.locator(".board__row").evaluateAll((r) => r.map((x) => x.getBoundingClientRect().bottom));
  assert.equal(rows.length, 4);
  assert.ok(Math.max(...rows) <= 844, "the whole board is inside the first screen");
  await ctx.close();
});

test("С2–С4: board rows jump to the plate, mark it and focus its heading", async () => {
  const { ctx, page } = await open(390, { reducedMotion: "reduce" });
  await page.click('.board__row[href="#dytiacha"]');
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => document.activeElement?.id), "dytiacha-name");
  assert.ok(await page.locator("#dytiacha.is-here").count());
  const route = page.locator("#dytiacha .route").first();
  assert.match(await route.getAttribute("href"), /^https:\/\/www\.google\.com\/maps\/search\//);
  await ctx.close();
});

test("С5: CT via Viber and Health24 are real channels", async () => {
  const { ctx, page } = await open(1440);
  assert.ok(await page.locator('#zapys a[href="viber://chat?number=%2B380638108870"]').count());
  assert.ok(await page.locator('#zapys a[href="https://h24.ua/"]').count());
  await ctx.close();
});

test("menu on 390 opens as a dialog and closes on an anchor", async () => {
  const { ctx, page } = await open(390);
  await page.click("[data-menu-open]");
  assert.equal(await page.evaluate(() => document.querySelector("#menu").open), true);
  await page.click('#menu a[href="#kontakty"]');
  assert.equal(await page.evaluate(() => document.querySelector("#menu").open), false);
  await ctx.close();
});

test("no links to the old site, future pages are inactive FutureLinks", async () => {
  const { ctx, page } = await open(1440);
  const bad = await page.$$eval("a[href]", (a) => a.map((x) => x.getAttribute("href")).filter((h) => /umbkl\.com/i.test(h) && !h.startsWith("mailto:")));
  assert.deepEqual(bad, []);
  const empty = await page.$$eval("a", (a) => a.filter((x) => !x.getAttribute("href") || x.getAttribute("href") === "#").length);
  assert.equal(empty, 0);
  const fl = await page.$$eval(".future-link", (f) => f.every((x) => x.getAttribute("aria-disabled") === "true" && !x.hasAttribute("href")));
  assert.ok(fl);
  await ctx.close();
});

test("no horizontal scroll from 320 to 1440", async () => {
  for (const w of [320, 375, 768, 1024, 1440]) {
    const { ctx, page } = await open(w);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(sw <= w, `scrollWidth ${sw} at ${w}`);
    await ctx.close();
  }
});

test("content is visible without JS", async () => {
  const { ctx, page } = await open(390, { javaScriptEnabled: false });
  const hidden = await page.$$eval("[data-reveal]", (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length);
  assert.equal(hidden, 0);
  assert.match(await page.locator("[data-reg-status]").innerText(), /13:00–16:00/);
  await ctx.close();
});
