# Accordion Block

## Overview

The Accordion block renders collapsible content sections using native HTML `<details>`/`<summary>` elements. Each row in the block becomes an expandable item with a label and body, ideal for FAQs, feature lists, or any content that benefits from progressive disclosure.

## Integration

### Block Configuration

Content is authored as rows with two columns per item:
- First column: Label (rendered as the clickable `<summary>`)
- Second column: Body (revealed when the item is expanded)

### Content Model (`_accordion.json`)

Uses a two-field model:
- **summary** (richtext, required) — The clickable heading
- **text** (richtext, required) — The expandable body content

The filter restricts child components to `accordion-item` only.

## Behavior Patterns

### Layout Behavior

- Items stack vertically with 16px spacing between them
- Each item has a glassmorphic card style with rounded corners and subtle border
- Hover state lifts the card slightly with a purple-tinted shadow

### User Interaction Flows

1. User clicks a summary label to expand/collapse the body
2. The chevron rotates from pointing right (closed) to pointing down (open)
3. Body content fades in with a slide-down animation (`accordionOpen` keyframe)
4. Only one item can be open at a time if the author structures it that way; the native `<details>` element handles toggle state

### Visual Details

- **Closed state**: Transparent background, neutral text, right-pointing chevron
- **Open state**: Light purple tinted background on summary, accent-colored text, top border on body
- **Hover**: Matches open-state coloring for discoverability

### Error Handling

- Missing second column: Item renders with an empty body area
- Empty rows: Rendered as empty `<details>` elements without visual breakage
- `prefers-reduced-motion`: Body animation is disabled for accessibility
