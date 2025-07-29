import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import { fromPath } from 'pdf2pic';
import { uploadFileToS3 } from '../../lib/s3';
import { prisma } from '../../lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.log('ai-extract-multipage loaded. AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);

export const config = { api: { bodyParser: false } };

const DEVICE_ORDER = [
  { id: 'exbody', name: 'ExBody' },
  { id: 'exbody_rom', name: 'ExBody ROM' },
  { id: 'inbody', name: 'InBody' },
  { id: 'omnifit_ppg', name: 'OmniFit PPG' },
  { id: 'omnifit_eeg', name: 'OmniFit EEG' },
  { id: 'auracom', name: 'Auracom' },
  { id: 'heartmath', name: 'HeartMath' },
];

// Import prompts from ai-extract
import { DEVICE_PROMPTS } from './ai-extract';

async function extractDeviceData(deviceType, base64Image, mimeType) {
  const prompt = DEVICE_PROMPTS[deviceType];
  const models = deviceType.startsWith('omnifit') ? ["gpt-4o", "gpt-4o-mini"] : ["gpt-4o-mini", "gpt-4o"];
  let extractedData = null;
  let lastError: any = null;
  let extractedText: string = '';
  for (const model of models) {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      });
      extractedText = response.choices[0]?.message?.content || '';
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
        break;
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  return { extractedData: extractedData || undefined, lastError, extractedText };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    console.log('Multipage handler called');
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];
    const submissionId = fields.submissionId?.[0];
    if (!file || !submissionId) {
      console.error('Missing file or submissionId');
      return res.status(400).json({ error: 'Missing file or submissionId' });
    }
    if (file.mimetype !== 'application/pdf') {
      console.error('Only PDF files are supported');
      return res.status(400).json({ error: 'Only PDF files are supported' });
    }

    // Split PDF into images
    const convert = fromPath(file.filepath, {
      density: 300,
      saveFilename: "page",
      savePath: "/tmp",
      format: "png",
      width: 2480,
      height: 3508
    });
    const results: Array<{ device: string; fileUrl: string | null; fileKey: string | null; extractedData: any; error: string | null }> = [];
    for (let i = 1; i <= DEVICE_ORDER.length; i++) {
      let deviceType = DEVICE_ORDER[i-1].id;
      try {
        console.log(`Processing page ${i} for device ${deviceType}`);
        const result = await convert(i, { responseType: 'base64' });
        let base64Image = result.base64 || '';
        base64Image = base64Image.replace(/\s/g, '');
        const padding = 4 - (base64Image.length % 4);
        if (padding !== 4) base64Image += '='.repeat(padding);
        const s3Key = `clients/${submissionId}/${DEVICE_ORDER[i-1].id}/${Date.now()}-page${i}.png`;
        const buffer = Buffer.from(base64Image, 'base64');
        const uploadResult = await uploadFileToS3(buffer, `page${i}.png`, 'image/png', `clients/${submissionId}/${DEVICE_ORDER[i-1].id}`);

        // Extract data for all devices
        const { extractedData, lastError } = await extractDeviceData(deviceType, base64Image, 'image/png');
        await prisma.uploadedFile.create({
          data: {
            submissionId,
            fileName: `page${i}.png`,
            fileKey: uploadResult.key,
            fileUrl: uploadResult.url,
            contentType: 'image/png',
            fileSize: buffer.length,
            deviceType: deviceType,
            extractedData: extractedData ?? undefined,
          },
        });
        results.push({
          device: deviceType,
          fileUrl: uploadResult.url,
          fileKey: uploadResult.key,
          extractedData,
          error: lastError ? (lastError.message || String(lastError)) : null
        });
        console.log(`Finished device ${deviceType}`);
      } catch (err) {
        console.error(`Error processing page ${i} for device ${deviceType}:`, err);
        results.push({
          device: deviceType,
          fileUrl: null,
          fileKey: null,
          extractedData: null,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }
    return res.status(200).json({ results });
  } catch (err) {
    console.error('Error processing request:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}