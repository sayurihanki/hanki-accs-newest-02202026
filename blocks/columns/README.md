# Columns Block

## Overview

The Columns block arranges content into a responsive multi-column layout. Each row becomes a flex container with equal-width columns. Columns containing only an image are automatically detected and styled as image columns with hover-scale effects.

## Integration

### Block Configuration

Content is authored as rows with multiple columns. The block auto-detects the column count from the first row and adds a `columns-{n}-cols` class.

### Content Model (`_columns.json`)

Standard EDS block definition — no special field configuration required.

## Behavior Patterns

### Layout Behavior

- **Mobile**: Columns stack vertically; image columns appear first (`order: 0`), text columns second
- **Desktop (900px+)**: Columns sit side-by-side with equal flex sizing and no explicit gap
- Dark glassmorphic card style per row with rounded corners, blur, and purple-tinted shadow
- Gradient shimmer line along the top edge of each row

### Visual Details

- **Background**: `rgb(0 0 0 / 75%)` with 24px blur and 160% saturation
- **Border**: Subtle white border at 10% opacity with inset glow
- **Hover**: Elevated shadow with increased purple tint
- **Image columns**: Images scale to 1.03x on row hover; left-side border radius on desktop
- **Buttons**: Purple gradient background with uppercase text, lift on hover

### User Interaction Flows

1. Content renders as stacked cards on mobile, side-by-side on desktop
2. Hovering a row lifts its shadow and scales any image column slightly
3. Links and buttons within columns remain fully interactive

### Error Handling

- Missing images: Column renders as text-only without the `columns-img-col` class
- Single-column rows: Rendered normally as a full-width card
