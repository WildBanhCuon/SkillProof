-- CreateTable
CREATE TABLE "CandidateProfile" (
    "id" TEXT NOT NULL,
    "candidateUserId" TEXT NOT NULL,
    "bio" TEXT,
    "phone" TEXT,
    "linkedInUrl" TEXT,
    "portfolioUrl" TEXT,
    "githubUrl" TEXT,
    "websiteUrl" TEXT,
    "resumeUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "JobPosting" ADD COLUMN "requiredProfileFields" JSONB NOT NULL DEFAULT '[]';

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_candidateUserId_key" ON "CandidateProfile"("candidateUserId");

-- AddForeignKey
ALTER TABLE "CandidateProfile" ADD CONSTRAINT "CandidateProfile_candidateUserId_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "CandidateUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
