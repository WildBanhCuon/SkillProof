# Claude prompt — Minimalist revision of SkillProof pitch deck

Copy everything below the line into Claude. Attach **`SkillProof_Pitch_Deck (1).pdf`** (current deck) and optionally screenshots from the app.

**Goal:** Regenerate or revise the deck to be **minimalist and uncrowded**. The jury reads the speaker, not the slide. Follow Session 4 rules: one idea per slide, one visual OR one big number, 18pt+ body, 32pt+ titles.

---

## PROMPT (copy from here)

You are an expert presentation designer. **Revise** the SkillProof pitch deck (attached PDF or described below) to be **minimalist, airy, and investor-grade** — not dense with bullets and paragraphs.

### Context

- **Product:** SkillProof — B2B SaaS for junior tech hiring (job ad upgrade → role-specific assessment → ranked shortlist with rubric evidence).
- **Audience:** Year 5 jury, ESCEN AI for Impact · Boston LXP 2026.
- **Format:** 10-minute oral pitch; **8 main slides** only for presentation. Appendices are Q&A backup, not presented live.
- **Current problem:** Slides are too full — multiple cards, tables, footnotes, and paragraphs on single slides (especially slide 6 Market & Business).

### Design system (match SkillProof app — do not change)

| Token | Value |
|--------|--------|
| Primary | Indigo `#4F46E5` |
| Background | White `#FFFFFF` / light `#F8FAFC` |
| Text headings | `#0F172A` |
| Body | `#475569` |
| Muted | `#64748B` |
| Font | Inter |
| Radius | 8px on cards |
| Tone | Clean B2B SaaS (Linear / Notion / Greenhouse) — **generous whitespace** |

**Brand:** SkillProof · tagline *“Too many applicants. Not enough proof.”*

---

### Global rules (apply to every slide)

1. **Max ~15 words on slide** excluding numbers and proper nouns (speaker says the rest).
2. **One focal element per slide:** headline OR big number OR diagram OR table — not all at once.
3. **Footer:** Page number only on slides 2–7. Full “ESCEN · AI for Impact · Boston LXP 2026” only on slide 1 and slide 8.
4. **No duplicate “SkillProof”** on title slide — logo once.
5. **Speaker notes:** Put all explanations, Marion’s story, mitigations, GTM detail, EU AI Act nuance, and COGS footnotes in **speaker notes** — not on the slide.
6. **Do not** use generic robot/AI stock photos.
7. **Appendices A1–A4:** Produce as **separate “Q&A backup” section** or omit from main export — **not** part of the 10-minute flow.

---

### Slide-by-slide revision spec

#### Slide 1 — Title & hook (~30s)

**REMOVE:** Long subtitle paragraph; segment line (“B2B SaaS · 50–500 · frontend…”); duplicate product name; crowded footer.

**KEEP:** Logo, hook (large): *“Too many applicants. Not enough proof.”*

**OPTIONAL (pick one):** Either a single hero product screenshot **or** one short subline: *Verified junior tech hiring* — **not both** fighting for space.

---

#### Slide 2 — Problem (~60s)

**REMOVE:** Marion full persona card and block quote; three pain cards with paragraph descriptions; third pain card (“CV-AI learns past bias”) from slide (ok in speaker notes).

**KEEP:** Headline: *One junior role. Hundreds of look-alike CVs.*

**KEEP (one visual anchor):** Single big number: **28–35** with label *hours manual screening per junior hire*.

**OPTIONAL:** One short pain line only, e.g. *200–500+ applications · low signal* — no card grid.

---

#### Slide 3 — Solution (~60s)

**REMOVE:** Wedge sentence on slide (“between ATS and interview…”); 2-line descriptions under each of the 3 steps.

**KEEP:** One horizontal flow: **Upgrade ad → Prove skills → Rank evidence**

**FORMAT:** Three steps as **3–4 words each** with numbers or icons only — no paragraphs.

**Speaker notes:** ATS wedge positioning; practice ≠ application; rubric evidence.

---

#### Slide 4 — Live demo (~2–3 min) — setup slide only

**REMOVE:** Screenshot placeholder (presenter demos live); “memorable moment” quote on slide; “pre-loaded data · backup video” on slide; HR/CANDIDATE labels on every line; wrapped long bullets.

**KEEP:** Title: *Live demo*

**KEEP:** Exactly **4 short lines** (max ~8 words each):
1. Check listing  
2. Practice test  
3. Apply & submit  
4. Ranked shortlist  

**Speaker notes:** Narrate before/during/after clicks; memorable moment = ranked shortlist with rubric; backup video if API fails.

---

#### Slide 5 — Why AI (~60s)

**REMOVE:** Three columns each with title + paragraph; long EU AI Act footnote on slide; COGS asterisk and $0.22 detail on slide (move to appendix or notes).

**KEEP:** One simple pipeline diagram only:

`Job ad → Gemini → Assessment → Grade → Rank`

**OPTIONAL one line under diagram:** *Humans approve the ad and make the final hire.*

**Do not** add three benefit columns on the same slide.

---

#### Slide 6 — Market (~45s) — **SPLIT from old slide 6**

Old slide 6 combined market + competitors + pricing + GTM — **split into two slides (6 and 7 below).**

**REMOVE from this slide:** Pricing table; GTM chain; competitor paragraphs; “our edge” bullet list.

**KEEP:** Three numbers only (large typography):

| TAM | SAM | SOM (12–24 mo) |
|-----|-----|----------------|
| $5.25B | $1.84B | $9.2M |

**KEEP:** One wedge line: *Junior hiring evidence · companies 50–500 employees*

**OPTIONAL:** Three competitor labels as single words only: `ATS` · `Test platforms` · `Manual` — no descriptions on slide.

---

#### Slide 7 — Business model (~45s) — **new slide (was crammed into old 6)**

**REMOVE:** Full 4-row pricing table; Starter and Pro tiers on slide; GTM phased plan on slide.

**KEEP:** Headline: *Monthly subscription*

**KEEP:** **One highlighted tier** (Growth — “most popular”):
- **€299 / month**
- 5 active jobs · 300 graded candidates · unlimited seats

**KEEP:** One verbal range line (small): *Plans from €149–€899*

**KEEP:** One GTM line: *Paid pilots first*

**Speaker notes:** Full tier table, unit economics, founder outbound → case studies → referrals.

---

#### Slide 8 — Risks (~60s)

**REMOVE:** Full table with mitigation column (long text); regulatory row on main slide (mention orally or in Q&A); trade-off sentence on slide.

**KEEP:** Headline: *Risks we own*

**KEEP:** Three risks as **short labels** with likelihood only:

| Market | Tech | Adoption |
|--------|------|----------|
| No WTP · L4 | AI quality · L3 | Tool fatigue · L4 |

**Speaker notes:** Mitigation for each; EU AI Act Aug 2026; quality-at-speed trade-off.

---

#### Slide 9 — Ask (~30s)

**REMOVE:** “Next 90 days” three-bullet list (or max one line); clutter in footer.

**KEEP:** Headline: *The ask*

**KEEP:** One sentence: *10 paid pilots — or warm intros to Heads of Talent at 50–100 employee firms*

**KEEP:** One closing line: *We’re validating with real pilots and measurable ROI.*

**KEEP:** Team names (small, footer).

---

### What NOT to include in the main 8–9 slide deck

- Appendix A1 (unit economics boxes) — Q&A backup only  
- Appendix A2 (funnel math paragraph) — delete or one number in notes  
- Appendix A3 (architecture stack) — Q&A only  
- Appendix A4 (red-team Q&A blocks) — **speaker notes only**, never slides  
- Competitor pricing details, PEPM, Porter’s five forces  
- Full pricing table with 4 tiers  
- Marion’s full quote and bio  
- EU AI Act legal paragraph on slide  

---

### Output format

Deliver:

1. **Revised slide list** (slides 1–9): for each slide — title, **exact on-slide text** (minimal), visual layout description, speaker notes (2–5 sentences).
2. **Before/after note** per slide: what you removed and why (1 line each).
3. If generating code: **HTML/reveal.js** or structured format using the design tokens above — wide margins, 40%+ whitespace, no bullet walls.
4. Confirm total **presentation slides = 8–9** (not 12 with appendices in main flow).

### Quality check before finishing

- [ ] No slide has more than 3 bullet lines OR 1 table OR 1 diagram  
- [ ] Slide 6 and 7 are separate (market vs business)  
- [ ] Slide 4 has no screenshot box  
- [ ] Slide 5 has no three-column feature grid  
- [ ] Every mitigation and paragraph moved to speaker notes  

Do not change product facts: Gemini 3.1 Flash Lite, AI-only grading (no live sandbox in MVP), demo billing only, live URLs skillproof-z3j9.onrender.com.

---

## END PROMPT

### Reference: current deck pain points (from review)

| Slide | Main issue |
|-------|------------|
| 1 | Text + mockup + duplicate branding |
| 2 | Persona + 3 cards + big stat |
| 3 | 3 steps with paragraphs + wedge line |
| 4 | 4 long bullets + screenshot + quotes |
| 5 | 3 columns + pipeline + 2 footnotes |
| 6 | TAM/SAM/SOM + competitors + pricing table + GTM |
| 7 | 4-row risk table with mitigations |
| 8 | OK but trim “next 90 days” |
| A1–A4 | Too dense for oral — Q&A only |
