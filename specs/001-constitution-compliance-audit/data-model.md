# Data Model: Constitution Compliance Audit

**Date**: 2026-08-25
**Feature**: 001-constitution-compliance-audit

## Audit Entities

### Audit Finding

A single identified violation of a constitution principle.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (e.g., `F001`, `F002`) |
| principle | number | Constitution principle number (I–XII) |
| principleName | string | Human-readable principle name |
| severity | enum | `blocker` \| `warning` \| `improvement` |
| status | enum | `open` \| `fixed` \| `wontfix` |
| file | string | Relative file path (e.g., `src/components/MealModal.tsx`) |
| line | string | Line number or range (e.g., `45`, `45-50`) |
| description | string | What the violation is |
| remediation | string | Concrete action to fix it |
| category | string | Taxonomy category (security, accessibility, typing, etc.) |

**State transitions**: `open` → `fixed` (after remediation) or `open` → `wontfix` (with justification)

---

### Remediation Item

An audit finding that has been triaged and assigned a fix priority.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (e.g., `R001`) |
| findingIds | string[] | References to related Audit Findings |
| priority | number | Fix order (1 = first) |
| effort | enum | `small` \| `medium` \| `large` |
| description | string | What needs to be done |
| verificationCommand | string | How to verify the fix (e.g., `tsc --noEmit`) |

**Relationships**: Many-to-one with Audit Finding (one remediation item may address multiple related findings)

---

### Compliance Report

The complete audit output.

| Field | Type | Description |
|-------|------|-------------|
| generatedAt | ISO 8601 | When the audit was performed |
| totalFindings | number | Count of all findings |
| findingsBySeverity | object | `{ blocker: N, warning: N, improvement: N }` |
| principleStatuses | map | Principle number → `compliant` \| `partial` \| `non-compliant` |
| findings | Audit Finding[] | All findings |
| remediationPlan | Remediation Item[] | Ordered list of fixes |

---

## Application Data Model (Existing)

### Meal

| Field | Type | Constraints |
|-------|------|-------------|
| id | number | Auto-increment primary key |
| name | string | Required, trimmed |
| category | string | Optional |

**Constitution gaps**: No maximum length validation; no sanitization on import.

### DayLog

| Field | Type | Constraints |
|-------|------|-------------|
| id | string | Format: `YYYY-MM-DD` (date string) |
| periods | Record<MealPeriod, number[]> | Map of period → meal IDs |

**Constitution gaps**: No validation that date strings match `YYYY-MM-DD` format on CSV import.

### MealPeriod

| Type | Values |
|------|--------|
| String union | `"desayuno"` \| `"almuerzo"` \| `"merienda"` \| `"cena"` \| `"colación"` |

**Constitution gaps**: None — type-safe union with runtime array (`MEAL_PERIODS`).

### IndexedDB Schema

```typescript
interface MealTrackerDB extends DBSchema {
  meals: { key: number; value: Meal; indexes: { "by-name": string } };
  dayLogs: { key: string; value: DayLog };
}
```

**Constitution gaps**: No versioned migrations; single version opening; no read/write validation at boundaries.
