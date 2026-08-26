# Research: mobile-layout-fixes

**Date**: 2026-08-25

## R1: iOS Status Bar Overlap in Standalone PWA Mode

**Decision**: Use `env(safe-area-inset-top)` as `padding-top` on `.app-header`.

**Rationale**: The app uses `apple-mobile-web-app-capable: yes` with `apple-mobile-web-app-status-bar-style: black-translucent`. This makes the status bar translucent and overlapping the web content. The `viewport-fit=cover` meta tag is already present, which enables `env(safe-area-inset-*)` CSS functions. On iPhones with notch/Dynamic Island, `env(safe-area-inset-top)` returns the height of the status bar area (typically ~47px on notched iPhones, ~0px on non-notched). On non-notched iPhones (SE, 8), it returns 0, so no extra space is added — the existing `padding: 16px 20px 12px` is sufficient.

**Alternatives considered**:
- Hardcoded `padding-top: 47px` — rejected because it would add unnecessary space on non-notched devices.
- JavaScript `window.visualViewport` API — rejected as overly complex for a CSS-available solution.
- `<meta name="apple-mobile-web-app-status-bar-style" content="default">` — rejected because it changes the status bar to opaque black, which is a visual regression.

## R2: Search Input Positioning in Meal Modal

**Decision**: Make `.modal-search-wrap` use `position: sticky; top: 0` inside the `.modal-sheet` flex column.

**Rationale**: The `.modal-sheet` is a `display: flex; flex-direction: column` container. Currently, `.modal-search-wrap` has no positioning — it sits in the normal flow. When the result list (`.modal-results` with `flex: 1; overflow-y: auto`) shrinks due to filtering, the flex layout reflows and the search input moves down. By making `.modal-search-wrap` sticky at `top: 0`, it stays pinned at the top of the scrollable area while `.modal-results` scrolls beneath it. The sticky positioning works because `.modal-sheet` has `max-height: 80dvh` which creates a scroll context.

**However**, there's a subtlety: `position: sticky` on a flex child works when the sticky element is inside a scroll container. The `.modal-sheet` itself doesn't scroll — `.modal-results` does. So the sticky approach needs the search wrap to be a sibling of the results within a common scroll context.

**Revised approach**: Restructure the CSS so `.modal-sheet` uses `overflow: hidden` and the inner content scrolls. OR, simpler: keep `.modal-sheet` as flex column, but make `.modal-search-wrap` fixed-height and `.modal-results` the only scrolling area. The issue is that `position: sticky` won't work here because the parent (`.modal-sheet`) doesn't scroll — the child (`.modal-results`) does.

**Final approach**: The real fix is to ensure `.modal-sheet` has a fixed height (not max-height) and the search input is outside the scrolling area. Since `.modal-sheet` already has `display: flex; flex-direction: column; max-height: 80dvh`, the search wrap and results are flex children. The results area has `flex: 1; overflow-y: auto`. The search wrap should NOT be affected by the results shrinking — it should maintain its natural height. The actual problem is that `max-height: 80dvh` on the sheet means when the results list is short, the sheet shrinks, pulling the search input down with it.

**Concrete fix**: Change `.modal-sheet` from `max-height: 80dvh` to a layout where the sheet always occupies the same vertical space, and only the results area scrolls. Use `min-height: 0` on `.modal-results` to allow it to shrink, and ensure `.modal-sheet` maintains its height. Alternatively, set a fixed `height` on `.modal-sheet` instead of `max-height`.

**Best approach**: Set `.modal-sheet` to use `height: 80dvh` (fixed, not max) so the sheet always takes 80% of viewport. The search input stays at its natural position at the top. The results list scrolls within the remaining space. When results shrink, the sheet doesn't shrink — only the scrollable area has less content.

**Alternatives considered**:
- `position: sticky` on `.modal-search-wrap` — doesn't work because the parent flex container doesn't scroll.
- JavaScript to detect keyboard and adjust positioning — rejected as overengineering for a CSS fix.
- `position: fixed` on the search input — would take it out of the modal flow and require manual positioning.

## R3: iOS Keyboard Behavior and Search Input Visibility

**Decision**: No special keyboard handling needed. The fixed-height modal sheet ensures the search input stays visible.

**Rationale**: On iOS, when the virtual keyboard appears, the viewport shrinks (the `visualViewport` changes). The `dvh` unit tracks this change. With `height: 80dvh` on the modal sheet, the sheet resizes when the keyboard appears, keeping the search input visible above the keyboard. The `env(safe-area-inset-bottom)` padding on the sheet already handles the home indicator.

**Alternatives considered**:
- `position: fixed` with `bottom: 0` and dynamic offset — rejected because it would conflict with the keyboard.
- Using `interactive-widget=overlays-content` viewport meta — not widely supported enough on iOS.

## Summary of Changes

| File | Change | Lines Affected |
|------|--------|----------------|
| `App.css` | Add `padding-top: env(safe-area-inset-top)` to `.app-header` | Line 28 |
| `App.css` | Change `.modal-sheet` from `max-height: 80dvh` to `height: 80dvh` | Line 87 |
| `App.css` | Add `min-height: 0` to `.modal-results` to ensure proper flex shrinking | Line 95 |
