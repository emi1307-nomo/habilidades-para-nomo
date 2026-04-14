---
name: next-best-practices
description: Comprehensive Next.js best practices from Vercel (50K installs) — file conventions, RSC boundaries, async APIs, data fetching, error handling, Suspense, images, fonts, metadata, route handlers, self-hosting, bundle optimization. Use for any Next.js architecture decision.
argument-hint: "[Next.js feature or pattern]"
metadata:
  source: vercel-labs/next-skills
  installs: 50300
  version: "1.0.0"
---

# Next.js Best Practices (Vercel Official)

Comprehensive reference for Next.js App Router development.

## RSC Boundaries — When to use "use client"

```
Only add "use client" when you need:
- useState, useEffect, useReducer, useContext
- Event handlers (onClick, onChange, onSubmit)
- Browser APIs (window, document, localStorage)
- Third-party libraries that use the above

Everything else = Server Component by default.
```

```tsx
// ✅ Push "use client" to leaf nodes
// Server Component — fetches data
async function ProductPage({ id }: { id: string }) {
  const product = await db.product.findUnique({ where: { id } })
  return (
    <div>
      <ProductInfo product={product} /> {/* Server */}
      <AddToCartButton productId={id} /> {/* Client — needs onClick */}
    </div>
  )
}

// "use client" only where needed
"use client"
export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => addToCart(productId)}>Add to cart</button>
}
```

## Async APIs (Next.js 15+)

All Next.js dynamic APIs are now async:

```tsx
// page.tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab: string }>
}) {
  const { id } = await params
  const { tab } = await searchParams
}

// Route Handler
import { cookies, headers } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const headersList = await headers()
  const token = cookieStore.get("token")
}
```

## Data Fetching Patterns

```tsx
// ✅ Fetch in Server Component — no API roundtrip
async function Orders() {
  const orders = await db.order.findMany()
  return <OrderList orders={orders} />
}

// ✅ Parallel fetch — no waterfalls
async function Dashboard() {
  const [orders, menu, stats] = await Promise.all([
    db.order.findMany({ take: 10 }),
    db.menuItem.findMany(),
    db.order.aggregate({ _count: true }),
  ])
}

// ✅ Stream independent sections with Suspense
export default function Page() {
  return (
    <>
      <Suspense fallback={<Skeleton />}><RecentOrders /></Suspense>
      <Suspense fallback={<Skeleton />}><KitchenQueue /></Suspense>
      <Suspense fallback={<Skeleton />}><Stats /></Suspense>
    </>
  )
}
```

## Error Handling

```tsx
// error.tsx — catches errors in segment
"use client"
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

// not-found.tsx
import { notFound } from "next/navigation"

async function ProductPage({ id }: { id: string }) {
  const product = await db.product.findUnique({ where: { id } })
  if (!product) notFound() // renders not-found.tsx
}
```

## Image Optimization

```tsx
import Image from "next/image"

// ✅ Always use next/image — never <img>
<Image
  src="/hero.webp"
  alt="Descriptive alt text"
  width={1200}
  height={600}
  priority // only for above-the-fold
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// ✅ Remote images — configure domains
// next.config.ts
export default {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.example.com" }
    ]
  }
}
```

## Font Optimization

```tsx
// ✅ next/font — zero layout shift, self-hosted automatically
import { Inter, Geist_Mono } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}

// ✅ Local font
import localFont from "next/font/local"
const myFont = localFont({ src: "./fonts/MyFont.woff2" })
```

## Metadata & SEO

```tsx
// Static metadata
export const metadata = {
  title: "NOMO — Gestión de Restaurantes",
  description: "Sistema completo para tu restaurante",
  openGraph: {
    title: "NOMO",
    images: ["/og-image.png"],
  },
}

// Dynamic metadata
export async function generateMetadata({ params }) {
  const { id } = await params
  const restaurant = await db.restaurant.findUnique({ where: { id } })
  return { title: restaurant?.name ?? "NOMO" }
}
```

## Route Handlers Best Practices

```tsx
// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server"

// ✅ Always validate input
// ✅ Use NextResponse.json()
// ✅ Handle errors explicitly
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page") ?? 1)
    const data = await db.order.findMany({ skip: (page-1)*20, take: 20 })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
```

## Self-Hosting (DigitalOcean)

```ts
// next.config.ts
export default {
  output: "standalone", // required for Docker
}
```

```dockerfile
# Multi-stage build — see nextjs-deployment skill
FROM node:22-alpine AS runner
COPY --from=builder /app/.next/standalone ./
CMD ["node", "server.js"]
```

## Hydration Errors — Common Fixes

```tsx
// ❌ Cause: content differs between server and client render
// ✅ Fix: suppress only when truly necessary
<time suppressHydrationWarning dateTime={date}>
  {formattedDate}
</time>

// ❌ Cause: using window/document during SSR
// ✅ Fix: check for browser environment
const isClient = typeof window !== "undefined"

// ❌ Cause: random IDs/dates in SSR
// ✅ Fix: useId() hook for stable IDs
import { useId } from "react"
const id = useId()
```
