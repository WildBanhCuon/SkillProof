# Claude prompt — SkillProof final pitch slides (10 min)

Copy everything below the line into Claude (or attach this file + screenshots from the running app).

**Already have a deck but it’s too crowded?** Use [Session4_Claude_Slides_Minimalist_Revision_Prompt.md](./Session4_Claude_Slides_Minimalist_Revision_Prompt.md) instead.

**Sources used:** `Session4_PitchAndRehearsal_NextU_2026.pdf`, `Session3_10min_Pitch_Deck.md`, `docs/pricing/pricing-strategy.md`, app design system.  
*(The ESCEN course docx was not in the repo; Session 4 PDF deliverables apply: Final Prototype + Report, Pitch Slides, oral presentation.)*

---

## PROMPT (copy from here)

You are an expert presentation designer and startup pitch coach. Create a **complete slide deck** for a **10-minute oral pitch** (Year 5 final project, ESCEN / Next-U **AI for Impact · Boston LXP 2026**). The product is **SkillProof** — a B2B SaaS for junior tech hiring.

### Grading context (what the jury expects)

Follow the **8-slide anatomy** from our workshop (~10 min + Q&A):

| # | Slide | Target time |
|---|--------|-------------|
| 1 | Title & Hook | 30 s |
| 2 | Problem | 60 s |
| 3 | Solution | 60 s |
| 4 | Demo | 2–3 min *(live in room — slide is setup only)* |
| 5 | Why AI | 60 s |
| 6 | Market & Business Model | 90 s |
| 7 | Risks & Trade-offs | 60 s |
| 8 | Ask & Path Forward | 30 s |

**Slide design rules (mandatory):**
- One big idea per slide — not walls of bullets.
- **18pt minimum** body text, **32pt minimum** titles (when exported to slides).
- Prefer **one image, one chart, or one big number** per slide over bullet lists.
- **Do not** use generic AI/robot stock photos, LinkedIn-style team photos, or 12pt text.
- Slides support the speaker — **speaker notes** under each slide (what to say, not full script on slide).
- Include **placeholders** for app screenshots: `[SCREENSHOT: HR results dashboard]`, etc.
- **16:9** aspect ratio, export-ready structure (Google Slides / PowerPoint / PDF).

**Avoid:** reading bullets verbatim; fake “match %” language; claiming we replace full ATS.

---

### Visual identity — MUST match the SkillProof app UI

Design the deck to look like the product (clean B2B SaaS: Linear / Notion / Greenhouse tone).

| Token | Value | Usage |
|--------|--------|--------|
| **Primary** | Indigo `#4F46E5` | Titles accent, buttons, links, key numbers |
| **Primary hover** | `#4338CA` | Optional emphasis |
| **Background** | White `#FFFFFF` and light `#F8FAFC` (slate-50) | Alternate slides |
| **Dark sections** | `#0F172A` (slate-900) | Optional title or closing slide |
| **Headings** | `#0F172A` | Main titles |
| **Body** | `#475569` | Subtext |
| **Muted** | `#64748B` | Captions, footnotes |
| **Success** | Emerald green | “Ready now”, high scores |
| **Warning** | Orange/amber | “Trainable”, flags |
| **Risk** | Red | “At risk”, seniority flags |
| **Info / AI** | Blue tint cards | AI insight callouts |
| **Font** | **Inter** (or closest available) | All text |
| **Radius** | 8px on cards and buttons | UI mockup frames |
| **Layout** | Generous whitespace, subtle `border-slate-200`, soft shadow only on product mockups |

**Brand:**
- Wordmark: **SkillProof** — emphasize “Proof” in indigo or full indigo mark + dark text.
- Tagline on title slide: *“Too many applicants. Not enough proof.”*
- Eyebrow pill style (optional): small indigo-100 background, indigo-700 text — “AI-assisted junior hiring”.

**UI motifs to echo in slides:** card-based layouts, indigo primary buttons, score badges, dimension/radar charts, ranked candidate list, job listing check flags (severity colors).

---

### Product truth (do not invent features we don’t have)

**SkillProof** helps HR teams (50–500 employees) for **junior tech roles** (frontend, WordPress, etc.):

1. **Job Ad Upgrade Studio** — AI flags unrealistic/vague job ads + skill matrix.
2. **Role-specific assessments** — generated from *this* job (coding + MCQ), not a static test bank.
3. **Practice vs application tests** — different question sets (anti-cheat).
4. **Rubric-based grading** — Gemini AI + deterministic MCQ; dimension scores 0–5, evidence cited — **no fake match %**.
5. **HR dashboard** — ranked shortlist, recommendations (ready now / trainable / at risk), interview questions.
6. **Candidate feedback** — structured rejection feedback.
7. **Demo subscription checkout** in app (plan tiers) — real payments not implemented.

**Tech (for “Why AI” slide):** Google **Gemini 3.1 Flash Lite**; NestJS + React + PostgreSQL; grading is **AI-only** (no live code sandbox in current MVP).

**Out of scope (say we cut it):** full ATS, job marketplace, Skills Passport across employers.

---

### Slide-by-slide content to include

#### Slide 1 — Title & Hook (30s)
- **Title:** SkillProof
- **Hook (big on slide):** “Too many applicants. Not enough proof.”
- Sub: Verified junior tech hiring — from messy applications to defensible shortlists.
- Optional: one hero product mockup frame (dashboard preview).
- **Speaker note:** 5-second catch phrase for jury.

#### Slide 2 — Problem (60s)
- **One persona:** Marion — Head of Talent, ~80-person scale-up, flooded when posting one junior role.
- **3 pains (visual, minimal text):**
  - 200–500+ applications, CVs look the same
  - Weeks screening noise; gut-feel decisions
  - AI-on-CV tools still learn from past hires → bias risk; no skills proof
- **Big number:** e.g. “28–35 hours” manual screening per hire OR “60%” drop-off from bad job ads.
- **Speaker note:** “We don’t ask ‘does this CV look good?’ — we ask ‘can this person do the job?’”

#### Slide 3 — Solution (60s)
- **One sentence:** SkillProof = job quality → role-specific test → ranked evidence (wedge between ATS and interview).
- **3-step visual** (match app landing): (1) Upgrade job ad (2) Candidates prove skills (3) HR gets ranked shortlist.
- Icons: sparkle / clipboard / chart — indigo accent.
- **Speaker note:** Not replacing every HR tool.

#### Slide 4 — Demo (2–3 min live)
- **Slide title:** Live demo
- **Checklist only** (large, readable) — jury watches screen, not dense text:
  1. HR: published junior role → Check listing + skills matrix
  2. Candidate: apply → profile → **practice** test (different questions)
  3. Candidate: **application** test → submit → graded result
  4. HR: ranked candidates + recommendation + evidence
- Footer: “Pre-loaded data · backup video ready”
- **Speaker note:** Narrate before/during/after each click; one memorable moment = ranked shortlist with rubric evidence.

#### Slide 5 — Why AI (60s)
- **Why impossible/worse without AI in 2026:**
  - Parse messy job ads at scale → skill matrix + calibrated assessment per role
  - Grade open-ended code + rubric consistently across 60+ submissions
  - LLM cost now viable (~$0.22/mo AI COGS at 10 jobs × 30 candidates — footnote small)
- **What stays human:** HR approves ad changes, publishes role, makes final hire decision (EU AI Act: high-risk → oversight).
- Visual: simple pipeline diagram (Job ad → Gemini → Assessment → Grade → Rank).

#### Slide 6 — Market & Business Model (90s)
- **Market (scenario-based):** TAM ~$5.25B · SAM ~$1.84B · SOM 12–24mo ~$9.2M ARR — wedge: junior hiring evidence, 50–500 emp.
- **Competitors (3 columns, not paragraph):**
  - ATS + AI CV screen — fast, CV-centric
  - Coding test platforms — annual lock-in, per-candidate fees at volume
  - Manual process — slow, not auditable
- **Our edge:** one workflow · practice≠application · explainable rubrics
- **Revenue:** Monthly subscription — active jobs + graded candidates/mo, unlimited seats.
- **Pricing table (from app):**

  | Tier | Size | Monthly | Jobs | Graded/mo |
  |------|------|---------|------|-----------|
  | Starter | 20–50 | €149 | 2 | 100 |
  | Growth | 50–100 | €299 | 5 | 300 |
  | Pro path | 250–500 | €899 | 20 | 2,000 |

  (Show Growth as “most popular” with indigo highlight.)

- **GTM one line:** Paid pilots €500–1,500 → Phase 1 founder outbound (0–20) → case studies (20–60) → referrals (60–100).

#### Slide 7 — Risks & Trade-offs (60s)
- **Table or 3 cards** — likelihood 1–5 + short mitigation:

  | Risk | L | Mitigation |
  |------|---|------------|
  | Market: no WTP | 4 | Paid pilots, ROI metrics |
  | Tech: AI quality/latency | 3 | Guardrails, monitoring, human review on low confidence |
  | Adoption: tool fatigue / ATS “good enough” | 4 | Wedge messaging, job-linked assessments |
  | Regulatory: EU AI Act (Aug 2026) | — | Disclosure, human oversight, documentation |

- **Trade-off we own:** Quality-at-speed — fast first pass, deeper review when uncertain.

#### Slide 8 — Ask & Path Forward (30s)
- **Ask (pick what fits your team):** e.g. “10 paid pilots with HR leads in 50–100 employee firms” OR “Introductions to Heads of Talent in EU scale-ups” — not vague “funding”.
- **Next 90 days:** ship pilot metrics (hours saved, shortlist quality), EU AI Act compliance checklist, ATS export.
- Closing line: “We know the risks — we’re validating with real pilots and measurable ROI.”
- Footer: ESCEN AI for Impact · Boston LXP 2026 · [Team names]

---

### Optional appendix slides (not counted in 10 min — for Q&A backup)

- A1: Unit economics (80%+ gross margin; AI COGS negligible)
- A2: Funnel math (250 applicants → ~60 graded)
- A3: Architecture one-liner (React + NestJS + Gemini)
- A4: Red-team answers (Why now? Why not free GPT? Why pay?)

---

### Output format

Deliver:

1. **Slide list** — for each slide: title, on-slide text (minimal), visual description, speaker notes (2–4 sentences).
2. **Design spec** — color hex codes, font sizes, layout grid (so we can rebuild in Google Slides/Figma).
3. **If you can generate visual slides:** provide as **HTML slides** (reveal.js or single-file) OR **structured JSON** for import — using the SkillProof design tokens above.
4. **Screenshot placement guide** — which 4–6 screens from the app to paste (HR jobs list, listing check, assessment, results rank, pricing page).

Do not hallucinate revenue we already achieved, customer logos, or live sandbox code execution. This is a **functional school prototype** with **demo billing**.

---

### Attachments to provide Claude (recommended)

When you run the prompt, also attach:
- 4–6 screenshots from `http://localhost:5173` (landing, HR job editor with listing check, candidate assessment, HR results).
- Logo PNG from `frontend/src/assets/` if available.
- This file or `Session3_10min_Pitch_Deck.md` for spoken timing.

---

## END PROMPT

### Quick timing rehearsal (10 min)

| Section | Min |
|---------|-----|
| Hook + Problem + Solution | ~2.5 |
| Demo (live) | ~3 |
| Why AI + Market/Business | ~2.5 |
| Risks + Ask | ~1.5 |
| Buffer / handoffs | ~0.5 |

Good luck on the oral.
