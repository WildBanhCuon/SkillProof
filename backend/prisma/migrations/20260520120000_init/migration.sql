-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "HrRole" AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'ANALYZED', 'PUBLISHED', 'CLOSED');
CREATE TYPE "SkillImportance" AS ENUM ('MUST_HAVE', 'NICE_TO_HAVE');
CREATE TYPE "SessionType" AS ENUM ('PRACTICE', 'APPLICATION');
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED', 'GRADING', 'GRADED');
CREATE TYPE "Recommendation" AS ENUM ('READY_NOW', 'TRAINABLE', 'AT_RISK');
CREATE TYPE "Dimension" AS ENUM ('TECHNICAL', 'PROBLEM_SOLVING', 'CODE_QUALITY', 'COMMUNICATION');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HrUser" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "HrRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HrUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CandidateUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CandidateUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "hrUserId" TEXT,
    "candidateUserId" TEXT,
    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suggestedDescription" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ListingAnalysis" (
    "id" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "issues" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ListingAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SkillRequirement" (
    "id" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "importance" "SkillImportance" NOT NULL,
    "expectedLevel" TEXT NOT NULL,
    "testable" BOOLEAN NOT NULL,
    CONSTRAINT "SkillRequirement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 90,
    "totalPoints" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "starterCode" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "rubric" JSONB NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'javascript',
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SandboxTestCase" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT true,
    "input" TEXT,
    "expectedOutput" TEXT NOT NULL,
    "timeoutMs" INTEGER NOT NULL DEFAULT 5000,
    CONSTRAINT "SandboxTestCase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TestSession" (
    "id" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "candidateUserId" TEXT NOT NULL,
    "sessionType" "SessionType" NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    CONSTRAINT "TestSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "submittedCode" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SandboxRun" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "isHiddenSuite" BOOLEAN NOT NULL,
    "results" JSONB NOT NULL,
    "ranAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SandboxRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "candidateUserId" TEXT NOT NULL,
    "testSessionId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "visibleToCompany" BOOLEAN NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "matchPercent" INTEGER NOT NULL,
    "recommendation" "Recommendation" NOT NULL,
    "strengths" JSONB NOT NULL,
    "improvements" JSONB NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DimensionScore" (
    "id" TEXT NOT NULL,
    "testResultId" TEXT NOT NULL,
    "dimension" "Dimension" NOT NULL,
    "score0_100" INTEGER NOT NULL,
    CONSTRAINT "DimensionScore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiAuditLog" (
    "id" TEXT NOT NULL,
    "pipeline" TEXT NOT NULL,
    "referenceId" TEXT,
    "model" TEXT NOT NULL,
    "requestMeta" JSONB,
    "responseJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HrUser_email_key" ON "HrUser"("email");
CREATE UNIQUE INDEX "CandidateUser_email_key" ON "CandidateUser"("email");
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
CREATE INDEX "HrUser_companyId_idx" ON "HrUser"("companyId");
CREATE INDEX "JobPosting_companyId_idx" ON "JobPosting"("companyId");
CREATE INDEX "JobPosting_status_idx" ON "JobPosting"("status");
CREATE INDEX "ListingAnalysis_jobPostingId_idx" ON "ListingAnalysis"("jobPostingId");
CREATE INDEX "SkillRequirement_jobPostingId_idx" ON "SkillRequirement"("jobPostingId");
CREATE UNIQUE INDEX "Assessment_jobPostingId_key" ON "Assessment"("jobPostingId");
CREATE INDEX "Question_assessmentId_idx" ON "Question"("assessmentId");
CREATE INDEX "SandboxTestCase_questionId_idx" ON "SandboxTestCase"("questionId");
CREATE INDEX "TestSession_jobPostingId_idx" ON "TestSession"("jobPostingId");
CREATE INDEX "TestSession_candidateUserId_idx" ON "TestSession"("candidateUserId");
CREATE UNIQUE INDEX "Answer_sessionId_questionId_key" ON "Answer"("sessionId", "questionId");
CREATE INDEX "Answer_sessionId_idx" ON "Answer"("sessionId");
CREATE INDEX "SandboxRun_answerId_idx" ON "SandboxRun"("answerId");
CREATE UNIQUE INDEX "Application_testSessionId_key" ON "Application"("testSessionId");
CREATE UNIQUE INDEX "Application_jobPostingId_candidateUserId_key" ON "Application"("jobPostingId", "candidateUserId");
CREATE INDEX "Application_jobPostingId_idx" ON "Application"("jobPostingId");
CREATE UNIQUE INDEX "TestResult_sessionId_key" ON "TestResult"("sessionId");
CREATE UNIQUE INDEX "DimensionScore_testResultId_dimension_key" ON "DimensionScore"("testResultId", "dimension");
CREATE INDEX "AiAuditLog_pipeline_idx" ON "AiAuditLog"("pipeline");
CREATE INDEX "AiAuditLog_referenceId_idx" ON "AiAuditLog"("referenceId");

-- AddForeignKey
ALTER TABLE "HrUser" ADD CONSTRAINT "HrUser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_hrUserId_fkey" FOREIGN KEY ("hrUserId") REFERENCES "HrUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_candidateUserId_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "CandidateUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ListingAnalysis" ADD CONSTRAINT "ListingAnalysis_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SkillRequirement" ADD CONSTRAINT "SkillRequirement_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SandboxTestCase" ADD CONSTRAINT "SandboxTestCase_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_candidateUserId_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "CandidateUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TestSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SandboxRun" ADD CONSTRAINT "SandboxRun_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidateUserId_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "CandidateUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_testSessionId_fkey" FOREIGN KEY ("testSessionId") REFERENCES "TestSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TestSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DimensionScore" ADD CONSTRAINT "DimensionScore_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
