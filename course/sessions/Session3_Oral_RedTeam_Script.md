# Session 3 — Oral Red-Team Script (SkillProof)

Use this as a speaking guide for the **10-minute red-team round**.

---

## 1) Live Demo (what to show and say)

### Problem Brief (2–3 min)

- Junior tech hiring is broken by **volume + low signal**:
  - too many applications,
  - CVs look similar,
  - screening is slow and inconsistent.
- HR teams spend weeks filtering noise instead of interviewing the right candidates.
- Hiring managers lack defensible evidence for who to advance.
- Current substitutes (CV triage, generic tests, spreadsheets) do not solve role-specific proof at scale.

**One-liner:**  
“We help HR turn messy junior applications into a verified, interview-ready shortlist.”

---

### Solution Spec (2–3 min)

- SkillProof is a B2B workflow for companies **50–500 employees** hiring junior tech talent.
- Core flow:
  1. Improve job posting quality (AI listing check),
  2. Generate role-specific assessments (coding + MCQ),
  3. Candidates complete practice or application tests,
  4. AI grades with rubric-based evidence,
  5. HR gets ranked shortlist + decision support.
- Differentiation:
  - tests are generated from the **actual job ad**,
  - practice and application sets are **separate** (anti-cheat),
  - scoring is transparent and explainable (not opaque “match %”).

**One-liner:**  
“We are not just another coding test — we connect job quality, assessment, and evidence-based ranking in one workflow.”

---

### v0 Prototype (3–4 min)

**Show this path live:**

1. HR creates/publishes a junior role (e.g., frontend / WordPress).
2. Run **Check listing** → show AI issues + skills matrix.
3. Show **candidate profile requirements** before apply.
4. Start **practice test** (different questions) vs **application test**.
5. Submit assessment → show grading status/result.
6. Open HR results view → ranked candidate with dimension scores and recommendation.
7. Mention candidate notifications for interview/declined decisions.

**Demo talking points while clicking:**

- “This is the pain point: unclear junior ads attract wrong applicants.”
- “Here we generate role-calibrated assessments, not generic templates.”
- “Candidates can practice first, but the real application uses a different question set.”
- “HR gets a defensible shortlist with evidence, not just keyword filtering.”

---

## 2) Attack three things (what peers will challenge + your answers)

### A) Market claims (defend TAM/SAM/SOM + segment)

**They may attack:** “Your market numbers are too big / not sourced enough.”

**Your response bullets:**

- We present TAM/SAM/SOM as **scenario ranges**, not single fake-precision numbers.
- ICP is explicit: worldwide, **50–500 employees**, junior tech hiring.
- Base case:
  - TAM ≈ **USD 5.25B ARR**,
  - SAM ≈ **USD 1.84B ARR**,
  - SOM (12–24 months) ≈ **USD 9.2M ARR**.
- We anchor pricing with HR software benchmarks and tiered subscription by company size.
- Early focus is narrow execution (founder-led pilots), not “capture all global HR software.”

**Strong closing line:**  
“We are not claiming we own all HR tech — we are claiming a focused wedge in junior hiring evidence.”

---

### B) AI necessity argument (defend why AI is required)

**They may attack:** “If GPT is free tomorrow, your product dies.”

**Your response bullets:**

- Our edge is **workflow + evidence + outcomes**, not raw model access.
- Without AI, product becomes manual templates + static tests — still useful, but much slower and less adaptive.
- AI unlocks:
  - **Quality:** role-aligned assessments and rubric consistency,
  - **Speed:** faster job-to-shortlist cycle,
  - **Efficiency:** less recruiter screening labor,
  - **Safety:** auditable decision trail,
  - **New opportunity:** rigorous junior screening for smaller teams.
- Commoditization risk exists only if we stop proving measurable hiring ROI.

**Strong closing line:**  
“Free models compress generic AI features; they do not replace a hiring workflow product with defensible outcomes.”

---

### C) Customer economics (defend pricing, CAC, unit economics)

**They may attack:** “Why would anyone pay? CAC looks too high.”

**Your response bullets:**

- Buyer is usually **HR lead / founder**, users are recruiters + hiring managers.
- Pricing: annual subscription by company size:
  - 50–100: USD 3k–5k,
  - 100–250: USD 7.5k–12k,
  - 250–500: USD 15k–25k.
- Willingness-to-pay comes from replacing:
  - manual screening hours,
  - fragmented tools,
  - low-quality interviews with weak candidates.
- Cheapest WTP test: **paid pilots** (10 companies, one role each, track pilot-to-paid conversion).
- GTM motion: hybrid **product-led + sales-assisted** (not pure enterprise sales yet).
- Unit economics goal: improve gross margin via model routing/cost controls and reduce CAC through case studies/referrals.

**Strong closing line:**  
“We price below full ATS transformation, above basic test tools, because we save measurable screening time and improve shortlist quality.”

---

## 3) One specific suggestion to give other teams (example format)

Use this sentence template:

> “This would be stronger if you researched or tested **[X]** by next week.”

### Good suggestions you can use (pick one relevant to their pitch)

- “…if you validated **pilot-to-paid conversion** with 10 real HR buyers.”
- “…if you tested **time-to-shortlist reduction** on one live role with before/after data.”
- “…if you benchmarked pricing against 3 direct competitors in your ICP segment.”
- “…if you measured **grading consistency** across 50 submissions for one role type.”
- “…if you ran a workflow adoption test with both recruiter and hiring manager in the same pilot.”

### Suggestion you can give if asked about SkillProof (meta)

- “This would be stronger if you ran 10 paid pilots and reported conversion + ROI metrics, not only product demos.”

---

## 4) 10-minute timing plan (recommended)

| Block | Time | Focus |
|---|---:|---|
| Problem brief | 2 min | Pain, urgency, who suffers |
| Solution spec | 2 min | Workflow + differentiation |
| Live demo | 4 min | End-to-end happy path |
| Defense prep line | 1 min | “Happy to be challenged on market, AI necessity, economics” |
| Q&A buffer | 1 min | Short, confident answers |

---

## 5) Closing sentence (use at the end)

“We know the risks — willingness to pay, AI reliability, and workflow adoption — and we are validating them through paid pilots with explicit ROI metrics, not assumptions alone.”

---

## 6) Quick backup numbers (if challenged live)

- **Segment:** worldwide, 50–500 employees, junior tech hiring.
- **TAM / SAM / SOM (base):** USD 5.25B / USD 1.84B / USD 9.2M ARR.
- **Top risks + likelihood:**
  - Market WTP: **4/5**,
  - Technical pipeline fragility: **3/5**,
  - Adoption/workflow change: **4/5**.
- **Trade-off owned:** quality-at-speed with targeted human review on low-confidence cases.
