# Implementation Plan: mobile-layout-fixes

**Branch**: `002-mobile-layout-fixes` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-mobile-layout-fixes/spec.md`

## Summary

Fix two mobile layout issues in the Meal Tracker PWA on iPhone: (1) the app header overlaps with the iOS status bar in standalone mode because `env(safe-area-inset-top)` is not used, and (2) the meal modal search input shifts downward as the filtered result list shrinks, causing it to go below the keyboard. Both issues are resolved with CSS-only changes to `App.css`.

## Technical Context

**Language/Version**: TypeScript 5.x + React 19 + CSS (vanilla, no preprocessors)

**Primary Dependencies**: React 19, Vite, vite-plugin-pwa, idb (IndexedDB wrapper)

**Storage**: N/A (no data layer changes)

**Testing**: Vitest (configured in `vitest.config.ts`), manual visual inspection on iPhone simulators

**Target Platform**: iOS Safari standalone PWA (iPhone SE through iPhone 16 Pro), portrait only

**Project Type**: Mobile-first PWA (single-page React app)

**Performance Goals**: No performance impact — CSS-only layout changes

**Constraints**: CSS-only changes to `App.css`; no new dependencies; no component structure changes; portrait orientation only

**Scale/Scope**: Single file change (`App.css`), ~6 lines of CSS modifications

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Simplicity | ✅ PASS | CSS-only change, minimal complexity, single responsibility |
| II. Mobile-First Responsive Design | ✅ PASS | Fixes are specifically for mobile; uses `env(safe-area-inset-top)` for safe area |
| III. Strong Typing & Architecture | ✅ PASS | No TypeScript changes; no architectural boundary violations |
| IV. IndexedDB as Database | ⚪ N/A | No data layer changes |
| V. Data Layer Abstraction | ⚪ N/A | No data layer changes |
| VI. Input Validation | ⚪ N/A | No input handling changes |
| VII. IndexedDB Security | ⚪ N/A | No data layer changes |
| VIII. Frontend Security | ✅ PASS | No dynamic content injection; no `dangerouslySetInnerHTML` |
| IX. Dependency Management | ✅ PASS | No new dependencies added |
| X. Testing Critical Paths | ⚪ N/A | Visual/layout changes tested by inspection, not unit tests |
| XI. Quality Gates | ✅ PASS | `tsc`, `eslint`, and tests must pass before completion |
| XII. Data Integrity & UX | ✅ PASS | Improves UX by making header visible and search input stable |

**Gate result**: PASS — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-mobile-layout-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── App.tsx              # Header element (no changes needed)
├── App.css              # ALL CSS changes go here
├── components/
│   └── MealModal.tsx    # Modal structure (no changes needed — CSS handles layout)
└── index.css            # No changes needed
```

**Structure Decision**: Single project, CSS-only changes. Only `App.css` is modified. No new files, no component changes, no new dependencies.

## Complexity Tracking

No constitution violations to justify. This is a minimal CSS fix.
