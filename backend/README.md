# SkillProof API



NestJS + Prisma REST API for the SkillProof MVP ([PRD](../docs/product/PRD.md)).



## Prerequisites



- Node.js 20+

- Docker (Postgres, Redis)

- Google Gemini API key



## Quick start



```bash

# 1. Infrastructure

docker compose up -d



# 2. Environment

cp .env.example .env

# Set GEMINI_API_KEY and JWT_SECRET in .env



# 3. Database

npm install

npx prisma migrate deploy

npm run prisma:seed



# 4. API

npm run start:dev

```



API base: `http://localhost:3000/v1`



Postgres is exposed on **port 54333** (not 5432) to avoid conflicting with a local PostgreSQL install on Windows. Use `127.0.0.1` in `DATABASE_URL`.



Health: `GET /v1/health`



## Seed accounts



| Role | Email | Password |

|------|-------|----------|

| HR | marion@acme.test | Password123! |

| Candidate | sofiane@test.com | Password123! |



## PRD routes (implemented)



### Auth

- `POST /v1/auth/hr/register`

- `POST /v1/auth/candidate/register`

- `POST /v1/auth/login` — body: `{ email, password, role: "hr" | "candidate" }`

- `POST /v1/auth/refresh`

- `POST /v1/auth/logout`

- `GET /v1/auth/me` — includes `companyTeamProfile` for HR

- `POST /v1/auth/generate-team-profile-from-website` — draft “about team” from public website (optional auth)
- `PATCH /v1/auth/company-profile` — HR updates default “about team” text and website URL



### HR — Jobs

- `POST /v1/jobs`

- `POST /v1/jobs/generate-from-wizard` — AI job ad from questionnaire answers

- `GET /v1/jobs`

- `GET /v1/jobs/:id`

- `PATCH /v1/jobs/:id`

- `POST /v1/jobs/:id/check-listing`

- `POST /v1/jobs/:id/accept-suggestions`

- `POST /v1/jobs/:id/apply-suggestions`

- `POST /v1/jobs/:id/publish` — generates assessment (Gemini)

- `POST /v1/jobs/:id/archive` — closes listing (`CLOSED`); candidates can no longer apply

- `DELETE /v1/jobs/:id` — permanent delete (draft, analyzed, or archived only; archive published jobs first)

- `GET /v1/jobs/:id/assessment`



### HR — Results

- `GET /v1/jobs/:id/stats`

- `GET /v1/jobs/:id/candidates?sort=score&band=ready_now&search=`

- `GET /v1/jobs/:id/candidates/:applicationId`
- `PATCH /v1/jobs/:id/candidates/:applicationId/decision` — `{ "decision": "interview" | "decline" }`



### Candidate — Applications & sessions

- `GET /v1/candidate/applications` — list applications and practice tests with status
- `GET /v1/candidate/applications/:sessionId` — detail and feedback summary
- `POST /v1/jobs/:id/sessions` — `{ "mode": "practice" | "application" }`

- `PATCH /v1/sessions/:id/answers/:questionId`

- `POST /v1/sessions/:id/submit` — returns 202, async AI grading

- `GET /v1/sessions/:id/result`



## Architecture



- **Gemini** — listing check, rewrite, assessment generation, session grading (code + rubric)

- **Bull + Redis** — async grading queue

- **Practice vs application** — practice results are not visible on HR dashboard



See [backend-architecture.md](../docs/architecture/backend-architecture.md).



## Scripts



| Command | Description |

|---------|-------------|

| `npm run start:dev` | Dev server with watch |

| `npm run build` | Production build |

| `npm run prisma:migrate` | Create/apply migrations (dev) |

| `npm run prisma:seed` | Seed demo users |

| `npm test` | E2E tests (all API routes; requires Docker + seed) |



## E2E tests



End-to-end tests live in `test/api.e2e-spec.ts`. They exercise every `/v1` route in order (auth → HR job lifecycle → candidate session → results → logout).



- **Mocks:** Gemini is stubbed so no API key is required for tests.

- **Database:** Uses your `.env` `DATABASE_URL` (Postgres on `127.0.0.1:54333`). Run `docker compose up -d`, `npx prisma migrate deploy`, and `npm run prisma:seed` first.

- **Redis:** Bull queue must be reachable (`redis://localhost:6379`) for app bootstrap; grading is invoked synchronously in tests after submit.



```bash

npm test

```



## Postman



Import into Postman:



- Collection: [`postman/SkillProof.postman_collection.json`](postman/SkillProof.postman_collection.json)

- Environment: [`postman/SkillProof.local.postman_environment.json`](postman/SkillProof.local.postman_environment.json)



Login requests auto-save `accessToken`, `refreshToken`, `jobId`, `sessionId`, and `questionId` to collection variables.



## Deploy on Render

| Setting | Value |
|--------|--------|
| Root Directory | `backend` |
| Branch | `deploy` |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npx prisma migrate deploy && npm run start:prod` |

**Node:** `backend/.node-version` pins **22** (optional; set `NODE_VERSION=22` in Render if needed).

**Important:** Do not set `NODE_ENV=production` during the build phase, or dev-only tools may be skipped. `@nestjs/cli` is listed under `dependencies` so `nest build` works on Render.

After first deploy, open **Shell** and run `npm run prisma:seed` once.

## Notes



- All AI features require `GEMINI_API_KEY`.

- Grading runs in the background; poll `GET /v1/sessions/:id/result` until `status: evaluated`.

