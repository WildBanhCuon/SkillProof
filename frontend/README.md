# SkillProof Web

React + Vite frontend for the SkillProof MVP. UI follows the [Lovable mockups](../mockups/) and [design spec](../docs/design/Lovable%20mockups%20prompt.md).

## Prerequisites

- Node.js 20+
- Backend API running at `http://localhost:3000/v1` (see [backend/README.md](../backend/README.md))

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:5173

## Demo accounts

After `npm run prisma:seed` in `backend/`:

| Role | Email | Password |
|------|-------|----------|
| HR | marion@acme.test | Password123! |
| Candidate | sofiane@test.com | Password123! |

A **published** Junior Frontend Developer job with one graded candidate is included — log in as HR and open **View results** on that row.

## Routes

| Path | Role | Screen |
|------|------|--------|
| `/` | Public | Landing |
| `/login`, `/register` | Public | Auth |
| `/hr/jobs` | HR | Job list |
| `/hr/profile` | HR | Company team profile (wizard default) |
| `/hr/jobs/wizard` | HR | Guided questionnaire → AI draft |
| `/hr/jobs/new`, `/hr/jobs/:id` | HR | Create / edit + AI check |
| `/hr/jobs/:id/results` | HR | Ranked candidates |
| `/hr/jobs/:id/candidates/:appId` | HR | Candidate detail |
| `/jobs` | Candidate | Browse jobs |
| `/jobs/:id` | Candidate | Apply / practice |
| `/sessions/:id` | Candidate | Assessment |
| `/sessions/:id/result` | Candidate | Graded result |

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4
- TanStack Query, React Router
- Monaco Editor (code), Recharts (radar)
