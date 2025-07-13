import type { NextApiRequest, NextApiResponse } from 'next';
import { chromium } from '@playwright/test';
import prisma from '@/lib/prisma';                               // default export
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, stage = 'final' } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });

    /* 1 ▸ headless Chromium ---------------------------------- */
    const browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],       // safer for prod
    });
    const page  = await browser.newPage();
    const base  = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    await page.goto(`${base}/print/plan/${id}?stage=${stage}`, {
      waitUntil: 'networkidle',
    });

    /* 2 ▸ generate buffer ----------------------------------- */
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    /* 3 ▸ S3 upload ----------------------------------------- */
    let pdfUrl: string | null = null;
    if (process.env.S3_BUCKET) {
      const key = `plans/${id}-${stage}-${uuid()}.pdf`;
      const s3  = new S3Client({ region: process.env.AWS_REGION });
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      }));
      pdfUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;

      /* persist URL so "Download" button appears */
      await prisma.planResult.update({
        where: {
          submissionId_stage: {
            submissionId: String(id),
            stage: String(stage) as 'preview' | 'final',
          },
        },
        data: { pdfUrl },
      });
    }

    /* 4 ▸ stream back to therapist -------------------------- */
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=plan-${id}.pdf`);
    return res.send(pdfBuffer);

  } catch (err) {
    console.error('[api/pdf] fatal', err);
    return res.status(500).json({ error: 'PDF generation failed' });
  }
}