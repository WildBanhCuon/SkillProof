import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../../prisma/prisma.service';
import {
  assessmentGenSchema,
  AssessmentGenResult,
  jobWizardGenSchema,
  JobWizardGenResult,
  listingCheckSchema,
  ListingCheckResult,
  listingRewriteSchema,
  sessionGradeSchema,
  SessionGradeResult,
  teamProfileFromWebSchema,
  TeamProfileFromWebResult,
} from './ai.schemas';
import type { PageExcerpt } from '../web/webpage-fetch.service';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly model: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.model = config.get('GEMINI_MODEL', 'gemini-2.0-flash');
  }

  private getClient() {
    const key = this.config.get<string>('GEMINI_API_KEY');
    if (!key) {
      throw new BadGatewayException(
        'GEMINI_API_KEY is not configured. Set it in .env to use AI features.',
      );
    }
    return new GoogleGenerativeAI(key);
  }

  /** Map Google SDK / HTTP errors to messages shown in the UI. */
  private throwGeminiError(pipeline: string, err: unknown): never {
    const raw = err instanceof Error ? err.message : String(err);

    if (
      raw.includes('429') ||
      raw.toLowerCase().includes('too many requests')
    ) {
      if (
        raw.includes('prepayment credits are depleted') ||
        raw.includes('billing')
      ) {
        throw new HttpException(
          'Gemini prepaid credits are depleted. Add billing or top up at https://ai.studio/projects (see https://ai.google.dev/gemini-api/docs/billing#prepay).',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Gemini rate limit exceeded. Wait a moment and try again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (
      raw.includes('API key not valid') ||
      raw.includes('API_KEY_INVALID') ||
      raw.includes('403')
    ) {
      throw new BadGatewayException(
        'GEMINI_API_KEY is invalid or lacks permission for this model.',
      );
    }

    const bracketDetail = raw.match(/\]\s+(.+)$/s)?.[1]?.trim();
    const detail = (bracketDetail ?? raw).slice(0, 400);
    throw new BadGatewayException(`Gemini ${pipeline} failed: ${detail}`);
  }

  private async generateJson<T>(
    pipeline: string,
    referenceId: string | undefined,
    prompt: string,
    schemaHint: string,
    parse: (raw: unknown) => T,
  ): Promise<T> {
    const genAI = this.getClient();
    const model = genAI.getGenerativeModel({
      model: this.model,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const fullPrompt = `${prompt}\n\nRespond with valid JSON only matching this shape:\n${schemaHint}`;

    try {
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      const parsed = JSON.parse(text) as unknown;
      const validated = parse(parsed);

      await this.prisma.aiAuditLog.create({
        data: {
          pipeline,
          referenceId,
          model: this.model,
          requestMeta: { promptLength: fullPrompt.length },
          responseJson: validated as object,
        },
      });

      return validated;
    } catch (err) {
      this.logger.error(`Gemini ${pipeline} failed`, err);
      this.throwGeminiError(pipeline, err);
    }
  }

  generateJobFromWizard(answers: Record<string, string>): Promise<JobWizardGenResult> {
    const prompt = `You are an expert technical recruiter writing a job posting for a tech hire.

Use the employer's questionnaire answers below. Write a complete, professional job ad in Markdown:
- Use ### for section headings (e.g. About the role, Responsibilities, Requirements, Nice to have)
- Use bullet lists for responsibilities and requirements
- Use **bold** sparingly for emphasis
- Keep seniority realistic: if they want a junior/intern, do NOT ask for 5+ years or staff-level stacks unless they explicitly asked
- Separate must-have vs nice-to-have skills clearly
- Include work mode and location when provided
- Tone should match their preference
- Be inclusive and clear; avoid buzzword soup

Questionnaire answers:
${JSON.stringify(answers, null, 2)}`;

    const schemaHint = `{
  "title": "string (concise job title)",
  "description": "string (full markdown job posting body, do not repeat the title as H1)"
}`;

    return this.generateJson(
      'job_wizard',
      undefined,
      prompt,
      schemaHint,
      (raw) => jobWizardGenSchema.parse(raw),
    );
  }

  generateTeamProfileFromWebsite(
    companyId: string | undefined,
    companyName: string,
    websiteUrl: string,
    excerpts: PageExcerpt[],
  ): Promise<TeamProfileFromWebResult & { sources: string[] }> {
    const combined = excerpts
      .map((e) => `--- ${e.url} ---\n${e.text}`)
      .join('\n\n')
      .slice(0, 14000);

    const prompt = `Write a short "about our team and product" blurb for job postings.

Company name: ${companyName}
Website: ${websiteUrl}

Use ONLY facts supported by the public website excerpts below. Do not invent funding, headcount, or tech stack items that are not mentioned.
- 2–4 sentences, plain professional English (match the site's language if clearly French)
- Suitable to paste into a job creation wizard as context for candidates
- Mention what the company does, who they serve, and team vibe if stated
- No markdown headings; single paragraph or two short paragraphs

Website excerpts:
${combined}`;

    const schemaHint = `{ "teamProfile": "string (min 10 chars)" }`;

    return this.generateJson(
      'company_profile_from_web',
      companyId,
      prompt,
      schemaHint,
      (raw) => {
        const parsed = teamProfileFromWebSchema.parse(raw);
        return { ...parsed, sources: excerpts.map((e) => e.url) };
      },
    );
  }

  analyzeListing(
    jobId: string,
    title: string,
    description: string,
  ): Promise<ListingCheckResult> {
    const prompt = `You are a pragmatic technical recruiter reviewing a job posting.

Title: ${title}

Description:
${description}

Your job is to decide if this listing is **good enough to publish** for the seniority level stated in the title — not to achieve perfection.

## When to return ZERO issues (issues: [])
Return an empty issues array when:
- Seniority in the title matches the experience and tasks described (e.g. junior + 0-1 years + mentorship/supervision is fine)
- Responsibilities are plausible for that level, even if some tasks touch PHP, WooCommerce, etc. for a junior WordPress role when framed as assisted/supervised work
- Wording is clear enough for candidates; minor style preferences are NOT issues
- Subjective phrases ("strong coding logic", "proactive mindset") are NOT issues unless they are the ONLY concrete requirement
- The listing was already improved and remaining concerns are nitpicks, not blockers

It is valid and expected to return **no issues** for a solid posting. Do not invent issues to be helpful.

## Only flag substantive issues (max 3 unless severe)
Use **high** only for clear blockers: wrong seniority band (junior title + 5+ years required), contradictory requirements, or scope far above the role level with no mentorship framing.
Use **medium** for fixable clarity problems: vague critical requirements, too many must-haves for a junior, internal contradictions.
Use **low** sparingly — omit low issues if the listing is otherwise publishable.

Do NOT flag:
- Tasks that are reasonable with "under supervision", "assist", "support", or "mentorship" already stated
- Title vs stack mismatch when the stack matches the job (WordPress junior + Elementor is fine)
- Preference for more specificity when the posting is already adequate

## Skills matrix
Extract skills from the posting (role-appropriate). Mark testable=true only for skills assessable with a coding exercise; WordPress/CMS-only configuration may be testable=false.`;

    const schemaHint = `{
  "issues": [{ "type": "string", "severity": "low|medium|high", "message": "string", "excerpt": "string" }],
  "skills": [{ "skillName": "string", "importance": "must_have|nice_to_have", "expectedLevel": "string", "testable": boolean }]
}`;

    return this.generateJson(
      'listing_check',
      jobId,
      prompt,
      schemaHint,
      (raw) => listingCheckSchema.parse(raw),
    );
  }

  rewriteListing(
    jobId: string,
    title: string,
    description: string,
    issues: unknown,
  ): Promise<{ improvedDescription: string }> {
    const prompt = `Rewrite this job posting to address ONLY the listed issues. Do not introduce new requirements or keep editing for hypothetical improvements.

Title: ${title}
Current:
${description}

Issues to fix (if empty, return the description with light polish only):
${JSON.stringify(issues, null, 2)}

Rules:
- Fix high and medium issues; ignore subjective nitpicks unless explicitly listed as high/medium
- Preserve tone, location, work mode, and seniority level
- Keep markdown structure (### headings, bullet lists)
- If issues are minor, make minimal targeted edits — do not rewrite the whole ad unnecessarily`;

    const schemaHint = `{ "improvedDescription": "string (markdown ok)" }`;

    return this.generateJson(
      'listing_rewrite',
      jobId,
      prompt,
      schemaHint,
      (raw) => listingRewriteSchema.parse(raw),
    );
  }

  generateAssessment(
    jobId: string,
    title: string,
    description: string,
    skills: { skillName: string; importance: string; testable: boolean }[],
    variant: 'practice' | 'application' = 'application',
    applicationQuestionTitles: string[] = [],
  ): Promise<AssessmentGenResult> {
    const testableSkills = skills.filter((s) => s.testable);
    const variantRules =
      variant === 'practice'
        ? `
This is the PRACTICE version (candidates take it before applying). It must:
- Cover the same testable skills and job stack as the official application test, but with DIFFERENT exercises, scenarios, and question titles.
- NOT reuse or paraphrase these official application question titles: ${applicationQuestionTitles.length ? applicationQuestionTitles.map((t) => JSON.stringify(t)).join(', ') : '(none yet)'}
- Use different starter code and instructions so practice answers cannot be copied into the real application test.`
        : `
This is the OFFICIAL APPLICATION version (used when the candidate applies). Candidates never see these exact questions during practice.`;

    const prompt = `Generate a technical assessment tailored to THIS job posting — not a generic frontend template.
${variantRules}

Job title: ${title}
Description:
${description}

Skills matrix (full):
${JSON.stringify(skills, null, 2)}

Testable skills (build questions ONLY from these — one question should map to each testable skill when possible):
${JSON.stringify(testableSkills, null, 2)}

Rules:
- Create exactly 4 coding-focused questions. Total 100 points. Duration 90 minutes.
- Match the stack in the job (e.g. WordPress/Elementor/WooCommerce/CSS/PHP — NOT React/TypeScript/Vue unless the job title or description explicitly requires them).
- Do NOT invent React, SPA, or jsonplaceholder API exercises for WordPress/CMS roles.
- Prefer exercises the candidate can do in the Monaco editor: CSS, HTML snippets, JavaScript for DOM/fetch, PHP for WordPress hooks/templates when PHP is testable.
- Set "language" to javascript, css, php, or python as appropriate (css for pure styling tasks).
- Each question needs starter code, clear instructions, and a rubric object for AI grading (no automated test cases).`;

    const schemaHint = `{
  "durationMinutes": 90,
  "totalPoints": 100,
  "questions": [{
    "title": "string",
    "instructions": "string",
    "starterCode": "string",
    "points": number,
    "language": "javascript|css|php|python",
    "rubric": {}
  }]
}`;

    return this.generateJson(
      variant === 'practice' ? 'assessment_gen_practice' : 'assessment_gen',
      `${jobId}:${variant}`,
      prompt,
      schemaHint,
      (raw) => assessmentGenSchema.parse(raw),
    );
  }

  gradeSession(
    sessionId: string,
    context: {
      jobTitle: string;
      skills: string[];
      questions: {
        id: string;
        title: string;
        points: number;
        rubric: unknown;
        instructions: string;
      }[];
      answers: {
        questionId: string;
        code: string;
        notes?: string | null;
      }[];
    },
  ): Promise<SessionGradeResult> {
    const prompt = `Grade this technical assessment submission for the role below. Evaluate each answer against the question instructions and rubric. Consider code quality, correctness, and fit for THIS job — not a generic React developer bar.

Job: ${context.jobTitle}
Required skills: ${context.skills.join(', ')}

${context.questions
  .map((q) => {
    const answer = context.answers.find((a) => a.questionId === q.id);
    return `
Question ${q.title} (${q.points} pts):
Instructions: ${q.instructions}
Rubric: ${JSON.stringify(q.rubric)}
Submitted code:
${answer?.code?.trim() ? answer.code : '(empty)'}
${answer?.notes ? `Candidate notes: ${answer.notes}` : ''}`;
  })
  .join('\n')}

Provide overallScore 0-100, matchPercent vs job skills, recommendation (ready_now|trainable|at_risk), strengths[], improvements[], aiSummary, dimensionScores for technical, problem_solving, code_quality, communication.`;

    const schemaHint = sessionGradeSchema.toString();

    return this.generateJson(
      'session_grade',
      sessionId,
      prompt,
      `{
  "overallScore": number,
  "matchPercent": number,
  "recommendation": "ready_now|trainable|at_risk",
  "strengths": ["string"],
  "improvements": ["string"],
  "aiSummary": "string",
  "dimensionScores": [{ "dimension": "technical|problem_solving|code_quality|communication", "score": number }]
}`,
      (raw) => sessionGradeSchema.parse(raw),
    );
  }
}
