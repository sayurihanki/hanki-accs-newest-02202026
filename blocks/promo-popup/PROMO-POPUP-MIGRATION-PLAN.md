# Promo Popup Spinner Wheel — Global Migration Plan

A complete blueprint for deploying the promo-popup block to another EDS/Adobe Commerce storefront instance. Use this plan to replicate the full styling system, behavior, and authoring experience.

---

## 1. Overview

The promo-popup block is a **glassmorphic spin-to-win popup** with:
- **Design tokens** that inherit from storefront `--main-color-accent`
- **5 theme variants** (purple, emerald, sunset, midnight, minimal)
- **5 entry triggers** (time, scroll, exit, immediate, first-interaction)
- **DA.live authoring** via table + sidebar
- **Accessibility** (focus trap, reduced motion, ARIA)
- **Responsive** layout with mobile breakpoints

---

## 2. File Checklist — What to Copy

| File | Purpose |
|------|---------|
| `blocks/promo-popup/promo-popup.js` | Block logic, wheel, triggers, overlay |
| `blocks/promo-popup/promo-popup.css` | All styling, tokens, themes, animations |
| `blocks/promo-popup/_promo-popup.json` | DA.live model + definitions |
| `blocks/promo-popup/promo-popup-table.txt` | Copy-paste table for content |
| `blocks/promo-popup/README.md` | Authoring docs (optional) |

**Registration:** The block is registered in `component-definition.json` and `component-models.json`. If your target instance uses a different registration system, add the promo-popup entry there.

---

## 3. Design Token System

### 3.1 Block-Level Tokens (in `promo-popup.css`)

These tokens are defined on `.promo-popup`, `main .promo-popup`, and `.pp-overlay`:

```css
--pp-accent: var(--main-color-accent, #6d28d9);   /* Inherits from storefront */
--pp-accent-light: #8b5cf6;                        /* Lighter accent for gradients */
--pp-text-primary: #0f0f1a;
--pp-text-secondary: #6b7280;
--pp-text-muted: #9ca3af;
--pp-radius-xl: 24px;
--pp-radius-lg: 16px;
--pp-radius-full: 100px;
```

**Storefront integration:** Set `--main-color-accent` in your global `styles/styles.css` (or equivalent). The block will automatically use it for buttons, highlights, and accents.

### 3.2 Storefront Token to Add (Optional)

In your target storefront’s global styles:

```css
:root, .dropin-design {
  --main-color-accent: #8821f4;  /* Your brand color */
}
```

---

## 4. CSS Class Reference — Full Inventory

### 4.1 Layout & Structure

| Class | Purpose |
|-------|---------|
| `.promo-popup` | Block wrapper; hides raw table |
| `.promo-popup > div` | Raw table cells (hidden) |
| `.pp-no-scroll` | Body class when modal open |
| `.pp-overlay` | Full-screen backdrop |
| `.pp-overlay--visible` | Visible state |
| `.pp-overlay--closing` | Exit animation |
| `.pp-modal` | Glassmorphic modal container |
| `.pp-modal-inner` | Inner padding wrapper |
| `.pp-header` | Header section |
| `.pp-wheel-section` | Wheel area with subtle bg |
| `.pp-wheel-wrap` | Wheel + pointer container |
| `.pp-wheel-ring` | Decorative outer ring |
| `.pp-bottom` | Footer (buttons, result, no-thanks) |

### 4.2 Header Elements

| Class | Purpose |
|-------|---------|
| `.pp-pill` | Badge above headline |
| `.pp-pill-dot` | Animated dot in pill |
| `.pp-headline` | Main headline |
| `.pp-headline span` | Highlighted word (gradient) |
| `.pp-subheadline` | Supporting text |

### 4.3 Wheel Elements

| Class | Purpose |
|-------|---------|
| `.pp-wheel` | Conic-gradient wheel |
| `.pp-dividers` | Divider container |
| `.pp-divider-line` | Segment divider lines |
| `.pp-segment-label` | Label on each segment |
| `.pp-wheel-cap` | Center cap with star SVG |
| `.pp-pointer` | Top pointer (triangle) |

### 4.4 Buttons & Result

| Class | Purpose |
|-------|---------|
| `.pp-close` | Close button |
| `.pp-close-x` | X icon |
| `.pp-spin-btn` | Primary spin CTA |
| `.pp-result` | Result container (collapsed by default) |
| `.pp-result--visible` | Result expanded |
| `.pp-result-inner` | Result card |
| `.pp-result-badge` | Emoji/headline |
| `.pp-result-label` | Won segment label |
| `.pp-result-desc` | Description text |
| `.pp-result-cta` | Claim link/button |
| `.pp-no-thanks` | Dismiss link |

### 4.5 Effects

| Class | Purpose |
|-------|---------|
| `.pp-confetti` | Confetti particle |

### 4.6 Keyframes

| Name | Purpose |
|------|---------|
| `pp-overlay-out` | Overlay fade out |
| `pp-pill-pulse` | Pill dot pulse |
| `pp-btn-shimmer` | Spin button shimmer |
| `pp-pointer-bob` | Pointer bounce |
| `pp-card-pop` | Result card pop-in |
| `pp-emoji-bounce` | Result badge bounce |
| `pp-confetti-fall` | Confetti fall |

---

## 5. Theme Color Palettes (JS)

In `promo-popup.js`, `SEGMENT_COLORS` defines wheel segment colors per theme:

| Theme | Colors (hex) |
|-------|--------------|
| `purple` | `#e8e0f7`, `#dde9f5`, `#e0f0ea`, `#f0e8e0` (glass pastels) |
| `emerald` | `#e0f0ea`, `#d1f0e0`, `#b8e6d0` |
| `sunset` | `#fef3e0`, `#fde8d0`, `#fcd9b8` |
| `midnight` | `#e8e8f5`, `#ddddf0`, `#d0d0eb` |
| `minimal` | `#f0f0f2`, `#e5e5e8`, `#d8d8dc` |

**To add a new theme:** Add an entry to `SEGMENT_COLORS` and to `_promo-popup.json` options.

---

## 6. Config Keys (Content Model)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `trigger` | string | `time` | Entry trigger |
| `trigger-delay` | number | 3 | Seconds (time trigger) |
| `trigger-scroll` | number | 50 | Scroll % (scroll trigger) |
| `storage-duration` | string | `1` | Days; `session`/`0` = session only |
| `headline` | string | Spin to Win! | Main headline |
| `headline-highlight` | string | Win | Word to highlight |
| `subheadline` | string | One spin… | Subheadline |
| `pill` | string | Exclusive offer | Badge text |
| `spin-button-text` | string | Spin the Wheel | CTA label |
| `no-thanks-text` | string | No thanks… | Dismiss text |
| `result-headline` | string | 🎉 | Post-spin badge |
| `cta-button-text` | string | Claim Offer | Default CTA |
| `theme` | string | purple | Theme variant |
| `show-orb-bg` | boolean | false | Animated orbs |
| `show-confetti` | boolean | true | Confetti on win |
| `spin-duration` | number | 4 | Spin seconds (3–8) |

---

## 7. DA.live / JSON Model Setup

### 7.1 `_promo-popup.json` Structure

- **Definitions:** Block title, id, model, DA plugin (`rows: 20`, `columns: 3`)
- **Models:** Fields for each config key with `data-*` names, types, labels, options

### 7.2 Component Definition Entry

In `component-definition.json` (Blocks group):

```json
{
  "title": "Promo Popup Spinner Wheel",
  "id": "promo-popup",
  "model": "promo-popup",
  "plugins": {
    "da": {
      "name": "promo-popup",
      "rows": 20,
      "columns": 3
    }
  }
}
```

### 7.3 Section Model

Ensure `promo-popup` is in the section’s allowed blocks list (e.g. `models/_section.json`).

---

## 8. Content Table Format

**Row 1:** Block name (`promo-popup`) — merged across columns  
**Rows 2–N:** Config rows (2 cells: key | value)  
**Rows N+1–end:** Promo rows (3 cells: Label | Description | CTA URL)

Example:

```
promo-popup
headline	Spin to Win!
headline-highlight	Win
subheadline	One spin, one deal made just for you.
pill	Exclusive offer
trigger	immediate
trigger-delay	3
trigger-scroll	50
storage-duration	session
theme	purple
spin-button-text	Spin the Wheel
no-thanks-text	No thanks, I'll skip
result-headline	🎉
cta-button-text	Claim Offer
show-orb-bg	false
show-confetti	true
spin-duration	4
10% Off	Use code <strong>SAVE10</strong> at checkout	/checkout
Free Ship	Free shipping on orders over $50	/shipping
...
```

---

## 9. Storefront Customization Checklist

| Task | Where | Notes |
|------|-------|-------|
| Set brand accent | `styles/styles.css` | `--main-color-accent: #YOUR_COLOR` |
| Add font import | `promo-popup.css` | Plus Jakarta Sans (or swap for your font) |
| Add new theme | `promo-popup.js` + `_promo-popup.json` | Extend `SEGMENT_COLORS` and options |
| Adjust radii | `promo-popup.css` | `--pp-radius-xl`, `--pp-radius-lg`, `--pp-radius-full` |
| Adjust breakpoints | `promo-popup.css` | `@media (max-width: 480px)` |
| Disable confetti | Content | `show-confetti` = false |

---

## 10. Build & Deploy Steps

1. **Copy files** into `blocks/promo-popup/` on target instance.
2. **Register block** in `component-definition.json` and `component-models.json` (if not auto-discovered).
3. **Add `--main-color-accent`** to global styles if not present.
4. **Run build:**
   ```bash
   npm run build:json
   ```
5. **Add block to a page** via DA.live (paste table or use sidebar).
6. **Test triggers** (immediate for quick test, then time/scroll/exit).
7. **Test storage** (session vs days) and reduced motion.

---

## 11. Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| Default | Modal 620px, wheel 400px |
| `max-width: 480px` | Wheel 340px, smaller labels, tighter padding |

---

## 12. Accessibility Summary

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
- Focus trap with Tab cycle
- Escape closes
- `aria-live="polite"` on result
- `prefers-reduced-motion` disables/shortens animations

---

## 13. Debug Mode

Add `data-debug="true"` to the block for console logs (trigger, promotions count, storage blocking).

---

## 14. Quick Reference — File Dependencies

```
promo-popup.js
  └── No external deps (vanilla JS)

promo-popup.css
  └── @import Plus Jakarta Sans
  └── Uses --main-color-accent from :root

_promo-popup.json
  └── Consumed by DA.live / block loader
```

---

*Use this plan as a single source of truth when deploying the promo-popup block to a new storefront or instance.*
