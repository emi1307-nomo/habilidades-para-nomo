---
name: redesign-skill
description: Upgrade existing websites/apps to premium quality WITHOUT rewriting from scratch. Scan → Audit → Fix. Works with existing tech stack. Typography, color, layout, motion, component upgrades. Use when a client has an existing site that needs to look better.
argument-hint: "[existing site or component to redesign/upgrade]"
metadata:
  source: Leonxlnx/taste-skill
  version: "1.0.0"
---

# Redesign Skill: Premium Upgrade Without Rewrite

## Core Rule
**Work with the existing tech stack. Do NOT migrate frameworks or styling libraries.**

Changes must be reviewable, focused improvements — not complete rewrites. Functionality preserved and tested throughout.

## Three-Step Process

### Step 1: Scan
- Read the codebase to understand tech stack, styling approach, component structure
- Identify what's already working (keep it)
- List all generic patterns found

### Step 2: Audit — Design Diagnosis
Check each area for generic patterns:

**Typography**
- [ ] Font choices (is it Inter/Roboto/Arial? → upgrade candidate)
- [ ] Hierarchy clarity (does scale communicate importance?)
- [ ] Line-height and letter-spacing tuned?

**Color & Surfaces**
- [ ] Pure black (#000000) anywhere? → replace with #0A0A0A or dark neutrals
- [ ] Oversaturated accents (saturation > 80%)? → desaturate
- [ ] Too many accent colors (> 2)?

**Layout**
- [ ] "3 equal cards" grid anywhere? → asymmetric alternative
- [ ] Centered hero with centered text? → off-center composition
- [ ] Insufficient whitespace? → increase padding/margin generously

**Interactivity**
- [ ] Hover states missing or generic?
- [ ] Loading states absent?
- [ ] No micro-interactions on key actions?

**Content**
- [ ] Fake names ("John Doe")? → replace with authentic names
- [ ] Stock photo patterns? → abstract or authentic photography

**Components**
- [ ] Generic pill buttons everywhere? → varied button treatments
- [ ] Shadow-heavy cards? → flatter with subtle borders
- [ ] Generic navbar? → more distinctive treatment

### Step 3: Fix — Quick Wins First
1. **Font swap** — biggest visual impact, minimal risk
2. **Color cleanup** — remove pure blacks, desaturate over-saturated accents
3. **Whitespace increase** — padding/margin boost
4. **Hover states** — add to all interactive elements
5. **Typography hierarchy** — size, weight, tracking adjustments
6. Then: layout improvements, animations, complex interactions

## Upgrade Techniques

### Typography Upgrades
```css
/* Variable font animation on headlines */
@keyframes weight-shift {
  0%, 100% { font-variation-settings: 'wght' 400; }
  50% { font-variation-settings: 'wght' 700; }
}

/* Text mask reveal on scroll */
.reveal-text {
  background: linear-gradient(to right, var(--fg) 50%, transparent 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  transition: background-position 0.6s ease;
}
```

### Layout Upgrades
- Replace `grid-cols-3` → asymmetric `grid-cols-[2fr_1fr_1fr]`
- Add `gap` variation instead of uniform spacing
- Maximize whitespace around key content

### Motion Upgrades
```tsx
// Staggered entry
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
}
```

### Surface Upgrades
```css
/* Glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Tinted shadow */
.tinted-shadow {
  box-shadow: 0 20px 60px rgba(var(--accent-rgb), 0.15);
}
```

## Anti-Patterns to Fix
- Centered text hero → asymmetric hero
- Generic "Transform your workflow" copy → specific, authentic copy
- 3 equal feature cards → varied sizes, bento grid
- Thin icon libraries → Phosphor or custom SVG
- Pure black text → #1A1A1A or similar
- 0 hover states → subtle color/transform shifts
