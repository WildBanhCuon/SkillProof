# SkillProof — Lovable prompt: Marketing landing page

Copy everything below the line into Lovable.

---

## Project brief

Build a **high-fidelity, non-functional marketing landing page** for **SkillProof** — a B2B SaaS for **junior tech hiring**. The page sells to **HR / talent teams** (primary buyer) while showing **candidates** that the process is fairer than CV-only screening.

**Do not build** login logic, APIs, or real navigation to a working app. Buttons can use `#` or placeholder routes (`/login`, `/register`). All numbers and UI previews are **static placeholders**.

**Language:** English only.

**Reference aesthetic:** Clean B2B SaaS (Linear / Notion / Greenhouse tone), not playful consumer. Match existing SkillProof mockups: indigo primary, white + light gray backgrounds, card-based UI previews.

**Existing showcase (visual continuity):** https://skillproof-showcase.lovable.app/ — reuse the same indigo, card style, and HR dashboard look for hero product mockups.

---

## Design system

| Token | Value |
|--------|--------|
| Primary | Indigo `#4F46E5` — primary buttons, links, accents |
| Primary hover | `#4338CA` |
| Page background | `#F8FAFC` (slate-50) alternating with white sections |
| Text | Headings `#0F172A`, body `#475569`, muted `#64748B` |
| Success | Green — “Ready now”, high scores |
| Warning | Orange — “Trainable”, flags |
| Risk | Red — “At risk”, seniority flags |
| Info | Blue — AI insight cards |
| Font | Inter |
| Radius | 8px on cards and buttons |
| Max content width | ~1152px (`max-w-6xl`), centered |
| Style | Generous whitespace, subtle borders (`border-slate-200`), soft shadows on hero mockup only |

**Logo:** Wordmark **SkillProof** (indigo accent on “Proof” or full indigo mark + dark text).

---

## Page structure (top to bottom)

Build **one long-scroll landing page** with a **sticky top navigation**. Section order is fixed — do not reorder.

---

### 1. Sticky navigation

**Layout:** Full-width white bar, bottom border `border-slate-200`, height ~64px, `backdrop-blur` optional on scroll.

**Left:** SkillProof logo → links to `#top`.

**Center (desktop):** Anchor links — **How it works** · **Features** · **For candidates** · **Why SkillProof**

**Right:**
- **Log in** — outline/ghost button
- **Get started** — primary indigo button (main conversion)

**Mobile:** Hamburger → same links + both buttons stacked.

**Behavior:** Smooth scroll to section IDs. Nav stays visible while scrolling.

---

### 2. Hero (most important section)

This section must answer in **5 seconds**: *What is SkillProof? Who is it for? What outcome do I get?*

#### Layout (desktop)

**Two-column split (60/40 or 55/45):**

| Left column | Right column |
|-------------|--------------|
| Copy + CTAs | **Product visual** — large, polished UI mockup |

**Left column content (top → bottom):**

1. **Eyebrow pill** (small, indigo background ~10% opacity):  
   `AI-assisted junior hiring`

2. **Headline** (large, bold, tight tracking, 2 lines max):  
   **Too many applicants.**  
   **Not enough proof.**

3. **Subheadline** (18–20px, slate-600, max ~520px width):  
   SkillProof helps hiring teams turn messy junior applications into **verified, job-ready shortlists** — with better job ads, role-calibrated assessments, and rubric-backed evidence instead of CV keywords.

4. **CTA row** (horizontal, gap 3):
   - **Primary:** `Get started` (indigo, large) — main action
   - **Secondary:** `See how it works` (outline) — scrolls to `#how-it-works`

5. **Micro-trust line** (13px, slate-500, with small check icons):  
   - No fake “match %” scores  
   - Inspectable rubrics HR can review  
   - Works for any junior tech role

**Right column — hero visual (critical):**

Build a **floating browser-style frame** (rounded-xl, shadow-xl, slight rotate -1deg optional) showing a **static HR Results dashboard preview** inspired by your results mockup:

- Title: **Junior Frontend Developer** · badge **Published**
- Mini stats: `248 applications` · `142 tests completed` · `18 top performers`
- **Top candidate card** emphasized:
  - **#1 Yasmine B.** · score **92/100** · badge **Ready now** (green)
  - Mini radar or 4 skill bars: Technical, Problem solving, Code quality, Communication
  - One-line AI summary: *“Strong React fundamentals; ready for interview”*
- Second card partially visible below (lower opacity) for depth

**Optional:** Small floating card top-right of mockup — orange AI flag: *“3+ years required on junior title”* with label **Job Ad Upgrade** — hints at the full workflow without cluttering the hero.

**Background:** Very subtle indigo-to-slate gradient blob behind the mockup (low opacity), not loud.

#### Mobile hero

Stack: eyebrow → headline → subhead → CTAs full-width → mockup below (full width, no horizontal scroll).

#### Hero do’s and don’ts

- **Do:** Clear B2B value, one dominant visual, strong hierarchy.  
- **Don’t:** Stock photos of handshakes, generic “AI brain” clipart, carousel, auto-playing video, or busy particle effects.

---

### 3. Logo / trust strip (optional, thin)

Full-width band, white or slate-50, centered text:

`Built for teams hiring junior developers, WordPress specialists, frontend engineers, and more.`

Below: 4–5 **placeholder company logos** (gray monochrome) OR metric chips:

`200+ applications per role` · `30–45 min assessments` · `60–70% less screening time`

Keep minimal — one row only.

---

### 4. Problem section — “The junior hiring trap”

**Section ID:** `#why-skillproof`  
**Background:** White  
**Layout:** Centered heading + 2-column on desktop

**Heading:** The junior hiring trap  
**Subheading:** High volume. Low signal. High cost when you guess wrong.

**Four pain cards** (2×2 grid), each with icon (lucide-style outline):

| Card title | Body copy |
|------------|-----------|
| **CVs look the same** | Bootcamp projects, tutorial repos, and keyword-stuffed resumes don’t tell you who can actually do the job. |
| **“Junior” ads aren’t junior** | Managers mix senior requirements into junior titles — wrong applicants apply, right ones bounce. |
| **Screening doesn’t scale** | One role can bring 200–500+ applications. HR spends weeks filtering noise. |
| **Decisions aren’t defensible** | When a hire fails or someone asks why they were rejected, there’s no structured evidence trail. |

**Closing line** (centered, slightly larger, indigo accent on key phrase):  
SkillProof replaces **school name, years of experience, and polished wording** with **structured proof of ability**.

---

### 5. How it works

**Section ID:** `#how-it-works`  
**Background:** `#F8FAFC`  
**Heading:** From vague job ad to verified shortlist  
**Subheading:** One workflow for HR. A fairer path for candidates.

**Three horizontal steps** connected by a subtle line or arrows (desktop); vertical timeline (mobile).

Each step: large step number `01` `02` `03`, role badge (**HR** or **Candidate**), title, short description, small illustrative icon.

| Step | Role | Title | Description |
|------|------|-------|-------------|
| 01 | HR | **Upgrade the job ad** | Paste your posting into the Job Ad Upgrade Studio. AI flags unrealistic requirements, vague responsibilities, and inconsistent seniority — then you approve a cleaner ad and skill matrix. |
| 02 | Candidate | **Prove skills on a real test** | Candidates complete a **30–45 minute** assessment generated from **that specific job** — not a generic test bank. |
| 03 | HR | **Review a ranked shortlist** | See scorecards with strengths, risks, cited evidence, and suggested interview questions. Spot top performers in minutes, not weeks. |

**Bottom CTA (centered):** outline button `Watch the demo flow` (no video required — can scroll to features or open a modal with 3 screenshot thumbnails: create listing · take test · results).

---

### 6. Features grid

**Section ID:** `#features`  
**Background:** White  
**Heading:** Everything you need to hire juniors with evidence  
**Subheading:** AI where it helps. Transparent rubrics where it matters.

**6 feature cards** (3×2 desktop, 1 col mobile), icon + title + 2-line description:

1. **Job Ad Upgrade Studio** — Analyze postings for overreach, vagueness, and missing info before you publish.  
2. **Skill matrix generation** — Turn the ad into explicit skills and evaluation criteria HR and hiring managers can align on.  
3. **Role-specific assessments** — Fresh tests from validated job context — frontend, WordPress, or other junior tech roles.  
4. **Rubric-based evaluation** — Scores 0–5 per criterion with **cited evidence** from submissions — not opaque AI guesses.  
5. **Ranked HR dashboard** — Aggregated rubric scores into a shortlist — **no fake match percentages**.  
6. **Actionable candidate feedback** — Rejected applicants get structured feedback, not silence.

**Highlight card** (span 2 cols on desktop OR bordered indigo):  
**AI + human in the loop** — table-style mini graphic:

| Step | Who |
|------|-----|
| Write job ad | HR |
| Analyze ad & skill matrix | AI → HR approves |
| Generate test | AI → HR approves |
| Grade answers | AI (rubric) |
| Rank shortlist | Code (deterministic) |
| Hire / pass | HR |

Caption: *We don’t predict “good hire” from biased historical labels. We show inspectable evidence.*

---

### 7. Dual audience — HR vs candidates

**Section ID:** `#for-candidates`  
**Background:** Slate-50  
**Layout:** Two equal cards side by side (stack on mobile)

#### Card A — For HR teams (primary styling: indigo border or “Recommended” pill)

**Title:** For HR & talent leaders  
**Bullets:**
- Cut screening time by **60–70%** per junior role  
- Defend realistic requirements with hiring managers  
- Lower mis-hires and first-year turnover  
- Build an audit-friendly decision trail for DE&I and internal review  

**CTA:** `Get started` (primary)

**Persona hint (small quote block):**  
*“I spend two weeks filtering noise per posting. I need juniors who can actually perform — and proof I can show my CTO.”* — Marion, Head of Talent

#### Card B — For candidates

**Title:** For junior applicants  
**Bullets:**
- Prove ability beyond diploma and years of experience  
- One role-specific test instead of endless repetitive screens  
- Structured feedback when you’re not selected  
- Fairer funnel when CVs all look the same  

**CTA:** `Browse open roles` (outline) — placeholder link

**Persona hint:**  
*“I sent hundreds of applications and got silence. I need a way to show what I can actually build.”* — Sofiane, CS graduate

---

### 8. Product preview band (visual proof)

**Background:** White  
**Heading:** See what HR gets on day one  
**Layout:** Three screenshot-style cards in a row (use built UI, not external images)

| Preview 1 | Preview 2 | Preview 3 |
|-----------|-----------|-----------|
| **Create & check listing** — editor + orange/blue AI flag cards + skills matrix table | **Candidate assessment** — timer, question sidebar, code editor chrome (decorative) | **Ranked results** — Yasmine #1, Lucas #2, Emma #3 with Ready now / Trainable / At risk badges |

Captions under each. Subtle “click to enlarge” optional (modal with static image).

---

### 9. Outcomes / metrics

**Background:** Indigo gradient or solid indigo-600 section with white text  
**Heading:** Hiring outcomes that compound  

**Four stat blocks** (large number + label):

| Stat | Label |
|------|-------|
| **60–70%** | Less screening time per junior role |
| **30%** | Higher interview-to-hire conversion (target) |
| **↓** | Mis-hire rate at 3–6 months |
| **Days → hours** | Time to build a defensible shortlist |

Fine print (small, opacity 80%): *Targets based on product design goals; prototype demo uses sample data.*

---

### 10. FAQ (accordion)

**Background:** Slate-50  
**Heading:** Common questions  

Include 5 items (static expand/collapse UI):

1. **Is this only for frontend developers?** — No. MVP demos often use Junior Frontend Developer, but SkillProof adapts listings, skills, and tests to **any junior tech role**.  
2. **Does AI decide who gets hired?** — No. AI analyzes ads, generates tests, and grades against rubrics. **HR makes every hire/pass decision.**  
3. **How is this different from Codility or ATS keyword filters?** — SkillProof connects **job ad improvement + ad-linked assessment + evidence shortlist** in one flow, aimed at juniors where CVs fail.  
4. **What do rejected candidates get?** — Personalized, structured feedback tied to rubric criteria — not a generic rejection.  
5. **Do you predict who will be a good hire?** — We don’t use black-box “fit scores.” Rankings come from **explicit rubrics** HR can inspect.

---

### 11. Final CTA band

**Background:** White, centered, generous padding  
**Heading:** Stop sorting CVs. Start reviewing proof.  
**Subheading:** Take a vague junior job ad to a verified shortlist in one workflow.  
**Buttons:** Primary `Get started` · Secondary `Log in`  
**Small text:** Free to explore in demo · No credit card (placeholder trust copy)

---

### 12. Footer

**Background:** `#0F172A` (slate-900), light text  
**Columns:**
- **Brand:** SkillProof + one-line tagline: *Verified junior tech hiring.*  
- **Product:** How it works, Features, For candidates  
- **Legal (placeholder):** Privacy, Terms  
- **Contact:** hello@skillproof.app (placeholder)

Bottom bar: `© 2026 SkillProof` · `Course prototype — ESCEN AI for Impact`

---

## Buttons & interaction map

| Location | Label | Style | Action |
|----------|-------|-------|--------|
| Nav | Log in | Outline | `#` or `/login` |
| Nav | Get started | Primary | `#` or `/register` |
| Hero | Get started | Primary large | Same |
| Hero | See how it works | Outline | Scroll `#how-it-works` |
| How it works | Watch the demo flow | Outline | Scroll to previews or modal |
| HR card | Get started | Primary | `#` |
| Candidate card | Browse open roles | Outline | `#` |
| Final CTA | Get started / Log in | Primary + outline | `#` |

**Only one primary indigo CTA per viewport** — avoid competing primaries in the same fold.

---

## Graphical elements checklist

- [ ] Hero **product mockup** (results dashboard) — largest visual on page  
- [ ] Optional **AI flag floating card** on hero mockup  
- [ ] **Step connector** line in How it works  
- [ ] **Lucide-style icons** on problem + feature cards (consistent stroke width)  
- [ ] **Three UI preview cards** (listing / test / results) — matches mockup screenshots  
- [ ] **Radar chart or skill bars** inside candidate preview (decorative, Recharts-like)  
- [ ] **No** stock photography, **no** mascot illustrations  
- [ ] Subtle **gradient blobs** in hero only — keep rest flat and professional  

---

## Responsive & quality bar

- **Desktop first** (1440px design), fully responsive down to 375px  
- Page should feel **investor-pitch ready** in 30 seconds of scrolling  
- Copy must sound **credible B2B**, not hype (“revolutionary”, “10x your hiring”)  
- Workflow obvious without reading every card: **Better ad → Test → Ranked evidence**  
- All UI in previews must use **English** and **realistic names** (Yasmine, Lucas, Emma, Acme Corp)

---

## Do NOT build

- Working auth, backend, Gemini, databases  
- Full HR app (jobs list, editors, etc.) — only **marketing sections** above  
- Blog, pricing page, careers, chat widget  
- Dark mode toggle (light mode only for MVP)  

---

## Deliverable

Single route `/` — full marketing landing page exportable as screenshots for pitch deck and eventual merge into the React app at `frontend/src/pages/landing/LandingPage.tsx`.

---

## Quick reference — hero copy (use verbatim unless A/B testing)

| Element | Copy |
|---------|------|
| Eyebrow | AI-assisted junior hiring |
| Headline | Too many applicants. Not enough proof. |
| Subhead | SkillProof helps hiring teams turn messy junior applications into verified, job-ready shortlists — with better job ads, role-calibrated assessments, and rubric-backed evidence instead of CV keywords. |
| Primary CTA | Get started |
| Secondary CTA | See how it works |
