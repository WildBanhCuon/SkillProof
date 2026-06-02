# SkillProof — Pricing strategy

Monthly **subscription** tiers based on **company size**, **active job slots**, and **graded candidate volume**.  
Research source: Gemini deep research (mid-2026) + internal API measurements.

Related: [course/sessions/Session3_Workshop_Checklist.md](../../course/sessions/Session3_Workshop_Checklist.md), [project brief](../brief/project%20brief.md).

**FX assumption (research):** 1 EUR ≈ 1.08 USD.

**Current product (codebase):** Grading is **AI-only** — MCQ auto-scored locally, code/text answers graded by **Gemini** on submit. **Judge0 / sandbox execution was removed** (`backend/prisma/migrations/20260520140000_remove_sandbox`). Infra COGS below reflects this stack, not the sandbox assumed in the original research report.

---

## Executive summary

| Topic | Conclusion |
|-------|------------|
| **Positioning** | Wedge between ATS and interview: job quality → role-specific assessment → ranked evidence — not a full ATS. |
| **Pricing anchor** | Value = recruiter labor replaced (~€800–1,575/hire top-of-funnel), **not** Gemini COGS. |
| **Competitor gap** | ATS assessment features often need expensive tier upgrades; assessment tools use annual lock-ins and punitive per-candidate fees at volume. |
| **COGS** | AI ~$0.22/mo at 10 jobs × 30 graded candidates; infra ~€10–20/customer/mo baseline. Margins **80%+** at tier quotas. |
| **Model** | Capacity-based monthly tiers (active jobs + graded candidates); **unlimited recruiter seats** recommended. |
| **Tiers (proposal)** | Starter €149 · Growth €299 · Scale €549 · Pro €899. |
| **PEPM floor ($19–26)** | **Rejected** for this product — misaligned with point-solution TA tools. |
| **Old annual tiers ($3k–25k)** | **Revised** — too high for standalone SMB wedge; target ~€1.5k–10k/year via monthly tiers. |
| **Paid pilots** | **Validated** — €500–1,500 / 2–4 weeks. |
| **Top risk** | EU AI Act (high-risk employment AI; enforceable Aug 2, 2026) + ATS “tool fatigue”. |

---

## Facts vs recommendations

| Type | Item |
|------|------|
| **Fact** | Google paid-tier list price for `gemini-3.1-flash-lite`: **$0.25 / 1M input**, **$1.50 / 1M output** (standard processing). |
| **Fact** | Junior tech postings often attract **150–500+** applicants; manual screen ~**23–35 h** per mid-volume hire. |
| **Fact** | **42%** abandon slow processes; **70%** abandon if application **>15 min** or mandatory account creation. |
| **Fact** | EU AI Act classifies **employment selection AI** as **high-risk** (Annex III). |
| **Recommendation** | Monthly subscriptions (not annual-only like some assessment vendors). |
| **Recommendation** | Gate on **active job slots + graded candidates**, not seats. |
| **Recommendation** | Overage fees for **tier segmentation**, not COGS recovery. |
| **Recommendation** | Market **role-specific assessments + rubric-based AI grading** vs generic ATS resume screeners (re-add live code sandbox only if buyers require it). |

---

## Hypothesis validation

| Hypothesis | Status | Notes |
|------------|--------|-------|
| Price between lightweight screening and full ATS | **Validated** | Wedge ~€150–550/mo vs ATS upgrades and $1,620+/yr assessment tools. |
| Annual tiers 50–100 → $3k–5k … 250–500 → $15k–25k | **Challenged** | Standalone screening wedge should not match enterprise ATS ACV; use monthly MRR ~€149–899. |
| HR PEPM $19–26 as floor | **Rejected** | PEPM fits HRIS (Lattice, BambooHR), not tools used by few TA users. |
| Paid pilots $500–1,500 | **Validated** | Under discretionary budget; proves ROI before annual commit. |

---

## Gemini API costs (measured)

**Model:** `gemini-3.1-flash-lite` (via `GEMINI_MODEL` in `backend`).

**Official list price (paid tier):** $0.25 / 1M input · $1.50 / 1M output — [Google AI pricing](https://ai.google.dev/gemini-api/docs/pricing).

**Source:** Point-in-time measurements from production-like flows. Re-measure if model, prompts, or pipelines change.

| # | Pipeline | When it runs | Input tokens | Output tokens | Total tokens | Cost (USD) |
|---|----------|--------------|-------------:|--------------:|-------------:|-----------:|
| 1 | Company profile — “About us” with AI | On company creation / account setup | 1,417 | 78 | 1,495 | $0.000471 |
| 2 | Job offer — guided setup | Creating a job via guided setup | 657 | 456 | 1,113 | $0.000848 |
| 3 | Job listing check | After listing is entered / on “Check listing” | 934 | 321 | 1,255 | $0.000715 |
| 4 | Assessment generation | On publish (generate assessment) | 1,515 | 1,007 | 2,522 | $0.00188925 |
| 5 | Session grading | When a candidate applies and results are graded | 746 | 288 | 1,034 | $0.0006185 |

### Derived cost per workflow

| Workflow | Calls included | Cost (USD) |
|----------|----------------|------------:|
| One-time company onboarding (About us AI) | #1 only | **$0.000471** |
| One job — create + check + publish assessment | #2 + #3 + #4 | **$0.003452** |
| One candidate — graded submission | #5 only | **$0.000619** |

```
monthly_AI_USD ≈ (jobs_created × $0.003452) + (graded_submissions × $0.000619) + (new_companies × $0.000471)
```

Add **~10–20% buffer** for retries. Listing check (#3) assumed **once per publish path** (re-checks cost extra).

| Jobs / month | Graded submissions | Job + grading AI (USD) |
|-------------:|-------------------:|-----------------------:|
| 2 | 30 | ~$0.025 |
| 5 | 100 | ~$0.079 |
| 10 | 300 | ~$0.220 |
| 20 | 1,000 | ~$0.688 |

**Strategic note:** Pricing must **not** be cost-plus on API usage; even 10× Google price increase stays negligible vs subscription revenue.

### Infrastructure COGS (estimates)

*No Judge0 or third-party code runner — removed from product.*

| Component | Indicative cost | Notes |
|-----------|-----------------|-------|
| **Cloud (Postgres, Redis, API hosting, storage)** | ~€8–30/mo per active SMB tenant (amortized) | Shared app + DB; scales with candidate volume (answers, sessions) |
| **Baseline COGS (no support)** | ~€8–25/customer/mo | Lower than research estimate that included Judge0 (~€27/mo platform-wide). Excludes payment fees, CS, legal/compliance |

**Optional future COGS:** If live code execution returns (Judge0, Piston, self-hosted worker), budget ~€25–50/mo platform baseline + per-run overage — revisit tiers before launch.

Not yet measured in-app: listing rewrite (“Apply suggestions”), extra listing checks.

---

## 1. Competitor and substitute pricing

*Indicative ranges from public pricing / market research (mid-2026). Verify before sales collateral.*

### A. ATS with screening (low overlap — system of record)

| Product | Model | Indicative range | SkillProof overlap | Notes |
|---------|-------|------------------|-------------------|-------|
| **Workable** | Subscription by tier | $189–299/mo Standard; **$599/mo Premier** for native assessments + video | Low | Assessment premium ~$300/mo jump |
| **Recruitee** | By active jobs / features | €270 / $224 Launch (≤10 jobs); $349–451 Scale/Advance | Low–medium | Assessments via integrations, not native sandbox |
| **Teamtailor** | Quote by size | ~$229/mo (~$2.75k/yr) to enterprise | Low | AI job copy; external partners for tech tests |
| **Greenhouse** | Annual quote | $6k–15k/yr Essential; $25k+ Advanced | Low | Marketplace integrations for screening |

**Implication:** Keep affordable ATS; add SkillProof as technical wedge vs $6k+ assessment upgrades.

### B. Technical assessment (high overlap)

| Product | Model | Indicative range | SkillProof overlap | Notes |
|---------|-------|------------------|-------------------|-------|
| **TestGorilla** | Annual + credits | $1,620/yr Core (400 credits); **$4,800/yr+** for custom coding | High | No monthly; credits don’t roll over |
| **HackerRank** | Monthly + limits | $165–199 Starter (10 attempts/mo); $375–449 Pro (25/mo); **$15/overage** | High | Punitive at junior volume |
| **Coderbyte** | Flat monthly | **$199/mo** unlimited (admins, candidates, tests) | High | Budget SMB benchmark |
| **Codility** | Annual | From ~$1,200/yr; enterprise custom | Medium | Senior / work-sample focus |

**Implication:** Compete on **predictable high-volume** grading vs per-candidate overage and annual lock-in.

### C. AI screening / async video (medium overlap on “automation” budget)

| Product | Model | Indicative range | SkillProof overlap | Notes |
|---------|-------|------------------|-------------------|-------|
| **Hireflix** | Monthly | $75–150/mo unlimited async video | Low | Commoditized capture; weak tech depth |
| **Sapia.ai** | Enterprise / per user | ~$5–15/user/mo at scale | Medium | AI chat + explainable scoring |
| **Willo** | Monthly | $233–399/mo | Low | Video + ID + ATS integrations |

**Implication:** Sell **evaluation + ranking + code proof**, not passive data collection.

### D. Manual substitute (value anchor)

| Activity | Time (per hire, mid-volume) |
|----------|----------------------------|
| Resume screen (~300 CVs × 2–3 min) | 10–15 h |
| Phone screens (~40 × 25 min) | 16–17 h |
| Scheduling / admin | 2–4 h |
| **Total** | **~28–35 h** |

**Loaded recruiter cost:** ~€40–50/h (EU mid-level TA, loaded).

| Scenario | Labor cost / hire |
|----------|------------------:|
| Conservative (20 h × €40) | **€800** |
| Base (35 h × €45) | **€1,575** |

### Sales pricing anchors

1. **Labor recapture** — “~€1,200 invisible labor per junior role vs a few hundred €/mo on SkillProof.”
2. **Predictability** — “No $15/candidate overage when a post gets 300 applicants.”
3. **Upgrade avoidance** — “Don’t buy a $6k/yr ATS tier just for legacy assessments.”

---

## 2. Jobs per customer (usage assumptions)

*“Jobs/month” = **concurrent active job slots**, not necessarily new requisitions created.*

| Segment | Employees | Persona | Jobs/mo (low / base / high) | Jobs/year | Rationale |
|---------|------------|---------|----------------------------|-----------|-----------|
| Startup | 20–50 | Founder / ops | 1 / 2 / 4 | 15–30 | Funding-driven hiring spikes |
| Growth SMB | 50–100 | First internal recruiter | 2 / 4 / 6 | 30–50 | ~7 hires/quarter; 3–5 open reqs |
| Mid-market | 100–250 | TA director | 3 / 6 / 10 | 50–90 | Structured pipeline; partial tech share of 101–250 hires/yr |
| Upper-mid | 250–500 | VP HR / tech recruiters | 5 / 10 / 15 | 80–130 | Turnover + grad/bootcamp cohorts |

**Context:** ~45% of developers tenure 1–2 years → continuous backfill. ~47% of companies ≤250 employees make 0–25 total hires/year.

**Product implication:** **Monthly** billing fits seasonal hiring; annual-only hurts startups that hire 3 months/year.

---

## 3. Candidates per offer (junior tech funnel)

*Base case for COGS and tier sizing: **~60 graded submissions per job**.*

| Metric | Low | Base | High | Notes |
|--------|-----|------|------|-------|
| Applicants per posting | 100 | 250 | 500+ | Junior tech glut 2026 |
| Pass initial resume/ATS filter | 30% | 40% | 50% | AI-tailored CVs inflate pass-through |
| Start assessment (of invited) | 50% | 65% | 80% | Fatigue; account creation kills conversion |
| Complete & graded | 45% | 60% | 96% | Short in-browser tests vs long take-homes |
| **Graded submissions / job** | **14** | **60** | **240** | Base: 250 → ~100 start → 60 complete |

**UX priorities (conversion):** no mandatory candidate account where possible; assessment **<45 min**; friction is a **quality filter** for spray-and-apply bots.

**Confidence:** completion rates are **moderate** — validate with MVP telemetry.

---

## 4. Proposed monthly subscription tiers

Gate on **active job slots** + **graded candidates/month**. **Unlimited HR/hiring-manager seats** (recommended).

| Tier | Target size | Monthly (EUR) | Monthly (USD) | Annual prepay (EUR, −20%) | Active jobs | Graded candidates/mo | Overage |
|------|-------------|--------------:|--------------:|--------------------------:|------------:|---------------------:|---------|
| **Starter** | 20–50 | €149 | ~$160 | ~€1,430 | 2 | 100 | €25/job · €1.00/candidate |
| **Growth** | 50–100 | €299 | ~$320 | ~€2,870 | 5 | 300 | €20/job · €0.75/candidate |
| **Scale** | 100–250 | €549 | ~$590 | ~€5,270 | 10 | 800 | €15/job · €0.50/candidate |
| **Pro** | 250–500 | €899 | ~$970 | ~€8,630 | 20 | 2,000 | Custom |

**Positioning vs competitors**

| Tier | vs market |
|------|-----------|
| Starter | Under TestGorilla annual minimum; low-friction vs $1,620/yr lock-in |
| Growth | Parallels Workable/Recruitee entry (~€270–299) as **add-on wedge** |
| Scale | vs HackerRank Pro (~$449 for **25** attempts) — **800** graded candidates |
| Pro | Below legacy enterprise assessment negotiations ($20k+) |

### Unit economics at 100% quota

Assumptions: AI COGS from formula + **15%** buffer; infra **€10** base + **€5 per 100** candidates; support **€10–60** by tier.

| Tier | Revenue (€) | Jobs | Candidates | AI (€) | Infra (€) | Support (€) | Contribution (€) | Gross margin |
|------|------------:|-----:|-----------:|-------:|----------:|------------:|-----------------:|-------------:|
| Starter | 149 | 2 | 100 | ~0.08 | 15 | 10 | ~124 | **~83%** |
| Growth | 299 | 5 | 300 | ~0.23 | 25 | 15 | ~259 | **~87%** |
| Scale | 549 | 10 | 800 | ~0.61 | 50 | 30 | ~468 | **~85%** |
| Pro | 899 | 20 | 2,000 | ~1.50 | 110 | 60 | ~728 | **~81%** |

Overage revenue not included. **Compliance/legal opex** (EU AI Act) not in gross margin — significant at company level.

### Prior course annual tiers (superseded for SMB wedge)

| Employees | Old annual (USD) | Research view |
|------------|-----------------|---------------|
| 50–100 | 3k–5k | Replace with **Growth** ~€2.9k/yr prepay |
| 100–250 | 7.5k–12k | **Scale** ~€5.3k/yr more realistic for point solution |
| 250–500 | 15k–25k | **Pro** ~€8.6k/yr unless enterprise bundle |

---

## 5. Sensitivity and risks

### Usage spikes (2× jobs, 3× candidates)

| Impact | Assessment |
|--------|------------|
| AI COGS | Negligible (e.g. €0.23 → ~€0.65 at 1,000 grades) |
| Infra | Mainly DB/API load; no sandbox runner — monitor storage and API CPU |
| Revenue | **Must enforce overage** or customers won’t upgrade tiers |

### Willingness-to-pay

| Objection | Mitigation |
|-----------|------------|
| “Our ATS already has AI screening” | Prove **job-linked assessments** + rubric evidence vs keyword/resume AI |
| Tool fatigue / another vendor | Wedge messaging: keep ATS, add SkillProof only for junior **proof** |

### EU AI Act (high-risk employment AI)

- Enforceable **Aug 2, 2026** for Annex III recruitment/selection systems.
- Requires documentation, bias testing, logging, **human oversight**, candidate disclosure.
- Compliance cost may exceed compute — plan legal/product budget (not in tier COGS table).

### Google model pricing risk

- 10× API price increase still small vs €299/mo tier.
- Mitigation: abstract LLM provider; fallback models (e.g. Groq/Mistral) if needed.

---

## 6. Open questions (customer interviews)

Validate with **5–10** interviews (Head of Talent, HR Director, hiring managers; 50–500 employees).

1. **Volume caps vs overage** — If a viral post exceeds graded quota, pause the link or auto-charge €0.75/candidate?
2. **Wedge UX** — Pain of external assessment link after ATS apply; talent drop-off risk?
3. **Code execution necessity** — Is AI-graded code submission (no runner) enough for juniors, or do buyers require **live execution** (would reintroduce sandbox COGS)?
4. **EU AI Act** — What docs/audits does legal need to approve AI grading?
5. **Paid pilot** — Would they authorize **~€1,000 / 1 month** to automate one junior cohort vs agency cost?

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-31 | Initial Gemini per-pipeline measurements recorded |
| 2026-05-31 | Model corrected to `gemini-3.1-flash-lite` |
| 2026-05-31 | Integrated Gemini deep research: competitors, usage, funnel, tiers, risks |
| 2026-05-31 | Removed Judge0 from COGS — product uses AI-only grading (sandbox dropped) |
