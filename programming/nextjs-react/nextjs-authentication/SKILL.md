---
name: nextjs-authentication
description: Authentication patterns for Next.js 15+ App Router — JWT, Auth.js (NextAuth v5), OAuth2, protected routes, role-based access, Server Actions security. Use when implementing or reviewing auth in Next.js apps.
argument-hint: "[auth feature to implement]"
metadata:
  source: giuseppe-trisciuoglio/developer-kit
  version: "1.0.0"
---

# Next.js Authentication

Patterns for authentication in Next.js 15+ with App Router.

## JWT Authentication (custom — Emiliano's stack)

```ts
// lib/auth/jwt.ts
import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function signToken(payload: { userId: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: string; role: string }
  } catch {
    return null
  }
}
```

## Middleware — Protect Routes

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/jwt"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Inject user info into headers for Server Components
  const headers = new Headers(request.headers)
  headers.set("x-user-id", payload.userId)
  headers.set("x-user-role", payload.role)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"]
}
```

## Get Current User in Server Components

```ts
// lib/auth/session.ts
import { cookies, headers } from "next/headers"
import { verifyToken } from "./jwt"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null
  return verifyToken(token)
}

// In Server Component
export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return <div>Welcome {user.userId}</div>
}
```

## Role-Based Access Control

```ts
// lib/auth/rbac.ts
export type Role = "admin" | "manager" | "staff"

const permissions: Record<Role, string[]> = {
  admin: ["*"],
  manager: ["orders:read", "orders:write", "menu:read", "menu:write", "reports:read"],
  staff: ["orders:read", "orders:write", "menu:read"],
}

export function can(role: Role, permission: string): boolean {
  const perms = permissions[role]
  return perms.includes("*") || perms.includes(permission)
}

// Usage in Server Action
export async function deleteProduct(id: string) {
  "use server"
  const user = await getCurrentUser()
  if (!user || !can(user.role as Role, "menu:write")) {
    throw new Error("Unauthorized")
  }
  await db.product.delete({ where: { id } })
}
```

## Secure Login Action

```ts
// actions/auth.ts
"use server"
import { cookies } from "next/headers"
import { z } from "zod"
import bcrypt from "bcrypt"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  })
  if (!parsed.success) return { error: "Invalid credentials" }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } })
  if (!user) return { error: "Invalid credentials" } // same message — no user enumeration

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
  if (!valid) return { error: "Invalid credentials" }

  const token = await signToken({ userId: user.id, role: user.role })

  const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return { success: true }
}
```

## Critical Security Rules

- **NEVER** trust middleware alone — always re-verify auth in Server Actions
- Use `httpOnly` cookies for tokens — never localStorage
- Never expose different error messages for "user not found" vs "wrong password" (user enumeration)
- Always use constant-time comparison for passwords (bcrypt does this)
- Refresh tokens on sensitive operations
- Log failed auth attempts
