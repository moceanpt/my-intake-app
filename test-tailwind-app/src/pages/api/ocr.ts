// pages/api/ocr.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import OpenAI from 'openai';

// tell Next.js not to parse the request body
export const config = { api: { bodyParser: false } };

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple AI extraction function
async function extractDataWithAI(base64Image: string, deviceType: string = 'auto'): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert at extracting health metrics from medical device reports. 
              Analyze this image and extract any numerical health metrics you can find. 
              Return the data as a JSON object with clear key names and numeric values only.
              Device type: ${deviceType}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Try to parse JSON from the response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON from AI response:', parseError);
    }

    // Return raw text if JSON parsing fails
    return { raw_text: content, extracted_metrics: 'See raw_text for extracted data' };

  } catch (error) {
    console.error('AI extraction error:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    /* ── 1 ▸ grab the uploaded PDF from multipart ───────────────── */
    const pdf: File = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        if (!files.file) return reject(new Error('No file uploaded'));
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        resolve(file as File);
      });
    });

    /* ── 2 ▸ read the file and convert to base64 ────────────────── */
    const buffer = await fs.readFile(pdf.filepath);
    const base64Image = buffer.toString('base64');
    const mimeType = pdf.mimetype || 'application/pdf';

    /* ── 3 ▸ determine device type from query params ────────────── */
    const deviceType = req.query.deviceType as string || 'auto';

    /* ── 4 ▸ use AI extraction ──────────────────────────────────── */
    const extractedData = await extractDataWithAI(base64Image, deviceType);

    /* ── 5 ▸ return the extracted data ──────────────────────────── */
    return res.status(200).json({
      success: true,
      data: extractedData,
      message: 'Data extracted successfully using AI OCR',
      deviceType
    });

  } catch (err: any) {
    console.error('[api/ocr] fatal:', err);
    return res.status(500).json({ 
      error: err.message || 'internal error',
      message: 'AI OCR extraction failed'
    });
  }
}