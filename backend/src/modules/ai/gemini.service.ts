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
  listingCheckSchema,
  ListingCheckResult,
  listingRewriteSchema,
  sessionGradeSchema,
  SessionGradeResult,
} from './ai.schemas';

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

  analyzeListing(
    jobId: string,
    title: string,
    description: string,
  ): Promise<ListingCheckResult> {
    const prompt = `You are an expert technical recruiter reviewing a JUNIOR FRONTEND DEVELOPER job posting.

Title: ${title}

Description:
${description}

Analyze for: unrealistic seniority, vague responsibilities, too many mandatory skills, inconsistent junior/senior stack.

Extract a skills matrix from the posting. Mark skills as testable if they can be assessed with a coding exercise.`;

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
    const prompt = `Rewrite this junior frontend job posting to fix these issues while keeping it professional and realistic.

Title: ${title}
Current:
${description}

Issues found:
${JSON.stringify(issues, null, 2)}`;

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
  ): Promise<AssessmentGenResult> {
    const prompt = `Generate a technical assessment for a Junior Frontend Developer role.

Job title: ${title}
Description:
${description}

Skills matrix:
${JSON.stringify(skills, null, 2)}

Create exactly 4 coding-focused questions (React, TypeScript, APIs, debugging). Total 100 points. Duration 90 minutes.
Each question needs starter code (JavaScript/React), instructions, rubric object, and 2-3 hidden test cases (input/expectedOutput for Judge0). Include at least 1 public sample test case per question with isHidden false.`;

    const schemaHint = `{
  "durationMinutes": 90,
  "totalPoints": 100,
  "questions": [{
    "title": "string",
    "instructions": "string",
    "starterCode": "string",
    "points": number,
    "language": "javascript",
    "rubric": {},
    "testCases": [{ "input": "string|null", "expectedOutput": "string", "isHidden": boolean }]
  }]
}`;

    return this.generateJson(
      'assessment_gen',
      jobId,
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
      questions: { id: string; title: string; points: number; rubric: unknown }[];
      answers: {
        questionId: string;
        code: string;
        sandboxResults: unknown;
      }[];
    },
  ): Promise<SessionGradeResult> {
    const prompt = `Grade this junior frontend assessment submission. Use sandbox results and code quality.

Job: ${context.jobTitle}
Required skills: ${context.skills.join(', ')}

${context.questions
  .map(
    (q) => `
Question ${q.title} (${q.points} pts):
Rubric: ${JSON.stringify(q.rubric)}
Answer: ${
      context.answers.find((a) => a.questionId === q.id)?.code ?? '(empty)'
    }
Sandbox: ${JSON.stringify(
      context.answers.find((a) => a.questionId === q.id)?.sandboxResults ?? {},
    )}
`,
  )
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
