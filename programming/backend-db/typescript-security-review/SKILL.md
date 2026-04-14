---
name: typescript-security-review
description: Security audit for TypeScript/Next.js/Node.js apps — OWASP Top 10, JWT validation, SQL injection, input validation, XSS, secrets management, security headers, dependency vulnerabilities. Use when reviewing code for security issues, especially apps with payments or multi-tenant data.
argument-hint: "[file or feature to audit]"
metadata:
  source: giuseppe-trisciuoglio/developer-kit
  version: "1.0.0"
---

# TypeScript Security Review

Security audit checklist for TypeScript/Next.js/Node.js applications. Critical for apps with payments, multi-tenant data, or user authentication.

## Review Checklist (9 checkpoints)

### 1. Authentication & JWT

```ts
// ✅ Correct JWT validation
import { jwtVerify } from "jose"

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!),
    {
      algorithms: ["HS256"], // explicit algorithm — prevents alg:none attacks
      issuer: process.env.NEXT_PUBLIC_APP_URL,
    }
  )
  return payload
}

// ❌ Never use jwt.verify without algorithm validation
// ❌ Never accept JWT with alg: "none"
// ❌ Never store JWT in localStorage — use httpOnly cookies
```

### 2. SQL Injection Prevention

```ts
// ✅ Prisma — parameterized by default
const user = await prisma.user.findUnique({ where: { email } })

// ✅ Raw queries — always use parameterized
const result = await prisma.$queryRaw`
  SELECT * FROM orders WHERE restaurant_id = ${restaurantId} AND date = ${date}
`

// ❌ NEVER string interpolation in SQL
// const result = await prisma.$queryRawUnsafe(`SELECT * FROM orders WHERE id = ${id}`)
```

### 3. Input Validation — All Public Endpoints

```ts
// Every API route and Server Action must validate inputs with Zod
import { z } from "zod"
import { NextRequest, NextResponse } from "next/server"

const createOrderSchema = z.object({
  tableId: z.string().uuid(),
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().positive().max(99),
  })).min(1).max(50),
  notes: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  // use parsed.data — type-safe and validated
}
```

### 4. XSS Prevention

```tsx
// Next.js/React escapes output by default — safe
<p>{userInput}</p>

// ❌ NEVER use dangerouslySetInnerHTML with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // XSS risk

// ✅ If you must render HTML — sanitize first
import DOMPurify from "dompurify"
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### 5. Secrets Management

```ts
// ✅ Correct
const secret = process.env.JWT_SECRET! // server-side only
const publicUrl = process.env.NEXT_PUBLIC_APP_URL! // safe for browser

// ❌ Never hardcode
const secret = "mysecret123" // NEVER

// ❌ Never expose server secrets to client
const secret = process.env.NEXT_PUBLIC_JWT_SECRET // exposes to browser!
```

### 6. Multi-Tenant Data Isolation (critical for NOMO SaaS)

```ts
// ALWAYS scope queries to the authenticated tenant
export async function getOrders(req: NextRequest) {
  const user = await getCurrentUser(req) // includes restaurantId
  if (!user) return unauthorized()

  // ✅ Always filter by restaurantId from the authenticated session
  const orders = await prisma.order.findMany({
    where: {
      restaurantId: user.restaurantId, // from JWT — not from request body
    }
  })

  // ❌ NEVER trust restaurantId from the request body/params
  // const orders = await prisma.order.findMany({
  //   where: { restaurantId: req.body.restaurantId } // tenant bypass!
  // })
}
```

### 7. Security Headers (Next.js)

```ts
// next.config.ts
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // adjust for your needs
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "connect-src 'self' wss:", // for WebSockets
    ].join("; ")
  },
]

export default {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  }
}
```

### 8. Mercado Pago Webhook Validation (NOMO specific)

```ts
// app/api/webhooks/mercadopago/route.ts
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature")
  const requestId = req.headers.get("x-request-id")
  const body = await req.text()

  // Validate webhook signature
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET!
  const manifest = `id:${requestId};ts:${Date.now()};`
  const hmac = crypto.createHmac("sha256", secret)
    .update(manifest + body)
    .digest("hex")

  if (hmac !== signature?.split("v1=")[1]) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)
  // process event...
}
```

### 9. Dependency Audit

```bash
npm audit                    # check for CVEs
npm audit fix               # auto-fix where possible
npx better-npm-audit audit  # stricter audit
```

## Severity Classification

| Severity | Action |
|---|---|
| Critical | Fix immediately, do not deploy |
| High | Fix before next release |
| Medium | Fix within sprint |
| Low | Add to backlog |

## Common Vulnerabilities in NOMO-type Apps

- Tenant data leakage (restaurantId not scoped in queries)
- Unauthenticated WebSocket connections (no auth on socket handshake)
- Payment webhook not validated (anyone can fake payment confirmation)
- Admin routes only protected by middleware (re-verify in Server Actions)
- PII in logs (never log passwords, tokens, card numbers)
