# SkillProof — Final report requirements & writing guide

**Purpose:** Single reference for the **10–15 page final project report** due **Wednesday, June 3, 2026** (with the functional prototype).

**Draft report:** [Final_Report_SkillProof.md](./Final_Report_SkillProof.md) — export to PDF for Google Classroom; add team names and screenshots before submit.  
**Program:** ESCEN — **AI for Impact**, Boston LXP 2026 (Next-U).  
**Product:** SkillProof.

> **Note:** The file `course/LXP BOSTON_AI_for_Impact_ESCEN.docx` is **not in this repository**. This guide merges every report-related requirement found in repo docs and session PDFs. **Cross-check** against your Classroom brief and the course docx before submitting.

---

## 1. Official deliverables & deadlines

From **Session 4 — Pitch and Rehearsal** (`Session4_PitchAndRehearsal_NextU_2026.pdf`):

| Date | Deliverable | Channel |
|------|-------------|---------|
| **Wed. June 3, 2026** | **Final prototype** (link or executable) **+ Final report** | Google Classroom |
| **Sun. June 7, 2026** | Final pitch slides | Google Classroom |
| **Mon. June 8, 2026** | Final oral presentations (10 min + Q&A) | In class |

**If not finished in class:** complete before the next session (same deadlines apply).

**Also expected (Session 4):**
- Working prototype for demo + **backup video** of key features if live demo fails.
- Pitch practiced with team handoffs (any jury member may ask any teammate).

**Course README** also references a main **project assignment PDF** at the root of `course/` — not present in repo; verify structure/grading rubric there.

---

## 2. Report format (what we know)

| Requirement | Source |
|-------------|--------|
| **Length: 10–15 pages** | `docs/product/PRD.md` §2.3 (course deliverable) |
| **Companion: 10 min pitch** | PRD; Session 4 oral structure |
| **Language** | English (product + course materials) |
| **Emphasis split** | **Open** — PRD §14 Q7: “% business vs % tech” not decided; suggest **~40% problem/business, ~40% solution/tech/AI, ~20% risks/limitations/next steps** unless Classroom says otherwise |

**Writing quality (Session 3 — Calibration):**
- **Do not** use excuse language (“we didn’t have time”, “AI will get better”, “privacy is a checkbox”, “monetization later”).
- **Do** own limitations explicitly with a next-step plan (language scope, input assumptions, hallucination rate, scope cuts).

**Figures:** Use **app screenshots**, architecture diagram, pricing table, risk matrix, TAM/SAM/SOM chart — not generic stock AI imagery (Session 4 slide rules apply to report visuals too).

---

## 3. What the report must demonstrate (grading themes)

Synthesized from **PRD**, **Session 3**, and **Session 4**:

| Theme | What jurors expect |
|-------|-------------------|
| **Real problem** | Specific user, specific pain, current failure mode — not generic “HR is hard” |
| **AI necessity** | Why the product is impossible or much worse without AI (not “we use ChatGPT”) |
| **Functional prototype** | End-to-end workflow works; link in report |
| **Business case** | Market structure, TAM/SAM/SOM, competitors, revenue model, unit economics, GTM |
| **Risks & mitigations** | Market + technical + adoption; likelihood 1–5; honest trade-offs |
| **Strategic choices** | What you **cut**, what you **sequenced**, and **why** |
| **Limitations** | Calibrated, owned constraints — not excuses |

**Session 3 — AI justification checkpoint** (include in report § “Why AI”):
1. If frontier models were free tomorrow — does SkillProof still win? (workflow + outcomes, not API access)
2. If you removed AI — what remains? Is it still valuable?
3. If a non-AI competitor appears — what specific value does your AI unlock? (quality, speed, defensibility, new capability)

**Session 4 — Q&A themes** (report should pre-answer):
- **Why now?** (2026: LLM cost/quality, junior hiring volume, EU AI Act urgency)
- **Why this scope?** What you cut (full ATS, marketplace, etc.)
- **Hardest part** — name top technical or adoption risk first
- **How do you make money?** One clear sentence + numbers
- **Why you?** Team insight / access / domain

---

## 4. Recommended report outline (10–15 pages)

Adjust page counts to hit the limit. Titles are suggestions.

### Cover & metadata (~0.5 page)
- Project title: **SkillProof**
- Team names, program, date
- **Live URLs** (from `README.md`):
  - Web: https://skillproof-z3j9.onrender.com/
  - API: https://skillproof-api-mxjo.onrender.com/v1
  - Repo: https://github.com/WildBanhCuon/SkillProof
- One-line tagline: *Too many applicants. Not enough proof.*

### 1. Executive summary (~1 page)
- Problem, solution, buyer, MVP outcome, business model in one paragraph each.
- Key metrics targets (screening time −60–70%, etc.) — label as **design goals** if not measured yet.

**Sources:** `README.md`, `docs/brief/project brief.md`

### 2. Problem & context (~1.5–2 pages)
- Junior tech hiring: volume (200–500+ applicants), low CV signal, bad job ads, cost of mis-hire, no audit trail.
- **Personas:** Marion (HR buyer) + Sofiane/Camille (candidates) — `docs/brief/project personas.md`
- JTBD for HR: *“When I post a junior role and get flooded, help me produce an interview-ready shortlist quickly with confidence.”*
- Why CV-only and ATS keyword AI are insufficient (bias from historical hires, no skills proof).

**Sources:** `docs/brief/project brief.md`, `Session3_10min_Pitch_Deck.md`

### 3. Solution & product overview (~1.5–2 pages)
- SkillProof wedge: **between ATS and interview** — not replacing full HR stack.
- **Workflow:** improve job ad → role-specific assessment → ranked evidence shortlist.
- HR flow vs candidate flow (`README.md` § Core Workflow).
- Design principles: verify don’t proxy, audit by default, transparent feedback (`PRD` §3.2).
- **Screenshots:** landing, job editor + listing check, assessment, HR results, pricing/checkout demo.

**Sources:** `README.md`, `docs/product/PRD.md` §1–4, `mockups/`

### 4. Why AI (~1–1.5 pages)
- Pipelines (current build): listing analysis, assessment generation, rubric grading — **Google Gemini 3.1 Flash Lite**.
- What AI does vs what stays human (HR approves ad, final hire decision).
- **AI necessity argument** (PRD §10): cannot economically analyze volume + generate per-role tests + consistent rubric grades manually.
- Session 3 stress-test answers (free GPT, remove AI, non-AI competitor).
- **Audit:** `ai_audit_log` requirement (`PRD` §8.7).

**Sources:** `docs/product/PRD.md` §10, `docs/architecture/backend-architecture.md`, `backend/src/modules/ai/gemini.service.ts`

### 5. Technical architecture & prototype (~2–3 pages)
- Stack: React + Vite, NestJS, PostgreSQL, Prisma, Redis/Bull (grading queue), Gemini API.
- High-level diagram: HR UI → API → DB / queue → Gemini.
- Auth: JWT, HR vs candidate roles.
- Key endpoints or modules (pointer to `docs/api/openapi.yaml`, `backend/README.md`).
- **Grading:** batch on submit; MCQ auto-score + Gemini for code/text (`GradingService`).
- **Scope note for honesty:** Original brief excluded live sandbox; **current MVP uses AI-only grading** (Judge0 removed — migration `20260520140000_remove_sandbox`). Say this explicitly; do not claim live code execution if demo doesn’t show it.
- Demo accounts: `marion@acme.test` / `Password123!` (`backend/README.md`).

**Sources:** `docs/architecture/backend-architecture.md`, `backend/README.md`, `docs/product/PRD.md` §12

### 6. Market & competitive landscape (~1.5–2 pages)
- **Porter’s 5 forces** summary — `course/sessions/Session3_Workshop_Checklist.md` (filled draft).
- **TAM / SAM / SOM** (scenario-based, cite sources):
  - TAM ≈ **$5.25B ARR** · SAM ≈ **$1.84B ARR** · SOM (12–24 mo) ≈ **$9.2M ARR**
- **Three competitor types:** ATS+AI screen, coding test platforms, manual process — with examples (Workable, TestGorilla, HackerRank, etc.) — `docs/pricing/pricing-strategy.md` §1.
- Differentiation: one workflow, job-linked tests, practice ≠ application, explainable rubrics (no fake match %).

**Sources:** `Session3_Workshop_Checklist.md`, `Session3_10min_Pitch_Deck.md`, `docs/pricing/pricing-strategy.md`

### 7. Business model & unit economics (~1.5–2 pages)
- **Buyer:** Head of Talent / HR / Founder (50–500 employees).
- **Revenue:** monthly subscription — **active job slots + graded candidates/month**, unlimited recruiter seats.
- **Pricing tiers (from app):**

  | Tier | Target | Monthly (EUR) | Jobs | Graded/mo |
  |------|--------|---------------|------|-----------|
  | Starter | 20–50 | €149 | 2 | 100 |
  | Growth | 50–100 | €299 | 5 | 300 |
  | Scale | 100–250 | €549 | 10 | 800 |
  | Pro | 250–500 | €899 | 20 | 2,000 |

- **Value anchor:** ~€800–1,575 manual screening labor per hire vs subscription.
- **Unit economics:** AI COGS negligible (~$0.22/mo at 10 jobs × 30 graded); gross margin 80%+ at tier quotas — `docs/pricing/pricing-strategy.md`.
- **GTM / first 100 customers:** paid pilots €500–1,500 → founder outbound (0–20) → case studies (20–60) → referrals (60–100).
- **Demo billing:** checkout is **simulated** (localStorage) — state clearly.

**Sources:** `docs/pricing/pricing-strategy.md`, `frontend/src/data/pricingPlans.ts`, `Session3_Workshop_Checklist.md` (Filled Draft — Revenue model)

### 8. Risks, trade-offs & compliance (~1.5–2 pages)
- **Three risk categories** (Session 3 Risk Clinic): market, technical, adoption.
- **Risk register** (likelihood 1–5 + mitigation) — example from workshop:

  | Risk | Type | L | Mitigation |
  |------|------|---|------------|
  | Low WTP despite interest | Market | 4 | Paid pilots, ROI metrics |
  | AI quality/cost/latency at scale | Technical | 3 | Guardrails, monitoring, routing |
  | Workflow resistance / tool fatigue | Adoption | 4 | Wedge + ATS coexistence |

- **Trade-off owned:** quality-at-speed — fast first pass, human review when uncertain.
- **EU AI Act:** high-risk employment AI (Annex III); enforceable **Aug 2, 2026** — disclosure, human oversight, documentation (`docs/pricing/pricing-strategy.md` §5).
- **GDPR:** recommended narrative for EU persona (PRD §14 Q15) — retention, consent before AI evaluation, practice vs application isolation.

**Sources:** `Session3_Workshop_Checklist.md`, `docs/product/PRD.md` §15, `docs/pricing/pricing-strategy.md`

### 9. Limitations & future work (~1 page)
- English only; single-tenant demo; no real payment processor; no ATS integration.
- Assessment quality depends on job description quality.
- Completion rates / pilot metrics **not yet validated** — list as next-step research.
- Roadmap: ATS export, EU compliance pack, optional code sandbox if buyers require it, Skills Passport (deferred).

**Sources:** `PRD` §6.2 out of scope, Session 3 Calibration slide

### 10. Conclusion (~0.5 page)
- Restate wedge + validated learning plan (paid pilots).
- Link to pitch (June 8) and deployed prototype.

### Optional appendix (not counted in page limit if allowed)
- API route table excerpt
- Gemini cost table — `docs/pricing/pricing-strategy.md`
- OpenAPI link

---

## 5. Content already drafted in the repo (copy/adapt)

| Topic | File |
|-------|------|
| Oral script & timing | `course/sessions/Session3_10min_Pitch_Deck.md` |
| Red-team answers | `course/sessions/Session3_Oral_RedTeam_Script.md` |
| Full business case + Porter + TAM/SAM/SOM + pricing + risks | `course/sessions/Session3_Workshop_Checklist.md` |
| Pricing & competitors (2026 research) | `docs/pricing/pricing-strategy.md` |
| Product requirements | `docs/product/PRD.md` |
| Architecture & flows | `docs/architecture/backend-architecture.md` |
| Problem & buyer | `docs/brief/project brief.md` |
| Personas | `docs/brief/project personas.md` |
| Pitch slides prompt | `course/sessions/Session4_Claude_Slides_Prompt.md` |

---

## 6. Prototype submission checklist (June 3)

Include in report **and** Classroom submission:

- [ ] **Live URL:** https://skillproof-z3j9.onrender.com/
- [ ] **API health:** https://skillproof-api-mxjo.onrender.com/v1/health
- [ ] **GitHub repo** + branch deployed (`deploy` per README)
- [ ] **How to run locally:** `backend/README.md`, `frontend/README.md`
- [ ] **Demo script** (happy path) — from `Session3_10min_Pitch_Deck.md` § Live demo
- [ ] **Demo credentials** or “register new HR account via /register/company”
- [ ] **Backup demo video** (Session 4 requirement)
- [ ] **Environment:** `GEMINI_API_KEY` required for AI features

**Happy path to describe in report:**
1. HR: publish role → Check listing → skills matrix → publish assessment  
2. Candidate: apply → profile → practice test (different questions) → application test → submit → graded result  
3. HR: ranked candidates, recommendation band, evidence  
4. Optional: company signup with plan selection (demo payment)

---

## 7. Alignment: report vs pitch vs slides

| Report section | Pitch slide (Session 4) |
|----------------|-------------------------|
| Executive summary + hook | Slide 1 — Title & Hook |
| §2 Problem | Slide 2 — Problem |
| §3 Solution | Slide 3 — Solution |
| §6–7 Business | Slide 6 — Market & Business Model |
| §5 Tech + demo path | Slide 4 — Demo (live) |
| §4 Why AI | Slide 5 — Why AI |
| §8 Risks | Slide 7 — Risks |
| §9–10 Next steps / ask | Slide 8 — Ask |

Keep **numbers consistent** across report, slides, and oral (pricing, TAM/SAM/SOM, tiers).

---

## 8. Product facts to keep accurate (June 2026 build)

| Topic | Current truth |
|-------|----------------|
| AI model | `gemini-3.1-flash-lite` (`GEMINI_MODEL`) |
| Code execution | **Not in MVP** — AI grades submitted code/text; no Judge0 |
| Roles | Any junior tech role in product copy; seed may use one demo job |
| Match % | Dashboard may show scores — explain as rubric-derived, not opaque AI match |
| Payments | **Demo only** — plan stored in browser localStorage |
| Deployment | Render (`deploy` branch) |

**Do not** copy outdated PRD lines about sandbox/Judge0 without the scope correction paragraph.

---

## 9. Pre-submission checklist (Wednesday)

### Content
- [ ] 10–15 pages (excluding cover/appendix if allowed)
- [ ] All Session 3 business elements: TAM/SAM/SOM, 3 competitors, revenue, unit economics, first-100 plan
- [ ] All Session 3 risk elements: market + tech + adoption + mitigations + likelihood
- [ ] AI justification (3 stress tests)
- [ ] Limitations owned (no excuse language)
- [ ] Screenshots with captions
- [ ] Prototype link + reproduction steps

### Consistency
- [ ] Pricing matches app (`pricingPlans.ts`) and `docs/pricing/pricing-strategy.md`
- [ ] No claim of features not in build (sandbox, real Stripe, ATS sync)
- [ ] Same team names on report, slides, and Classroom

### Logistics
- [ ] Uploaded to **Google Classroom** by **June 3**
- [ ] Prototype link works on jury machine (test without local `.env`)
- [ ] Pitch slides ready for **June 7** upload
- [ ] Rehearse **10 min** timing — `Session3_10min_Pitch_Deck.md` timing table

---

## 10. Sources referenced in course materials

**In repo:**
- `course/sessions/Session4_PitchAndRehearsal_NextU_2026.pdf`
- `course/sessions/Session3_BusinessModelAndRisk_NextU_2026.pdf`
- `course/sessions/Session3_Workshop_Checklist.md` (links to e.g. Lattice PEPM, market research URLs)

**Not in repo — verify locally:**
- `course/LXP BOSTON_AI_for_Impact_ESCEN.docx` (main assignment / rubric)
- Project assignment PDF (`course/README.md`)

**Instructor contact (Session 4):** deepak@next-u.fr

---

## Changelog

| Date | Note |
|------|------|
| 2026-06-02 | Initial consolidation from repo docs + Session 3–4 PDFs |
