# Programming Skills — NOMO Digital

Documentación completa de skills de programación para desarrollo de NOMO y proyectos relacionados.

## 📁 Estructura

### 🎨 Web Design (`web-design/`)
Diseño visual, branding, componentes UI.

- **design/** — Identidad visual, logos, design systems, UI
- **brand/** — Voz de marca, guía de estilo, mensajes, consistencia
- **banner-design/** — Banners para redes sociales, ads, hero sections

### ⚛️ Next.js & React (`nextjs-react/`)
Patrones, arquitectura, performance, best practices.

- **nextjs-app-router/** — App Router, Server/Client Components, Server Actions
- **nextjs-authentication/** — JWT, OAuth, rutas protegidas, RBAC, cookies seguras
- **nextjs-deployment/** — Docker, GitHub Actions CI/CD, DigitalOcean, env vars
- **nextjs-performance/** — Core Web Vitals, imágenes, fonts, Suspense, bundle
- **next-best-practices/** — Referencia completa Next.js (50K installs)
- **next-cache-components/** — PPR, `use cache`, cacheLife, cacheTag (Next.js 16)
- **react-patterns/** — React 19, useOptimistic, useActionState, hooks, WebSockets
- **react-best-practices/** — 69 reglas de performance (229K installs)
- **composition-patterns/** — Compound components, sin boolean props (95K installs)

### 🗄️ Backend & Database (`backend-db/`)
Base de datos, seguridad, validación.

- **postgres-best-practices/** — Queries, indexes, RLS, connection pooling, Prisma
- **typescript-security-review/** — OWASP Top 10, multi-tenant, webhook validation
- **zod-validation-utilities/** — Schemas, safeParse, React Hook Form, discriminated unions

### 🧪 Testing & Debugging (`testing-debugging/`)
Metodología de testing y debugging sin parches rápidos.

- **systematic-debugging/** — Root cause first, 4-fase methodology
- **test-driven-development/** — Red/Green/Refactor, validación de tests
- **webapp-testing/** — Playwright, browser automation, testing UI y PWA

### 🤖 AI & Prompting (`ai-prompting/`)
Ingeniería de prompts, diseño de prompts, templates.

- **prompt-engineering/** — Few-shot, chain-of-thought, templates para NOMO

---

## 🚀 Cómo Usar

Cada skill tiene:
- `SKILL.md` — Contenido principal (patterns, ejemplos, best practices)
- Referencia clara a qué usar en cada situación

**Ejemplo:**
```
// Necesitás autenticación → lee nextjs-react/nextjs-authentication/SKILL.md
// Necesitás optimizar performance → lee nextjs-react/nextjs-performance/SKILL.md
// Necesitás debuggear un bug → lee testing-debugging/systematic-debugging/SKILL.md
```

---

## 📊 Resumen

| Categoría | Skills | Uso |
|-----------|--------|-----|
| Web Design | 3 | Diseño visual, branding, componentes |
| Next.js/React | 9 | Frontend, patrones, performance |
| Backend/DB | 3 | Autenticación, DB, seguridad |
| Testing | 3 | Testing, debugging, QA |
| AI/Prompting | 1 | Prompts, templates, diseño |
| **TOTAL** | **19** | Desarrollo completo NOMO |

---

Última actualización: 2026-04-14
