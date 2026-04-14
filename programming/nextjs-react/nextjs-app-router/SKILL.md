---
name: nextjs-app-router
description: Next.js 16+ App Router patterns — Server vs Client Components, Server Actions, caching with use cache, async APIs, file conventions (page, layout, loading, error, route). Use when building or reviewing Next.js App Router applications.
argument-hint: "[feature or component to implement]"
metadata:
  source: giuseppe-trisciuoglio/developer-kit
  version: "1.0.0"
---

# Next.js App Router (Next.js 16+)

Patterns for building modern Next.js applications with App Router architecture.

## Server vs Client Components

**Server Components** (default):
- Run on the server, can use async/await directly
- Access databases, secrets, file system
- Cannot use hooks, browser APIs, or event handlers

**Client Components** (add `"use client"` directive):
- Required for hooks, browser APIs, event handlers
- Hydrated on the client
- Keep them as leaf nodes — push `"use client"` down the tree

```tsx
// Server Component (default)
async function ProductList() {
  const products = await db.product.findMany() // direct DB access
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}

// Client Component
"use client"
import { useState } from "react"
export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## Server Actions

Define mutations with `"use server"` directive. Always validate inputs.

```tsx
// actions/product.ts
"use server"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const schema = z.object({ name: z.string().min(1), price: z.number().positive() })

export async function createProduct(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    price: Number(formData.get("price"))
  })
  if (!parsed.success) return { error: parsed.error.flatten() }
  
  await db.product.create({ data: parsed.data })
  revalidatePath("/products")
}
```

## Caching (Next.js 16)

```tsx
// Explicit caching with use cache
"use cache"
import { cacheLife, cacheTag } from "next/cache"

export async function getProducts() {
  cacheLife("hours") // or seconds: number
  cacheTag("products")
  return db.product.findMany()
}

// On-demand revalidation
import { revalidateTag } from "next/cache"
revalidateTag("products") // invalidates all cached data with this tag
```

## Async APIs (Next.js 16 — all are async)

```tsx
import { cookies, headers } from "next/headers"
import { type NextRequest } from "next/server"

// In Server Components and Route Handlers
export default async function Page({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q: string }>
}) {
  const { id } = await params
  const { q } = await searchParams
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
}
```

## File Conventions

| File | Purpose |
|---|---|
| `page.tsx` | Route page |
| `layout.tsx` | Shared layout (persists across navigations) |
| `loading.tsx` | Suspense fallback while page loads |
| `error.tsx` | Error boundary for the segment |
| `not-found.tsx` | 404 for the segment |
| `route.ts` | API Route Handler |
| `middleware.ts` / `proxy.ts` | Request interception |

## Route Handlers

```ts
// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page") ?? 1)
  const orders = await db.order.findMany({ skip: (page - 1) * 10, take: 10 })
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  // validate with zod before using
  const order = await db.order.create({ data: body })
  return NextResponse.json(order, { status: 201 })
}
```

## Critical Rules

- NEVER access `window` or `document` in Server Components — throws at runtime
- Client Components CANNOT be async
- Server Actions without validation expose the database — always validate
- Always sanitize third-party API responses before using
