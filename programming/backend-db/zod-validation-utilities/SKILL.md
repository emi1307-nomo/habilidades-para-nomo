---
name: zod-validation-utilities
description: Zod v4 validation patterns for TypeScript — schema definition, safeParse, form integration with React Hook Form, discriminated unions, reusable schema utilities, API boundary validation. Use when adding input validation to Server Actions, API routes, or forms.
argument-hint: "[schema or form to validate]"
metadata:
  source: giuseppe-trisciuoglio/developer-kit
  version: "1.0.0"
---

# Zod Validation Utilities

Production-ready Zod v4 patterns for TypeScript applications.

## Core Workflow

```ts
import { z } from "zod"

// 1. Define schema
const orderSchema = z.object({
  tableId: z.string().uuid("Invalid table ID"),
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().positive().max(99),
  })).min(1, "At least one item required"),
  notes: z.string().max(500).optional(),
})

// 2. Export type (inferred — stays in sync with schema)
export type OrderInput = z.infer<typeof orderSchema>

// 3. safeParse at boundaries
const result = orderSchema.safeParse(requestBody)
if (!result.success) {
  return { error: result.error.flatten().fieldErrors }
}
const data = result.data // type-safe OrderInput
```

## Reusable Schema Utilities

```ts
// lib/schemas/common.ts — define once, use everywhere
import { z } from "zod"

export const uuidSchema = z.string().uuid("Invalid ID format")
export const emailSchema = z.string().email("Invalid email").toLowerCase()
export const phoneSchema = z.string().regex(/^\+?[\d\s\-()]{8,15}$/, "Invalid phone")
export const priceSchema = z.number().positive("Price must be positive").multipleOf(0.01)
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})
export const dateRangeSchema = z.object({
  from: z.string().date(),
  to: z.string().date(),
}).refine(d => d.from <= d.to, "from must be before to")
```

## API Route Validation Pattern

```ts
// Always validate at API boundaries
import { z } from "zod"
import { NextRequest, NextResponse } from "next/server"
import { paginationSchema } from "@/lib/schemas/common"

const querySchema = paginationSchema.extend({
  status: z.enum(["pending", "preparing", "ready", "delivered"]).optional(),
  restaurantId: z.string().uuid(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams))

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { page, limit, status, restaurantId } = parsed.data
  // use validated data
}
```

## React Hook Form Integration

```tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const menuItemSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters").max(100),
  description: z.string().max(500).optional(),
  price: z.coerce.number().positive("Must be positive"),
  category: z.enum(["starter", "main", "dessert", "drink"]),
  available: z.boolean().default(true),
})

type MenuItemForm = z.infer<typeof menuItemSchema>

export function MenuItemForm({ onSubmit }: { onSubmit: (data: MenuItemForm) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MenuItemForm>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: { available: true }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Item name" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <input {...register("price")} type="number" step="0.01" />
      {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

      <select {...register("category")}>
        <option value="starter">Starter</option>
        <option value="main">Main</option>
        <option value="dessert">Dessert</option>
        <option value="drink">Drink</option>
      </select>

      <button type="submit" disabled={isSubmitting}>Save</button>
    </form>
  )
}
```

## Discriminated Unions (complex payloads)

```ts
// WebSocket message validation
const socketMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("order:new"),
    payload: z.object({ orderId: z.string().uuid(), tableId: z.string() })
  }),
  z.object({
    type: z.literal("order:status"),
    payload: z.object({ orderId: z.string().uuid(), status: z.enum(["preparing", "ready"]) })
  }),
  z.object({
    type: z.literal("table:occupied"),
    payload: z.object({ tableId: z.string(), guests: z.number().int().positive() })
  }),
])

type SocketMessage = z.infer<typeof socketMessageSchema>

// Usage
socket.on("message", (raw: unknown) => {
  const result = socketMessageSchema.safeParse(raw)
  if (!result.success) return // ignore invalid messages
  const msg = result.data
  // TypeScript knows exact shape based on msg.type
  if (msg.type === "order:new") console.log(msg.payload.orderId)
})
```

## Environment Variables Validation

```ts
// lib/env.ts — validate at startup
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 chars"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  MERCADOPAGO_ACCESS_TOKEN: z.string().min(1),
})

export const env = envSchema.parse(process.env)
// Throws at startup if any env var is missing or invalid — fail fast
```

## Rules

- Always export both schema and inferred type: `export type X = z.infer<typeof xSchema>`
- Use `safeParse` (not `parse`) at API/Action boundaries — handle errors gracefully
- Keep schemas close to where they're consumed
- Use `z.coerce` for query params and FormData (they're always strings)
- Use `z.discriminatedUnion` for WebSocket messages and event payloads
