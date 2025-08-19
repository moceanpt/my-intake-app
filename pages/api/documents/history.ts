import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  
  const { clientId, deviceType, limit = '10' } = req.query;
  
  if (!clientId) {
    return res.status(400).json({ error: 'Missing clientId parameter' });
  }

  try {
    // Get all submissions for this client
    const submissions = await prisma.intakeSubmission.findMany({
      where: {
        clientId: String(clientId),
      },
      select: {
        id: true,
        submittedAt: true,
        status: true,
        uploadedFiles: {
          where: deviceType ? {
            deviceType: String(deviceType)
          } : {},
          orderBy: { uploadedAt: 'desc' },
          select: {
            id: true,
            fileName: true,
            fileUrl: true,
            fileKey: true,
            deviceType: true,
            uploadedAt: true,
            extractedData: true,
            fileSize: true,
            contentType: true,
          }
        },
        AssessmentMetric: {
          select: {
            metricKey: true,
            value: true,
            unit: true,
            deviceType: true,
            collectedAt: true,
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
      take: parseInt(String(limit)),
    });

    // Group documents by evaluation date and device type
    const documentHistory = submissions.map(submission => ({
      evaluationId: submission.id,
      evaluationDate: submission.submittedAt,
      status: submission.status,
      documents: submission.uploadedFiles.map(file => ({
        id: file.id,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileKey: file.fileKey,
        deviceType: file.deviceType,
        uploadedAt: file.uploadedAt,
        fileSize: file.fileSize,
        contentType: file.contentType,
        extractedData: file.extractedData,
        hasMetrics: submission.AssessmentMetric.some(metric => 
          metric.deviceType === file.deviceType
        )
      })),
      metrics: submission.AssessmentMetric,
      totalDocuments: submission.uploadedFiles.length,
      totalMetrics: submission.AssessmentMetric.length,
    }));

    res.status(200).json({
      clientId: String(clientId),
      totalEvaluations: submissions.length,
      documentHistory,
      summary: {
        totalDocuments: submissions.reduce((sum, sub) => sum + sub.uploadedFiles.length, 0),
        totalMetrics: submissions.reduce((sum, sub) => sum + sub.AssessmentMetric.length, 0),
        deviceTypes: [...new Set(submissions.flatMap(sub => sub.uploadedFiles.map(f => f.deviceType)))],
        dateRange: {
          earliest: submissions.length > 0 ? submissions[submissions.length - 1].submittedAt : null,
          latest: submissions.length > 0 ? submissions[0].submittedAt : null,
        }
      }
    });

  } catch (error) {
    console.error('Error fetching document history:', error);
    res.status(500).json({ error: 'Failed to fetch document history' });
  }
}
