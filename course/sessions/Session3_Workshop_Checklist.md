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

### Risk Clinic
- [ ] For each key risk, define mitigation
- [ ] Document core trade-offs you are choosing:
  - [ ] Cost vs accuracy vs speed
- [ ] Defend trade-off choices with rationale

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

