---
name: brutalist-skill
description: Industrial brutalism & tactical telemetry UI. Swiss typographic rigor meets military/aerospace terminal aesthetics. Heavy sans-serif, visible grids, 90° geometry, monospace data. Two archetypes: Swiss Industrial Print OR Tactical Telemetry dark mode. Use for data-dense, mechanically precise interfaces.
argument-hint: "[component or dashboard to build with brutalist industrial design]"
metadata:
  source: Leonxlnx/taste-skill
  version: "1.0.0"
---

# Industrial Brutalism & Tactical Telemetry UI

## Choose ONE Archetype — Commit Entirely

### Swiss Industrial Print
- Light substrates (warm off-white, not pure white)
- Heavy sans-serif (Impact, Helvetica Neue Black, Aktiv Grotesk Extended)
- Visible grid lines as design elements
- Aviation red as the ONE accent color
- Newspaper column layouts

### Tactical Telemetry (Dark Mode)
- Near-black substrate (#0A0A0A, #111111)
- Monospace dominance (Courier New, IBM Plex Mono, Space Mono)
- Simulated CRT degradation effects
- Phosphor glow on key data points (green or amber, never blue)
- Terminal/radar aesthetic

## Typography Strategy

### Macro-Typography
- Fluid scaling: `clamp(4rem, 10vw, 15rem)` for hero numbers
- Negative letter-spacing creates "solid architectural blocks"
- Text as structural architecture, not decoration

### Micro-Typography
- Monospace fixed sizes: 10–14px for data
- Generous tracking on all-caps labels
- `text-transform: uppercase` for all UI labels
- `letter-spacing: 0.15em` minimum on caps

## Design Constraints (NON-NEGOTIABLE)
- **No gradients** — flat fills only
- **No soft shadows** — hard drop shadows or none at all
- **No rounded corners** — strict 90° geometry everywhere
- **One foreground, one background, one accent per substrate**
- CSS Grid with `gap: 1px` generates dividing lines (not borders)
- Extensive horizontal rules segregate content zones

## Analog Degradation Effects (Optional)
- CRT scanlines via CSS repeating-linear-gradient
- Halftone dithering on images
- SVG noise overlays for texture
- Slight desaturation + contrast boost on photos

## Semantic HTML
- Use `<data>` for numbers with values
- Use `<samp>` for system output
- Use `<kbd>` for keyboard references
- Use `<time>` for timestamps

## Color Discipline
```css
/* Swiss Industrial */
--bg: #F5F0E8;
--fg: #1A1A1A;
--accent: #CC0000; /* aviation red */
--grid: #1A1A1A;

/* Tactical Telemetry */
--bg: #0A0A0A;
--fg: #E0E0E0;
--accent: #00FF41; /* phosphor green */
--dim: #404040;
```

## Reference Aesthetic
- Wired magazine layouts
- Bloomberg Terminal
- NASA control room interfaces
- Swiss International Style posters
