# Footer Block

## Overview

The Footer block loads a footer fragment and optionally renders a store-view switcher for multistore Adobe Commerce setups. It provides site-wide navigation links, branding, and — when multistore is enabled — a modal-based store/locale selector.

## Integration

### Block Configuration

- The footer content path is read from the page's `footer` metadata tag; defaults to `/footer`
- The fragment is loaded via the shared `loadFragment` utility

### Multistore Support

When `isMultistore()` returns `true`, the block also loads a `/store-switcher` fragment and renders a store-view switcher button in the footer. Clicking the button opens a modal with the available stores grouped by region.

### Dependencies

- `@dropins/tools/lib/aem/configs.js` — `getRootPath`, `isMultistore`
- `@dropins/tools/components.js` — `Button` component, `provider` (UI renderer)
- `../modal/modal.js` — `createModal` for the store switcher dialog
- `../../scripts/aem.js` — `getMetadata`
- `../fragment/fragment.js` — `loadFragment`

## Behavior Patterns

### Layout Behavior

- Dark glassmorphic background (`rgb(0 0 0 / 85%)`) with blur and saturation filters
- Content is centered at max-width 1200px with flex layout (logo and links)
- A gradient top border provides a subtle accent line

### User Interaction Flows

1. **Single store**: Footer renders the loaded fragment content (links, logo, copyright)
2. **Multistore**: A "Store Switcher" button appears; clicking it opens a modal listing available stores
3. **Store regions with multiple views**: Regions expand/collapse as an accordion via `aria-expanded`
4. **Keyboard navigation**: Store list items respond to Enter and Space keys for accessibility

### Error Handling

- If the store-switcher fragment fails to load, the block logs an error and returns early without rendering
- Missing footer metadata gracefully falls back to `/footer`
- Single-store regions are flattened to a simple list item instead of an expandable group
