# Hero Block

## Overview

The Hero block displays a full-width banner image with an overlaid text element. It is a CSS-only block (no JS) designed for top-of-page visual impact, typically used for category landing pages or promotional banners.

## Integration

### Block Configuration

No JavaScript is needed; the block relies entirely on the default EDS markup and CSS styling.

### Content Model (`_hero.json`)

Three fields per hero instance:
- **image** (reference) — The banner image
- **alt** (text) — Alt text for the image
- **text** (text) — Overlay heading text rendered as `<h1>`

## Behavior Patterns

### Layout Behavior

- The wrapper removes default max-width and padding to allow full-bleed images
- Inner content is constrained to 1200px with auto margins
- Minimum height of 300px ensures the block has visual presence even with small images

### Visual Details

- **Image**: Covers the full block area with `object-fit: cover` and rounded corners (24px)
- **Hover effect**: Image slowly scales to 1.04x over 8 seconds for a subtle Ken Burns feel
- **Text overlay**: Positioned absolute at the bottom-right, capped at 40% width, with a dark glassmorphic card (blur + border + shadow)
- **Typography**: 18px / 500 weight / -0.01em tracking for a clean, modern look

### Responsive Behavior

- At 900px+ the horizontal padding increases from 24px to 32px
- The overlay text card remains proportionally sized via percentage-based max-width

### Error Handling

- Missing image: The block renders at minimum height with no visual content
- Missing text: No overlay card appears; the image fills the block alone
