# Contracts Versioning (SSOT)

These JSON schemas and samples are the Single Source of Truth (SSOT) for AIME ↔ PuttSolver integration.

## Rules
1) **Backwards compatible changes** (add optional fields, relax validation) → bump MINOR
2) **Breaking changes** (rename fields, change types, change required fields) → bump MAJOR
3) Every PR that changes schemas must update:
   - `contracts/schemas/*.json`
   - `contracts/samples/*.json` (at least one golden sample)
   - a short note in the PR description

## Current Status
- Some fields are intentionally marked as **BLOCKED** until the developer blockers call answers:
  - local origin corner (SW/SE/NW/NE)
  - rotation sign convention
  - GetPlotLength meaning / plot scaling fields
  - instruction buffer max length / encoding
  - DLL thread safety / concurrency assumptions
