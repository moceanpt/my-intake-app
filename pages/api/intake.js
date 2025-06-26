/* pages/api/intake.js
   ------------------------------------------------------------------
   Saves a client intake and stores a PREVIEW plan (no e-mail)
   ------------------------------------------------------------------ */

   import { promises as fs } from "fs";
   import path    from "path";
   import crypto  from "crypto";
   import { z }   from "zod";
   
   import prisma               from "@/lib/prisma";
   import { buildPreview }    from "@/lib/planFactory";   // or '@/lib/score'
   
   
   

   /* 1 ▸ Zod schema */
   const IntakeSchema = z.object({
    clientId:    z.string().optional(),
    reasons:     z.array(z.string()),
     discomfort:  z.record(z.any()),
     history:     z.record(z.any()),
     hc:          z.record(z.any()),
     hcSlider:    z.record(z.any()),
     life:        z.record(z.any()),
     lifeOptIn:   z.boolean(),
     snapshot:    z.record(z.any()).optional(),
   });
   
   export default async function handler(req, res) {
     if (req.method !== "POST") {
       res.setHeader("Allow", "POST");
       return res.status(405).json({ error: "POST required" });
     }
   
     const parsed = IntakeSchema.safeParse(req.body);
     if (!parsed.success) return res.status(422).json(parsed.error);
   
     const data = parsed.data;
    /* TEMP sanity-check — remove later */
    console.log('⬅︎ full hcSlider:', JSON.stringify(data.hcSlider, null, 2));
  
    const submissionId = crypto.randomUUID();
   
     try {
       /* 2 ▸ Prisma transaction */
       await prisma.$transaction(async (tx) => {
         await tx.intakeSubmission.create({
           data: {
             id: submissionId,
             clientId: data.clientId ?? submissionId,  // fallback
             symptomChips      : data.hc,
            sliderValues      : data.hcSlider,   // NEW optional column
            lifestyleAnswers  : data.life,
            lifestyleOptIn    : data.lifeOptIn,  // store the flag
             rawReasons: data.reasons,
             rawDiscomfort: data.discomfort,
             rawHistory: data.history,
             status: "intake_submitted",
           },
         });
   
         const previewPlan = buildPreview({
          hc       : data.hc,
          hcSlider : data.hcSlider,  
          life     : data.lifeOptIn ? data.life : {},
        });
   
         await tx.planResult.create({
           data: {
             submissionId,
             stage: 'preview',   // cast if TS enum
             resultJson: previewPlan,
           },
         });
       });
   
     } catch (err) {
       /* 3 ▸ fallback to local JSON if DB is down */
       console.error("[api/intake] DB error, writing to local file:", err);
       await saveToLocalJSON(submissionId, data);
     }
   
     return res.status(200).json({ ok: true, id: submissionId });
   }
   
   /* helper: original JSON-file fallback (unchanged) */
   async function saveToLocalJSON(id, submission) {
     const dataDir = path.join(process.cwd(), "data");
     const file    = path.join(dataDir, "submissions.json");
   
     const record = {
       id,
       submittedAt: new Date().toISOString(),
       ...submission,
     };
   
     await fs.mkdir(dataDir, { recursive: true });
   
     let existing = [];
     try {
       const raw = await fs.readFile(file, "utf8");
       existing = JSON.parse(raw);
     } catch (_) { /* ignore */ }
   
     existing.push(record);
     await fs.writeFile(file, JSON.stringify(existing, null, 2));
   }

   