-- AlterTable
ALTER TABLE "AssessmentMetric" ADD COLUMN     "fileKey" TEXT;

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" SERIAL NOT NULL,
    "submissionId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "deviceType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UploadedFile_submissionId_idx" ON "UploadedFile"("submissionId");

-- CreateIndex
CREATE INDEX "UploadedFile_deviceType_idx" ON "UploadedFile"("deviceType");

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IntakeSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
