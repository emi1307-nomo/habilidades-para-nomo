---
name: nextjs-performance
description: Next.js performance optimization — Core Web Vitals (LCP, INP, CLS), Server Components architecture, image/font optimization, caching strategies, bundle size, streaming and Suspense. Use when optimizing or reviewing performance of a Next.js app.
argument-hint: "[page or feature to optimize]"
metadata:
  source: giuseppe-trisciuoglio/developer-kit
  version: "1.0.0"
---

# Next.js Performance Optimization

Core Web Vitals and production-grade performance for Next.js 16+ apps.

## Core Web Vitals Targets

| Metric | Good | Needs Work | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5–4s | > 4s |
| INP (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |

## Server Components First (biggest win)

Convert `useEffect` + fetch → async Server Component. Reduces JS bundle by ~70%.

```tsx
// ❌ Before (Client Component with useEffect)
"use client"
export function OrderList() {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(setOrders)
  }, [])
  return <ul>{orders.map(o => <li key={o.id}>{o.id}</li>)}</ul>
}

// ✅ After (Server Component)
export async function OrderList() {
  const orders = await db.order.findMany({ take: 20 })
  return <ul>{orders.map(o => <li key={o.id}>{o.id}</li>)}</ul>
}
```

## Image Optimization

```tsx
import Image from "next/image"

// Above the fold — use priority
<Image
  src="/hero.webp"
  alt="Hero"
  width={1200}
  height={600}
  priority // only for above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/webp;base64,..."
/>

// Below the fold — lazy load (default)
<Image src="/product.webp" alt="Product" width={400} height={300} />
```

**Rules:**
- Use `priority` ONLY for the largest above-the-fold image
- Always use WebP or AVIF format
- Always specify `width` and `height` to prevent CLS

## Font Optimization (zero CLS)

```tsx
// app/layout.tsx
import { Inter, Geist_Mono } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

## Streaming with Suspense (improve perceived performance)

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react"
import { OrdersSkeleton } from "@/components/skeletons"

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Streams independently — doesn't block page render */}
      <Suspense fallback={<OrdersSkeleton />}>
        <RecentOrders />
      </Suspense>
      <Suspense fallback={<OrdersSkeleton />}>
        <KitchenQueue />
      </Suspense>
    </div>
  )
}
```

## Lazy Loading Heavy Components

```tsx
import dynamic from "next/dynamic"

// Load chart library only when needed
const OrdersChart = dynamic(() => import("@/components/OrdersChart"), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded" />,
  ssr: false, // only if it uses browser APIs
})
```

## Caching Strategy

```ts
// lib/cache.ts — granular cache tags
import { unstable_cache } from "next/cache"

export const getMenuItems = unstable_cache(
  async (restaurantId: string) => {
    return db.menuItem.findMany({ where: { restaurantId } })
  },
  ["menu-items"],
  { tags: ["menu"], revalidate: 300 } // 5 min
)

export const getOrderStats = unstable_cache(
  async (restaurantId: string, date: string) => {
    return db.order.aggregate({ where: { restaurantId, date } })
  },
  ["order-stats"],
  { tags: ["orders", "stats"], revalidate: 60 }
)

// Invalidate on mutation
import { revalidateTag } from "next/cache"
await revalidateTag("menu") // only menu cache invalidated
```

## Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true npm run build

# Check what's large — common culprits:
# - moment.js → replace with date-fns
# - lodash → import specific functions
# - chart libraries → lazy load
```

## Performance Checklist

- [ ] Server Components used by default, `"use client"` only where needed
- [ ] Above-the-fold image has `priority` attribute
- [ ] All images use `next/image` with width/height
- [ ] Fonts use `next/font` (not CSS imports)
- [ ] Heavy components below fold use `dynamic()` import
- [ ] Data fetching uses cache tags for granular revalidation
- [ ] Suspense boundaries around async data fetches
- [ ] No `useEffect` for data fetching that could be a Server Component
