import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { submissionId, device } = req.query;
  if (!submissionId || !device) return res.status(400).json({ error: 'Missing submissionId or device' });

  try {
    const file = await prisma.uploadedFile.findFirst({
      where: {
        submissionId: String(submissionId),
        deviceType: String(device),
      },
      orderBy: { uploadedAt: 'desc' },
    });
    if (!file) return res.status(404).json({ error: 'No file found' });
    res.status(200).json({
      fileUrl: file.fileUrl,
      fileKey: file.fileKey,
      fileName: file.fileName,
      contentType: file.contentType,
      uploadedAt: file.uploadedAt,
      extractedData: file.extractedData || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 