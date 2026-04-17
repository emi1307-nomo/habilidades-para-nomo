---
name: gpt-tasteskill
description: Award-winning motion-rich UI. AIDA structure, GSAP animations, 2-line hero rule, gapless bento grids, Python-driven randomization to prevent formulaic repetition. Requires design_plan verification block before coding. Use for maximum visual impact landing pages.
argument-hint: "[landing page or hero section to build with award-winning design]"
metadata:
  source: Leonxlnx/taste-skill
  version: "1.0.0"
---

# GPT-Taste Design Framework: Award-Winning Motion UI

## Core Philosophy
Combats "statistical biases" in AI outputs — enforces *deliberate* design choices rather than defaults. Every layout decision must be intentional, not the safe/obvious choice.

## Pre-Code Verification Block (MANDATORY)
Before writing ANY UI code, output this block:

```
<design_plan>
RANDOMIZATION: [hero architecture chosen + reasoning]
AIDA COMPLIANCE: Nav → Hero → Features → Motion → CTA/Footer ✓
HERO MATH: Heading fits in [N] lines at [breakpoint] using [font-size]
LABEL SWEEP: No meta-labels, no invisible buttons, no emoji ✓
GSAP ANIMATIONS: [list 3 specific animations planned]
</design_plan>
```

## AIDA Structure (Page Architecture)
Every landing page follows this exact flow with massive vertical spacing between sections:

1. **Navigation** — minimal, functional
2. **Hero** — Attention (asymmetric, bold, immediate)
3. **Features/Bento** — Interest (visual proof, not bullet lists)
4. **Scroll Motion Section** — Desire (GSAP scroll-pinned, scrubbing)
5. **CTA/Footer** — Action (clear, unambiguous)

Vertical padding between sections: minimum `py-32` (128px), ideally `py-48` (192px).

## The 2-Line Rule (Hero Headlines)
Hero headings MUST flow horizontally in 2–3 lines maximum.

```tsx
// ❌ Wrong — narrow container causes 5+ line wrap
<div className="max-w-lg">
  <h1 className="text-4xl">Your headline goes here and wraps too much</h1>
</div>

// ✅ Correct — ultra-wide container, fluid sizing
<div className="max-w-5xl">
  <h1 className="text-[clamp(3rem,6vw,7rem)] leading-[1.05] tracking-tight">
    Two lines maximum, impact guaranteed
  </h1>
</div>
```

## Gapless Bento Grids
Apply `grid-auto-flow: dense` to eliminate blank cells. Mathematically interlock col-span and row-span values.

```tsx
// Every cell must be filled — no orphaned spaces
<div
  className="grid grid-cols-12"
  style={{ gridAutoFlow: 'dense' }}
>
  <div className="col-span-7 row-span-2 min-h-[300px]">// Large feature</div>
  <div className="col-span-5 min-h-[140px]">// Top right</div>
  <div className="col-span-3 min-h-[140px]">// Bottom right A</div>
  <div className="col-span-2 min-h-[140px]">// Bottom right B</div>
</div>
```

## GSAP Animations (Real Library, Not CSS)

### Scroll-Pinned Section
```js
gsap.registerPlugin(ScrollTrigger)

gsap.to('.pinned-content', {
  x: '-66.66%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.pin-container',
    pin: true,
    scrub: 1,
    end: '+=300%',
  }
})
```

### Image Fade/Scale Reveal
```js
gsap.from('.reveal-image', {
  opacity: 0,
  scale: 1.1,
  duration: 1.2,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.reveal-image', start: 'top 80%' }
})
```

### Scrubbing Text
```js
gsap.to('.scrub-text', {
  backgroundPositionX: '100%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.scrub-section',
    scrub: true,
    start: 'top center',
    end: 'bottom center',
  }
})
```

### Card Stacking
```js
cards.forEach((card, i) => {
  gsap.to(card, {
    scale: 1 - (cards.length - i) * 0.05,
    scrollTrigger: {
      trigger: card,
      start: 'top top',
      pin: true,
      scrub: true,
    }
  })
})
```

### Hover Scale
```js
element.addEventListener('mouseenter', () =>
  gsap.to(element, { scale: 1.04, duration: 0.3, ease: 'power2.out' })
)
element.addEventListener('mouseleave', () =>
  gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.inOut' })
)
```

## STRICT BANS
- Meta-labels ("SECTION 01", "FEATURE 03", "STEP 02")
- Invisible button text (white text on white bg, etc.)
- Emoji anywhere in code
- Stamp icons or pill-tags in hero sections
- Generic `ease-in-out` without spring physics
- Centered hero text when variance > 4
- 3 equal-width feature cards
