---
name: next-cache-components
description: Next.js 16 caching with Partial Prerendering (PPR) — use cache directive, cacheLife, cacheTag, revalidateTag, mixing static/cached/dynamic content in one route. Use when implementing caching strategy in Next.js 16+ apps.
argument-hint: "[component or route to cache]"
metadata:
  source: vercel-labs/next-skills
  installs: 15100
  version: "1.0.0"
---

# Next.js Cache Components (PPR)

Partial Prerendering — mix static, cached, and dynamic content in a single route. Next.js 16+.

## Setup

```ts
// next.config.ts
export default {
  cacheComponents: true, // replaces experimental.ppr
}
```

## Three Content Types in One Route

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react"

export default function Dashboard() {
  return (
    <div>
      {/* STATIC — rendered at build time, instant */}
      <Header />
      <Navigation />

      {/* CACHED — fetched once, served from cache */}
      <Suspense fallback={<MenuSkeleton />}>
        <MenuItems /> {/* use cache inside */}
      </Suspense>

      {/* DYNAMIC — fresh on every request */}
      <Suspense fallback={<OrdersSkeleton />}>
        <LiveOrders /> {/* no cache — real-time */}
      </Suspense>
    </div>
  )
}
```

## `use cache` Directive

```tsx
// File level — entire module is cached
"use cache"
import { cacheLife, cacheTag } from "next/cache"

export async function getMenuItems(restaurantId: string) {
  cacheLife("hours")           // cache for hours
  cacheTag("menu", restaurantId) // tag for invalidation
  return db.menuItem.findMany({ where: { restaurantId } })
}

// Function level — only this function is cached
export async function getStats(restaurantId: string) {
  "use cache"
  cacheLife({ stale: 60, revalidate: 120, expire: 3600 }) // custom: seconds
  cacheTag("stats", restaurantId)
  return db.order.aggregate({ where: { restaurantId } })
}

// Component level
export async function MenuSection({ restaurantId }: { restaurantId: string }) {
  "use cache"
  cacheLife("minutes")
  cacheTag("menu")
  const items = await db.menuItem.findMany({ where: { restaurantId } })
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}
```

## Cache Life Profiles

| Profile | Stale | Revalidate | Use for |
|---|---|---|---|
| `"seconds"` | 0s | 1s | Near-real-time |
| `"minutes"` | 60s | 60s | Frequently updated |
| `"hours"` | 300s | 3600s | Menu, catalog |
| `"days"` | 3600s | 86400s | Static content |
| `"weeks"` | 86400s | 604800s | Brand assets |
| `"max"` | max | max | Never changes |

## Cache Invalidation

```ts
// On-demand invalidation — after mutation
import { revalidateTag } from "next/cache"

export async function updateMenuItem(id: string, data: MenuItemData) {
  "use server"
  await db.menuItem.update({ where: { id }, data })
  revalidateTag("menu")          // invalidates all "menu" tagged caches
  revalidateTag(data.restaurantId) // or scope to specific restaurant
}

// updateTag — within same request
import { updateTag } from "next/cache"
updateTag("menu") // immediate, same request context
```

## Constraints

```tsx
// ❌ Cannot use runtime APIs inside "use cache"
export async function getCachedData() {
  "use cache"
  const cookieStore = await cookies() // ERROR — runtime API!
}

// ✅ Pass runtime values as arguments
export async function getCachedData(userId: string) {
  "use cache"
  cacheTag(`user-${userId}`)
  return db.user.findUnique({ where: { id: userId } })
}

// ✅ Or use "use cache: private" for compliance needs
export async function getPrivateData() {
  "use cache: private" // allows runtime APIs, restricted to browser
  const cookieStore = await cookies() // OK with private profile
}
```

## Migration from unstable_cache

```tsx
// ❌ Old pattern
import { unstable_cache } from "next/cache"

const getMenu = unstable_cache(
  async (restaurantId: string) => db.menuItem.findMany({ where: { restaurantId } }),
  ["menu"],
  { tags: ["menu"], revalidate: 3600 }
)

// ✅ New pattern with use cache
async function getMenu(restaurantId: string) {
  "use cache"
  cacheLife("hours")
  cacheTag("menu", restaurantId)
  return db.menuItem.findMany({ where: { restaurantId } })
}
```
