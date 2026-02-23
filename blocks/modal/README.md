# Modal Block

## Overview

The Modal block provides a reusable dialog component built on the native HTML `<dialog>` element. It is not authored directly in content — instead, other blocks (e.g., Footer's store switcher) call `createModal()` programmatically to display overlay content.

## Integration

### API

```js
import createModal from '../modal/modal.js';

const modal = await createModal([contentNode1, contentNode2]);
modal.showModal();   // open the dialog
modal.removeModal(); // close and clean up
```

`createModal(contentNodes)` returns an object with:
- **block** — The outer `.modal` wrapper element appended to `<main>`
- **showModal()** — Opens the dialog, resets scroll position, focuses the first input, and adds `modal-open` to `<body>`
- **removeModal()** — Closes the dialog and unmounts any dropin containers inside it

### Dependencies

- `@dropins/tools/lib.js` — `Render.unmount` for cleaning up dropin components
- `../../scripts/aem.js` — `loadCSS`, `buildBlock`

## Behavior Patterns

### Visual Details

- Glassmorphic card: semi-transparent white background with blur/saturation filters
- Purple-tinted box shadow and a gradient top-edge highlight
- Entry animation scales up from 92% with a fade (`modalIn` keyframe)
- Backdrop is a dark semi-transparent overlay with blur

### User Interaction Flows

1. Calling code invokes `createModal()` with DOM nodes to display
2. `showModal()` opens the native `<dialog>`, scrolls content to top, and auto-focuses the first `<input>`
3. User can close via the X button, clicking outside the dialog, or pressing Escape (native `<dialog>` behavior)
4. On close, `modal-open` is removed from `<body>` and the block element is removed from the DOM

### Close Button

- Circular button at top-right with a CSS-drawn X icon
- Rotates 90 degrees on hover for a playful interaction cue

### Responsive Behavior

- Mobile: Dialog fills 100vw
- 600px+: Dialog is 80vw, capped at 700px

### Error Handling

- Outside-click close only triggers for mouse events (`pointerType === 'mouse'`), preventing accidental closes on touch
- Dropin containers inside the modal are properly unmounted on close to avoid memory leaks
- `prefers-reduced-motion`: Entry animation is disabled
