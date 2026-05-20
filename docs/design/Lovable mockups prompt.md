# SkillProof — Lovable prompt (English UI)

Copy everything below the line into Lovable as your initial project prompt.

---

## What to build

A **non-functional, high-fidelity UI prototype** for **SkillProof** — visual design and user workflow only. No real AI, APIs, auth, or code execution. Buttons may navigate between screens; all data is **hardcoded placeholders**.

**Language:** All UI copy in **English**.

**MVP role:** Junior Frontend Developer only.

---

## End-to-end user workflow (this is the story the prototype must tell)

```
HR (company)                          Candidate                    HR (company)
─────────────────────────────────────────────────────────────────────────────────

1. Write a new job listing
   (free-text editor)

2. Click "Check listing"
   → AI surfaces issues
   (incoherence, unrealistic reqs,
   vague responsibilities, etc.)
   [design-only — panel appears
   with pre-written feedback]

3. Fix listing → Publish
   → AI auto-generates a skill test
   (questions matched to the ad)
   [implied between steps — no
   backend; optional toast or
   "Assessment ready" if needed]

4. Share posting / candidates apply
                                    5. Candidate takes the test
                                       (proves skills on role-
                                       relevant questions)

                                                                  6. HR opens results dashboard
                                                                     → sees scores & rankings
                                                                     → quickly spots the most
                                                                       skilled candidates
```

**Three main screens** map to steps **1–2**, **5**, and **6**. Step 3 can be a success state on Screen 1 (e.g. after **Publish listing**, show a brief inline banner: *"Assessment generated — 4 questions ready"*) or a simple modal — still static, no logic.

---

## Design system (match reference mockups)

| Token | Value |
|--------|--------|
| Primary | Indigo ~`#4F46E5` (primary buttons, active nav, progress) |
| Background | White + page gray ~`#F8FAFC` |
| Text | Headings `#0F172A`, secondary `#64748B` |
| Success | Green — high scores, "Ready now", Published |
| Warning | Orange — "Trainable", flags |
| Risk | Red — "At risk", must-have badges |
| Info | Blue — AI insight cards |
| Font | Inter (or similar) |
| Radius | ~8px cards/buttons |
| Style | B2B SaaS — clean cards, subtle borders, generous whitespace |

**HR screens (1 & 3):** Top nav — **SkillProof** · **Jobs** · **Candidates** · **Tests** · **Analytics** · user **Marie D. · HR Manager**

**Candidate screen (2):** Minimal chrome — logo, timer, Exit test (no HR nav).

---

## Screen 1 — Create job listing & check with AI (HR)

**Route:** `/jobs/new` or `/jobs/create`

**Purpose:** Company drafts a new offer, then runs an AI **check** to catch problems before publishing.

### Default state (step 1 — writing)

- Page title: **Create job posting**
- Subtitle: *Junior Frontend Developer · Draft*
- **JOB DESCRIPTION** — large text area with formatting toolbar (visual only)
- Pre-filled sample text for a junior frontend role (React, TypeScript, Git, agile). Include **intentional flaws** for the AI to flag later, e.g.:
  - "3+ years of professional experience required" on a junior title
  - Vague line: "Must be passionate about code"
  - Mix of senior tools (Kubernetes) with junior level
- Word count: e.g. **342 words**
- Footer actions:
  - **Save draft** (outline)
  - **Check listing** (primary indigo) ← main CTA; clicking switches to "checked" state below

### Checked state (step 2 — after "Check listing")

Same page layout; **right column appears** (or becomes visible):

- Section: **AI ANALYSIS** with badge **AI Assistant**
- Insight cards (static copy):
  1. **Orange** — *Requirement may be too senior* — references the "3+ years" line
  2. **Blue** — *Vague responsibilities* — suggests concrete deliverables
  3. **Orange** — *Inconsistent seniority* — junior title vs senior stack (Kubernetes)
  4. **Blue** — *Too many mandatory skills* — recommends nice-to-have split
- Button: **Apply suggestions** (secondary — no real edit; optional)
- Button: **View improved version** (outline — optional)

**Below editor + analysis — SKILLS MATRIX** (full width)

Shows skills extracted from the listing (static table):

| Skill | Importance | Expected level | Testable? |
|-------|------------|----------------|-----------|
| React | Must-have | Junior | ✓ |
| TypeScript | Must-have | Junior | ✓ |
| HTML/CSS | Must-have | Junior | ✓ |
| REST APIs | Nice-to-have | Beginner | ✓ |
| Kubernetes | Nice-to-have | Beginner | ✗ |
| Git | Must-have | Junior | ✓ |

**Footer (checked state):**
- **Back** (outline)
- **Publish listing** (primary indigo)

**After Publish (optional micro-state):** Green banner at top: *"Listing published · AI generated 4 assessment questions"* — then demo can jump to Screen 3 or Screen 2.

**Important:** Do not implement real AI. Toggling "Check listing" only reveals the pre-built analysis panel (CSS/state toggle or route query `?checked=true`).

---

## Screen 2 — Candidate skill test (candidate)

**Route:** `/assessment` or `/test/demo`

**Purpose:** Candidate proves skills on questions **generated from the job listing** (explain in UI subtitle: *"Based on Acme Corp — Junior Frontend Developer posting"*).

**Header:** Logo · timer **01:24:37** · **Exit test**

**Context bar:**
- **Junior Frontend Developer** @ **Acme Corp**
- **90 min** · **4 questions** · **100 points**
- Progress: **Question 2 of 4** + indigo progress bar

**Left sidebar**
- Question list (AI-generated labels, static):
  1. React component ✓
  2. API integration *(active)*
  3. State management
  4. Debugging scenario
- **What we evaluate:** Logic · Code quality · Communication (mini bars)

**Main area**
- **2. API INTEGRATION** · **40 pts**
- Tabs: **Instructions** | **Documentation**
- Bullet instructions (fetch users API, error handling, list UI)
- Mock **code editor** (dark, read-only `App.jsx` snippet)

**Footer:** **Previous question** · **Next question**

No runnable code — editor is decorative only.

---

## Screen 3 — Candidate results & rankings (HR)

**Route:** `/jobs/:id/results` or `/candidates`

**Purpose:** Company reviews test outcomes and **quickly identifies the most skilled candidates** — sorted/ranked by verified score, not CV keywords.

**Header:**
- **Junior Frontend Developer**
- Badge: **Published**
- **Share posting** · **View posting**

**Stats row**
| Applications received | Tests completed | Verified matches | Top performers |
|----------------------|-----------------|------------------|----------------|
| 248 | 142 | 78 | 18 |

**Filter / sort bar**
- Sort dropdown (default): **Highest score**
- Tabs: **All** · **Ready now** · **Trainable** · **At risk**
- Search: *Search candidates…* · **Filters**

**Ranked candidate cards** (best first — Yasmine on top)

Each card = one row, rich but scannable:

| # | Name | Overall score | Match | AI recommendation |
|---|------|---------------|-------|-------------------|
| 1 | Yasmine B. | **92/100** | 88% | **Ready now** (green) |
| 2 | Lucas M. | **78/100** | 71% | **Trainable** (orange) |
| 3 | Emma T. | **61/100** | 58% | **At risk** (red) |

Per card include:
- Avatar, location, education
- **Radar chart:** Technical · Problem solving · Code quality · Communication
- **Strengths** / **Areas to improve** (bullets)
- One-line AI summary: *"Strong React fundamentals; ready for interview"*
- **View details** (outline)

**Visual hierarchy:** #1 candidate card slightly emphasized (border or "Top match" badge) so HR instantly sees the best profile.

Pagination: `1 2 3 … 15`

Nav: **Candidates** active.

---

## Prototype navigation (workflow demo)

Add a small **flow nav** on `/` or fixed corner to walk the story:

1. **Create & check listing** (Screen 1 — show both draft and checked if possible via two links)
2. **Take assessment** (Screen 2)
3. **View results** (Screen 3)

Suggested click path for pitch demo:
**Check listing** → review AI issues → **Publish listing** → (optional banner) → open **Results** → highlight top candidate.

---

## Do NOT build

- Real AI / LLM calls
- Working rich-text or code editor
- Code sandbox, test grading logic, databases
- ATS, auth, payments, multi-role support
- Mobile layout (desktop 1440px)

---

## Quality bar

- Looks like a real product; behaves like a slide deck (clicks change screens/states only)
- Workflow is obvious in 30 seconds without explanation
- English throughout
- Screenshots ready for Figma import and course pitch
