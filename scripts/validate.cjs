const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const issues = [];

  page.on("console", (message) => {
    if (message.type() === "error") issues.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => issues.push(`page: ${error.message}`));

  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/tmp/rcs-desktop.png", fullPage: true });

  const title = await page.title();
  if (!title.includes("RCS")) issues.push("missing RCS page title");
  if ((await page.locator("h1").count()) !== 1) issues.push("expected one h1");
  if ((await page.locator("main section").count()) !== 3) issues.push("expected three main sections");

  await page.getByRole("button", { name: "Workshop", exact: true }).click();
  const visibleCards = await page.locator(".activity-card:visible").count();
  if (visibleCards !== 1) issues.push(`workshop filter showed ${visibleCards} cards`);
  if (!(await page.locator(".result-count").innerText()).startsWith("1")) issues.push("filter count did not update");

  await page.getByRole("button", { name: /View details/ }).click();
  if (!(await page.locator("dialog").getAttribute("open") !== null)) issues.push("activity dialog did not open");
  await page.getByRole("button", { name: "Close details" }).click();

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (dimensions.scrollWidth > dimensions.clientWidth + 1) issues.push("desktop horizontal overflow");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const expanded = await page.getByRole("button", { name: "Open navigation" }).getAttribute("aria-expanded");
  if (expanded !== "true") issues.push("mobile navigation did not expand");
  await page.screenshot({ path: "/tmp/rcs-mobile.png", fullPage: true });
  const mobileDimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (mobileDimensions.scrollWidth > mobileDimensions.clientWidth + 1) issues.push("mobile horizontal overflow");

  await browser.close();
  if (issues.length) {
    console.error(issues.join("\n"));
    process.exit(1);
  }
  console.log("Validated desktop and mobile layouts, filters, dialog, navigation, headings, and overflow.");
})();
