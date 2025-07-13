/*
  Warnings:

  - A unique constraint covering the columns `[submissionId,stage]` on the table `PlanResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PlanStage" AS ENUM ('preview', 'final');

-- DropIndex
DROP INDEX "PlanResult_submissionId_key";

-- AlterTable
ALTER TABLE "PlanResult" ADD COLUMN     "notes" JSONB,
ADD COLUMN     "stage" "PlanStage" NOT NULL DEFAULT 'preview';

-- CreateIndex
CREATE UNIQUE INDEX "PlanResult_submissionId_stage_key" ON "PlanResult"("submissionId", "stage");
