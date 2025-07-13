/*
  Warnings:

  - The primary key for the `IntakeSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `goals` on the `IntakeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `healthScores` on the `IntakeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `lifestyle` on the `IntakeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `lifestyleSummary` on the `IntakeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `radarData` on the `IntakeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `smartPrompts` on the `IntakeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `IntakeSubmission` table. All the data in the column will be lost.
  - The required column `id` was added to the `IntakeSubmission` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `lifestyleAnswers` to the `IntakeSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stressScores` to the `IntakeSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supportScores` to the `IntakeSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symptomChips` to the `IntakeSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('intake_submitted', 'intake_reviewed', 'assessments_pending', 'metrics_entered', 'plan_generated', 'plan_sent');

-- DropForeignKey
ALTER TABLE "Implant" DROP CONSTRAINT "Implant_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "Surgery" DROP CONSTRAINT "Surgery_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "Symptom" DROP CONSTRAINT "Symptom_submissionId_fkey";

-- AlterTable
ALTER TABLE "IntakeSubmission" DROP CONSTRAINT "IntakeSubmission_pkey",
DROP COLUMN "goals",
DROP COLUMN "healthScores",
DROP COLUMN "lifestyle",
DROP COLUMN "lifestyleSummary",
DROP COLUMN "radarData",
DROP COLUMN "smartPrompts",
DROP COLUMN "submissionId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "lifestyleAnswers" JSONB NOT NULL,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'intake_submitted',
ADD COLUMN     "stressScores" JSONB NOT NULL,
ADD COLUMN     "supportScores" JSONB NOT NULL,
ADD COLUMN     "symptomChips" JSONB NOT NULL,
ADD CONSTRAINT "IntakeSubmission_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "AssessmentMetric" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "metricKey" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "deviceType" TEXT,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanResult" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "resultJson" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssessmentMetric_metricKey_idx" ON "AssessmentMetric"("metricKey");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentMetric_submissionId_metricKey_key" ON "AssessmentMetric"("submissionId", "metricKey");

-- CreateIndex
CREATE UNIQUE INDEX "PlanResult_submissionId_key" ON "PlanResult"("submissionId");

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Implant" ADD CONSTRAINT "Implant_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentMetric" ADD CONSTRAINT "AssessmentMetric_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanResult" ADD CONSTRAINT "PlanResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
