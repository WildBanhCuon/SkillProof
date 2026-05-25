# SkillProof

Too many junior applicants, not enough proof. SkillProof helps companies turn messy applications into verified, job-ready talent shortlists.

SkillProof is a B2B SaaS concept for junior tech hiring. It helps HR and talent teams improve vague junior job ads, generate role-calibrated assessments, evaluate applicants against an explicit rubric, and produce a ranked shortlist backed by evidence instead of CV keywords.

The MVP focuses on one role: **Junior Frontend Developer**.

## Problem

Junior hiring creates a difficult mix of high volume and low signal:

- A single junior role can receive 200-500+ applications.
- CVs often look interchangeable: similar bootcamps, similar keywords, similar tutorial projects.
- "Junior" job ads frequently contain senior-level expectations, discouraging the right applicants and attracting the wrong ones.
- HR teams lack a defensible way to prove why one candidate was shortlisted and another was rejected.
- A bad junior hire can cost months of salary, onboarding effort, and manager time before the mismatch is visible.

SkillProof replaces subjective screening proxies such as school name, years of experience, and polished CV wording with structured evidence of actual ability.

## Primary Users

### HR / Talent Acquisition Lead

The main buyer is an HR manager, recruiter, or tech hiring lead at a scale-up, mid-market company, IT services firm, or digital agency hiring several junior developers per year.

Their goals:

- Reduce screening time.
- Defend realistic job requirements with hiring managers.
- Identify juniors who can actually perform.
- Lower first-year turnover and mis-hires.
- Build a structured decision trail for internal review, feedback, and DE&I reporting.

### Junior Applicant

Applicants benefit from a fairer path into the funnel. Instead of being filtered only by experience, school, or network, they can prove skill through a role-specific test and receive structured feedback.

Examples from the product context include:

- A computer science graduate with strong personal projects but no professional experience.
- A career changer with bootcamp and side-project experience who is rejected by traditional filters.

## Core Workflow

### HR Flow

1. Log in or register.
2. Create, modify, or delete a job offer.
3. Paste a free-text job ad into the Job Ad Upgrade Studio.
4. Review AI flags for overreach, vague responsibilities, missing information, and unrealistic junior expectations.
5. Validate the generated skill matrix and role-specific test.
6. Review ranked candidates with scorecards, strengths, risks, evidence, and suggested interview questions.
7. Interview qualified candidates with a defensible shortlist.

### Applicant Flow

1. Log in or register.
2. Browse available applications with filters such as location and diploma requirements.
3. Open a job offer.
4. Complete a 30-45 minute assessment.
5. Progress to interview or receive personalized feedback when not selected.

## Key Features

- **Job Ad Upgrade Studio**: analyzes junior job ads and flags unrealistic requirements, vague responsibilities, and missing information.
- **Skill Matrix Generation**: turns a job ad into explicit skills and evaluation criteria.
- **Role-Specific Assessment Generation**: creates a fresh assessment from the validated job context instead of relying on a static test bank.
- **Rubric-Based Evaluation**: scores candidate answers per criterion from 0 to 5 with cited evidence from the submission.
- **Ranked HR Dashboard**: aggregates rubric scores into a shortlist without fake "match percentage" probabilities.
- **Candidate Scorecards**: show strengths, weaknesses, risks, and interview questions.
- **Applicant Feedback**: gives rejected candidates actionable feedback instead of silence or a generic rejection.

## Where AI Fits

| Step | Owner |
| --- | --- |
| Write job ad | HR |
| Analyze job ad and generate flags + skill matrix | AI |
| Approve or edit suggestions | HR |
| Generate role-specific test | AI |
| Approve or edit test | HR |
| Evaluate candidate answers per rubric | AI |
| Aggregate scores and rank shortlist | Code |
| Draft candidate feedback and HR recommendation | AI |
| Make hire/pass decision | HR |

The system does not try to predict whether someone will be a good hire from historical labels. That would require company-specific performance data and could reproduce historical bias. SkillProof instead uses explicit, inspectable rubrics that HR can review and adjust.

## Inputs and Outputs

### Inputs

- **HR input**: a free-text job ad, typically 200-800 words, pasted into the Studio.
- **Candidate input**: written answers, multiple-choice answers, and small code submissions from one timed assessment session.

### Outputs

- **For HR**: improved job offer content, technical requirements, skill matrix, suggestion cards, candidate scorecards, ranked dashboard, rubric scores, evidence, risks, and interview questions.
- **For applicants**: assessment grade and personalized feedback.

## Architecture

The planned architecture separates HR and candidate frontends from a shared SkillProof REST API.

- **Clients**: HR web app and candidate app built with React and TypeScript.
- **API layer**: REST API with JWT middleware.
- **Core modules**: authentication, jobs and listings, assessments and sessions, results and ranking, and AI orchestration.
- **AI orchestration**: Gemini-backed workflows for job ad analysis, assessment generation, evaluation, recommendations, and feedback.
- **Infrastructure**: PostgreSQL for application data, Redis for sessions and job queues, object storage for code snapshots and logs.
- **External services**: Google Gemini API for listing AI, assessment generation, and grading.

See [backend architecture](docs/architecture/backend-architecture.md) for system diagrams (Mermaid).

The REST API contract is in [`docs/api/openapi.yaml`](docs/api/openapi.yaml), including route examples for authentication, jobs, AI orchestration, assessments, applications, candidate sessions, and results.

## Run backend

```bash
cd backend
cp .env.example .env   # set GEMINI_API_KEY, JWT_SECRET
docker compose up -d
npm install
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

API: `http://localhost:3000/v1` — full route list in [backend/README.md](backend/README.md).

## Run frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:5173 (proxies `/v1` to the API in dev). See [frontend/README.md](frontend/README.md).

**Full stack:** start Docker + backend (`npm run start:dev`), then `npm run dev` in `frontend/`.

Demo logins after `npm run prisma:seed` in `backend/`:

| Role | Email | Password |
|------|-------|----------|
| HR | marion@acme.test | Password123! |
| Candidate | sofiane@test.com | Password123! |

The seed includes a **published** Junior Frontend Developer role with one graded application — open HR results at `/hr/jobs` → **View results** on the demo job.

## Project structure

```
project/
├── README.md                 # This file
├── backend/                  # NestJS API (Prisma, Gemini)
├── frontend/                 # React + Vite SPA (HR + candidate flows)
├── docs/
│   ├── README.md             # Documentation index
│   ├── brief/                # Problem & personas
│   ├── product/              # PRD
│   ├── architecture/         # Backend design
│   ├── design/               # UI / mockup prompts
│   └── api/                  # OpenAPI draft + PRD route notes
├── mockups/                  # UI screenshots (Figma / Lovable)
└── course/
    ├── sessions/             # Class slides (sessions 1–2)
    └── …                     # Course assignment PDF
```

## MVP Scope

The 4-week prototype demonstrates the complete B2B value chain for a single role:

1. Improve a junior frontend job ad.
2. Generate a validated assessment.
3. Collect candidate submissions.
4. Evaluate answers against a rubric.
5. Produce a ranked shortlist with evidence and feedback.

Out of scope for the MVP:

- A real job marketplace.
- Full ATS integration.
- Live production-grade code execution sandbox.
- Multi-role test generation.
- A general "predict good hire" model.

## Success Metrics

SkillProof is designed to improve measurable hiring outcomes:

- 60-70% reduction in screening time per junior role.
- 30% improvement in interview-to-hire conversion.
- Lower mis-hire rate measured 3-6 months after hiring.
- Faster time-to-fill for junior tech roles.

## Links

- Repository: [https://github.com/WildBanhCuon/SkillProof](https://github.com/WildBanhCuon/SkillProof)
- Mockup: [https://skillproof-showcase.lovable.app/](https://skillproof-showcase.lovable.app/)
