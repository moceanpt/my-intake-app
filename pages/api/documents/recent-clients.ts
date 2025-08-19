import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Get clients with the most recent activity
    const recentClients = await prisma.intakeSubmission.groupBy({
      by: ['clientId'],
      _count: {
        id: true,
      },
      _max: {
        submittedAt: true,
      },
      orderBy: {
        _max: {
          submittedAt: 'desc',
        },
      },
      take: 10,
    });

    // Get detailed information for each client
    const clientsWithDetails = await Promise.all(
      recentClients.map(async (client) => {
        const submissions = await prisma.intakeSubmission.findMany({
          where: {
            clientId: client.clientId,
          },
          select: {
            id: true,
            submittedAt: true,
            status: true,
            uploadedFiles: {
              select: {
                id: true,
                deviceType: true,
                uploadedAt: true,
              },
            },
            AssessmentMetric: {
              select: {
                id: true,
                deviceType: true,
                collectedAt: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
        });

        const totalDocuments = submissions.reduce((sum, sub) => sum + sub.uploadedFiles.length, 0);
        const totalMetrics = submissions.reduce((sum, sub) => sum + sub.AssessmentMetric.length, 0);
        const lastActivity = client._max.submittedAt;

        return {
          clientId: client.clientId,
          totalEvaluations: client._count.id,
          totalDocuments,
          totalMetrics,
          lastActivity,
          deviceTypes: [...new Set(submissions.flatMap(sub => sub.uploadedFiles.map(f => f.deviceType)))],
        };
      })
    );

    res.status(200).json({
      clients: clientsWithDetails,
      total: clientsWithDetails.length,
    });

  } catch (error) {
    console.error('Error fetching recent clients:', error);
    res.status(500).json({ error: 'Failed to fetch recent clients' });
  }
}
