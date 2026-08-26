# Quickstart Validation: mobile-layout-fixes

**Date**: 2026-08-25

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Access to iOS Simulator (Xcode) or a physical iPhone

## Validation Scenarios

### Scenario 1: Header visible below iPhone status bar

**Setup**:
```bash
npm run build && npm run preview
```

**Steps**:
1. Open the preview URL on an iPhone (or iOS Simulator with iPhone 14/15 Pro)
2. Add the app to the Home Screen (Safari → Share → Add to Home Screen)
3. Open the app from the Home Screen (standalone mode)

**Expected outcome**: The "🍽 Meals" header is fully visible below the iOS status bar. No part of the header text or icon overlaps with the clock, notch, or Dynamic Island.

**Pass criteria**: Header text is 100% readable; no overlap with any system UI element.

### Scenario 2: Header stays sticky below status bar when scrolling

**Setup**: Same as Scenario 1

**Steps**:
1. Open the app and navigate to the Calendar view
2. Scroll down through the calendar grid

**Expected outcome**: The header remains sticky at the top, always below the status bar, never overlapping system UI.

**Pass criteria**: Header position is stable during scroll; no flickering or jumping.

### Scenario 3: Search input stays fixed while filtering in meal modal

**Setup**: Same as Scenario 1

**Steps**:
1. Select a day in the calendar to open DayView
2. Tap "Añadir" on any meal period (e.g., "Desayuno")
3. Tap the search input — keyboard appears
4. Type a single character (e.g., "a") — results filter
5. Type more characters to narrow results to 1-2 items
6. Observe the search input position throughout

**Expected outcome**: The search input remains at the same vertical position relative to the modal header throughout the filtering process. It does not move down as the result list shrinks.

**Pass criteria**: Search input position does not change by more than 0px during filtering.

### Scenario 4: Search input visible above keyboard with few results

**Setup**: Same as Scenario 3

**Steps**:
1. With the keyboard open and 1-2 results showing, observe the search input
2. Verify the input is fully visible above the keyboard

**Expected outcome**: The search input is completely visible and usable above the iOS keyboard, even when only 1-2 results remain.

**Pass criteria**: Input is fully visible; no part is hidden below the keyboard.

### Scenario 5: Works on non-notched iPhone (iPhone SE / iPhone 8)

**Setup**: Use iOS Simulator with iPhone SE (3rd gen) or iPhone 8

**Steps**:
1. Open the app in standalone mode
2. Verify the header is visible
3. Open a meal modal and filter results

**Expected outcome**: Both the header and search input behave correctly on non-notched devices. No excessive padding from `env(safe-area-inset-top)` returning 0.

**Pass criteria**: Layout looks correct; no extra unwanted spacing.

## Automated Checks

```bash
# Type checking must pass
npx tsc --noEmit

# Linting must pass
npm run lint

# Tests must pass (if any exist)
npm run test
```
