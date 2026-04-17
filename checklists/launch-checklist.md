# Checklist de Launch — Proyecto Web

Usar antes de entregar cualquier proyecto a producción.

---

## Performance
- [ ] Lighthouse score ≥ 90 en Performance, Accessibility, Best Practices, SEO
- [ ] LCP < 2.5s — imagen hero con `priority` y `sizes` correctos
- [ ] Imágenes en WebP/AVIF, máx 200KB por imagen above-the-fold
- [ ] Fuentes con `font-display: swap` o cargadas desde next/font
- [ ] Bundle analizado — `npx @next/bundle-analyzer` sin chunks inesperados
- [ ] `next/image` en todas las imágenes, nunca `<img>` cruda

## SEO
- [ ] `<title>` único en cada página (60-70 chars)
- [ ] `<meta description>` único en cada página (150-160 chars)
- [ ] OG tags: og:title, og:description, og:image (1200x630), og:url
- [ ] Twitter Card: twitter:card, twitter:title, twitter:image
- [ ] `sitemap.xml` generado y accesible en /sitemap.xml
- [ ] `robots.txt` configurado
- [ ] Schema markup en páginas clave (Organization, Product, Article)
- [ ] URLs en minúsculas sin caracteres especiales
- [ ] Canonical tags donde corresponde

## Seguridad
- [ ] Variables de entorno en `.env.local`, nunca en el código
- [ ] `.env` en `.gitignore`
- [ ] HTTPS forzado en producción
- [ ] Headers de seguridad en `next.config.js` (X-Frame-Options, CSP, etc.)
- [ ] Rate limiting en API routes públicas
- [ ] Validación con Zod en todos los endpoints que reciben datos del cliente
- [ ] No exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente (solo `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] Cookies con `httpOnly: true`, `secure: true`, `sameSite: 'lax'`

## Funcionalidad
- [ ] Formularios validados con mensajes de error claros
- [ ] Estados de loading en botones de submit
- [ ] Manejo de errores en Server Actions (return error, no throw)
- [ ] 404 personalizado (`not-found.tsx`)
- [ ] Error page personalizada (`error.tsx`)
- [ ] Links internos funcionales sin 404
- [ ] Favicon y app icons configurados

## Mobile
- [ ] Responsive en 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1280px (desktop)
- [ ] Touch targets ≥ 44x44px
- [ ] Sin scroll horizontal en ningún breakpoint
- [ ] Formularios con `type` correcto en inputs (email, tel, number)

## Accesibilidad
- [ ] Contraste de texto ≥ 4.5:1 (WCAG AA)
- [ ] `alt` en todas las imágenes informativas
- [ ] Labels en todos los campos de formulario
- [ ] Navegación con teclado funcional
- [ ] Focus rings visibles

## Antes del deploy
- [ ] Variables de entorno cargadas en el servidor (Vercel/DigitalOcean)
- [ ] Base de datos en producción con datos seed si corresponde
- [ ] Dominio apuntado y SSL activo
- [ ] Analytics configurado (si aplica)
- [ ] Backup inicial de DB tomado
