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
| Build Command | `npm install --include=dev && npx prisma generate && npm run build` |
| Start Command | `npm run start:render` |

**Node:** `backend/.node-version` pins **22**.

**Important:** Use `npm install --include=dev` in the build command (or rely on `backend/.npmrc`).

### Required environment variables (API service)

Create **PostgreSQL** and **Key Value (Redis)** in the **same region** as the web service, then set:

| Variable | Where to get it |
|----------|-----------------|
| `DATABASE_URL` | Postgres → **Internal** URL. If Prisma cannot connect, append `?sslmode=require` (or `&sslmode=require` if the URL already has query params). Easiest: **Link** the database to the web service in Render. |
| `REDIS_URL` | Key Value → **Internal** URL (`redis://...`). **Required** — the API uses Bull for grading; without Redis the process exits on startup. |
| `JWT_SECRET` | Long random string (you generate) |
| `GEMINI_API_KEY` | Google AI Studio key |
| `GEMINI_MODEL` | `gemini-2.0-flash` |
| `CORS_ORIGINS` | Your frontend URL, e.g. `https://skillproof-web.onrender.com` (add `http://localhost:5173` for local dev) |

Optional: `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES`, `PORT` (Render sets `PORT` automatically).

### After first successful deploy

1. Open **Shell** on the API service.
2. Run: `npm run prisma:seed`
3. Hit `GET https://<your-api>.onrender.com/v1/health`

### Build succeeded but deploy exits with status 1

The start command runs **migrations then the API**. Open the **deploy logs** (not build logs) and scroll above `Exited with status 1` for the real error.

| Log message | Fix |
|-------------|-----|
| `Can't reach database server` / `P1001` | Set `DATABASE_URL` to the Postgres **Internal** URL; link DB to service; add `sslmode=require` if needed. |
| `Authentication failed` / `P1000` | Wrong credentials — re-link database or copy URL again from Render. |
| `ECONNREFUSED 127.0.0.1:6379` | Set `REDIS_URL` to Render Key Value **Internal** URL (not localhost). |
| `prisma: command not found` | Use start command `npm run start:render` (needs latest `deploy` branch). |
| App starts then crashes | Check `GEMINI_API_KEY`, `REDIS_URL`, and full deploy log stack trace. |

## Notes



- All AI features require `GEMINI_API_KEY`.

- Grading runs in the background; poll `GET /v1/sessions/:id/result` until `status: evaluated`.

