// pages/api/intake.js
// -------------------------------------------------------------
// Simple API route to receive MOCEAN intake submissions.
// • Accepts POST with JSON payload (see pages/intake.jsx)
// • Appends each submission to /data/submissions.json (creates if missing)
// • Responds with { ok: true, id } on success.
// -------------------------------------------------------------

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  
  const submission = req.body;

  // naive sanity‑check — make sure we have at least the reasons array & snapshot
  if (!submission?.reasons || !submission?.snapshot) {
    return res.status(400).json({ error: "Bad payload" });
  }

  // Add timestamp & unique id
  const id = crypto.randomUUID();
  const record = { id, submittedAt: new Date().toISOString(), ...submission };

  // Ensure data dir exists and append JSON line
  const dataDir = path.join(process.cwd(), "data");
  const file = path.join(dataDir, "submissions.json");

  try {
    await fs.mkdir(dataDir, { recursive: true });

    let existing = [];
    try {
      const raw = await fs.readFile(file, "utf8");
      existing = JSON.parse(raw);
    } catch (_) {
      /* file might not exist yet */
    }

    existing.push(record);
    await fs.writeFile(file, JSON.stringify(existing, null, 2));

    // TODO: You could email the data here with nodemailer, or push to Airtable.

    return res.status(200).json({ ok: true, id });
  } catch (err) {
    console.error("Intake save error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
