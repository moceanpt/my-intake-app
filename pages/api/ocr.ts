// pages/api/ocr.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { ApiErrorHandler } from '@/lib/api/errorHandler';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(
      ApiErrorHandler.createErrorResponse('Method not allowed', 405)
    );
  }

  try {
    const form = formidable();
    
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file;
    if (!file || Array.isArray(file)) {
      return res.status(400).json(
        ApiErrorHandler.createErrorResponse('No file uploaded or multiple files not supported', 400)
      );
    }

    // Convert file to base64 for OpenAI Vision
    const fs = require('fs');
    const fileBuffer = fs.readFileSync((file as formidable.File).filepath);
    const base64Image = fileBuffer.toString('base64');

    // Extract data using AI
    const extractedData = await extractDataWithAI(base64Image);

    // Clean up uploaded file
    fs.unlinkSync((file as formidable.File).filepath);

    return res.status(200).json(
      ApiErrorHandler.createSuccessResponse({
        metrics: extractedData,
        message: 'Data extracted successfully'
      })
    );

  } catch (error) {
    console.error('OCR API Error:', error);
    
    // Handle specific error types
    if (error.message?.includes('file')) {
      return res.status(400).json(
        ApiErrorHandler.createErrorResponse('Invalid file format. Please upload a valid image or PDF.', 400)
      );
    }

    if (error.message?.includes('OpenAI') || error.message?.includes('API')) {
      return res.status(503).json(
        ApiErrorHandler.createErrorResponse('AI service temporarily unavailable. Please try again later.', 503)
      );
    }

    return res.status(500).json(
      ApiErrorHandler.createErrorResponse('Failed to process file. Please try again.', 500)
    );
  }
}

async function extractDataWithAI(base64Image: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all health metrics from this image. Return only valid JSON with the following structure: { "hydration": number, "smm_pct": number, "body_fat_pct": number, "ecw_tbw": number, "vfa": number, "phase_angle": number, "weight": number, "body_fat_mass": number, "smm_mass": number, "tbw": number }. If a metric is not found, use null. Only return the JSON object, no other text.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    try {
      const metrics = JSON.parse(content);
      return metrics;
    } catch (parseError) {
      throw new Error('Invalid JSON response from AI service');
    }

  } catch (error) {
    console.error('AI extraction error:', error);
    throw error;
  }
}