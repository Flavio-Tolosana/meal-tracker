# Feature Specification: mobile-layout-fixes

**Feature Branch**: `002-mobile-layout-fixes`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Quiero que la cabecera de la web, donde pone un emoticono de un plato y 'Meals' esté más abajo, ya que al verlo en la versión móvil (aplicación de iPhone encierra web) lo que sucede es que dicha cabecera se pone donde la hora del iPhone, entonces sería necesario bajarlo más. Además en el buscador desplegado de 'Añadir a [desayuno/almuerzo/comida/...]' a medida que se va escribiendo se van filtrando los resultados, entonces como la lista de candidatos disminuye baja el buscador hacia abajo colocándose por debajo del teclado del iPhone, es por ello que sería mejor que se quedara a la altura inicial siempre y cuando se vaya filtrando la comida en vez de bajarse el buscador que se quede ahí."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Header visible below iPhone status bar (Priority: P1)

A user opens the Meal Tracker PWA on their iPhone. The app header (plate icon + "Meals" title) is fully visible and readable below the iOS status bar, not overlapping with the clock or system indicators.

**Why this priority**: This is the most critical issue because the header is currently obscured by the iPhone status bar, making the app feel broken and unprofessional on first load. Without a visible header, users cannot orient themselves within the app.

**Independent Test**: Open the PWA on an iPhone (or iOS simulator). Verify the header with the plate icon and "Meals" text is fully visible below the status bar without overlap. Can be tested by visual inspection on any iPhone.

**Acceptance Scenarios**:

1. **Given** the user opens the app on an iPhone, **When** the app loads, **Then** the header ("🍽 Meals") is displayed fully below the iOS status bar with sufficient spacing.
2. **Given** the user scrolls the main content area, **When** the header becomes sticky, **Then** the header remains visible below the status bar without overlapping system UI elements.
3. **Given** the user is on any screen of the app, **When** viewing on an iPhone with a notch or Dynamic Island, **Then** the header does not overlap with the notch, Dynamic Island, or status bar time.

---

### User Story 2 - Search input remains fixed while filtering (Priority: P2)

A user opens the meal modal ("Añadir a desayuno/almuerzo/comida/...") and begins typing to search for a food item. As they type and the result list filters down, the search input stays in its original position rather than moving downward with the shrinking list.

**Why this priority**: This is a significant usability issue on iPhone because when the keyboard is visible and the filtered list shrinks, the search input can end up below the keyboard, making it impossible to see or interact with what the user is typing.

**Independent Test**: Open the meal modal on an iPhone, tap the search input, and type characters to filter results. Verify the search input remains in the same vertical position regardless of how many results remain. Can be tested on any iPhone with the keyboard visible.

**Acceptance Scenarios**:

1. **Given** the user opens the meal modal and the keyboard appears, **When** they type to filter the food list, **Then** the search input remains at its original vertical position (above the results list) and does not move downward.
2. **Given** the user has typed a query that filters to a small number of results (e.g., 1-2 items), **When** they continue viewing or editing the search, **Then** the search input is still fully visible above the keyboard and results.
3. **Given** the user clears the search query, **When** the full list of results reappears, **Then** the search input remains in its original fixed position.

---

### Edge Cases

- What happens when the iPhone keyboard appears for the first time (initial focus)?
- ~~How does the layout behave when switching between portrait and landscape orientation?~~ → Out of scope: landscape orientation is not addressed in this feature.
- What happens when the user scrolls within the filtered results list — does the search input remain visible?
- How does the layout handle the bottom safe area (home indicator) in relation to the search input position?
- ~~What happens when the search yields no results?~~ → Out of scope: current empty results behavior is preserved as-is.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app header MUST be positioned below the iOS status bar with sufficient vertical spacing so that no part of the header overlaps with the status bar, notch, or Dynamic Island.
- **FR-002**: The header spacing MUST adapt to different iPhone models (with notch, Dynamic Island, or standard bezel) without requiring device-specific configuration.
- **FR-003**: The search input in the meal modal MUST remain fixed at its original vertical position while the user types and the result list filters.
- **FR-004**: The search input MUST remain visible above the iOS keyboard when the keyboard is displayed.
- **FR-005**: The filtered results list MUST be contained in a scrollable area that adjusts independently of the search input position.
- **FR-006**: The modal layout MUST function correctly on both iPhone models with notch (iPhone X and later) and models without notch (iPhone SE, iPhone 8).

### Key Entities

- **App Header**: The top bar containing the plate icon and "Meals" title. Must be visible below the iOS status bar.
- **Meal Modal Search Input**: The text input field for filtering food items when adding to a meal period. Must remain fixed during filtering.
- **Filtered Results List**: The scrollable list of food items that filters as the user types. Must scroll independently without affecting the search input position.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On any iPhone model, the header is fully visible and readable below the status bar on 100% of screen loads.
- **SC-002**: The search input in the meal modal stays within 0px of its original vertical position (no displacement) while filtering results, on 100% of interactions.
- **SC-003**: The search input remains visible above the iOS keyboard while typing, on 100% of interactions.
- **SC-004**: The app passes visual inspection on iPhone SE, iPhone 14, iPhone 15 Pro, and iPhone 16 Pro (or equivalent simulator models).

## Clarifications

### Session 2026-08-25

- Q: Should the layout fixes also work correctly when the iPhone is held in landscape orientation, or is portrait mode the only priority? → A: Portrait only — landscape is out of scope.
- Q: When the user types a search query that matches zero food items, what should be displayed below the search input? → A: Keep current behavior — no changes to the empty results state.

## Assumptions

- The app is deployed as a PWA and runs in standalone mode on iOS (using `apple-mobile-web-app-capable`).
- The `viewport-fit=cover` meta tag is already correctly set (confirmed in `index.html`).
- The `env(safe-area-inset-top)` CSS function is available and reliable for detecting the top safe area (status bar) on iPhones with notches.
- No separate component is needed for the header — it is an inline element in `App.tsx` and only CSS changes are required for both issues.
- The meal modal's search input and results list are already in separate DOM elements, so the fix involves CSS layout adjustments rather than structural component changes.
- Both issues can be resolved with CSS-only changes to `App.css`.
- This feature targets portrait orientation only. Landscape mode behavior is out of scope.
