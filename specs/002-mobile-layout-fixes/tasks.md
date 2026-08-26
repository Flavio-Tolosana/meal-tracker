# Tasks: mobile-layout-fixes

**Input**: Design documents from `/specs/002-mobile-layout-fixes/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Tests**: No automated tests — visual/layout changes validated by manual inspection per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: User Story 1 - Header visible below iPhone status bar (Priority: P1) 🎯 MVP

**Goal**: The app header ("🍽 Meals") is fully visible below the iOS status bar on all iPhone models in standalone PWA mode.

**Independent Test**: Open the PWA on an iPhone in standalone mode. Verify the header is fully visible below the status bar with no overlap.

### Implementation for User Story 1

- [x] T001 [US1] Add `padding-top: env(safe-area-inset-top)` to `.app-header` in `src/App.css` to push the header below the iOS status bar on notched iPhones
- [x] T002 [US1] Verify the sticky header behavior is preserved after adding safe area padding — the header must still stick at `top: 0` when scrolling in `src/App.css`

**Checkpoint**: At this point, User Story 1 should be fully functional — header visible below status bar on all iPhone models.

---

## Phase 2: User Story 2 - Search input remains fixed while filtering (Priority: P2)

**Goal**: The meal modal search input stays at its original vertical position while the user types and the result list filters, preventing it from sliding below the iPhone keyboard.

**Independent Test**: Open the meal modal on an iPhone, type to filter results, and verify the search input does not move as the list shrinks.

### Implementation for User Story 2

- [x] T003 [US2] Change `.modal-sheet` from `max-height: 80dvh` to `height: 80dvh` in `src/App.css` so the modal maintains a fixed height regardless of result list size
- [x] T004 [US2] Add `min-height: 0` to `.modal-results` in `src/App.css` to ensure the results area can shrink properly within the fixed-height modal sheet
- [x] T005 [US2] Verify the modal still displays correctly when the result list is full (no overflow, proper scrolling) in `src/App.css`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 3: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality gates

- [x] T006 Run `npx tsc --noEmit` to verify no type errors introduced
- [x] T007 Run `npm run lint` to verify no linting errors introduced
- [x] T008 Run `npm run test` to verify all existing tests still pass
- [ ] T009 Run quickstart.md validation scenarios on iPhone SE and iPhone 15 Pro simulator

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1 (Phase 1)**: No dependencies — can start immediately
- **User Story 2 (Phase 2)**: No dependencies on US1 — can start in parallel with US1
- **Polish (Phase 3)**: Depends on both US1 and US2 being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent — no dependencies on other stories
- **User Story 2 (P2)**: Independent — no dependencies on other stories

Both user stories modify the same file (`src/App.css`), so they should be implemented sequentially to avoid merge conflicts, but they are logically independent.

### Parallel Opportunities

- T006, T007, T008 (quality gates) can run in parallel in Phase 3

---

## Parallel Example: Phase 3 Quality Gates

```bash
# Run all quality gates in parallel:
npx tsc --noEmit        # T006
npm run lint            # T007
npm run test            # T008
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Header fix (T001-T002)
2. **STOP and VALIDATE**: Test header visibility on iPhone simulator
3. Deploy/demo if ready

### Incremental Delivery

1. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
2. Add User Story 2 → Test independently → Deploy/Demo
3. Run quality gates → Complete

### Notes

- Both stories modify `src/App.css` only — no new files, no component changes
- Total tasks: 9 (2 for US1, 3 for US2, 4 for polish)
- Estimated effort: < 30 minutes for implementation, remaining time for validation
