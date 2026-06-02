-- CreateEnum
CREATE TYPE "AssessmentPurpose" AS ENUM ('PRACTICE', 'APPLICATION');

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN "purpose" "AssessmentPurpose";

UPDATE "Assessment" SET "purpose" = 'APPLICATION' WHERE "purpose" IS NULL;

ALTER TABLE "Assessment" ALTER COLUMN "purpose" SET NOT NULL;

-- DropIndex
DROP INDEX "Assessment_jobPostingId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_jobPostingId_purpose_key" ON "Assessment"("jobPostingId", "purpose");

CREATE INDEX "Assessment_jobPostingId_idx" ON "Assessment"("jobPostingId");
