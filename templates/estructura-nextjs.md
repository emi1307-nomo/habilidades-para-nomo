# Estructura de Proyecto Next.js — Template

Estructura base para proyectos con App Router + Supabase + TypeScript.

---

```
mi-proyecto/
├── .env.local                    # Variables de entorno (no commitear)
├── .env.example                  # Template de variables (sí commitear)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   ├── favicon.ico
│   └── og-image.png              # 1200x630 para redes sociales
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout con metadata global
│   │   ├── page.tsx              # Home
│   │   ├── globals.css           # Tailwind base + variables CSS + keyframes
│   │   ├── not-found.tsx         # Página 404
│   │   ├── error.tsx             # Error boundary global
│   │   │
│   │   ├── (auth)/               # Grupo de rutas — no crea segmento en URL
│   │   │   ├── login/page.tsx
│   │   │   └── registro/page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Layout con sidebar/navbar del dashboard
│   │   │   ├── page.tsx
│   │   │   └── [seccion]/page.tsx
│   │   │
│   │   └── api/
│   │       ├── webhooks/
│   │       │   └── mercadopago/route.ts
│   │       └── upload/route.ts
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (auto-generados)
│   │   ├── layout/               # Header, Footer, Sidebar, Nav
│   │   └── [feature]/            # Componentes por feature (ej: productos/, usuarios/)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # createBrowserClient
│   │   │   └── server.ts         # createServerClient (cookies)
│   │   ├── auth.ts               # JWT helpers
│   │   ├── validations.ts        # Schemas Zod reutilizables
│   │   └── utils.ts              # cn(), formatPrice(), formatDate()
│   │
│   ├── actions/                  # Server Actions organizadas por feature
│   │   ├── auth.ts
│   │   ├── productos.ts
│   │   └── pagos.ts
│   │
│   ├── types/
│   │   ├── database.ts           # Tipos generados por Supabase (supabase gen types)
│   │   └── index.ts              # Tipos del dominio del negocio
│   │
│   └── hooks/                   # Custom hooks del cliente
│       ├── useDebounce.ts
│       └── useLocalStorage.ts
│
├── prisma/                       # Si se usa Prisma en vez de Supabase client directo
│   ├── schema.prisma
│   └── migrations/
│
└── tests/
    ├── unit/                     # Vitest
    └── e2e/                      # Playwright
```

---

## Comandos iniciales

```bash
# Crear proyecto
npx create-next-app@latest mi-proyecto --typescript --tailwind --eslint --app --src-dir

# Instalar dependencias base
npm install @supabase/supabase-js @supabase/ssr
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react clsx tailwind-merge

# shadcn/ui
npx shadcn@latest init

# Supabase CLI (tipos de DB)
npx supabase gen types typescript --project-id XXXXX > src/types/database.ts
```

## next.config.ts base

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
```
