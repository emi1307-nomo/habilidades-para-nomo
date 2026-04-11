---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, and HTML/CSS). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, and check UI/UX code. Projects: website, landing page, dashboard, admin panel, e-commerce, SaaS, portfolio, blog, and mobile app. Elements: button, modal, navbar, sidebar, card, table, form, and chart. Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism, bento grid, dark mode, responsive, skeuomorphism, and flat design. Topics: color systems, accessibility, animation, layout, typography, font pairing, spacing, interaction states, shadow, and gradient."
---

# UI/UX Pro Max — Design Intelligence

Guía completa de diseño para web y mobile. Contiene 50+ estilos, 161 paletas de colores, 57 combinaciones tipográficas, 161 tipos de producto con reglas de razonamiento, 99 pautas de UX y 25 tipos de gráficos para 10 stacks de tecnología.

## Cuándo aplicar

**Obligatorio** para:
- Diseñar páginas nuevas (Landing Page, Dashboard, Admin, SaaS, Mobile App)
- Crear o refactorizar componentes UI (botones, modales, formularios, tablas, gráficos)
- Elegir paletas de color, tipografía, espaciado o sistemas de layout
- Revisar código por problemas de UX/accesibilidad
- Implementar navegación y patrones de interacción
- Mejorar calidad de interfaces existentes

**Omitir** para: lógica backend, diseño de APIs, base de datos, infraestructura no visual.

---

## Reglas por prioridad (1–10)

| Prioridad | Categoría | Impacto | Foco clave |
|-----------|-----------|---------|-----------|
| 1 | Accesibilidad | CRÍTICO | Contraste 4.5:1, alt text, teclado, ARIA |
| 2 | Touch & Interacción | CRÍTICO | Mínimo 44×44px, espaciado 8px+, feedback |
| 3 | Performance | ALTO | WebP/AVIF, lazy loading, CLS < 0.1 |
| 4 | Selección de estilo | ALTO | Coherente con tipo de producto, SVG icons |
| 5 | Layout & Responsive | ALTO | Mobile-first, sin scroll horizontal |
| 6 | Tipografía & Color | MEDIO | 16px base, line-height 1.5, tokens semánticos |
| 7 | Animación | MEDIO | 150–300ms, transform/opacity only |
| 8 | Formularios & Feedback | MEDIO | Labels visibles, errores junto al campo |
| 9 | Navegación | ALTO | Back predecible, máx 5 items bottom nav |
| 10 | Gráficos & Datos | BAJO | Leyendas, tooltips, colores accesibles |

---

## Reglas críticas de referencia rápida

### Accesibilidad (§1)
- Contraste mínimo 4.5:1 texto normal, 3:1 texto grande
- Foco visible en elementos interactivos (2–4px)
- Alt text descriptivo para imágenes con significado
- ARIA labels para botones solo con ícono
- Soporte completo de teclado con orden de tab lógico
- Respetar `prefers-reduced-motion`

### Touch & Interacción (§2)
- Mínimo 44×44pt (Apple) / 48×48dp (Material) para áreas táctiles
- Mínimo 8px entre áreas táctiles
- Deshabilitar botón durante operaciones async con spinner
- Feedback visual al presionar (ripple/highlight) en < 100ms

### Performance (§3)
- Usar WebP/AVIF con `srcset/sizes`, lazy load imágenes no críticas
- Declarar `width/height` o usar `aspect-ratio` para prevenir layout shift
- `font-display: swap` para evitar texto invisible
- Virtualizar listas con 50+ items
- Skeleton screens / shimmer en lugar de spinners largos

### Selección de estilo (§4)
- El estilo debe coincidir con el tipo de producto
- Mismo estilo en todas las páginas
- Íconos SVG (Heroicons, Lucide) — no emojis
- Un solo CTA primario por pantalla

### Layout & Responsive (§5)
- `width=device-width initial-scale=1` (nunca deshabilitar zoom)
- Mobile-first: diseñar desde 375px, escalar hasta tablet y desktop
- Breakpoints sistemáticos: 375 / 768 / 1024 / 1440
- Cuerpo de texto mínimo 16px en mobile (previene auto-zoom de iOS)
- Sistema de espaciado 4pt/8dp
- `min-h-dvh` en lugar de `100vh` en mobile

### Tipografía & Color (§6)
- Line-height 1.5–1.75 para texto de cuerpo
- 65–75 caracteres por línea
- Escala tipográfica consistente: 12 14 16 18 24 32
- Tokens de color semánticos: primary, secondary, error, surface
- Dark mode: variantes desaturadas/más claras, no colores invertidos

### Animación (§7)
- 150–300ms para micro-interacciones, ≤400ms transiciones complejas
- Solo `transform` y `opacity`, nunca animar width/height/top/left
- `ease-out` para entrar, `ease-in` para salir
- Skeleton o indicador de progreso si carga > 300ms

### Formularios & Feedback (§8)
- Label visible por input (no solo placeholder)
- Error debajo del campo relacionado
- Estados: loading → success / error en submit
- Validar en blur (no por tecla)
- Toast auto-dismiss en 3–5 segundos
- Confirmar antes de acciones destructivas

### Navegación (§9)
- Bottom nav máximo 5 items con etiquetas e íconos
- El back debe ser predecible y consistente, preservando scroll/estado
- Todas las pantallas clave accesibles por deep link / URL
- Modales y sheets deben ofrecer cierre claro

### Gráficos & Datos (§10)
- Tipo de gráfico según tipo de dato: tendencia → línea, comparación → barra, proporción → torta
- Paletas accesibles, no solo rojo/verde para daltónicos
- Siempre mostrar leyenda; tooltips/labels al hover/tap
- Etiquetar ejes con unidades

---

## Checklist pre-entrega

### Calidad visual
- [ ] Sin emojis como íconos (usar SVG)
- [ ] Todos los íconos de la misma familia y estilo
- [ ] Tokens de tema semánticos usados de forma consistente

### Interacción
- [ ] Todos los elementos tocables tienen feedback al presionar
- [ ] Touch targets ≥44×44pt (iOS) / ≥48×48dp (Android)
- [ ] Timing de micro-interacción 150–300ms con easing nativo
- [ ] Estados deshabilitados claros visualmente

### Layout
- [ ] Safe areas respetadas para headers/tab bars/CTA bars
- [ ] Verificado en phone pequeño, grande, tablet (portrait + landscape)
- [ ] Ritmo de espaciado 4/8dp mantenido

### Accesibilidad
- [ ] Imágenes/íconos con labels de accesibilidad
- [ ] Campos de formulario con labels, hints y mensajes de error claros
- [ ] Color no es el único indicador
- [ ] Soporte para reduced-motion y tamaño de texto dinámico

---

## Flujo de trabajo recomendado

1. Analizar requerimientos: tipo de producto, audiencia, keywords de estilo, stack
2. Generar sistema de diseño base (colores, tipografía, espaciado, íconos)
3. Diseñar mobile-first aplicando las reglas por prioridad
4. Revisar checklist pre-entrega antes de finalizar
