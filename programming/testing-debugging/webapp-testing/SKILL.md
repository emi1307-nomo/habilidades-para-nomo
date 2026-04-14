---
name: webapp-testing
description: Web application testing with Playwright — browser automation, screenshot capture, UI verification, debugging frontend behavior, testing local dev servers. From Anthropic (38K installs). Use when verifying UI functionality, testing flows, or debugging visual regressions.
argument-hint: "[page or flow to test]"
metadata:
  source: anthropics/skills
  installs: 38100
  version: "1.0.0"
---

# Web App Testing (Playwright)

Browser automation and testing for local web applications.

## Workflow Decision Tree

```
1. Static HTML? → Read file directly to identify selectors
2. Dynamic app?
   → Is dev server running?
   → Yes: connect to localhost
   → No: start server first
3. Navigate → wait for networkidle → screenshot → identify selectors → act
```

## Basic Playwright Test (TypeScript)

```ts
// tests/orders.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Order Flow", () => {
  test("waiter can create an order", async ({ page }) => {
    // Navigate
    await page.goto("http://localhost:3000/dashboard")
    await page.waitForLoadState("networkidle") // wait for JS to execute

    // Screenshot for debugging
    await page.screenshot({ path: "screenshots/dashboard.png" })

    // Interact
    await page.click("[data-testid='new-order-btn']")
    await page.fill("[name='tableId']", "table-1")
    await page.click("[data-testid='menu-item-burger']")
    await page.click("[data-testid='submit-order']")

    // Assert
    await expect(page.locator("[data-testid='order-success']")).toBeVisible()
    await expect(page.locator(".order-status")).toHaveText("Pending")
  })

  test("kitchen sees new order in real-time", async ({ page }) => {
    await page.goto("http://localhost:3000/kitchen")
    await page.waitForLoadState("networkidle")

    // Wait for WebSocket connection
    await page.waitForSelector("[data-testid='kitchen-connected']")

    // Create order in another tab
    const orderPage = await page.context().newPage()
    await orderPage.goto("http://localhost:3000/dashboard")
    await orderPage.click("[data-testid='quick-order']")

    // Verify kitchen updates
    await expect(page.locator(".order-card")).toHaveCount(1)
  })
})
```

## playwright.config.ts

```ts
import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
  ],
  // Start dev server before tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
```

## Reconnaissance Pattern (debug unknown UI)

```ts
// Step 1: Navigate and screenshot
await page.goto("http://localhost:3000")
await page.waitForLoadState("networkidle")
await page.screenshot({ path: "recon.png", fullPage: true })

// Step 2: Find selectors
const buttons = await page.locator("button").all()
for (const btn of buttons) {
  console.log(await btn.textContent(), await btn.getAttribute("data-testid"))
}

// Step 3: Check for errors
page.on("console", msg => {
  if (msg.type() === "error") console.error("Browser error:", msg.text())
})

// Step 4: Network requests
page.on("request", req => console.log("→", req.method(), req.url()))
page.on("response", res => console.log("←", res.status(), res.url()))
```

## Testing Server Actions / Forms

```ts
test("menu item form validates correctly", async ({ page }) => {
  await page.goto("/admin/menu/new")

  // Submit empty form
  await page.click("button[type='submit']")

  // Check validation errors
  await expect(page.locator("[data-error='name']")).toHaveText("Minimum 2 characters")
  await expect(page.locator("[data-error='price']")).toHaveText("Must be positive")

  // Fill form and submit
  await page.fill("[name='name']", "Burger")
  await page.fill("[name='price']", "1200")
  await page.selectOption("[name='category']", "main")
  await page.click("button[type='submit']")

  // Verify success and redirect
  await page.waitForURL("/admin/menu")
  await expect(page.locator("text=Burger")).toBeVisible()
})
```

## QR Menu Testing (NOMO-specific)

```ts
test("QR menu loads and works offline", async ({ page, context }) => {
  // Test the PWA menu
  await page.goto("http://localhost:3000/menu/restaurant-id")
  await page.waitForLoadState("networkidle")

  // Verify menu items load
  await expect(page.locator(".menu-item")).toHaveCount(5)

  // Simulate offline
  await context.setOffline(true)

  // Reload — PWA should serve from cache
  await page.reload()
  await expect(page.locator(".menu-item")).toHaveCount(5) // still shows!
  await expect(page.locator(".offline-badge")).toBeVisible()
})
```

## Quick Commands

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/orders.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode (step through)
npx playwright test --debug

# Generate selectors interactively
npx playwright codegen http://localhost:3000

# View last test report
npx playwright show-report
```
