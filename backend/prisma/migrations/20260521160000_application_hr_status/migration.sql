CREATE TYPE "ApplicationHrStatus" AS ENUM ('PENDING', 'INTERVIEW', 'DECLINED');

ALTER TABLE "Application" ADD COLUMN "hrStatus" "ApplicationHrStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Application" ADD COLUMN "hrDecidedAt" TIMESTAMP(3);
