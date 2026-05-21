# API documentation

| File | Description |
|------|-------------|
| [openapi.yaml](./openapi.yaml) | Original draft contract (partially outdated) |
| **Implemented API** | See [backend/README.md](../../backend/README.md) for PRD-aligned routes |

The running backend follows [PRD.md](../product/PRD.md) and [backend-architecture.md](../architecture/backend-architecture.md). Key differences from `openapi.yaml`:

| Topic | OpenAPI draft | Implemented (PRD) |
|-------|---------------|-------------------|
| Listing AI | `/jobs/{id}/upgrade` | `/jobs/{id}/check-listing`, `accept-suggestions`, `apply-suggestions` |
| Assessment | Separate generate + approve before publish | Auto-generated on `publish` |
| Apply flow | `POST /applications` then session | `POST /jobs/{id}/sessions` with `practice` or `application` |
| Scoring | Rubric 0–5 per skill | `/100` overall, match %, radar dimensions |
| Practice tests | Not defined | `mode: practice` — hidden from HR |

OpenAPI will be reconciled in a follow-up pass; use the backend README as the source of truth for integration.
