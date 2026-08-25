# Tasks: Constitution Compliance Audit

**Input**: Design documents from `/specs/001-constitution-compliance-audit/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in feature specification. Test framework setup is included as a foundational task to satisfy constitution Principle XI (Quality Gates).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install and configure test framework required by constitution Principle XI

- [x] T001 Install vitest and @testing-library/react as devDependencies in package.json
- [x] T002 Create vitest.config.ts extending vite.config.ts with test configuration
- [x] T003 Add "test" script to package.json scripts section
- [x] T004 Verify vitest runs with `npm test` (expect zero tests, clean exit)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Enable TypeScript strict mode and update ESLint — blocks all code fixes

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Enable `"strict": true` in tsconfig.app.json compilerOptions
- [x] T006 [P] Update eslint.config.js to use tseslint.configs.recommendedTypeChecked with parserOptions.project
- [x] T007 Run `tsc --noEmit` and fix any type errors introduced by strict mode
- [x] T008 Run `npm run lint` and fix any new lint errors from type-checked rules
- [x] T009 [P] Write audit-report.md in specs/001-constitution-compliance-audit/ with all12 principle statuses and findings per contracts/audit-output.md format

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Audit Report Generation (Priority: P1) MVP

**Goal**: Produce the structured compliance report covering all12 constitution principles

**Independent Test**: Verify audit-report.md exists, covers all12 principles, and each finding references a file:line

### Implementation for User Story 1

- [x] T010 [US1] Populate Principle I (Code Quality) section in audit-report.md — mark as Compliant
- [x] T011 [US1] Populate Principle II (Mobile-First) section in audit-report.md — mark as Partial with accessibility findings
- [x] T012 [US1] Populate Principle III (Strong Typing) section in audit-report.md — mark as Non-Compliant (strict mode disabled)
- [x] T013 [US1] Populate Principle IV (IndexedDB) section in audit-report.md — mark as Partial (no migrations, no validation)
- [x] T014 [US1] Populate Principle V (Data Layer) section in audit-report.md — mark as Compliant
- [x] T015 [US1] Populate Principle VI (Input Validation) section in audit-report.md — mark as Partial (CSV gaps)
- [x] T016 [US1] Populate Principle VII (Security Boundaries) section in audit-report.md — mark as Compliant
- [x] T017 [US1] Populate Principle VIII (Frontend Security) section in audit-report.md — mark as Compliant
- [x] T018 [US1] Populate Principle IX (Dependencies) section in audit-report.md — mark as Compliant
- [x] T019 [US1] Populate Principle X (Testing) section in audit-report.md — mark as Non-Compliant (no tests)
- [x] T020 [US1] Populate Principle XI (Quality Gates) section in audit-report.md — mark as Non-Compliant (no test gate)
- [x] T021 [US1] Populate Principle XII (Data Integrity) section in audit-report.md — mark as Partial (no error/empty states)
- [x] T022 [US1] Add Executive Summary table and Remediation Plan section to audit-report.md

**Checkpoint**: Audit report complete — all12 principles documented with findings

---

## Phase 4: User Story 2 — Prioritized Remediation Plan (Priority: P2)

**Goal**: Create severity-prioritized remediation plan ordered by risk

**Independent Test**: Verify plan groups findings by severity and security/data-integrity items appear first

### Implementation for User Story 2

- [x] T023 [US2] Define remediation items R001–R005 for Blocker-severity findings (TypeScript strict mode, ESLint type-checked rules, test framework)
- [x] T024 [US2] Define remediation items R006–R010 for Warning-severity findings (accessibility ARIA, input validation, IndexedDB migrations)
- [x] T025 [US2] Define remediation items R011–R015 for Improvement-severity findings (error states, empty states, loading states)
- [x] T026 [US2] Add dependency graph and parallel execution notes to remediation plan

**Checkpoint**: Remediation plan complete — all findings triaged and ordered

---

## Phase 5: User Story 3 — Targeted Code Fixes (Priority: P3)

**Goal**: Apply atomic code fixes to bring each non-compliant principle into compliance

**Independent Test**: Each fix passes `tsc --noEmit`, `npm run lint`, and `npm test` independently

### Implementation for User Story 3

#### Typing & Linting Fixes (Principles III, XI)

- [x] T027 [P] [US3] Fix any TypeScript strict-mode errors in src/types/index.ts
- [x] T028 [P] [US3] Fix any TypeScript strict-mode errors in src/utils/csv.ts
- [x] T029 [P] [US3] Fix any TypeScript strict-mode errors in src/db/indexedDB.ts
- [x] T030 [US3] Fix any TypeScript strict-mode errors in src/context/AppContext.tsx (depends on T027–T029)
- [x] T031 [P] [US3] Fix any TypeScript strict-mode errors in src/components/CalendarView.tsx
- [x] T032 [P] [US3] Fix any TypeScript strict-mode errors in src/components/DayView.tsx
- [x] T033 [P] [US3] Fix any TypeScript strict-mode errors in src/components/MealModal.tsx
- [x] T034 [P] [US3] Fix any TypeScript strict-mode errors in src/components/LibraryView.tsx
- [x] T035 [P] [US3] Fix any TypeScript strict-mode errors in src/components/SettingsView.tsx
- [x] T036 [P] [US3] Fix any TypeScript strict-mode errors in src/App.tsx and src/main.tsx

#### Accessibility Fixes (Principle II)

- [x] T037 [US3] Add role="dialog", aria-modal="true", and aria-label to MealModal.tsx modal container
- [x] T038 [US3] Add focus trap (Escape key, Tab cycling) to MealModal.tsx
- [x] T039 [P] [US3] Add aria-label to close button "✕" in MealModal.tsx
- [x] T040 [P] [US3] Add aria-label to calendar nav buttons "‹"/"›" in CalendarView.tsx
- [x] T041 [P] [US3] Add role="grid" and aria-label to calendar grid in CalendarView.tsx
- [x] T042 [P] [US3] Replace calendar day-of-week <div> with <th> with role="columnheader" in CalendarView.tsx
- [x] T043 [P] [US3] Add aria-label with full date to each calendar day button in CalendarView.tsx
- [x] T044 [P] [US3] Add aria-label to "+" add-meal buttons in DayView.tsx
- [x] T045 [P] [US3] Add aria-label to all library action buttons (✎, ⊘, ✓, ✕, ↩) in LibraryView.tsx
- [x] T046 [P] [US3] Add <label> elements for search and edit inputs in LibraryView.tsx
- [x] T047 [P] [US3] Add aria-current="page" to active tab in App.tsx
- [x] T048 [P] [US3] Add role="alert" and aria-live="polite" to status messages in SettingsView.tsx

#### Input Validation Fixes (Principle VI)

- [x] T049 [US3] Add date format validation (YYYY-MM-DD regex) to importCSV in src/context/AppContext.tsx
- [x] T050 [US3] Add CSV escaping utility for meal names with commas/newlines in src/utils/csv.ts
- [x] T051 [US3] Integrate CSV escaping into exportCSV in src/context/AppContext.tsx

#### IndexedDB Schema & Validation Fixes (Principle IV)

- [x] T052 [US3] Add versioned migration strategy to src/db/indexedDB.ts (document version increments)
- [x] T053 [US3] Add runtime validation (zod or manual) for Meal and DayLog at IndexedDB read/write boundaries in src/db/indexedDB.ts

#### Data Integrity & UX Fixes (Principle XII)

- [x] T054 [US3] Add loading state indicator while IndexedDB data loads on mount in src/context/AppContext.tsx
- [x] T055 [US3] Add empty-state UI for meals list and day logs in src/components/DayView.tsx and LibraryView.tsx
- [x] T056 [US3] Add try/catch error handling for IndexedDB operations with user-facing messages in src/context/AppContext.tsx

#### Verification

- [x] T057 Run `tsc --noEmit` — expect zero errors
- [x] T058 Run `npm run lint` — expect zero errors
- [x] T059 Run `npm test` — expect all tests pass
- [x] T060 Run `npm run build` — expect successful build

**Checkpoint**: All code fixes applied — application in full constitution compliance

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T061 Update audit-report.md — mark all fixed findings as status "fixed"
- [x] T062 Run quickstart.md validation scenarios end-to-end
- [x] T063 Verify zero regressions: `tsc --noEmit && npm run lint && npm test && npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — produces the audit report
- **US2 (Phase 4)**: Depends on Phase 3 — produces the remediation plan
- **US3 (Phase 5)**: Depends on Phase 4 — applies code fixes
- **Polish (Phase 6)**: Depends on Phase 5 — final validation

### User Story Dependencies

- **US1 (Audit Report)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **US2 (Remediation Plan)**: Depends on US1 completion — needs audit findings to triage
- **US3 (Code Fixes)**: Depends on US2 completion — needs remediation plan to execute

### Within Each User Story

- Typing/linting fixes (T027–T036) can run in parallel across files
- Accessibility fixes (T037–T048) can run in parallel across files
- Input validation fixes (T049–T051) are sequential (utility → integration)
- IndexedDB fixes (T052–T053) are sequential (schema → validation)
- UX fixes (T054–T056) can run in parallel
- Verification tasks (T057–T060) must run after all fixes

### Parallel Opportunities

- T006, T009 can run in parallel (ESLint config + audit report)
- T027–T029 can run in parallel (type fixes in types, utils, db)
- T031–T036 can run in parallel (type fixes in components)
- T039–T048 can run in parallel (accessibility fixes across components)
- T054–T056 can run in parallel (UX fixes across files)

---

## Parallel Example: User Story 3 (Accessibility)

```bash
# Launch all accessibility fixes together (different files):
Task: "Add aria-label to close button in MealModal.tsx"
Task: "Add aria-label to calendar nav buttons in CalendarView.tsx"
Task: "Add role='grid' to calendar grid in CalendarView.tsx"
Task: "Add aria-label to add-meal buttons in DayView.tsx"
Task: "Add aria-label to library action buttons in LibraryView.tsx"
Task: "Add <label> elements in LibraryView.tsx"
Task: "Add aria-current to active tab in App.tsx"
Task: "Add role='alert' to status messages in SettingsView.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup vitest
2. Complete Phase 2: Enable strict mode + ESLint type-checked rules + write audit report
3. Complete Phase 3: Audit report with all12 principles documented
4. **STOP and VALIDATE**: Audit report covers all principles with file:line references
5. The audit report itself is the deliverable — no code changes needed for US1

### Incremental Delivery

1. Setup + Foundational → Foundation ready + audit report produced
2. Add Remediation Plan → All findings triaged and ordered
3. Add Code Fixes → Apply fixes in priority order (blockers → warnings → improvements)
4. Polish → Final validation, all gates pass

### Suggested MVP Scope

**User Story 1 (Audit Report)** is the MVP. It delivers value independently — the developer knows exactly what to fix and where. Stories 2 and 3 build on this foundation.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- TypeScript strict-mode fixes (T027–T036) may require reading the actual error output before writing fixes — these are placeholders for "fix whatever tsc reports"
