# Audit Output Contract

**Date**: 2026-08-25
**Feature**: 001-constitution-compliance-audit

## Purpose

Define the structured output format that the constitution compliance audit must produce.
This contract ensures consistency between the audit report, remediation plan, and
downstream task generation.

## Audit Report Format

The audit report is a Markdown file (`audit-report.md`) in the feature directory.

### Structure

```markdown
# Constitution Compliance Audit Report

**Generated**: [ISO 8601 timestamp]
**Codebase**: meal-tracker
**Constitution Version**: 1.0.0

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Findings | [N] |
| Blockers | [N] |
| Warnings | [N] |
| Improvements | [N] |
| Principles Compliant | [N]/12 |
| Principles Partial | [N]/12 |
| Principles Non-Compliant | [N]/12 |

## Principle Status Matrix

| # | Principle | Status | Findings |
|---|-----------|--------|----------|
| I | Code Quality and Simplicity | Compliant | 0 |
| II | Mobile-First Responsive Design | Partial | [N] |
| III | Strong Typing and Architecture | Non-Compliant | [N] |
| ... | ... | ... | ... |

## Findings

### [F001] Principle [N] - [Short Description]

- **Severity**: [blocker/warning/improvement]
- **File**: [path]
- **Line**: [number or range]
- **Description**: [what is wrong]
- **Remediation**: [how to fix it]
- **Verification**: [command to verify fix]

[Repeat for each finding]

## Remediation Plan

| Priority | Finding(s) | Effort | Description | Verification |
|----------|------------|--------|-------------|--------------|
| 1 | F003, F004 | small | Enable strict mode | tsc --noEmit |
| 2 | F001, F002 | medium | Add ARIA attributes | manual check |
| ... | ... | ... | ... | ... |
```

### Field Constraints

- **Severity values**: `blocker`, `warning`, `improvement`
  - `blocker`: Security vulnerability, data loss risk, or principle violation that could cause runtime errors
  - `warning`: Compliance gap that should be fixed but has no immediate risk
  - `improvement`: Best-practice enhancement that increases quality
- **Status values**: `compliant`, `partial`, `non-compliant`
- **File paths**: Relative to project root, forward slashes
- **Line numbers**: 1-indexed; ranges use `N-M` format
- **Verification commands**: Must be runnable from project root

## Remediation Item Format

Each remediation item in the plan corresponds to one or more findings and defines
the atomic change required.

### Constraints

- One principle violation per remediation item (atomic)
- Verification command must pass after the fix
- Effort estimate: `small` (< 30 min), `medium` (30 min – 2 hr), `large` (> 2 hr)
- Dependencies between items must be explicit (e.g., "R001 must complete before R003")
