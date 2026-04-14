---
name: test-driven-development
description: TDD methodology — Red/Green/Refactor cycle, writing tests before code, validating tests fail first. From obra/superpowers (35K installs). Use when building new features to ensure tests actually catch bugs rather than just passing.
argument-hint: "[feature or function to build with TDD]"
metadata:
  source: obra/superpowers
  installs: 35400
  version: "1.0.0"
---

# Test-Driven Development

Write tests before code. If you didn't watch the test fail, you don't know if it tests the right thing.

## The Three-Phase Cycle

```
RED   → Write a minimal failing test
GREEN → Write the simplest code to pass it
REFACTOR → Improve code quality, keep tests green
```

**Non-negotiable:** Code written before tests must be deleted and rewritten. No "I'll keep it as reference."

## TDD for a Server Action (NOMO example)

### 1. RED — Write the failing test first

```ts
// tests/actions/order.test.ts
import { createOrder } from "@/actions/order"

describe("createOrder", () => {
  it("rejects order with empty items", async () => {
    const formData = new FormData()
    formData.set("tableId", "table-1")
    // no items

    const result = await createOrder(null, formData)
    expect(result.error).toBeDefined()
    expect(result.error?.items).toBeTruthy()
  })

  it("rejects invalid tableId", async () => {
    const formData = new FormData()
    formData.set("tableId", "not-a-uuid")
    formData.append("items", "item-1")

    const result = await createOrder(null, formData)
    expect(result.error?.tableId).toBeTruthy()
  })

  it("creates order and returns orderId", async () => {
    const formData = new FormData()
    formData.set("tableId", "550e8400-e29b-41d4-a716-446655440000")
    formData.append("items", "550e8400-e29b-41d4-a716-446655440001")

    const result = await createOrder(null, formData)
    expect(result.success).toBe(true)
    expect(result.orderId).toBeDefined()
  })
})
```

**Run and verify it fails:**
```bash
npm test tests/actions/order.test.ts
# ✗ createOrder — FAIL (function doesn't exist yet)
```

### 2. GREEN — Write minimal code to pass

```ts
// actions/order.ts
"use server"
import { z } from "zod"

const schema = z.object({
  tableId: z.string().uuid(),
  items: z.array(z.string()).min(1),
})

export async function createOrder(prevState: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    tableId: formData.get("tableId"),
    items: formData.getAll("items"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const order = await db.order.create({
    data: { tableId: parsed.data.tableId, status: "pending" }
  })

  return { success: true, orderId: order.id }
}
```

**Run tests — all pass:**
```bash
npm test tests/actions/order.test.ts
# ✓ createOrder (3 tests) — PASS
```

### 3. REFACTOR — Improve without breaking

```ts
// Add proper error typing, revalidation, etc.
export async function createOrder(prevState: unknown, formData: FormData) {
  const parsed = schema.safeParse({ ... })
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const order = await db.order.create({ data: parsed.data })
  revalidatePath("/kitchen")          // added in refactor
  revalidatePath("/dashboard")

  return { success: true, orderId: order.id }
}

// Tests still pass after refactor ✓
```

## TDD for a Utility Function

```ts
// tests/lib/pricing.test.ts — write first
import { calculateOrderTotal } from "@/lib/pricing"

describe("calculateOrderTotal", () => {
  it("returns 0 for empty items", () => {
    expect(calculateOrderTotal([])).toBe(0)
  })

  it("sums item prices multiplied by quantity", () => {
    const items = [
      { price: 1000, quantity: 2 }, // 2000
      { price: 500, quantity: 3 },  // 1500
    ]
    expect(calculateOrderTotal(items)).toBe(3500)
  })

  it("handles single item", () => {
    expect(calculateOrderTotal([{ price: 750, quantity: 1 }])).toBe(750)
  })
})

// lib/pricing.ts — write after tests fail
export function calculateOrderTotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
```

## Anti-Patterns to Avoid

```
❌ "It's too simple to test" — simple code still breaks
❌ "I'll write tests after" — those tests always pass immediately
❌ "Manual testing is enough" — not repeatable
❌ "I'll keep existing code as reference" — defeats the purpose
❌ Testing implementation details — test behavior, not how
❌ One giant test — small focused tests are easier to debug
```

## Vitest Setup (for Next.js)

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
})

// tests/setup.ts
import { vi } from "vitest"

// Mock Prisma in unit tests
vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))
```

## Verification Before Shipping

- [ ] Every new function has a test written BEFORE the code
- [ ] All tests were observed failing before implementation
- [ ] All tests pass after implementation
- [ ] Refactored code still passes all tests
- [ ] No tests test implementation details (internals can change)
