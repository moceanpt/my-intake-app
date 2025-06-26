/*
  Warnings:

  - Added the required column `rawDiscomfort` to the `IntakeSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawHistory` to the `IntakeSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawReasons` to the `IntakeSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IntakeSubmission" ADD COLUMN     "rawDiscomfort" JSONB NOT NULL,
ADD COLUMN     "rawHistory" JSONB NOT NULL,
ADD COLUMN     "rawReasons" JSONB NOT NULL;
