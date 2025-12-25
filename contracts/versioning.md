# API Versioning Strategy

## Version Format

APIs use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes to request/response schemas
- **MINOR:** New fields added (backward compatible)
- **PATCH:** Bug fixes, internal changes

## Current Versions

### PuttSolver Service
- **Version:** `0.1.0` (Phase 0 - Mocked)
- **Base Path:** `/` (no version prefix in Phase 0)
- **Future:** `/v1/` prefix when stable

### AIME Backend (FastAPI)
- **Version:** `0.2.0`
- **Base Path:** `/api/`
- **PuttSolver Endpoint:** `/api/solve_putt` (no version prefix in Phase 0)

## Versioning Strategy

### Phase 0 (Current)
- No version prefixes
- All endpoints under `/api/` or root `/`
- Mock implementations

### Phase 1+ (Future)
- Add version prefixes: `/api/v1/solve_putt`
- Maintain backward compatibility for at least one major version
- Deprecation notices in headers: `X-API-Deprecated: true`

## Request/Response Versioning

### Request Headers
```http
Content-Type: application/json
X-API-Version: 0.1.0  # Optional, for future use
```

### Response Headers
```http
Content-Type: application/json
X-API-Version: 0.1.0
X-Service-Version: 0.1.0  # PuttSolver service version
```

## Schema Versioning

JSON schemas in `contracts/schemas/` are versioned by filename:
- `solve_putt.request.schema.json` (current)
- `solve_putt.request.v2.schema.json` (future breaking change)

## Migration Path

When introducing breaking changes:
1. Create new schema version
2. Support both old and new versions for 1 major version cycle
3. Deprecate old version with `X-API-Deprecated: true` header
4. Remove old version after deprecation period

