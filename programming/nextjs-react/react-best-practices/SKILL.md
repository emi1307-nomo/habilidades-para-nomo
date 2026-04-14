---
name: react-best-practices
description: 69 performance rules for React and Next.js across 8 categories — waterfall elimination, bundle size optimization, server-side caching, re-render optimization, rendering performance. From Vercel (229K installs). Use when writing new React components, reviewing code for performance, or optimizing bundle size.
argument-hint: "[component or pattern to review/build]"
metadata:
  source: vercel-labs/agent-skills
  installs: 229800
  version: "1.0.0"
---

# React Best Practices (Vercel)

69 performance rules across 8 categories. Prioritized by impact.

## CRITICAL: Waterfall Elimination

```tsx
// ❌ Waterfall — sequential fetches
async function Page() {
  const user = await getUser()          // waits
  const orders = await getOrders(user.id) // then waits again
  const stats = await getStats(user.id)   // then waits again
}

// ✅ Parallel — all at once
async function Page({ userId }: { userId: string }) {
  const [user, orders, stats] = await Promise.all([
    getUser(userId),
    getOrders(userId),
    getStats(userId),
  ])
}
```

## CRITICAL: Bundle Size

```tsx
// ❌ Barrel imports — loads entire library
import { Button, Input, Modal } from "@/components"

// ✅ Direct imports
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ❌ Import entire date library
import moment from "moment"

// ✅ Tree-shakeable alternative
import { format } from "date-fns"

// ✅ Dynamic import for heavy components below fold
import dynamic from "next/dynamic"
const HeavyChart = dynamic(() => import("@/components/Chart"))
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { ssr: false })
```

## Server-Side Performance

```tsx
// ✅ Cache repeated data access
import { unstable_cache } from "next/cache"

const getRestaurantMenu = unstable_cache(
  async (restaurantId: string) => db.menuItem.findMany({ where: { restaurantId } }),
  ["restaurant-menu"],
  { tags: ["menu"], revalidate: 300 }
)

// ✅ Deduplicate concurrent requests with React cache
import { cache } from "react"

export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } })
})
// Calling getUser(id) multiple times in one render = single DB query
```

## Re-render Optimization

```tsx
// ❌ New object reference on every render
function Parent() {
  return <Child config={{ theme: "dark" }} /> // re-renders Child every time
}

// ✅ Stable reference
const CONFIG = { theme: "dark" } // outside component
function Parent() {
  return <Child config={CONFIG} />
}

// ✅ useMemo for expensive derived values
const sortedOrders = useMemo(
  () => orders.sort((a, b) => b.createdAt - a.createdAt),
  [orders]
)

// ✅ useCallback for stable function references
const handleStatusChange = useCallback((id: string, status: string) => {
  updateOrder(id, status)
}, []) // stable reference — child won't re-render

// ✅ useEffect — minimal dependency arrays
useEffect(() => {
  fetchData(userId) // only re-run when userId changes
}, [userId]) // not [userId, fetchData] if fetchData is stable
```

## Rendering Performance

```tsx
// ✅ Avoid conditional rendering that unmounts/remounts
// ❌
{isVisible && <ExpensiveComponent />} // unmounts on false

// ✅ CSS hide — preserves state
<ExpensiveComponent className={isVisible ? "block" : "hidden"} />

// ✅ Virtualize long lists
import { useVirtualizer } from "@tanstack/react-virtual"
// Don't render 1000 order rows — only visible ones
```

## State Management

```tsx
// ✅ Colocate state — keep state as close to usage as possible
// Don't lift state to root unless multiple components need it

// ✅ Derive state — don't duplicate
// ❌
const [items, setItems] = useState([])
const [count, setCount] = useState(0) // duplicated from items.length

// ✅
const [items, setItems] = useState([])
const count = items.length // derived
```

## Quick Checklist

- [ ] No sequential awaits — use `Promise.all` for independent fetches
- [ ] No barrel imports from large libraries
- [ ] Heavy components use `dynamic()` import
- [ ] `unstable_cache` or `React.cache` for repeated data access
- [ ] No new object/array literals passed as props in render
- [ ] `useCallback` for functions passed to child components
- [ ] `useMemo` for expensive computations
- [ ] Long lists use virtualization
