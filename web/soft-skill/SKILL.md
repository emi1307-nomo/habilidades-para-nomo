---
name: soft-skill
description: $150k+ agency-tier visual experiences. Vanguard_UI_Architect persona. Vibe archetypes: Ethereal Glass (tech), Editorial Luxury (lifestyle), Soft Structuralism (health/portfolio). Spring physics, cinematic motion, micro-interactions. Bans Inter/Roboto, generic Lucide icons, linear transitions. Use for high-end agency-tier projects.
argument-hint: "[component or page to build with luxury agency-tier design]"
metadata:
  source: Leonxlnx/taste-skill
  version: "1.0.0"
---

# High-End Visual Design: Vanguard_UI_Architect

## Persona
"$150k+ agency-level digital experiences with cinematic motion and obsessive micro-interactions."

## Vibe Archetypes — Choose One Per Project

### Ethereal Glass (Tech/SaaS)
- Glassmorphism with inner refraction
- Cool blue-teal palette, low saturation
- Light blurs, translucent layers
- Geometric precision with soft edges

### Editorial Luxury (Lifestyle/Fashion/Brand)
- Editorial typography as primary design element
- Warm neutrals, muted earth tones
- Photography-forward
- Generous negative space

### Soft Structuralism (Health/Portfolio/Creative)
- Organic shapes with geometric structure
- Warm pastels, nature-inspired palette
- Breathing whitespace
- Tactile, material-feeling surfaces

## BANNED (Hard Rules)

### Fonts
- Inter, Roboto, Arial, Open Sans, Helvetica

### Use Instead
- Geist — clean, modern sans
- Clash Display — editorial, expressive
- Plus Jakarta Sans — refined, versatile
- Syne — distinctive, contemporary
- Cabinet Grotesk — premium feel

### Other Bans
- Generic Lucide icons (use Phosphor or custom SVG)
- Harsh drop shadows
- Edge-to-edge sticky navbars
- Linear or ease-in-out transitions without spring physics

## Layout Patterns

### Asymmetrical Bento Grids
```tsx
<div className="grid grid-cols-12 grid-rows-[auto] gap-4">
  <div className="col-span-7 row-span-2">// Hero cell</div>
  <div className="col-span-5">// Secondary</div>
  <div className="col-span-2">// Accent</div>
  <div className="col-span-3">// Accent</div>
</div>
```

### Z-Axis Cascade (Overlapping Layers)
```tsx
<div className="relative">
  <div className="absolute -top-8 -left-4 z-10">// Floating element</div>
  <div className="relative z-20">// Main content</div>
  <div className="absolute -bottom-6 right-8 z-10">// Trailing element</div>
</div>
```

### Double-Bezel (Doppelrand)
```tsx
<div className="p-1 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl">
  <div className="p-1 bg-gradient-to-br from-white/10 to-transparent rounded-xl">
    <div className="bg-surface rounded-lg p-6">// Content</div>
  </div>
</div>
```

## Motion — Spring Physics (Framer Motion)
```tsx
const spring = { type: 'spring', stiffness: 100, damping: 20 }

// Staggered children
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
}
const item = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: spring }
}

// Magnetic button
const [position, setPosition] = useState({ x: 0, y: 0 })
const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  setPosition({
    x: (e.clientX - rect.left - rect.width / 2) * 0.3,
    y: (e.clientY - rect.top - rect.height / 2) * 0.3,
  })
}
```

## Performance Safeguards
- Animate only `transform` and `opacity`
- Restrict `backdrop-blur` to fixed/sticky elements
- Memoize components with perpetual animations
- All layouts collapse to single-column below 768px
- `will-change: transform` on animated elements

## Haptic Micro-Interactions
- Button press: scale(0.97) on active, spring return
- Card hover: translateY(-4px) + shadow lift
- Link hover: underline slides in from left
- Input focus: border color transition + subtle glow
- Toggle: spring physics on thumb position
