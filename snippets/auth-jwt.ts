// Autenticación JWT — Next.js App Router
// Instalar: npm install jose bcryptjs

import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

// Crear token
export async function createToken(payload: { userId: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

// Verificar token
export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET)
  return payload as { userId: string; role: string }
}

// Login Server Action
export async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } })
  if (!user) return { error: 'Credenciales inválidas' }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return { error: 'Credenciales inválidas' }

  const token = await createToken({ userId: user.id, role: user.role })

  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  return { success: true }
}

// Middleware — middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    await verifyToken(token)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
