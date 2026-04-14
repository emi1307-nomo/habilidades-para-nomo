---
name: systematic-debugging
description: Disciplined debugging methodology — NO FIXES WITHOUT ROOT CAUSE FIRST. Four phases: investigate, pattern analysis, hypothesis testing, implement. From obra/superpowers. Use when stuck on a bug or when quick fixes keep failing.
argument-hint: "[bug or error to debug]"
metadata:
  source: obra/superpowers
  installs: "N/A"
  version: "1.0.0"
---

# Systematic Debugging

**Rule #1: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

Quick patches mask underlying problems. Complete all four phases before touching code.

## The Four Phases

### Phase 1: Root Cause Investigation

```
1. Read the error message completely — don't skim
2. Read the full stack trace — find where it actually breaks
3. Reproduce consistently — can you make it happen reliably?
4. Check recent changes — what changed right before this broke?
5. Gather evidence at each component boundary:
   - Log what data ENTERS the component
   - Log what data EXITS the component
   - Find where the data diverges from expectation
```

**For Next.js/Node errors:**
```bash
# Read the full error, not just the first line
npm run dev 2>&1 | head -50

# Check server logs
docker logs <container> --tail 100

# Database query log
DATABASE_URL="...?log=query" npm run dev
```

**For runtime errors:**
```ts
// Instrument at boundaries
export async function createOrder(formData: FormData) {
  "use server"
  console.log("[createOrder] input:", Object.fromEntries(formData))

  const parsed = schema.safeParse(...)
  console.log("[createOrder] parsed:", parsed.success ? "OK" : parsed.error.flatten())

  const result = await db.order.create(...)
  console.log("[createOrder] result:", result.id)
  return result
}
```

### Phase 2: Pattern Analysis

```
1. Find a WORKING example of similar code in the codebase
2. Compare working vs broken — what's different?
3. Read the relevant reference implementation completely
4. Check if there's a known issue / GitHub issue for this
```

```bash
# Find similar working code
grep -r "socket.on" src/ --include="*.ts" -l
grep -r "revalidateTag" src/ --include="*.ts"
```

### Phase 3: Hypothesis Testing

```
1. Form ONE clear hypothesis: "I think X is happening because Y"
2. Make the minimal change to test it
3. Verify the result
4. If wrong: form NEW hypothesis (don't stack fixes)
```

```ts
// ❌ Stacking fixes (don't do this)
// Fix 1: add null check
// Fix 2: change the query
// Fix 3: add try/catch
// Fix 4: disable the feature

// ✅ One hypothesis at a time
// Hypothesis: restaurantId is undefined because JWT isn't being read
// Test: log the JWT payload right after verification
// Result: JWT payload is fine → new hypothesis needed
```

### Phase 4: Implementation

```
1. Create a failing test case FIRST
2. Implement the single fix addressing root cause
3. Verify the fix passes the test
4. Run full test suite — no regressions
```

## Common Next.js/NOMO Bug Patterns

### WebSocket not receiving events

```ts
// Investigation checklist:
// 1. Is socket connected? Log socket.connected
// 2. Is the event name correct on both ends?
// 3. Is the restaurantId matching?
// 4. Is there a CORS issue?

// Server (socket.io)
io.on("connection", (socket) => {
  console.log("[socket] connected:", socket.id, socket.handshake.query)

  socket.on("join:restaurant", (restaurantId) => {
    socket.join(`restaurant:${restaurantId}`)
    console.log("[socket] joined room:", `restaurant:${restaurantId}`)
  })
})

// Emit with confirmation
io.to(`restaurant:${restaurantId}`).emit("order:new", order)
console.log("[socket] emitted order:new to", `restaurant:${restaurantId}`)

// Client
socket.on("connect", () => console.log("[socket] connected"))
socket.on("disconnect", (reason) => console.log("[socket] disconnected:", reason))
socket.emit("join:restaurant", restaurantId)
socket.on("order:new", (order) => console.log("[socket] received order:new", order))
```

### Prisma query returning wrong data

```ts
// Add logging to see exact SQL
const prisma = new PrismaClient({ log: ["query"] })

// Check what's actually in the where clause
const where = { restaurantId, status: "pending" }
console.log("[query] where:", JSON.stringify(where, null, 2))
const orders = await prisma.order.findMany({ where })
console.log("[query] results:", orders.length)
```

### Server Action not running

```ts
// Common causes:
// 1. Missing "use server" directive
// 2. Called from Client Component without proper import
// 3. Form action not bound correctly

// Verify with a simple log at the top
export async function myAction(formData: FormData) {
  "use server"
  console.log("[myAction] CALLED") // if this doesn't appear, action isn't running
}
```

## Stop Signal

> If THREE OR MORE attempted fixes fail → **STOP**

This signals an architectural problem, not a fixable bug. Signs:
- Each fix reveals a new problem in a different place
- The problem seems to move around
- You're not sure what's actually wrong anymore

**Action:** Step back, explain the full situation, and discuss whether a redesign is needed.

## Red Flags (rationalization traps)

```
"It's probably just a timing issue" → No — find the actual cause
"Let me just try this quickly" → Quick fixes create more bugs
"I'm almost there" → If 3 fixes failed, you're not close
"It works on my machine" → Environment difference — investigate why
```
