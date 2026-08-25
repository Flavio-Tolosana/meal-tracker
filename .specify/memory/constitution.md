<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Added sections: All (initial constitution)
- Removed sections: None
- Modified principles: None (new)
- Follow-up TODOs: None
-->

# Meal-Tracker Constitution

## Core Principles

### I. Code Quality and Simplicity

All code MUST be clean, simple, readable and maintainable. Prioritize clarity over cleverness.
Follow YAGNI — do not add functionality until it is needed. Refactor when complexity
exceeds the value it provides. Every module, function and component MUST have a single,
clear responsibility.

### II. Mobile-First Responsive Design

The UI MUST be built mobile-first and remain fully responsive across all screen sizes.
All interactive elements MUST be accessible — follow WCAG 2.1 AA minimum. Touch targets
MUST be at least 44x44px. Layouts MUST adapt fluidly without horizontal scrolling.

### III. Strong Typing and Architecture

TypeScript MUST be used with strict mode enabled. Prefer explicit types over `any`.
Enforce clear separation of concerns: presentation, business logic and data access MUST
reside in distinct layers. No shortcut imports across architectural boundaries.

### IV. IndexedDB as Database

Treat IndexedDB as a database, not a key-value cache. Every object store MUST have an
explicit schema. All schema changes MUST use versioned databases with migrations. Data
MUST be validated at read and write boundaries. Never store data that violates the
declared schema.

### V. Data Layer Abstraction

UI components MUST NEVER access IndexedDB directly. All persistence operations MUST go
through a repository or service layer. This layer owns schema access, migration logic
and data transformation. Components consume domain models, not raw database records.

## Security and Data Validation

### VI. Input Validation

Never trust persisted or user-provided data. Validate all external data at application
boundaries before processing. Use schema validation libraries where appropriate. Reject
or sanitize invalid data immediately — do not propagate it into business logic.

### VII. IndexedDB Security Boundaries

IndexedDB is NOT a security boundary. It MUST NEVER store secrets, credentials, API
keys or personally identifiable information that requires protection. All data in
IndexedDB is accessible to any script running in the same origin. Design accordingly.

### VIII. Frontend Security

Protect against XSS by sanitizing all dynamic content rendered to the DOM. Never use
`dangerouslySetInnerHTML` with untrusted input. Avoid `eval`, `Function` constructor
and similar dynamic code execution. Follow OWASP Top 10 guidance for frontend
applications.

### IX. Dependency Management

Avoid unnecessary dependencies. Every new dependency MUST be justified: does it solve a
real problem, is it maintained, is it small, is there a simpler alternative? Prefer
built-in browser APIs when they suffice. Audit dependencies regularly.

## Testing and Quality Gates

### X. Testing Critical Paths

Business logic, data validation, persistence operations and migrations MUST have
corresponding tests. Focus test effort on correctness-critical paths, not exhaustive
coverage of trivial code. Tests MUST be deterministic and independent.

### XI. Quality Gates

Type checking (`tsc`), linting (`eslint`) and tests MUST all pass before a feature is
considered complete. No exceptions. A feature with failing checks is incomplete, regardless
of functionality.

### XII. Data Integrity and User Experience

Prioritize data integrity — a correct result is more important than a fast one. Design
for graceful degradation when IndexedDB is unavailable. Provide clear feedback for
loading, error and empty states. Never silently lose user data.

## Governance

This constitution is the authoritative reference for all development decisions in
Meal-Tracker. It supersedes ad-hoc conventions and personal preferences.

**Amendment process**: Propose changes via pull request. Changes MUST include rationale,
impact analysis and version bump per semver rules. MAJOR for principle removal or
redefinition, MINOR for new principles or material expansion, PATCH for clarifications.

**Compliance review**: Every pull request MUST be checked against these principles.
Reviewers MUST flag violations. Type checking, linting and tests are mandatory gates —
merge is blocked until all pass.

**Version**: 1.0.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
