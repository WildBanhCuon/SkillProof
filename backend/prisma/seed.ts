import {
  Dimension,
  JobStatus,
  PrismaClient,
  Recommendation,
  SessionStatus,
  SessionType,
  SkillImportance,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEMO_JOB_ID = '00000000-0000-0000-0000-000000000010';
const DEMO_ASSESSMENT_ID = '00000000-0000-0000-0000-000000000011';
const DEMO_SESSION_ID = '00000000-0000-0000-0000-000000000012';
const DEMO_APPLICATION_ID = '00000000-0000-0000-0000-000000000013';
const DEMO_RESULT_ID = '00000000-0000-0000-0000-000000000014';

const DEMO_DESCRIPTION = `We are hiring a Junior Frontend Developer to join our product team.

Responsibilities:
- Build features in React and TypeScript
- Collaborate with designers and backend engineers

Requirements:
- React, TypeScript, HTML, CSS, Git
- Strong communication skills`;

const DEMO_QUESTIONS = [
  {
    orderIndex: 0,
    title: 'React state',
    instructions: 'Fix the component so it displays the counter.',
    starterCode: 'function App() { return null; }',
    points: 25,
    language: 'javascript',
    rubric: { clarity: 5 },
    publicCase: { expectedOutput: 'ok' },
    hiddenCase: { expectedOutput: 'ok' },
  },
  {
    orderIndex: 1,
    title: 'API fetch',
    instructions: 'Fetch users from the API and return an array.',
    starterCode: 'async function load() {}',
    points: 25,
    language: 'javascript',
    rubric: { error_handling: 5 },
    publicCase: { expectedOutput: '[]' },
    hiddenCase: { expectedOutput: '[]' },
  },
  {
    orderIndex: 2,
    title: 'TypeScript types',
    instructions: 'Add proper types to the function.',
    starterCode: 'const x = 1;',
    points: 25,
    language: 'javascript',
    rubric: { types: 5 },
    publicCase: null,
    hiddenCase: { expectedOutput: '1' },
  },
  {
    orderIndex: 3,
    title: 'Debug UI',
    instructions: 'Find and fix the bug in the component.',
    starterCode: 'console.log("hi");',
    points: 25,
    language: 'javascript',
    rubric: { debugging: 5 },
    publicCase: null,
    hiddenCase: { expectedOutput: 'hi' },
  },
];

async function seedDemoJob(
  companyId: string,
  candidateId: string,
) {
  const expiresAt = new Date(Date.now() + 90 * 60 * 1000);

  await prisma.jobPosting.upsert({
    where: { id: DEMO_JOB_ID },
    update: {
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      description: DEMO_DESCRIPTION,
    },
    create: {
      id: DEMO_JOB_ID,
      companyId,
      title: 'Junior Frontend Developer',
      description: DEMO_DESCRIPTION,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      listingAnalyses: {
        create: {
          issues: [
            {
              type: 'seniority_mismatch',
              severity: 'high',
              message: 'Junior role asks for 3+ years',
              excerpt: '3+ years',
            },
          ],
        },
      },
      skillRequirements: {
        create: [
          {
            skillName: 'React',
            importance: SkillImportance.MUST_HAVE,
            expectedLevel: 'junior',
            testable: true,
          },
          {
            skillName: 'TypeScript',
            importance: SkillImportance.MUST_HAVE,
            expectedLevel: 'junior',
            testable: true,
          },
        ],
      },
      assessment: {
        create: {
          id: DEMO_ASSESSMENT_ID,
          durationMinutes: 90,
          totalPoints: 100,
          questions: {
            create: DEMO_QUESTIONS.map((q) => ({
              orderIndex: q.orderIndex,
              title: q.title,
              instructions: q.instructions,
              starterCode: q.starterCode,
              points: q.points,
              language: q.language,
              rubric: q.rubric,
              testCases: {
                create: [
                  ...(q.publicCase
                    ? [
                        {
                          isHidden: false,
                          input: null,
                          expectedOutput: q.publicCase.expectedOutput,
                        },
                      ]
                    : []),
                  {
                    isHidden: true,
                    input: null,
                    expectedOutput: q.hiddenCase.expectedOutput,
                  },
                ],
              },
            })),
          },
        },
      },
    },
  });

  const existingSession = await prisma.testSession.findUnique({
    where: { id: DEMO_SESSION_ID },
  });

  if (!existingSession) {
    const questions = await prisma.question.findMany({
      where: { assessmentId: DEMO_ASSESSMENT_ID },
      orderBy: { orderIndex: 'asc' },
    });

    await prisma.testSession.create({
      data: {
        id: DEMO_SESSION_ID,
        jobPostingId: DEMO_JOB_ID,
        candidateUserId: candidateId,
        sessionType: SessionType.APPLICATION,
        status: SessionStatus.GRADED,
        expiresAt,
        submittedAt: new Date(),
        answers: {
          create: questions.map((q) => ({
            questionId: q.id,
            submittedCode: q.starterCode,
          })),
        },
        application: {
          create: {
            id: DEMO_APPLICATION_ID,
            jobPostingId: DEMO_JOB_ID,
            candidateUserId: candidateId,
          },
        },
        testResult: {
          create: {
            id: DEMO_RESULT_ID,
            visibleToCompany: true,
            overallScore: 78,
            matchPercent: 82,
            recommendation: Recommendation.TRAINABLE,
            strengths: ['Solid React basics', 'Clear code structure'],
            improvements: ['Add loading states', 'Improve error handling'],
            aiSummary:
              'Good junior candidate with room to grow on async patterns.',
            dimensionScores: {
              create: [
                { dimension: Dimension.TECHNICAL, score0_100: 75 },
                { dimension: Dimension.PROBLEM_SOLVING, score0_100: 80 },
                { dimension: Dimension.CODE_QUALITY, score0_100: 72 },
                { dimension: Dimension.COMMUNICATION, score0_100: 85 },
              ],
            },
          },
        },
      },
    });
  }
}

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const company = await prisma.company.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Acme Corp',
      hrUsers: {
        create: {
          email: 'marion@acme.test',
          passwordHash,
          fullName: 'Marie D.',
          role: 'ADMIN',
        },
      },
    },
    include: { hrUsers: true },
  });

  const candidate = await prisma.candidateUser.upsert({
    where: { email: 'sofiane@test.com' },
    update: {},
    create: {
      email: 'sofiane@test.com',
      passwordHash,
      displayName: 'Sofiane K.',
    },
  });

  await seedDemoJob(company.id, candidate.id);

  console.log('Seed complete:');
  console.log('  HR: marion@acme.test / Password123!');
  console.log('  Candidate: sofiane@test.com / Password123!');
  console.log('  Company:', company.name);
  console.log('  Demo job (published): Junior Frontend Developer');
  console.log('  HR results: /hr/jobs/' + DEMO_JOB_ID + '/results');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
