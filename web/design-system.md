---
name: design-system
description: "Token architecture, component specifications, and design system creation. Three-layer tokens (primitive→semantic→component), CSS variables, spacing/typography scales, component specs, Tailwind theme configuration. Use for design tokens, systematic design, creating consistent UI patterns, brand-compliant component libraries, or establishing design-to-code handoff systems."
argument-hint: "[component or token]"
---

# Design System — Token Architecture & Component Specs

Skill para crear sistemas de diseño estructurados con arquitectura de tokens de tres capas, especificaciones de componentes y escalas de tipografía/espaciado.

## Cuándo usar

- Crear tokens de diseño (colores, espaciado, tipografía, sombras)
- Definir especificaciones de estados de componentes
- Configurar variables CSS para un sistema de diseño
- Escalar espaciado y tipografía de forma sistemática
- Handoff de diseño a código
- Configurar tema de Tailwind
- Establecer patrones consistentes entre páginas

---

## Arquitectura de tokens (3 capas)

```
Primitivos (valores crudos)
       ↓
Semánticos (alias por propósito)
       ↓
Componentes (tokens específicos)
```

### Ejemplo completo

```css
/* ── CAPA 1: Primitivos ── */
:root {
  --color-blue-100: #DBEAFE;
  --color-blue-500: #3B82F6;
  --color-blue-600: #2563EB;
  --color-blue-900: #1E3A8A;

  --color-gray-50:  #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-900: #111827;

  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* ── CAPA 2: Semánticos ── */
:root {
  --color-primary:   var(--color-blue-600);
  --color-primary-hover: var(--color-blue-500);
  --color-primary-fg: #FFFFFF;

  --color-bg:        var(--color-gray-50);
  --color-surface:   #FFFFFF;
  --color-border:    var(--color-gray-100);

  --color-text:      var(--color-gray-900);
  --color-text-muted: #6B7280;

  --color-success:   #10B981;
  --color-warning:   #F59E0B;
  --color-error:     #EF4444;
}

/* ── CAPA 3: Componentes ── */
:root {
  --btn-primary-bg:     var(--color-primary);
  --btn-primary-hover:  var(--color-primary-hover);
  --btn-primary-fg:     var(--color-primary-fg);
  --btn-radius:         var(--radius-md);
  --btn-height:         40px;
  --btn-padding-x:      var(--space-4);

  --input-border:       var(--color-border);
  --input-bg:           var(--color-surface);
  --input-height:       40px;
  --input-radius:       var(--radius-md);

  --card-bg:            var(--color-surface);
  --card-border:        var(--color-border);
  --card-radius:        var(--radius-xl);
  --card-shadow:        var(--shadow-sm);
}
```

---

## Escala tipográfica

```css
:root {
  /* Font families */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Scale */
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px — mínimo en mobile */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */

  /* Line heights */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed:1.625;

  /* Weights */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;
}
```

---

## Escala de espaciado (4pt base)

```css
:root {
  --space-0:  0px;
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

---

## Especificaciones de componentes

### Patrón de estados

```
Componente: Button
├── default:   bg-primary, text-white, shadow-sm
├── hover:     bg-primary-hover, shadow-md, cursor-pointer
├── active:    scale-[0.98], shadow-sm
├── disabled:  opacity-50, cursor-not-allowed
└── focus:     ring-2 ring-primary/30 ring-offset-2
```

### Ejemplo implementado

```tsx
// Botón usando tokens semánticos
const Button = ({ variant = 'primary', disabled, children, ...props }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-[var(--btn-radius)]',
      'h-[var(--btn-height)] px-[var(--btn-padding-x)]',
      'text-sm font-medium transition-all duration-150',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
      variant === 'primary' && [
        'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)]',
        'hover:bg-[var(--btn-primary-hover)] hover:shadow-md',
        'active:scale-[0.98]',
      ],
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
)
```

---

## Integración con Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          hover:   'hsl(var(--color-primary-hover))',
          fg:      'hsl(var(--color-primary-fg))',
        },
        background: 'hsl(var(--color-bg))',
        surface:    'hsl(var(--color-surface))',
        border:     'hsl(var(--color-border))',
        muted: {
          DEFAULT: 'hsl(var(--color-bg))',
          foreground: 'hsl(var(--color-text-muted))',
        },
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
      },
      spacing: {
        // Tailwind ya tiene escala 4pt por defecto
      },
    },
  },
}
```

---

## Dark mode

```css
.dark {
  --color-primary:     var(--color-blue-500);  /* más claro en dark */
  --color-bg:          #0F172A;
  --color-surface:     #1E293B;
  --color-border:      #334155;
  --color-text:        #F1F5F9;
  --color-text-muted:  #94A3B8;
}
```

---

## Checklist de sistema de diseño

- [ ] Los 3 niveles de tokens están definidos (primitivo → semántico → componente)
- [ ] Variables CSS declaradas en `:root`
- [ ] Dark mode con variantes alternativas (no invertidos)
- [ ] Escala tipográfica con mínimo 16px en base
- [ ] Espaciado siguiendo ritmo 4pt/8dp
- [ ] Estados de componente definidos (default, hover, active, disabled, focus)
- [ ] Contraste mínimo 4.5:1 en ambos temas
- [ ] Integración con Tailwind config verificada
