-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('CODE', 'MCQ');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "questionType" "QuestionType" NOT NULL DEFAULT 'CODE';
ALTER TABLE "Question" ADD COLUMN "mcqOptions" JSONB;
