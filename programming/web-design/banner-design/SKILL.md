---
name: ckm:banner-design
description: Design banners for social media, ads, website heroes, creative assets, and print. Multiple art direction options with AI-generated visuals. Actions: design, create, generate banner. Platforms: Facebook, Twitter/X, LinkedIn, YouTube, Instagram, Google Display, website hero, print. Styles: minimalist, gradient, bold typography, photo-based, illustrated, geometric, retro, glassmorphism, 3D, neon, duotone, editorial, collage.
argument-hint: "[platform] [style] [dimensions]"
license: MIT
metadata:
  author: claudekit
  version: "1.0.0"
---

# Banner Design — Multi-Format Creative System

Design banners across social, ads, web, and print formats. Generates multiple art direction options per request.

## When to Activate

- User requests banner, cover, or header design
- Social media cover/header creation
- Ad banner or display ad design
- Website hero section visual design
- Event/print banner design
- Creative asset generation for campaigns

## Workflow

### Step 1: Gather Requirements
1. **Purpose** — social cover, ad banner, website hero, print, or creative asset?
2. **Platform/size** — which platform or custom dimensions?
3. **Content** — headline, subtext, CTA, logo placement?
4. **Brand** — colors, fonts, existing identity?
5. **Style preference** — any art direction in mind?
6. **Quantity** — how many options? (default: 3)

### Step 2: Art Direction
Select 2-3 styles from the list below based on brand and purpose.

### Step 3: Design HTML/CSS Banner
- Use exact platform dimensions
- Apply safe zones (critical content in central 70-80%)
- Max 2 typefaces, single CTA
- Contrast ratio ≥ 4.5:1

### Step 4: Present & Iterate
Show options with rationale. Iterate until approved.

## Banner Sizes Quick Reference

| Platform | Type | Size (px) | Ratio |
|---|---|---|---|
| Facebook | Cover | 820 × 312 | ~2.6:1 |
| Twitter/X | Header | 1500 × 500 | 3:1 |
| LinkedIn | Personal | 1584 × 396 | 4:1 |
| LinkedIn | Company | 1128 × 191 | ~6:1 |
| YouTube | Channel art | 2560 × 1440 | 16:9 |
| Instagram | Story | 1080 × 1920 | 9:16 |
| Instagram | Post | 1080 × 1080 | 1:1 |
| Google Ads | Med Rectangle | 300 × 250 | 6:5 |
| Google Ads | Leaderboard | 728 × 90 | 8:1 |
| Website | Hero | 1920 × 600-1080 | ~3:1 |

## Art Direction Styles (Top 10)

| Style | Best For | Key Elements |
|---|---|---|
| Minimalist | SaaS, tech | White space, 1-2 colors, clean type |
| Bold Typography | Announcements | Oversized type as hero element |
| Gradient | Modern brands | Mesh gradients, chromatic blends |
| Photo-Based | Lifestyle, e-com | Full-bleed photo + text overlay |
| Geometric | Tech, fintech | Shapes, grids, abstract patterns |
| Retro/Vintage | F&B, craft | Distressed textures, muted colors |
| Glassmorphism | SaaS, apps | Frosted glass, blur, glow borders |
| Neon/Cyberpunk | Gaming, events | Dark bg, glowing neon accents |
| Editorial | Media, luxury | Grid layouts, pull quotes |
| 3D/Sculptural | Product, tech | Rendered objects, depth, shadows |

## Design Rules

- **Safe zones**: critical content in central 70-80% of canvas
- **CTA**: one per banner, bottom-right, min 44px height, action verb
- **Typography**: max 2 fonts, min 16px body, ≥32px headline
- **Text ratio**: under 20% for ads (Meta penalizes heavy text)
- **Contrast**: all text ≥ 4.5:1 against background

## HTML Banner Template

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  .banner {
    width: 1500px;
    height: 500px;
    position: relative;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
    /* Style: replace with actual background */
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  }

  .content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 80px;
  }

  .headline {
    font-size: 56px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.1;
    max-width: 60%;
  }

  .subtext {
    font-size: 20px;
    color: rgba(255,255,255,0.75);
    margin-top: 16px;
    max-width: 50%;
  }

  .cta {
    margin-top: 32px;
    display: inline-block;
    padding: 14px 32px;
    background: #3b82f6;
    color: white;
    font-size: 18px;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
  }

  .logo {
    position: absolute;
    top: 40px;
    right: 60px;
  }
</style>
</head>
<body>
<div class="banner">
  <div class="content">
    <h1 class="headline">Your Headline Here</h1>
    <p class="subtext">Supporting message that reinforces the value</p>
    <a class="cta" href="#">Call to Action</a>
  </div>
  <div class="logo"><!-- Logo SVG or img --></div>
</div>
</body>
</html>
```
