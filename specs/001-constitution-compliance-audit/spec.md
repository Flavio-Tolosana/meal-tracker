# Feature Specification: Constitution Compliance Audit

**Feature Branch**: `001-constitution-compliance-audit`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Quiero hacer un repaso a la aplicación para que concuerde con la constitution, es decir, que sea código legible y mantenible, buenas prácticas, seguro,..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audit Report Generation (Priority: P1)

A developer reviews the existing codebase and produces a structured report showing which constitution principles are already satisfied, which have partial compliance, and which are violated. The report maps each violation to specific code locations and suggests concrete remediation actions.

**Why this priority**: This is the foundation — without knowing the current state, no remediation can begin. It directly enables all other stories.

**Independent Test**: Can be fully tested by producing the audit report and verifying it covers all12 constitution principles with verifiable findings per principle.

**Acceptance Scenarios**:

1. **Given** the audit is initiated, **When** the developer reviews the codebase against all12 constitution principles, **Then** a report is produced listing each principle with compliance status (Compliant / Partial / Non-Compliant).
2. **Given** a principle has violations, **When** the report is reviewed, **Then** each violation references specific file paths and line numbers with a clear remediation suggestion.
3. **Given** the audit is complete, **When** the report is checked, **Then** no constitution principle is unaddressed and no finding lacks a concrete code reference.

---

### User Story 2 - Prioritized Remediation Plan (Priority: P2)

Based on the audit findings, a prioritized remediation plan is produced. Items are grouped by severity (blocker, warning, improvement) and ordered by risk to data integrity and security first, then maintainability.

**Why this priority**: Knowing what to fix first prevents wasted effort and ensures the highest-risk issues are addressed before lower-risk ones.

**Independent Test**: Can be tested by verifying the plan groups findings correctly and that security/data-integrity items appear before cosmetic improvements.

**Acceptance Scenarios**:

1. **Given** the audit report exists, **When** the remediation plan is created, **Then** all findings are categorized by severity and grouped by constitution principle.
2. **Given** the plan is complete, **When** it is reviewed, **Then** security and data-integrity issues (Principles VI, VII, VIII) appear before code quality issues (Principles I, III).
3. **Given** multiple items share the same severity, **When** ordering is applied, **Then** items affecting data integrity or user data loss are prioritized over stylistic concerns.

---

### User Story 3 - Targeted Code Fixes (Priority: P3)

After the audit and plan, specific code changes are made to bring the application into compliance. Each fix is atomic, verifiable and addresses one principle violation at a time. Fixes include refactoring, adding validation, securing IndexedDB access, and enforcing type safety.

**Why this priority**: This is the execution phase — it delivers the actual value of the audit. It depends on Stories 1 and 2 being complete.

**Independent Test**: Each fix can be tested by running type checking, linting and tests to verify the violation is resolved without introducing regressions.

**Acceptance Scenarios**:

1. **Given** a remediation item is selected, **When** the fix is applied, **Then** the specific violation is resolved and the code passes `tsc` and `eslint`.
2. **Given** multiple fixes are applied, **When** all tests are run, **Then** no existing functionality is broken.
3. **Given** a fix addresses a security principle, **When** the fix is verified, **Then** the vulnerability is demonstrably closed (e.g., no `dangerouslySetInnerHTML` with dynamic content, no secrets in IndexedDB).

---

### Edge Cases

- What happens when a constitution principle has no corresponding code to audit? The report notes "No applicable code found" for that principle.
- How does the audit handle principles that conflict with each other? The report flags conflicts and defers to the constitution's priority order (data integrity > security > maintainability > UX).
- What happens when a fix for one principle introduces a violation of another? The fix must be reworked — the audit report tracks regressions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The audit MUST evaluate the application against all12 constitution principles (I through XII) and produce a per-principle compliance status.
- **FR-002**: Each finding MUST reference a specific file path and line number (or range) where the violation occurs.
- **FR-003**: Each finding MUST include a concrete remediation suggestion — not a vague recommendation, but a specific action (e.g., "Move IndexedDB call from `DayView.tsx:45` to a repository function").
- **FR-004**: The audit MUST verify TypeScript strict mode is enabled and report any `any` types or missing type annotations.
- **FR-005**: The audit MUST verify that no UI component directly imports or calls IndexedDB functions (Principle V violation).
- **FR-006**: The audit MUST verify that IndexedDB usage follows explicit schema definitions with versioned migrations (Principle IV).
- **FR-007**: The audit MUST check for XSS vectors: `dangerouslySetInnerHTML`, `eval`, `Function` constructor, unescaped dynamic content in JSX.
- **FR-008**: The audit MUST verify that no secrets, credentials or API keys are stored in IndexedDB or hardcoded in source.
- **FR-009**: The audit MUST verify that user input and persisted data are validated before use (Principle VI).
- **FR-010**: The audit MUST verify that `tsc`, `eslint` and tests pass as a quality gate (Principle XI).
- **FR-011**: The remediation plan MUST group findings by severity (Blocker / Warning / Improvement) and prioritize security and data-integrity items first.
- **FR-012**: Code fixes MUST be atomic — one principle violation per change — and must not introduce regressions.
- **FR-013**: The audit MUST verify accessibility basics: semantic HTML, ARIA labels on interactive elements, touch target sizes (Principle II).
- **FR-014**: The audit MUST verify separation of concerns: components contain presentation logic only, business logic resides in services/hooks, data access in repository layer (Principle III).

### Key Entities

- **Audit Finding**: A single identified violation of a constitution principle. Has principle reference, severity, file location, description and remediation suggestion.
- **Remediation Item**: An audit finding that has been triaged and assigned a fix priority. Links to one or more findings.
- **Compliance Report**: The complete audit output. Contains all findings, compliance status per principle, and the remediation plan.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every constitution principle (I–XII) has a documented compliance status in the audit report — no principle is left unchecked.
- **SC-002**: At least90% of findings include a file path and line number reference — vague "somewhere in the codebase" entries are not acceptable.
- **SC-003**: After remediation, `tsc --noEmit` reports zero errors, `eslint` reports zero errors, and all existing tests pass.
- **SC-004**: Zero instances of `dangerouslySetInnerHTML` with dynamic content, `eval`, or hardcoded secrets remain after remediation.
- **SC-005**: Zero UI components directly import from `src/db/` — all data access goes through the repository/service layer.
- **SC-006**: The audit report is produced and reviewed within a single working session — the process is lightweight, not a multi-day effort.

## Assumptions

- The existing codebase is the starting point — no prior constitution compliance work has been done.
- The developer performing the audit has access to the full source tree and can run `tsc`, `eslint` and tests.
- Remediation fixes are applied directly to the existing codebase (not a separate branch or fork).
- The `idb` library is the chosen IndexedDB wrapper and its usage patterns are the standard for this project.
- Accessibility audit is limited to structural/semantic checks (no automated screen reader testing).
- The audit covers the `src/` directory only — configuration files (`vite.config.ts`, `tsconfig.*.json`) are reviewed for settings but not audited as application code.
