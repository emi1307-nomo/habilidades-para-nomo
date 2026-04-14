---
name: react-patterns
description: React 19 patterns for Next.js App Router — Server vs Client Components, useOptimistic, useActionState, hooks patterns, TypeScript typing, Suspense, ErrorBoundary, Server Actions. Use when building React components or implementing UI interactions.
argument-hint: "[component or pattern to implement]"
metadata:
  source: giuseppe-trisciuoglio/developer-kit
  version: "1.0.0"
---

# React 19 Patterns

Modern React patterns for Next.js App Router with TypeScript.

## Component Decision Tree

```
Does it need hooks, browser APIs, or event handlers?
├── YES → "use client" directive
└── NO → Server Component (default, no directive needed)
         Can it fetch data directly?
         ├── YES → async function, await db/fetch directly
         └── NO → pass data as props from parent
```

## Server Actions with useActionState

```tsx
// actions/order.ts
"use server"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const schema = z.object({ tableId: z.string(), items: z.array(z.string()) })

export async function createOrder(prevState: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    tableId: formData.get("tableId"),
    items: formData.getAll("items"),
  })
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const order = await db.order.create({ data: parsed.data })
  revalidatePath("/kitchen")
  return { success: true, orderId: order.id }
}

// Component
"use client"
import { useActionState } from "react"
import { createOrder } from "@/actions/order"

export function OrderForm() {
  const [state, action, isPending] = useActionState(createOrder, null)

  return (
    <form action={action}>
      <input name="tableId" />
      {state?.error && <p className="text-red-500">{JSON.stringify(state.error)}</p>}
      {state?.success && <p className="text-green-500">Order created!</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Order"}
      </button>
    </form>
  )
}
```

## Optimistic UI with useOptimistic

```tsx
"use client"
import { useOptimistic, useTransition } from "react"
import { updateOrderStatus } from "@/actions/order"

type Order = { id: string; status: "pending" | "preparing" | "ready" }

export function KitchenQueue({ orders }: { orders: Order[] }) {
  const [optimisticOrders, addOptimistic] = useOptimistic(
    orders,
    (state, { id, status }: { id: string; status: Order["status"] }) =>
      state.map(o => o.id === id ? { ...o, status } : o)
  )
  const [, startTransition] = useTransition()

  const markReady = (id: string) => {
    startTransition(async () => {
      addOptimistic({ id, status: "ready" }) // instant UI update
      await updateOrderStatus(id, "ready")   // actual server call
    })
  }

  return (
    <ul>
      {optimisticOrders.map(order => (
        <li key={order.id}>
          {order.id} — {order.status}
          {order.status === "preparing" && (
            <button onClick={() => markReady(order.id)}>Mark Ready</button>
          )}
        </li>
      ))}
    </ul>
  )
}
```

## Data Fetching Patterns

```tsx
// ✅ Parallel data fetching in Server Component
export default async function DashboardPage() {
  const [orders, stats, menu] = await Promise.all([
    db.order.findMany({ take: 10 }),
    db.order.aggregate({ _count: true }),
    db.menuItem.findMany({ where: { available: true } }),
  ])
  return <Dashboard orders={orders} stats={stats} menu={menu} />
}
```

## Suspense + Error Boundaries

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export default function Page() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrderList />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## Custom Hooks Patterns

```tsx
// hooks/useRealtime.ts — WebSocket for NOMO
"use client"
import { useEffect, useRef, useState } from "react"
import type { Socket } from "socket.io-client"

export function useKitchenSocket(restaurantId: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { restaurantId }
    })
    socketRef.current = socket

    socket.on("order:new", (order: Order) => {
      setOrders(prev => [order, ...prev])
    })

    socket.on("order:updated", (updated: Order) => {
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
    })

    return () => { socket.disconnect() }
  }, [restaurantId])

  return { orders, socket: socketRef.current }
}
```

## TypeScript Component Patterns

```tsx
// Always type props explicitly
interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
  }
  onAddToCart: (id: string) => void
  className?: string
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product.id)}>Add to cart</button>
    </div>
  )
}
```

## Rules

- Server Components cannot use hooks — they're async functions
- `"use client"` propagates down — everything imported in a Client Component becomes client-side
- Always type Server Action return values for type-safe `useActionState`
- Use `useOptimistic` for any real-time UI (KDS, order status, stock)
