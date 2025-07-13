import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Device-specific prompts for data extraction
const DEVICE_PROMPTS = {
  inbody: `You are an expert at reading "InBody" body-composition reports.

When I give you an InBody page (image **or** OCR text) you must:

1. Extract these eight metrics ⬇️  
   • Total Body Water (lb)            ➜  tbw_lb  
   • Weight (lb)                      ➜  weight_lb  
   • Skeletal Muscle Mass (lb)        ➜  smm_lb  
   • Body Fat Mass (lb)               ➜  body_fat_lb  
   • Percent Body Fat (%)             ➜  pbf_pct  
   • ECW / TBW ratio                  ➜  ecw_tbw  
   • Visceral Fat Area (cm²)          ➜  vfa_cm2  
   • Whole-Body Phase Angle (°)       ➜  phase_angle_deg  

2. Return **only** a valid JSON object with exactly these keys (all lower-case, snake-case, in the order shown) and **numeric values** (no units, no strings).  
   Example shape:  
   {
     "tbw_lb": 100.8,
     "weight_lb": 181.1,
     "smm_lb": 78.3,
     "body_fat_lb": 42.9,
     "pbf_pct": 23.7,
     "ecw_tbw": 0.372,
     "vfa_cm2": 78.7,
     "phase_angle_deg": 6.7
   }`,

  auracom: `You are an expert at reading *Auracom* (Ava-Aura) bio-field reports.

**Task:** From the page(s) you see, extract these numeric metrics (no units) and return **only** a valid JSON object with the exact keys shown below.  
If a value is completely missing, output \`null\` for that key.

Required keys
-------------
{
  "ava_score":        number,   // the big red-label "Ava:###"
  "vigor":            number,   // violet/magenta "Vigor" bar
  "stability":        number,   // purple "Stability" bar
  "activity_percent": number,   // % at the mid-point of the blue-red Activity↔Relaxation gauge
  "wood":             number,   // Five-element bar "A"
  "fire":             number,   // bar "B"
  "earth":            number,   // bar "C"
  "metal":            number,   // bar "D"
  "water":            number    // bar "E"
}

Extraction hints
----------------
- "Ava:###" is usually printed in red, right of the aura photo; grab the digits only.
- Vigor & Stability use vertical coloured bar-charts with the value printed at the top of each bar.
- *Activity %* is the numeric value closest to the coloured diamond/marker on the horizontal "Activity – Relaxation" line.
- The Five-element balance bars are labelled **A B C D E** (Wood, Fire, Earth, Metal, Water); use the numbers above each bar.
- Ignore any units, words, or extra text; output bare numbers.
- Do **not** invent or estimate values; use \`null\` if the figure truly isn't visible.

**Output ONLY the JSON object, nothing else.**`,

  heartmath: `You are a precise data-extraction assistant for HeartMath "HRV Assessment" PDFs.

TASK  
–– Scan every page.  
–– Locate the summary table that lists HRV metrics (it contains rows such as "Number of RR intervals", "SDNN", "LF / HF ratio", etc.).  
–– From that table extract the **numeric value only** (no units) for each of the keys below.  
–– Return **only** a valid JSON object, nothing else.

Return exactly this schema; if a value is not present, use null:

{
  "rr_intervals"      : <Number of RR intervals>,
  "mean_hr_bpm"       : <Mean heart-rate>,
  "mean_ibi_ms"       : <Mean inter-beat interval>,
  "sdnn_ms"           : <SDNN>,
  "rmssd_ms"          : <RMSSD>,
  "total_power"       : <Total power>,
  "vlf_power"         : <VLF power>,
  "lf_power"          : <LF power>,
  "hf_power"          : <HF power>,
  "lf_hf_ratio"       : <LF / HF ratio>,
  "normalized_coherence_pct": <Normalised coherence>
}

Formatting rules  
• JSON keys **must** appear in that order.  
• Values are plain numbers (e.g. 55.6, 0.5), no quotes, no units.  
• Do **not** add explanation, comments, or extra fields.`
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const deviceType = formData.get('deviceType') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!deviceType || !DEVICE_PROMPTS[deviceType as keyof typeof DEVICE_PROMPTS]) {
      return NextResponse.json(
        { success: false, error: 'Invalid device type' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Determine MIME type
    const mimeType = file.type || 'image/jpeg';

    // Prepare the prompt
    const prompt = DEVICE_PROMPTS[deviceType as keyof typeof DEVICE_PROMPTS];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.1, // Low temperature for consistent extraction
    });

    const extractedText = response.choices[0]?.message?.content;
    
    if (!extractedText) {
      return NextResponse.json(
        { success: false, error: 'Failed to extract data from image' },
        { status: 500 }
      );
    }

    // Try to parse the JSON response
    let extractedData;
    try {
      // Clean the response to extract just the JSON
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', extractedText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to parse extracted data',
          rawResponse: extractedText 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      deviceType
    });

  } catch (error) {
    console.error('AI extraction error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 