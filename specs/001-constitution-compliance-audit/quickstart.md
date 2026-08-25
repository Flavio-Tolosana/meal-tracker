# Quickstart Validation Guide

**Date**: 2026-08-25
**Feature**: 001-constitution-compliance-audit

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Access to project root directory

## Phase 1: Audit Report Validation

### Step 1: Verify TypeScript Strict Mode

```bash
npx tsc --noEmit 2>&1
```

**Expected**: Errors related to strict mode violations (if strict is enabled during audit)
**Pass condition**: All errors are documented as findings in the audit report

### Step 2: Verify ESLint Passes

```bash
npm run lint
```

**Expected**: Clean output or warnings only
**Pass condition**: No errors; any warnings documented in audit report

### Step 3: Verify No XSS Vectors

```bash
rg -n "dangerouslySetInnerHTML|eval\(|new Function\(|innerHTML|outerHTML|document\.write" src/
```

**Expected**: Zero matches
**Pass condition**: Clean output — if matches found, they must be in audit report as findings

### Step 4: Verify No Direct IndexedDB Access from Components

```bash
rg -n "from.*db/indexedDB|from.*\.\./db/" src/components/
```

**Expected**: Zero matches
**Pass condition**: Clean output — only `context/AppContext.tsx` imports from `db/`

### Step 5: Verify No Hardcoded Secrets

```bash
rg -n -i "password|secret|api.?key|token|credential" src/ --glob '!*.svg' --glob '!*.png'
```

**Expected**: Zero matches (excluding asset files)
**Pass condition**: Clean output

### Step 6: Verify Audit Report Completeness

```bash
# Check all12 principles are addressed
rg -n "Principle [I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII]" specs/001-constitution-compliance-audit/audit-report.md
```

**Expected**:12 matches (one per principle)
**Pass condition**: All principles present in report

## Phase 2: Remediation Validation

### Step 7: TypeScript Strict Mode (after fix)

```bash
npx tsc --noEmit
```

**Expected**: Zero errors
**Pass condition**: Clean output

### Step 8: ESLint Strict Config (after fix)

```bash
npm run lint
```

**Expected**: Zero errors
**Pass condition**: Clean output

### Step 9: Tests Pass (after vitest setup)

```bash
npm test
```

**Expected**: All tests pass
**Pass condition**: Zero failures

### Step 10: Build Succeeds

```bash
npm run build
```

**Expected**: Successful build with no errors
**Pass condition**: Clean output, `dist/` directory created

### Step 11: Application Runs

```bash
npm run dev
```

**Expected**: Application starts without console errors
**Pass condition**: No errors in browser console; UI renders correctly

## Phase 3: Accessibility Validation

### Step 12: Modal Dialog Attributes

Open `MealModal` and verify in browser DevTools:
- Modal container has `role="dialog"` and `aria-modal="true"`
- Close button has `aria-label="Cerrar"`
- Focus is trapped within modal

### Step 13: Navigation ARIA Labels

Inspect tab navigation:
- Active tab has `aria-current="page"`
- Each tab has descriptive `aria-label`

### Step 14: Calendar Accessibility

Inspect calendar grid:
- Grid container has `role="grid"`
- Day-of-week headers are `<th>` with `role="columnheader"`
- Day buttons have `aria-label` with full date

## Success Criteria Checklist

| # | Criterion | Command | Expected |
|---|-----------|---------|----------|
| SC-001 | All12 principles documented | `rg` audit report |12 matches |
| SC-002 | 90%+ findings have file:line | Manual review | Audit report |
| SC-003 | tsc + eslint + tests pass | `tsc --noEmit && npm run lint && npm test` | Zero errors |
| SC-004 | Zero XSS vectors | `rg` patterns | Zero matches |
| SC-005 | Zero component→db imports | `rg` import patterns | Zero matches |
| SC-006 | Audit completes in one session | Manual | < 4 hours |
