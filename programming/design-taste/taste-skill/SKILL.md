---
name: taste-skill
description: High-agency UI/UX engineering framework. DESIGN_VARIANCE:8, MOTION_INTENSITY:6, VISUAL_DENSITY:4. Bans centered heroes, AI purple, generic card grids. Premium arsenal: bento grids, glassmorphism, magnetic buttons, spring physics animations. Use when building any frontend UI.
argument-hint: "[component or page to build with premium design taste]"
metadata:
  source: Leonxlnx/taste-skill
  version: "1.0.0"
---

# Design Taste Frontend: High-Agency UI/UX Engineering

## Core Configuration
Three baseline dials govern all output:
- **DESIGN_VARIANCE: 8** (Artsy asymmetry over predictable symmetry)
- **MOTION_INTENSITY: 6** (Fluid, spring-physics animations)
- **VISUAL_DENSITY: 4** (Breathing white space, not cramped)

Users can override these dynamically per request.

## Critical Enforcement Rules

### Architecture
- React/Next.js with Server Components (RSC) as default
- Isolate interactive components with `"use client"` at the leaf level
- Mandatory dependency verification via `package.json` before imports
- Global state restricted to deep prop-drilling avoidance only

### Design Anti-Patterns (STRICTLY FORBIDDEN)
- Emojis (replace with Phosphor, Radix, or Lucide icons)
- Purple/neon glows ("AI Purple" aesthetic forbidden)
- `h-screen` on heroes → use `min-h-[100dvh]` to prevent mobile layout collapse
- Centered hero sections when variance > 4
- Generic "3 equal cards" layouts
- Serif fonts on dashboards
- Fake personas ("Jane Doe", "John Smith")
- Stock photography patterns
- "Stop doing centered text over a dark image"

### Performance Guardrails
- Animate ONLY via `transform` and `opacity` — never `top`, `left`, `width`, `height`
- Hardware-accelerate fixed elements only
- Isolate perpetual animations in memoized Client Components
- Avoid grain/noise filters on scrolling containers

## The Premium Arsenal

### Layout Patterns
- **Bento grids** — asymmetric, interlocking cells with `grid-auto-flow: dense`
- **Asymmetric hero sections** — off-center image placement, strategic fades
- **Z-Axis Cascade overlaps** — elements floating above each other in depth
- **Editorial Split layouts** — half image, half content, deliberate whitespace

### Surface Treatments
- **Glassmorphism panels** — with inner refraction, `backdrop-blur`, tinted borders
- **Mesh gradients** — subtle, not saturated
- **Ambient depth** — desaturated photography, not heavy shadows

### Motion (Framer Motion — Spring Physics)
- `stiffness: 100, damping: 20` as default spring config
- `staggerChildren` for list/card reveals
- Scroll-pinned sections, image fade/scale reveals, scrubbing text
- Card stacking animations
- Magnetic buttons on hover
- Liquid swipe transitions

### Typography
- Prefer: Geist, Clash Display, Plus Jakarta Sans
- Avoid: Inter (unless system UI), Roboto, Arial, Open Sans, Helvetica
- Variable font animations for headlines
- Text mask reveals on scroll
- `clamp()` for fluid responsive sizing

## Checklist Before Shipping
- [ ] No centered hero when variance > 4
- [ ] No "AI Purple" or neon
- [ ] No 3-equal-card grid
- [ ] Animations only on transform/opacity
- [ ] min-h-[100dvh] on full-height sections
- [ ] Dependencies verified in package.json
- [ ] No fake names or stock patterns
