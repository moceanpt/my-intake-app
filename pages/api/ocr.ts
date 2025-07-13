// pages/api/ocr.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File }      from 'formidable';
import fs                        from 'fs/promises';
import FormData                  from 'form-data';
import fetch                     from 'node-fetch';

// tell Next.js not to parse the request body
export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    /* ── 1 ▸ grab the uploaded PDF from multipart ───────────────── */
    const pdf: File = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, _fields, files) => {
        if (err) return reject(err);
        if (!files.file) return reject(new Error('No file uploaded'));
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        resolve(file as File);
      });
    });

    /* ── 2 ▸ build a new multipart body for FastAPI ─────────────── */
    const buffer = await fs.readFile(pdf.filepath);
    const form   = new FormData();
    form.append('file', buffer, pdf.originalFilename || 'upload.pdf');

    /* ── 3 ▸ POST to Python OCR micro-service ───────────────────── */
    const base = process.env.OCR_SERVICE_URL ?? 'http://localhost:8000';
    const pyRes = await fetch(`${base}/extract`, {
      method: 'POST',
      body:   form,
      // form-data sets its own Content-Type (with boundary) via getHeaders()
      headers: form.getHeaders(),
    });

    if (!pyRes.ok) {
      const text = await pyRes.text();
      return res.status(pyRes.status).json({ error: 'ocr failure', detail: text });
    }

    const data = await pyRes.json();   // { metrics: {...}, raw_text: "..." }
    return res.status(200).json(data);

  } catch (err: any) {
    console.error('[api/ocr] fatal:', err);
    return res.status(500).json({ error: err.message || 'internal error' });
  }
}