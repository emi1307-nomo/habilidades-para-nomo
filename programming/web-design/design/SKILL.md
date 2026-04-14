---
name: ckm:design
description: Unified design skill covering brand identity, logos, design systems, UI, presentations, banners, icons SVG, and social media images. Use when a client needs visual identity, logo, corporate identity program, or complete design assets.
argument-hint: "[logo|identity|banner|icon|social] [brand name]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Design — Unified Visual Design Skill

Comprehensive design skill covering brand identity, logos, design tokens, UI styling, presentations, banners, icons, and social media images.

## Capabilities

| Capability | Description |
|---|---|
| Logo Design | 55+ styles, 30 color palettes, 25 industry guides |
| Corporate Identity | 50+ deliverables, 20 styles, brand consistency |
| Presentations | Strategic HTML with Chart.js, persuasion formulas |
| Banners | 22 art direction styles, multi-platform |
| Icons | 15 styles, SVG output, 12 categories |
| Social Images | Multi-platform, HTML/CSS based |

## When to Activate

- Client asks for logo design or brand identity
- Need to generate visual assets (icons, banners, covers)
- Corporate identity program from scratch
- Social media visual assets
- Pitch deck or presentation design

## Logo Design Process

1. Gather: brand name, industry, style preference, colors
2. Define: 3 concept directions with rationale
3. Generate: SVG logos in chosen styles
4. Deliver: Primary + variations (horizontal, icon-only, dark/light)

### Logo Style Categories (55+)
- **Minimal/Modern:** wordmark, lettermark, geometric
- **Classic:** serif, emblem, badge, crest
- **Tech:** circuit, digital, abstract mark
- **Organic:** hand-drawn, botanical, flowing
- **Bold:** slab, display, sport

## Corporate Identity Deliverables

When a client needs full brand identity:

```
Brand Identity Package:
├── Logo (primary, horizontal, icon, favicon)
├── Color palette (primary, secondary, neutrals, semantic)
├── Typography system (display, body, mono)
├── Brand guidelines document
├── Business card design
├── Letterhead template
├── Email signature
├── Social media profile/cover templates
└── Brand voice & tone guide
```

## Icon Design Guidelines

**Styles:**
- Outline (2px stroke, rounded caps)
- Filled (solid shapes)
- Duotone (two-color layered)
- Sharp (flat, no rounding)

**Grid system:**
- 24×24px base grid
- 2px padding on all sides (20×20 live area)
- Optical adjustments for circles (+1px) and diagonals

**SVG Output format:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- paths here -->
</svg>
```

## Social Media Image Sizes

| Platform | Post | Story/Reel | Profile |
|---|---|---|---|
| Instagram | 1080×1080 | 1080×1920 | 320×320 |
| LinkedIn | 1200×627 | 1080×1920 | 400×400 |
| Twitter/X | 1600×900 | — | 400×400 |
| Facebook | 1200×630 | 1080×1920 | 180×180 |

## Routing Logic

- Logo request → focus on SVG mark creation
- Full brand → logo + palette + typography + guidelines
- Banner → activate `ckm:banner-design` skill
- UI components → activate `ckm:ui-styling` skill
- Design tokens → activate `ckm:design-system` skill
