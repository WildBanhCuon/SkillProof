# SkillProof — Backend architecture

> **Status:** Confirmed design (team decisions May 2026)  
> Aligned with [mockups](../../mockups/) and [project brief](../brief/project%20brief.md)

---

## Confirmed decisions

| # | Topic | Decision |
|---|--------|----------|
| 1 | Candidate access | **C** — Candidate account; browse jobs and apply inside SkillProof |
| 2 | Code execution | **B** — Run submissions in a **code sandbox** (e.g. Judge0); results feed grading |
| 3 | Skills matrix | **A** — Computed **only** when HR clicks **Check listing** |
| 4 | AI suggestions | **B** — Gemini returns a full rewritten listing; HR **accepts in one click** |
| 5 | Grading timing | **A** — **Batch** on final **Submit** only (UI progress bars ≠ live AI) |
| 6 | Auth | **A** — Multi-tenant **Company** + HR users, **JWT** |
| 7 | Frontend | **Custom codebase** (not Lovable) — UI recreated from mockups, talks to REST API |
| 8 | LLM | **Google Gemini** for all AI pipelines + logged for audit trail |
| 9 | Apply vs practice | **Apply = test completed + submit as application.** Practice test allowed without apply → **company never sees** that result. **No external ATS.** |
| 10 | MVP depth | **All paths use real Gemini** (no seeded/fake AI responses) |

---

## What the backend must support

| Screen | User | Backend responsibility |
|--------|------|-------------------------|
| Create job posting | HR (JWT) | Draft listing, **Check listing** → issues + skills matrix, **Accept suggestions**, publish → generate assessment |
| Take assessment | Candidate (JWT) | Sandbox runs, save answers, timer; **practice** or **application** submit |
| Results dashboard | HR (JWT) | Only **application** submissions; rank, Gemini insights, stats |

**MVP scope:** Junior Frontend Developer template · no ATS · no marketplace.

---

## Architecture overview

```mermaid
flowchart TB
    subgraph Clients["Clients (custom frontends)"]
        HR["HR Web App<br/>React / TS"]
        CAND["Candidate App<br/>React / TS"]
    end

    subgraph API["SkillProof REST API"]
        GW["API + JWT middleware"]
        AUTH["Auth<br/>HR + Candidate"]
        JOBS["Jobs & Listings"]
        ASSESS["Assessments & Sessions"]
        RESULTS["Results & Ranking"]
        AI["AI Orchestration<br/>Gemini"]
        SB["Sandbox Runner"]
    end

    subgraph Data["Infrastructure"]
        DB[("PostgreSQL")]
        CACHE[("Redis<br/>sessions, job queue")]
        OBJ[("Object storage<br/>code snapshots, logs")]
    end

    subgraph External["External services"]
        GEMINI["Google Gemini API"]
        JUDGE["Code sandbox<br/>Judge0 / Piston / Docker worker"]
    end

    HR --> GW
    CAND --> GW
    GW --> AUTH
    GW --> JOBS
    GW --> ASSESS
    GW --> RESULTS
    JOBS --> AI
    ASSESS --> AI
    ASSESS --> SB
    RESULTS --> AI
    AI --> GEMINI
    SB --> JUDGE
    AUTH --> DB
    JOBS --> DB
    ASSESS --> DB
    RESULTS --> DB
    AI --> DB
    SB --> DB
    ASSESS --> CACHE
```

### Tech stack (recommended — frontend separate, backend TBD)

| Layer | Recommendation | Notes |
|--------|----------------|--------|
| **HR + Candidate UI** | React + TypeScript + Vite | Recreate [mockups](../../mockups/); call REST API |
| **API** | **NestJS** (TypeScript) | Team can pick; both fit Gemini + Judge0 |
| **Database** | PostgreSQL | Relational model below |
| **Cache / queue** | Redis | Sandbox job queue, rate limits, session TTL |
| **AI** | `google-generativeai` / Vertex AI | Structured JSON outputs per pipeline |
| **Sandbox** | Judge0 CE or self-hosted worker | Hidden tests per question; timeout per run |
| **Auth** | JWT (access + refresh); `company_id` on HR claims | Separate candidate auth namespace |

Lovable is **not** used in production — mockups are the UI spec only.

---

## Candidate journeys: practice vs apply

```mermaid
flowchart TD
    START["Candidate logged in"] --> BROWSE["Browse published jobs"]
    BROWSE --> CHOICE{"Intent?"}

    CHOICE -->|Practice| PRAC["Start practice session<br/>session_type = practice"]
    PRAC --> TEST["Take test + sandbox runs"]
    TEST --> SUB_P["Submit"]
    SUB_P --> GRADE_P["Gemini grades (batch)"]
    GRADE_P --> PRIV["test_result.visible_to_company = false"]
    PRIV --> CAND_FB["Candidate sees own feedback"]
    PRIV -.->|not visible| HR["HR dashboard"]

    CHOICE -->|Apply| APP["Start application session<br/>session_type = application"]
    APP --> TEST2["Take test (required)"]
    TEST2 --> SUB_A["Submit application"]
    SUB_A --> GRADE_A["Sandbox + Gemini grade (batch)"]
    GRADE_A --> PUB["Create APPLICATION<br/>visible_to_company = true"]
    PUB --> HR

    style HR fill:#e0e7ff
    style PRIV fill:#f1f5f9
```

**Rules**

- An **application** only exists after the candidate **submits the test** and chooses **Submit application** (not practice).
- **Practice** sessions are tied to `candidate_user` + `job_posting` but have **no** `application` row and **`visible_to_company = false`**.
- HR dashboard queries **only** results where `visible_to_company = true`.
- No CV upload, no ATS sync — SkillProof is the sole funnel for this MVP.

---

## Flow A — HR: create → check → accept → publish

```mermaid
sequenceDiagram
    autonumber
    actor HR as HR User
    participant API as REST API
    participant Jobs as Job Service
    participant AI as AI (Gemini)
    participant DB as PostgreSQL

    HR->>API: POST /auth/login
    API-->>HR: JWT (company_id, role)

    HR->>API: POST /jobs { title, description }
    Jobs->>DB: job_posting status=draft
    Note over HR,DB: Skills matrix empty until Check listing

    HR->>API: PATCH /jobs/{id} { description }
    Jobs->>DB: update draft only (no AI)

    HR->>API: POST /jobs/{id}/check-listing
    AI->>Gemini: analyze listing → issues + skills matrix
    Gemini-->>AI: structured JSON
    AI->>DB: listing_analysis + skill_requirements
    AI->>DB: ai_audit_log
    API-->>HR: issue cards + skills table

    HR->>API: POST /jobs/{id}/accept-suggestions
    AI->>Gemini: rewrite full job description
    Gemini-->>AI: improved_description
    AI->>DB: store suggestion snapshot + audit
    API-->>HR: improved_description

    HR->>API: POST /jobs/{id}/apply-suggestions
    Jobs->>DB: replace description (HR confirmed one-click)
    API-->>HR: updated job

    HR->>API: POST /jobs/{id}/publish
    Jobs->>DB: status=published
    AI->>Gemini: generate assessment from listing + skills
    Gemini-->>AI: questions + rubrics + hidden tests
    AI->>DB: assessment + questions + sandbox_test_cases
    API-->>HR: job live for candidates
```

**Skills matrix:** populated **only** at step 5 (`check-listing`). Re-run check after major edits.

---

## Flow B — Candidate: practice or apply + sandbox + batch grade

```mermaid
sequenceDiagram
    autonumber
    actor Cand as Candidate
    participant API as REST API
    participant Assess as Assessment Service
    participant SB as Sandbox
    participant AI as AI (Gemini)
    participant DB as PostgreSQL

    Cand->>API: POST /auth/register or /login
    API-->>Cand: JWT (candidate_id)

    Cand->>API: GET /jobs (published)
    Cand->>API: GET /jobs/{id}

    alt Practice
        Cand->>API: POST /jobs/{id}/sessions { mode: practice }
    else Apply path
        Cand->>API: POST /jobs/{id}/sessions { mode: application }
    end

    Assess->>DB: test_session + timer
    API-->>Cand: questions (no rubric / no hidden tests)

    loop Each question (autosave)
        Cand->>API: PATCH /sessions/{id}/answers/{qId} { code }
        Assess->>DB: upsert answer
        opt Run code (optional preview)
            Cand->>API: POST /sessions/{id}/answers/{qId}/run
            Assess->>SB: execute against public sample tests
            SB-->>Cand: stdout / errors (not final grade)
        end
    end

    Cand->>API: POST /sessions/{id}/submit { submit_as: practice | application }
    Assess->>DB: status=submitted, lock edits

    loop Each answer (batch)
        Assess->>SB: run hidden test suite
        SB-->>Assess: pass/fail, logs, runtime
        Assess->>DB: sandbox_run results
    end

    Assess->>AI: grade_session(code + sandbox results + rubric)
    AI->>Gemini: structured scoring + dimensions + band
    Gemini-->>AI: scores, strengths, improvements, summary
    AI->>DB: test_result + dimension_scores + ai_audit_log

    alt submit_as = application
        Assess->>DB: create application, visible_to_company=true
        API-->>Cand: application confirmed + feedback
    else submit_as = practice
        Assess->>DB: visible_to_company=false
        API-->>Cand: private feedback only
    end
```

**Grading (5A):** Gemini runs **once per session** on submit, using sandbox outcomes + code + rubric. UI “What we evaluate” bars are **static or post-submit** — not live AI during the test.

---

## Flow C — HR: dashboard (applications only)

```mermaid
sequenceDiagram
    autonumber
    actor HR as HR User
    participant API as REST API
    participant Res as Results Service
    participant DB as PostgreSQL

    HR->>API: GET /jobs/{id}/stats
    Res->>DB: COUNT applications WHERE visible_to_company
    API-->>HR: applications, avg score, ready_now count, etc.

    HR->>API: GET /jobs/{id}/candidates?sort=score&band=ready_now
    Res->>DB: join application + candidate + test_result
    Note over Res,DB: Exclude practice sessions
    API-->>HR: ranked cards (radar, AI summary, band)
```

**Dashboard metrics (revised for decision 9)**

| Metric | Definition |
|--------|------------|
| Applications received | Candidates who **submitted test as application** |
| Tests completed | Same as applications in MVP (apply requires test) |
| Verified matches | Applications with `match_percent` ≥ threshold |
| Top performers | Applications with `recommendation = ready_now` |

Practice attempts are **excluded** from HR stats (optional separate analytics later for product, not HR UI).

---

## Grading pipeline (sandbox + Gemini)

```mermaid
flowchart TD
    SUB["POST /sessions/:id/submit"] --> LOCK["Lock session"]
    LOCK --> LOOP["For each answer"]

    LOOP --> SB["Sandbox: hidden tests<br/>Judge0 worker"]
    SB --> SR["sandbox_run<br/>passed, failed, stderr, time"]

    SR --> GEM["Gemini: grade with<br/>code + execution evidence + rubric"]
    GEM --> QSCORE["Per-question score"]

    QSCORE --> AGG["Aggregate dimension scores"]
    AGG --> OVR["overall_score /100"]
    OVR --> MATCH["match_percent vs skill_requirements"]
    MATCH --> BAND["recommendation band<br/>ready_now | trainable | at_risk"]
    BAND --> INS["Gemini: strengths, improvements, summary"]
    INS --> STORE["Save test_result + ai_audit_log"]

    STORE --> VIS{"submit_as?"}
    VIS -->|application| APP["application + visible_to_company=true"]
    VIS -->|practice| PRAC["visible_to_company=false"]
```

---

## AI orchestration (Gemini — all real)

```mermaid
flowchart LR
    subgraph Pipelines["Gemini pipelines (structured JSON)"]
        P1["Listing check"]
        P2["Rewrite listing"]
        P3["Generate assessment"]
        P4["Grade session"]
        P5["Shortlist narrative"]
    end

    P1 --> P2
    P3 --> P4 --> P5
```

| Pipeline | Trigger | Gemini output |
|----------|---------|----------------|
| Listing check | `POST /jobs/:id/check-listing` | `issues[]`, `skills[]` |
| Rewrite listing | `POST /jobs/:id/accept-suggestions` | `improved_description` (markdown/HTML) |
| Generate assessment | `POST /jobs/:id/publish` | `questions[]`, `rubrics`, starter code |
| Grade session | `POST /sessions/:id/submit` | scores, dimensions, band, feedback |
| Shortlist narrative | Part of grade or `GET` refresh | strengths, improvements, one-line summary |

Every call writes to **`ai_audit_log`** (prompt hash, model, request/response JSON, `job_id` / `session_id`) for the brief’s **decision trail**.

---

## Core data model

```mermaid
erDiagram
    COMPANY ||--o{ HR_USER : employs
    COMPANY ||--o{ JOB_POSTING : owns
    JOB_POSTING ||--o| LISTING_ANALYSIS : has
    JOB_POSTING ||--o{ SKILL_REQUIREMENT : defines
    JOB_POSTING ||--o| ASSESSMENT : generates
    ASSESSMENT ||--|{ QUESTION : contains
    QUESTION ||--o{ SANDBOX_TEST_CASE : has

    CANDIDATE_USER ||--o{ TEST_SESSION : takes
    CANDIDATE_USER ||--o{ APPLICATION : submits
    JOB_POSTING ||--o{ APPLICATION : receives
    JOB_POSTING ||--o{ TEST_SESSION : offers

    TEST_SESSION ||--|{ ANSWER : contains
    ANSWER ||--o{ SANDBOX_RUN : produces
    TEST_SESSION ||--o| TEST_RESULT : produces
    TEST_RESULT ||--|{ DIMENSION_SCORE : includes
    APPLICATION ||--|| TEST_SESSION : "1:1 on apply submit"
    TEST_RESULT }o--|| APPLICATION : "visible when applied"

    COMPANY {
        uuid id PK
        string name
    }

    HR_USER {
        uuid id PK
        uuid company_id FK
        string email
        string password_hash
        enum role "admin | member"
    }

    CANDIDATE_USER {
        uuid id PK
        string email
        string password_hash
        string display_name
    }

    JOB_POSTING {
        uuid id PK
        uuid company_id FK
        string title
        text description
        text suggested_description "last AI rewrite"
        enum status "draft | analyzed | published | closed"
        timestamp published_at
    }

    LISTING_ANALYSIS {
        uuid id PK
        uuid job_posting_id FK
        json issues
        timestamp created_at
    }

    SKILL_REQUIREMENT {
        uuid id PK
        uuid job_posting_id FK
        string skill_name
        enum importance "must_have | nice_to_have"
        string expected_level
        boolean testable
    }

    ASSESSMENT {
        uuid id PK
        uuid job_posting_id FK
        int duration_minutes
        int total_points
    }

    QUESTION {
        uuid id PK
        uuid assessment_id FK
        int order_index
        string title
        text instructions
        text starter_code
        int points
        json rubric
    }

    SANDBOX_TEST_CASE {
        uuid id PK
        uuid question_id FK
        boolean is_hidden
        text input
        text expected_output
        int timeout_ms
    }

    APPLICATION {
        uuid id PK
        uuid job_posting_id FK
        uuid candidate_user_id FK
        uuid test_session_id FK
        timestamp applied_at
    }

    TEST_SESSION {
        uuid id PK
        uuid job_posting_id FK
        uuid candidate_user_id FK
        enum session_type "practice | application"
        enum status "in_progress | submitted | expired"
        timestamp started_at
        timestamp expires_at
        timestamp submitted_at
    }

    ANSWER {
        uuid id PK
        uuid session_id FK
        uuid question_id FK
        text submitted_code
        text notes
    }

    SANDBOX_RUN {
        uuid id PK
        uuid answer_id FK
        boolean is_hidden_suite
        json results "per test case"
        timestamp ran_at
    }

    TEST_RESULT {
        uuid id PK
        uuid session_id FK
        boolean visible_to_company
        int overall_score
        int match_percent
        enum recommendation "ready_now | trainable | at_risk"
        json strengths
        json improvements
        text ai_summary
    }

    DIMENSION_SCORE {
        uuid id PK
        uuid test_result_id FK
        string dimension
        int score_0_100
    }

    AI_AUDIT_LOG {
        uuid id PK
        string pipeline
        uuid reference_id
        string model "gemini-..."
        json request_meta
        json response_json
        timestamp created_at
    }
```

---

## REST API surface

```mermaid
flowchart TB
    subgraph Auth
        H1["POST /auth/hr/login"]
        H2["POST /auth/hr/register-company"]
        C1["POST /auth/candidate/register"]
        C2["POST /auth/candidate/login"]
    end

    subgraph HR["HR (Bearer JWT, company scope)"]
        J1["POST /jobs"]
        J2["PATCH /jobs/:id"]
        J3["POST /jobs/:id/check-listing"]
        J4["POST /jobs/:id/accept-suggestions"]
        J5["POST /jobs/:id/apply-suggestions"]
        J6["POST /jobs/:id/publish"]
        J7["GET /jobs/:id/candidates"]
        J8["GET /jobs/:id/stats"]
    end

    subgraph Candidate["Candidate (Bearer JWT)"]
        P1["GET /jobs"]
        P2["GET /jobs/:id"]
        P3["POST /jobs/:id/sessions"]
        P4["PATCH /sessions/:id/answers/:qId"]
        P5["POST /sessions/:id/answers/:qId/run"]
        P6["POST /sessions/:id/submit"]
        P7["GET /sessions/:id/result"]
    end
```

---

## Job posting state machine

```mermaid
stateDiagram-v2
    [*] --> Draft: HR creates job
    Draft --> Draft: autosave description
    Draft --> Analyzed: Check listing (Gemini)
    Analyzed --> Draft: HR edits (matrix stale until re-check)
    Analyzed --> Analyzed: Accept + apply suggestions
    Analyzed --> Published: Publish (Gemini generates test)
    Published --> Closed: HR closes role
    Closed --> [*]
```

---

## Frontend ↔ backend integration

```mermaid
flowchart LR
    subgraph FE["Custom frontends"]
        HR_UI["HR app"]
        CAND_UI["Candidate app"]
    end

    API["SkillProof REST API<br/>OpenAPI / Swagger"]
    FE -->|"HTTPS + JWT"| API
```

- Recreate three mockup flows in code; no Lovable runtime dependency.
- Shared API client (generated from OpenAPI optional).
- CORS configured for dev/staging origins.

---

## Security & tenancy notes

- HR JWT includes `company_id`; every `/jobs/*` query scoped to tenant.
- Candidates only access their own `sessions` and `results`.
- Hidden sandbox tests never sent to client — only `run` uses public sample cases.
- Rate-limit Gemini and sandbox per company/session.
- Store `GEMINI_API_KEY` server-side only.

---

## Implementation order (suggested)

1. PostgreSQL schema + HR/candidate auth (JWT)  
2. Jobs CRUD + `check-listing` + `accept/apply-suggestions` (Gemini)  
3. `publish` → assessment generation (Gemini)  
4. Sandbox worker + `run` + hidden tests on submit  
5. Submit flow (practice vs application) + grade (Gemini)  
6. HR candidates + stats endpoints  
7. Wire custom React apps to API  

---

## Brief vs sandbox (note for pitch)

The [project brief](../brief/project%20brief.md) lists “no live code-execution sandbox” for the **4-week story MVP**. Your team chose **real sandbox execution (2B)** for the functional build — stronger demo, higher engineering cost. Mention this explicitly in the report as a deliberate scope upgrade.
