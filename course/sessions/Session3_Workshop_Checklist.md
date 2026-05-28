# Session 3 - Workshop Checklist

Source: `Session3_BusinessModelAndRisk_NextU_2026.pdf`

## Objective for Day 3

Prepare the business case and risk materials needed for pitching:
- Market structure and monetization clarity
- Defensible business model and customer economics
- Explicit risks with mitigation strategies

## Deliverables (Required)

### 1) Business Case Slides
- [ ] Market structure analysis
- [ ] TAM / SAM / SOM with credible sources
- [ ] Three competitors
- [ ] Revenue model
- [ ] Unit economics
- [ ] First-100-customers plan

### 2) Risks & Mitigation Slides
- [ ] Top market risk
- [ ] Top technical risk
- [ ] Top adoption risk
- [ ] Mitigation strategy for each risk
- [ ] Likelihood score for each risk/failure mode (1 = low, 5 = high)

## Work to Complete During Session

### Structural Market Analysis
- [ ] Analyze Porter’s 5 Forces
  - Competitive rivalry
  - Threat of new entrants
  - Threat of substitutes
  - Buyer bargaining power
  - Supplier bargaining power
- [ ] Define first target segment
- [ ] Define buyer persona
- [ ] Define primary distribution channel
- [ ] Clarify JTBD:
  - [ ] Value added (what job user hires product to do)
  - [ ] Value replaced (what they stop using)

#### Filled Draft - Forces shaping the market (SkillProof)

Context used for this draft: SkillProof is positioned as a B2B hiring workflow for junior tech roles (job-posting quality + role-linked assessment + shortlist/ranking), initially targeting HR/talent teams and hiring managers.

##### 1) Competitive Rivalry - **High**
- Many adjacent competitors already exist: ATS platforms, assessment tools, AI interview tools, and recruiting agencies.
- Buyers can assemble alternatives from multiple point solutions (ATS + coding test + spreadsheet rubric), increasing comparison pressure.
- Differentiation is possible, but must stay sharp: role-specific test generation from the actual job ad, transparent rubric-based evidence, and faster shortlist creation for junior roles.
- Rivalry intensity is highest when selling to SMB/scale-up teams with shorter cycles and lower switching friction.

##### 2) Threat of New Entrants - **Medium to High**
- Technical barriers are moderate: modern LLM APIs and no-code tooling make basic product replication easier than before.
- Distribution and trust are the real barriers: HR data sensitivity, integration into hiring process, and proof of reliable/defensible outcomes.
- New entrants can launch quickly, but sustaining quality (evaluation consistency, hallucination controls, candidate fairness, workflow fit) is harder.
- Defensibility should come from workflow embedding, data/feedback loops, and repeatable hiring outcomes rather than model access alone.

##### 3) Threat of Substitutes - **High**
- Strong substitutes include:
  - Internal manual screening (CV triage + custom take-home)
  - Recruiters/staffing agencies
  - Generic skills tests not tied to the specific role
  - Referral-heavy hiring processes
- Substitute quality may be lower, but teams still use them because they are familiar, already budgeted, or perceived as lower-risk.
- SkillProof must prove measurable improvement over substitutes on time-to-shortlist, interview quality, and decision confidence.

##### 4) Bargaining Power of Buyers - **High**
- Buyers (HR leads, founders, hiring managers) have many options and can delay purchase.
- Procurement pressure is strong in this category: budget scrutiny, pilot requirements, and ROI expectations.
- Switching costs are initially low if SkillProof is not integrated deeply into ATS/interview workflows.
- Buyers can demand discounts unless value is quantified clearly (e.g., screening hours saved, improved interview conversion, lower mis-hire risk).

##### 5) Bargaining Power of Suppliers - **Medium to High**
- Core upstream suppliers include LLM/API vendors and cloud infrastructure providers.
- Supplier concentration is significant at the model layer; price, policy, rate limits, and availability can shift unexpectedly.
- Dependency risk exists for quality and cost of inference, especially if margin relies on heavy API usage.
- Mitigation is possible via multi-model routing, prompt/control-layer design, caching, and fallbacks for degraded AI performance.

#### Strategic implication (what this means for your pitch)
- The market is attractive but crowded and buyer-driven.
- Win condition is not “we use AI”; it is:
  - faster, defensible junior-hiring decisions,
  - clear ROI with pilot metrics,
  - and workflow adoption that is hard to replace once teams operate with it.
- Priority proof points for go-to-market:
  - reduction in screening time,
  - quality of shortlist/interview conversion,
  - consistency and transparency of evaluation.

#### Filled Draft - Segments and buyer dynamics (SkillProof)

##### First segment (where to start)
- **Primary entry segment:** SMB and scale-up companies hiring **junior software/web profiles** (frontend, full-stack junior, WordPress/CMS junior) with recurring hiring needs.
- **Why this segment first:**
  - Acute pain from high applicant volume and limited screening bandwidth.
  - Faster decision cycles than large enterprise.
  - Clear ROI story (hours saved + better shortlist quality).

##### Buyer persona (who pays)
- **Economic buyer:** Head of Talent / HR Lead / Founder (in smaller orgs).
- **Primary user:** Recruiter / Talent partner running initial screening.
- **Influencer/stakeholder:** Hiring manager / CTO validating technical relevance.
- **Buying trigger:** Too many low-signal applications, slow time-to-shortlist, inconsistent evaluation quality.
- **Decision criteria:** speed, transparency, fairness/defensibility, integration effort, and cost vs alternatives.

##### Distribution channel (how you reach first customers)
- **Main channel:** Founder-led outbound + warm network intro to HR/talent leaders in tech SMBs.
- **Supporting channel:** LinkedIn content + case-study-led inbound (before/after hiring workflow outcomes).
- **Pilot motion:** 2–4 week paid/low-risk pilot on live hiring roles, with explicit success metrics.

##### TAM / SAM / SOM (draft framework and assumptions)

Use annual recurring revenue (ARR) framing for investor/pitch clarity.

###### TAM - Total Addressable Market
- **Definition:** All organizations globally that hire junior digital/tech talent and could buy structured screening + role-linked assessment tooling.
- **Top-down formula:**  
  `# potential employer accounts globally x estimated annual contract value (ACV)`
- **Working assumptions for draft (replace with sourced numbers):**
  - Potential accounts globally: **500k–1.5M**
  - Early-stage ACV range: **$2,000–$12,000/year**
- **Draft TAM range:** **$1B–$18B ARR**

###### SAM - Serviceable Addressable Market
- **Definition:** Subset of TAM you can serve in the next 2–3 years with current product/language/go-to-market constraints.
- **Scope assumption (example):**
  - Geography: EU + North America
  - Company size: 20–500 employees
  - Hiring use case: junior web/software roles
  - Product constraints: current language coverage + current integrations
- **Bottom-up formula:**  
  `# reachable target accounts in chosen region/segment x realistic ACV`
- **Draft SAM placeholder:** **10%–25% of TAM** (tighten with sourced counts).

###### SOM - Serviceable Obtainable Market
- **Definition:** Realistic share of SAM you can capture in ~12–24 months.
- **Execution-based formula:**  
  `# accounts your GTM can close in 12–24 months x realized ACV`
- **Practical planning anchor:**
  - Year 1 pilot-to-paid target: **30–100 accounts**
  - ACV: **$3k–$8k**
- **Draft SOM range (12–24 months):** **$90k–$800k ARR**

##### Buyer dynamics to mention in your slide narrative
- HR owns process pain, hiring manager owns quality risk, finance/founder owns budget.
- Buyer confidence increases when you show:
  - reduced screening time,
  - better interview conversion from shortlisted candidates,
  - auditable rubric evidence for decisions.
- Typical buying objections:
  - “We already have ATS + coding test tools”
  - “Will this be fair/reliable for junior candidates?”
  - “How much setup and team change is required?”

##### What to validate next (to convert draft into sourced numbers)
- Exact target geography for your first year (e.g., France-only vs EU vs EU+US).
- Precise ICP company band (e.g., 20–200 vs 50–500 employees).
- Real ACV hypothesis by plan tier (pilot, SMB, scale-up).
- Number of junior tech roles hired per account per year.

##### Data/sources still needed (you can gather with Perplexity/Gemini)
- Number of SMB/scale-up companies hiring junior tech roles in your target geography.
- Current spend benchmarks for ATS/assessment/recruiting tools in SMB hiring.
- Reported hiring volume and applicant volume benchmarks for junior tech roles.
- Comparable pricing from nearest substitutes (assessment tools, AI interview tools, recruiting workflow tools).

#### Updated Draft with Perplexity Inputs - TAM / SAM / SOM

Use this as the pitch-ready version (explicitly scenario-based where global data is thin).

##### 1) Segment and buyer dynamics (final wording)
- **First segment:** Worldwide companies with **50–500 employees** hiring junior tech talent (frontend, full-stack junior, WordPress/CMS).
- **Economic buyer:** Head of Talent / HR Lead / Founder (smaller orgs).
- **Primary user:** Recruiter / talent partner.
- **Influencer:** Hiring manager / CTO.
- **Primary channel:** Founder-led outbound + warm intros + case-study-led LinkedIn inbound.

##### 2) Sourced anchors to cite
- OECD enterprise-size framing (medium = 50–249) for base comparability.
- UK/market usage often extends “medium” toward 50–499, aligning with our ICP.
- HR software pricing benchmark around **USD 19–26 PEPM** as a pricing floor proxy.

##### 3) Model assumptions (scenario)
- **Eligible companies worldwide (50–500 proxy):**
  - Low: 1.0M
  - Base: 2.0M
  - High: 4.0M
- **Share hiring junior tech annually:**
  - Low: 20%
  - Base: 35%
  - High: 50%
- **ACV (subscription by company size):**
  - Low: USD 3,000
  - Base: USD 7,500
  - High: USD 15,000
- **Serviceable subset for 2–3 years (SAM filter):**
  - Low: 25%
  - Base: 35%
  - High: 40%
- **Obtainable penetration in 12–24 months (SOM):**
  - Low: 0.2%
  - Base: 0.5%
  - High: 1.0%

##### 4) Formulas
- `TAM ARR = Eligible companies × Share hiring junior tech × ACV`
- `SAM ARR = TAM ARR × Serviceable subset`
- `SOM ARR = SAM ARR × 12–24 month penetration`

##### 5) Base case
- Eligible companies = 2,000,000
- Hiring junior tech = 35%
- ACV = USD 7,500
- Serviceable subset = 35%
- SOM penetration = 0.5%

Calculations:
- `TAM = 2,000,000 × 0.35 × 7,500 = USD 5.25B`
- `SAM = 5.25B × 0.35 = USD 1.84B`
- `SOM = 1.84B × 0.005 = USD 9.2M`

##### 6) Range view

| Metric | Low | Base | High |
|---|---:|---:|---:|
| Eligible companies | 1.0M | 2.0M | 4.0M |
| Share hiring junior tech | 20% | 35% | 50% |
| ACV | USD 3,000 | USD 7,500 | USD 15,000 |
| **TAM ARR** | **USD 600M** | **USD 5.25B** | **USD 30.0B** |
| Serviceable subset | 25% | 35% | 40% |
| **SAM ARR** | **USD 150M** | **USD 1.84B** | **USD 12.0B** |
| 12–24 month penetration | 0.2% | 0.5% | 1.0% |
| **SOM ARR** | **USD 300K** | **USD 9.2M** | **USD 120M** |

##### 7) Subscription tiers (size-based)
- **50–100 employees:** USD 3k–5k ARR
- **100–250 employees:** USD 7.5k–12k ARR
- **250–500 employees:** USD 15k–25k ARR

##### 8) Data-gap note (say this explicitly in slides)
- Global count of 50–500 companies and junior-tech hiring incidence are proxy-based in this version.
- Mark these as scenario assumptions and plan a country-by-country registry refinement.

##### 9) Sources
- OECD - Enterprises by business size  
  https://www.oecd.org/en/data/indicators/enterprises-by-business-size.html
- Workday - SME size framing  
  https://blog.workday.com/en-gb/what-are-small-and-medium-enterprises-smes.html
- Lattice - HR software pricing benchmark  
  https://lattice.com/articles/hr-software-pricing
- SBE Council - U.S. small business facts  
  https://sbecouncil.org/about-us/facts-and-data/
- Market Research Future - B2B SaaS market context  
  https://www.marketresearchfuture.com/reports/b2b-saas-market-42826
- Market.us - SaaS market context  
  https://market.us/report/software-as-a-service-saas-market/

#### Filled Draft - Jobs to be Done (JTBD)

##### Core JTBD (one-line)
- “When I open a junior tech role and receive too many low-signal applications, help me produce a defensible shortlist quickly so I can move the right candidates to interview with confidence.”

##### Your Value ADD (what users hire SkillProof to do)

**Functional jobs**
- Turn vague/inconsistent job ads into clearer, role-calibrated postings.
- Generate role-specific assessments from the actual job context.
- Evaluate candidates using rubric-based evidence instead of CV keywords.
- Rank applicants into an interview-ready shortlist faster.

**Emotional jobs**
- Reduce anxiety about missing strong candidates hidden in high-volume pipelines.
- Increase confidence that interview invites are fair and justified.
- Reduce fear of making a weak hire due to noisy screening signals.

**Social/organizational jobs**
- Help HR defend screening decisions to hiring managers/leadership.
- Provide an auditable rationale for why candidates were advanced or declined.
- Improve alignment between HR and hiring managers on “what good looks like.”

##### Value REPLACED (what they fire to make room)

**Current process being replaced**
- Manual CV triage and keyword filtering as the primary screening method.
- Generic coding tests not tied to the specific role requirements.
- Fragmented workflow across ATS + spreadsheets + ad hoc scoring notes.
- Long back-and-forth calibration between recruiter and hiring manager.

**Budget/process line items likely reduced**
- Time-heavy first-pass screening labor.
- External screening/support dependency for early-stage filtering.
- Poor interview utilization (interviewing too many weak-fit candidates).
- Cost of misaligned shortlists that delay hiring decisions.

##### JTBD proof points to include in your pitch
- Time-to-shortlist reduction (hours/days saved per role).
- Interview conversion quality (share of shortlisted candidates moving forward).
- Decision defensibility (rubric traceability per candidate).
- Candidate experience quality (structured feedback vs silence).

##### Optional tightening inputs (if you want this even sharper)
If you want, I can tailor this JTBD section to one exact buyer persona (e.g., “Head of Talent at 80-person startup”).
For that, give me:
- Typical hiring volume per quarter
- Current screening workflow/tools
- Biggest failure mode today (speed, quality, fairness, or manager alignment)

#### Filled Draft - Revenue model & pricing (SkillProof)

##### Revenue model choice

**Primary model:** annual **subscription** tiered by company size and hiring volume.  
**Why:** predictable ARR, aligns with recurring hiring workflows, and is easier to budget than per-candidate transaction pricing.

**Recommended structure**
- Platform fee (base subscription)
- Plus usage allowance (number of active roles / assessments per month)
- Overage for unusually high hiring periods

This combines subscription stability with fair upside when customer usage spikes.

##### Subscription vs alternatives (and why)
- **Subscription (chosen):** best for repeat hiring teams and retention.
- **Pure usage-based:** good for occasional hiring, but less budget-predictable and can create fear of variable spend.
- **Marketplace:** not core to your current product motion; adds complexity and two-sided market risk.
- **Licensing/enterprise-only:** possible later for large orgs, but too heavy for first go-to-market.

##### Who is the buyer? (often not the user)
- **Economic buyer (budget owner):** Head of Talent, HR Director, COO, or Founder (in smaller companies).
- **Primary user:** recruiter/talent partner running screening flow.
- **Key influencer:** hiring manager / CTO who validates role relevance and interview quality.
- **Approval dynamic:** HR drives process need, hiring manager validates quality, finance/founder approves spend.

##### Price anchor (closest comparables + positioning)

**Closest comparables**
- Assessment/screening tools (coding tests, AI interview/screening)
- HR/recruiting software subscriptions (PEPM benchmarks)
- In-house/manual screening labor and agency support (time/cost anchor)

**Anchor logic**
- You are **above basic testing tools** because SkillProof is not just test delivery; it includes:
  - job-posting quality improvement,
  - role-linked assessment generation,
  - rubric-based shortlist and defensibility layer.
- You are **below full ATS transformation programs / heavy enterprise suites** because you do not replace the entire HR stack.

**Suggested annual tiers (already aligned with your TAM/SAM/SOM assumptions)**
- 50–100 employees: **USD 3k–5k ARR**
- 100–250 employees: **USD 7.5k–12k ARR**
- 250–500 employees: **USD 15k–25k ARR**

##### Willingness-to-pay (what customers cut to fund SkillProof)

Expected budget reallocation sources:
- Manual screening hours (recruiter/manager time) from first-pass filtering.
- Spend on fragmented point tools that duplicate screening steps.
- Partial reduction in external recruiter dependency for early-stage filtering.
- Cost of low-quality interviews (interviewing weak-fit candidates).

##### WTP validation plan (what to test now)
- Run paid pilots with explicit value hypothesis:
  - target screening-time reduction per role,
  - shortlist quality / interview conversion lift,
  - recruiter and hiring manager satisfaction.
- Test three pricing offers in discovery/pilot calls:
  - “good” tier, “better” tier, “best” tier
  - identify objection points and accepted anchor range.
- Ask direct trade-off question in interviews:
  - “If SkillProof saves X hours and improves shortlist quality by Y, what line item would you reduce first?”

##### Slide-ready one-liner
- “SkillProof is a tiered annual subscription for 50–500 employee companies, priced between lightweight testing tools and full enterprise HR suites, justified by measurable savings in screening time and improved shortlist quality.”

#### Filled Draft - Unit economics & GTM (SkillProof)

##### 1) Unit costs (per customer, per assessment cycle)

Use a simple cost stack you can explain on one slide.

**Variable cost per assessment cycle (candidate submission)**
- LLM cost for:
  - job-analysis / test generation (amortized over candidates for same role),
  - grading and feedback generation.
- Infrastructure cost:
  - compute, storage, logs, queueing.
- Support/ops allocation:
  - monitoring and issue handling per active customer cohort.

**Formula**
- `Contribution per cycle = Revenue per cycle - Variable cost per cycle`
- `Gross margin % = (Revenue - COGS) / Revenue`

**Practical KPI targets (early-stage SaaS)**
- Target gross margin: **70%+** once usage is stable.
- Keep model/API cost as a controlled % of revenue via:
  - model routing by task complexity,
  - caching/retries controls,
  - guardrails to reduce unnecessary calls.

##### 2) CAC and first-100-customer plan

**CAC definition**
- `CAC = (Sales + marketing spend over period) / # of new paying customers`

**First 100 customers acquisition plan (phased)**
- **Phase 1 (0–20 customers):** founder-led outbound + warm intros + pilot conversion.
- **Phase 2 (20–60):** repeatable outbound playbook + case-study-led inbound.
- **Phase 3 (60–100):** hybrid motion with tighter ICP filtering, referral loop, and light partner assists.

**Suggested funnel assumptions to track**
- Meetings booked -> pilot started -> paid conversion -> expansion.
- Time-to-close per segment (50–100 vs 100–250 vs 250–500 employees).
- CAC payback period target: **< 12 months** in base case.

##### 3) Distribution leverage

Prioritize channels that compound trust and reduce CAC over time:

- **Direct outbound (primary at start):** fastest learning loop on objections and pricing.
- **Community/content leverage:** founder content on junior hiring quality and evidence-based screening.
- **Partner leverage (phase 2+):** recruiting consultancies, HR operators, or niche talent communities.
- **API/integration leverage (phase 2+):** integrations into ATS/workflows to reduce switching friction.
- **Marketplace listing (optional):** useful for discoverability, but secondary to direct GTM early on.

##### 4) Sales motion choice

**Recommended motion:** **hybrid product-led + sales-assisted**
- **PLG elements:** fast demo value, low-friction trial/pilot, clear workflow outcomes.
- **Sales-assisted layer:** needed because buyer/user/influencer are different stakeholders (HR + hiring manager + budget owner).

Why not pure self-serve at start:
- Multi-stakeholder buying and workflow change require guided onboarding and ROI framing.

Why not pure sales-led only:
- Would slow learning speed and increase CAC too early.

##### 5) Slide-ready GTM narrative
- “We start with founder-led, sales-assisted pilots in 50–500 employee companies hiring junior tech talent, then compound distribution through case studies, referrals, and workflow integrations. Our unit economics improve as model-cost controls and repeatable onboarding raise gross margin and reduce CAC payback.”

##### 6) Data needed to tighten this section (if you want investor-grade precision)

If you share these, I can compute a numeric CAC/payback table:
- Average pilot price and pilot duration
- Pilot -> paid conversion rate
- Average annual contract value by segment
- Monthly pipeline spend (tools + ads + contractor support)
- Founder/sales time cost assumption
- Average # assessments per customer per month
- Average API cost per assessment (or per graded session)

### Business Model Definition
- [ ] Choose pricing model (subscription / usage-based / marketplace / licensing)
- [ ] Define who pays (buyer vs user)
- [ ] Set price anchor (closest comparable + justification)
- [ ] Define willingness-to-pay test
- [ ] Estimate unit costs (per user / per API cycle)
- [ ] Define CAC logic for first 100 customers
- [ ] Define distribution leverage (API / partner / marketplace / community)
- [ ] Define sales motion (self-serve / sales-led / product-led)

### AI Necessity Checkpoint
- [ ] If GPT-5 became free tomorrow, define your durable edge
- [ ] If AI is removed, state whether product still creates value
- [ ] If non-AI competitor enters, define unique value unlocked by AI
  - [ ] Quality
  - [ ] Speed
  - [ ] Efficiency
  - [ ] Safety
  - [ ] New opportunity

#### Filled Draft - AI necessity stress test answers

##### 1) If GPT-5 launches free tomorrow, do we still have an edge?

**Short answer:** Yes, if we execute on workflow + evidence + distribution; no, if we position as “just an AI wrapper.”

**Why edge remains**
- SkillProof’s value is not raw model access; it is an integrated hiring workflow:
  - job ad calibration,
  - role-linked assessment creation,
  - rubric-based scoring,
  - shortlist decision support.
- The defensible layer is process fit and decision traceability (who advanced, why, and based on what evidence), not generic text generation.
- HR teams buy outcomes (faster, better shortlists), not model endpoints.

**Commoditization risk condition**
- If we fail to build sticky workflow integration and measurable hiring outcomes, free frontier models compress differentiation quickly.

##### 2) If we remove AI, what does the product become?

**Without AI, SkillProof becomes:**
- a structured hiring operations tool with:
  - manual job-check templates,
  - static test banks,
  - deterministic rubric forms,
  - shortlist dashboards.

**Is it still valuable?**
- **Partly valuable:** it still improves process consistency and documentation.
- **But materially weaker:** it loses speed, role-specific adaptation, and scalable feedback generation.

**Conclusion**
- AI is not the only value driver, but it is the multiplier that makes the workflow fast, role-adaptive, and economically superior at scale.

##### 3) If a non-AI competitor enters, what specific value does AI unlock?

**Quality**
- Better role-to-assessment alignment from actual job context.
- More consistent rubric-level evaluation across large applicant pools.

**Speed**
- Faster conversion from job draft -> validated assessment -> ranked shortlist.
- Reduced recruiter and hiring-manager cycle time per role.

**Efficiency**
- Lower manual screening effort for first-pass candidate filtering.
- Higher interviewer utilization by reducing low-fit interview slots.

**Safety / reliability**
- Structured evidence trail and explicit rubrics improve defensibility and reduce arbitrary decision-making.
- Guardrails and review checkpoints reduce blind trust in model outputs.

**New opportunity**
- Makes evidence-based junior hiring feasible for smaller teams that otherwise cannot run rigorous, scalable screening.
- Enables candidate feedback loops that are impractical with fully manual review.

##### Slide-ready one-liner
- “Even if model capability commoditizes, SkillProof wins by embedding AI inside a defensible hiring workflow that delivers measurable speed, consistency, and decision quality gains.”

### Risk Clinic
- [ ] For each key risk, define mitigation
- [ ] Document core trade-offs you are choosing:
  - [ ] Cost vs accuracy vs speed
- [ ] Defend trade-off choices with rationale

#### Filled Draft - Three risks, mitigations, and likelihood

##### Risk #1 - Market risk (willingness to pay)

**Risk statement**
- HR/talent teams may like the product but still not pay because they perceive current ATS + manual workflow as “good enough.”

**Likelihood (1–5)**
- **4 / 5 (High)** in early stage before repeatable ROI proof.

**Cheapest willingness-to-pay test**
- Run a paid pilot offer to 10 ICP companies (50–500 employees), with one role each:
  - Offer: fixed pilot fee (e.g., USD 500–1,500) for 2–4 weeks.
  - Success threshold: at least 30% pilot-to-paid conversion at target ACV band.
  - Collect hard metrics: screening time saved, shortlist quality, interview conversion.

**Mitigation strategy**
- Sell outcomes, not features:
  - “hours saved per role,”
  - “better interview hit-rate,”
  - “defensible candidate evidence.”
- Publish 2–3 case studies with before/after metrics.
- Price by company size and hiring volume so buyers see predictable spend.

**Owner / leading indicators**
- Owner: GTM/founder.
- Indicators: pilot close rate, pilot-to-paid conversion, discount pressure, CAC payback.

---

##### Risk #2 - Technical risk (pipeline fragility, scale, and bad inputs)

**Risk statement**
- AI output quality can degrade on poor job descriptions, unusual roles, or ambiguous candidate responses; at scale, latency/cost spikes can hurt UX and margins.

**Likelihood (1–5)**
- **3 / 5 (Medium)** with current architecture, rising if usage spikes quickly.

**Fragile pipeline points**
- Input quality dependence (vague/inconsistent job ads).
- Assessment generation quality drift (wrong skill emphasis).
- Grading consistency across role types and answer formats.
- Supplier dependency on model API cost/availability.

**Failure modes**
- Incorrect/irrelevant questions generated.
- Inconsistent grading between similar answers.
- Slow turnaround during high submission periods.
- Rising inference cost compressing gross margin.

**Mitigation strategy**
- Guardrails + control layer:
  - input validation and fallback templates for weak job ads,
  - schema-constrained outputs,
  - confidence checks and human review triggers on low-confidence runs.
- Reliability and cost controls:
  - queue-based async grading,
  - multi-model routing and fallback paths,
  - caching and token-budget limits by task type,
  - monitoring dashboards for latency, failure rate, and cost per graded session.
- Quality monitoring:
  - periodic rubric calibration set,
  - spot audits on generated assessments and scores.

**Owner / leading indicators**
- Owner: Product + Engineering.
- Indicators: generation error rate, grading dispute rate, p95 latency, cost per session, model fallback frequency.

---

##### Risk #3 - Adoption risk (behavior change in HR workflow)

**Risk statement**
- Recruiters and hiring managers may resist changing screening behavior if SkillProof feels like an extra tool instead of fitting their current ATS/interview process.

**Likelihood (1–5)**
- **4 / 5 (High)** until workflow embedding is strong.

**Behavior-change challenge**
- Users will not switch if setup is heavy, output is not trusted, or handoffs to hiring manager are unclear.

**Mitigation strategy**
- **Wrap/join existing workflows first** (not full replacement):
  - export/shareable evidence packets,
  - lightweight integrations and copy-paste-safe outputs for ATS records.
- Onboarding for first value in < 1 hour:
  - one live role setup,
  - first shortlist generated with recruiter present.
- Internal champion strategy:
  - co-sell with HR + hiring manager in kickoff,
  - define shared success metric before pilot start.

**Owner / leading indicators**
- Owner: Customer success + product.
- Indicators: activation rate, time-to-first-shortlist, weekly active recruiters per account, churn after first hiring cycle.

---

#### Underlying trade-offs (Cost vs Accuracy vs Speed)

##### Trade-off 1 - Grading depth vs speed
- Choice: prioritize **fast first-pass grading** with optional deeper re-check for edge cases.
- Rationale: hiring teams need timely decisions; perfect depth on every submission is too slow/expensive.

##### Trade-off 2 - Model quality vs margin
- Choice: **tiered model routing** (higher-cost models only where needed).
- Rationale: preserves quality on hard tasks while controlling average cost per session.

##### Trade-off 3 - Automation vs human control
- Choice: keep **human checkpoints** for sensitive decisions and low-confidence outputs.
- Rationale: protects trust/defensibility while still automating high-volume repetitive work.

##### Trade-off statement for pitch
- “We optimize for decision-quality-at-speed: enough accuracy to make defensible shortlist decisions quickly, with targeted human review where model uncertainty is highest.”

#### Risk register snapshot (slide-ready)

| Risk | Type | Likelihood (1–5) | Impact (1–5) | Priority | Core mitigation |
|---|---|---:|---:|---:|---|
| Low willingness to pay despite interest | Market | 4 | 5 | 20 | Paid pilots + ROI proof + pricing fit |
| AI quality/cost/latency drift at scale | Technical | 3 | 5 | 15 | Guardrails, routing, monitoring, fallback |
| Recruiter/hiring-manager workflow resistance | Adoption | 4 | 4 | 16 | Workflow wrapping, fast onboarding, champion model |

### Calibration (Quality of Narrative)
- [ ] Remove excuse language ("we didn’t have time", etc.)
- [ ] Replace with explicit limitations and next-step plan
- [ ] Own known constraints (inputs, multilingual scope, hallucination rate, etc.)

### Peer Red-Team (Last Hour)
- [ ] Prepare 10-minute team red-team round:
  - [ ] Problem brief
  - [ ] Solution spec
  - [ ] v0 prototype
- [ ] Stress-test:
  - [ ] Market claims
  - [ ] AI necessity argument
  - [ ] Customer economics
- [ ] Capture one specific next-week test/research suggestion

## End-of-Day Requirements

- [ ] Finalize Business Case + Risk slides
- [ ] If unfinished in class, complete before next session
- [ ] Apply peer red-team feedback to:
  - [ ] Business case
  - [ ] Risk register/slides
  - [ ] Prototype design

## Next Session

- Day 4: Crafting your pitch and dry runs.

