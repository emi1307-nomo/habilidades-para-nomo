---
name: ui-styling
description: "Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based visual designs. Use when building user interfaces, implementing design systems, creating responsive layouts, adding accessible components (dialogs, dropdowns, forms, tables), customizing themes and colors, implementing dark mode, generating visual designs and posters, or establishing consistent styling patterns across React/Next.js applications."
argument-hint: "[component or layout]"
---

# UI Styling — shadcn/ui + Tailwind CSS

Skill para crear interfaces de usuario modernas y accesibles combinando shadcn/ui (componentes accesibles sobre Radix UI), Tailwind CSS (utility-first) y principios de diseño visual.

## Cuándo usar

- Construir UI con frameworks basados en React (Next.js, Vite, Remix, Astro)
- Implementar componentes accesibles (diálogos, formularios, tablas, navegación)
- Aplicar estilos con enfoque utility-first (Tailwind)
- Crear layouts responsive y mobile-first
- Implementar dark mode y personalización de tema
- Construir design systems con tokens consistentes
- Generar diseños visuales, posters o materiales de marca
- Prototipado rápido con feedback visual inmediato

---

## Stack principal

### Capa de componentes: shadcn/ui
- Componentes pre-construidos y accesibles vía primitivos Radix UI
- Modelo copy-paste (los componentes viven en tu codebase)
- TypeScript-first con tipado completo
- Primitivos componibles para UIs complejas
- Instalación y gestión vía CLI

### Capa de estilos: Tailwind CSS
- Framework CSS utility-first
- Procesamiento en build-time, cero overhead en runtime
- Diseño responsive mobile-first
- Tokens de diseño consistentes (colores, espaciado, tipografía)
- Eliminación automática de código no usado

---

## Quick Start

### Setup con shadcn/ui + Tailwind

```bash
# Inicializar shadcn/ui (configura también Tailwind)
npx shadcn@latest init

# Agregar componentes
npx shadcn@latest add button card dialog form table
```

### Ejemplo de uso

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Dashboard() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Ver métricas</p>
          <Button variant="default" className="w-full">
            Ver detalles
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Solo Tailwind (sin shadcn/ui)

```bash
npm install -D tailwindcss @tailwindcss/vite
```

```css
/* src/index.css */
@import "tailwindcss";
```

---

## Componentes clave

### Formularios e inputs
- `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`
- `Form` (integración React Hook Form + Zod)
- `Label`, `FormField`, `FormMessage`

### Layout y navegación
- `NavigationMenu`, `Breadcrumb`, `Tabs`
- `Sheet` (panel lateral), `Dialog` (modal), `Popover`
- `Sidebar`, `ScrollArea`

### Overlays y diálogos
- `AlertDialog` (confirmaciones destructivas)
- `Tooltip`, `HoverCard`, `ContextMenu`
- `DropdownMenu`, `Command` (búsqueda estilo cmd+k)

### Feedback y estado
- `Toast` / `Sonner`, `Alert`, `Badge`, `Progress`, `Skeleton`
- `Spinner` (animación de carga)

### Display
- `Table` (con sorting y filtros)
- `DataTable` (con TanStack Table)
- `Calendar`, `DatePicker`
- `Avatar`, `Separator`, `Collapsible`, `Accordion`

---

## Tema y personalización

### Variables CSS (en globals.css)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Dark mode

```tsx
// En layout.tsx — usar clsx para toggle
<html className={isDark ? 'dark' : ''}>
```

---

## Patrones responsivos

### Mobile-first

```tsx
<div className="
  grid grid-cols-1        /* mobile */
  md:grid-cols-2          /* tablet */
  lg:grid-cols-3          /* desktop */
  gap-4 md:gap-6
">
```

### Breakpoints de Tailwind
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Utilidades Tailwind esenciales

### Espaciado (escala 4pt/8dp)
```
p-2=8px  p-4=16px  p-6=24px  p-8=32px  p-12=48px  p-16=64px
```

### Tipografía
```
text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl
font-normal font-medium font-semibold font-bold
leading-tight leading-normal leading-relaxed
```

### Layout
```
flex items-center justify-between gap-4
grid grid-cols-2 col-span-full
container mx-auto max-w-6xl
```

### Colores semánticos
```
text-foreground text-muted-foreground
bg-background bg-muted bg-primary
border border-border
```

---

## Accesibilidad

### ARIA patterns
```tsx
<Button aria-label="Cerrar modal" onClick={close}>
  <XIcon className="h-4 w-4" />
</Button>

<nav aria-label="Navegación principal">
  <ul role="list">...</ul>
</nav>
```

### Navegación por teclado
- Todos los componentes shadcn/ui soportan teclado por defecto
- Tabs con `Tab` / `Shift+Tab`, activar con `Enter` / `Space`
- `Escape` cierra modales, dropdowns, sheets

### Focus visible
```css
/* Tailwind ya incluye focus-visible por defecto */
.focus-visible\:ring-2 { ... }
```

---

## 10 mejores prácticas

1. **Composición sobre configuración** — Combinar componentes pequeños, evitar mega-componentes
2. **Tokens semánticos** — Usar `text-foreground`, `bg-primary`, no colores hardcodeados
3. **Accesibilidad primero** — ARIA labels, orden de foco, contraste 4.5:1
4. **Mobile-first** — Escribir estilos base para mobile, agregar `md:` y `lg:` después
5. **Consistencia de íconos** — Solo Lucide React o Heroicons, mismo tamaño (h-4 w-4)
6. **Estados de carga** — Skeleton para carga lenta, spinner para acciones
7. **Manejo de errores** — Mensajes cerca del campo, color semántico + ícono
8. **Dark mode** — Probar ambos temas antes de entregar
9. **Espaciado rítmico** — Respetar escala 4pt/8dp en todos los espacios
10. **Componentes de shadcn/ui siempre sobre HTML nativo** — Garantizan accesibilidad automática

---

## Referencias

- shadcn/ui docs: https://ui.shadcn.com
- Tailwind CSS docs: https://tailwindcss.com/docs
- Radix UI primitives: https://www.radix-ui.com
