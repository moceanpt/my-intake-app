-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('safe', 'caution', 'review');

-- CreateTable
CREATE TABLE "IntakeSubmission" (
    "submissionId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goals" JSONB NOT NULL,
    "healthScores" JSONB NOT NULL,
    "lifestyle" JSONB NOT NULL,
    "radarData" JSONB NOT NULL,
    "smartPrompts" JSONB,
    "lifestyleSummary" TEXT,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'safe',

    CONSTRAINT "IntakeSubmission_pkey" PRIMARY KEY ("submissionId")
);

-- CreateTable
CREATE TABLE "Surgery" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "bodyRegion" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Surgery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Implant" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "implantCode" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "side" TEXT,

    CONSTRAINT "Implant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "chipCode" TEXT NOT NULL,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntakeSubmission_clientId_idx" ON "IntakeSubmission"("clientId");

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("submissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Implant" ADD CONSTRAINT "Implant_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("submissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("submissionId") ON DELETE RESTRICT ON UPDATE CASCADE;
