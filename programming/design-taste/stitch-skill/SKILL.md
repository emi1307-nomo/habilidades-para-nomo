---
name: stitch-skill
description: Semantic design system for generating DESIGN.md files — single source of truth for UI standards. Density/variance/motion ratings, color constraints, typography rules, layout philosophy, motion standards, anti-pattern lists. Use when setting up design standards for a new project.
argument-hint: "[project to create DESIGN.md standards for]"
metadata:
  source: Leonxlnx/taste-skill
  version: "1.0.0"
---

# Stitch Design Taste: DESIGN.md Generator

## Purpose
Generate a `DESIGN.md` file that serves as the single source of truth for UI standards on a project. Translates frontend engineering principles into descriptive rules with precise values.

## DESIGN.md Template

```markdown
# DESIGN.md — [Project Name]

## Atmosphere
- **Density:** [1-10] — [description]
- **Variance/Asymmetry:** [1-10] — [description]
- **Motion Intensity:** [1-10] — [description]

## Color System
- **Background:** [hex] — [description, e.g. "warm off-white, not pure white"]
- **Foreground:** [hex] — [description]
- **Accent:** [hex] — [description, ONE accent only]
- **Surface:** [hex] — [card/panel background]
- **Border:** [hex or rgba] — [subtle dividers]
- **Rule:** Max 1 accent color. Saturation below 80%. No pure #000000 or #FFFFFF.

## Typography
- **Display:** [font name + weight] — headlines, hero text
- **Body:** [font name + weight] — paragraphs, UI text
- **Mono:** [font name] — code, data, technical elements
- **Scale:** [e.g. 12/14/16/20/24/32/48/64px]
- **Rule:** Inter BANNED for premium/creative. Generic serifs banned in dashboards.

## Layout
- **Max Width:** [e.g. 1280px]
- **Grid:** [e.g. 12-col, 24px gap]
- **Spacing Scale:** [e.g. 4/8/12/16/24/32/48/64/96px]
- **Philosophy:** [e.g. "No overlapping elements — clear spatial zones. Centered heroes prohibited for variance > 4."]

## Components

### Cards
- [border-radius, shadow, padding, border description]

### Buttons (Primary)
- [background, text, border-radius, padding, hover state]

### Buttons (Secondary)
- [background, text, border, hover state]

### Navigation
- [sticky behavior, background, border, item spacing]

### Forms
- [input height, border, focus state, error state]

## Motion Standards
- **Spring:** stiffness: 100, damping: 20 (default for all animations)
- **Duration:** 200ms micro / 400ms standard / 600ms elaborate
- **Easing:** spring physics preferred; cubic-bezier(0.16, 1, 0.3, 1) for CSS
- **Rule:** Animate ONLY transform and opacity. No layout properties.
- **Perpetual:** Only in memoized Client Components

## Anti-Patterns (BANNED on this project)
- [ ] Emojis in UI
- [ ] Filler text ("Scroll to explore", "Get started today")
- [ ] Custom cursors
- [ ] AI copywriting clichés
- [ ] Broken image links or placeholder images
- [ ] Generic placeholder naming (John Doe, user@example.com in demos)
- [ ] Neon colors / AI purple
- [ ] Centered hero with centered text (if variance > 4)
- [ ] 3 equal-width feature cards
- [ ] [Add project-specific bans here]

## Accessibility Baseline
- Contrast ratio: minimum 4.5:1 for body text
- Focus rings: visible, 2px, accent-colored
- Touch targets: minimum 44×44px
- Reduced motion: respect `prefers-reduced-motion`
```

## How to Use This Skill

When starting a new project:
1. Answer the atmosphere questions (density, variance, motion)
2. Define color palette (1 background, 1 foreground, 1 accent)
3. Choose typography pair (display + body)
4. Set layout constraints
5. Generate `DESIGN.md` → commit to repo root
6. Reference it in `CLAUDE.md` so all future work follows it
