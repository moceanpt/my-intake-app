import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { fromPath } from 'pdf2pic';
import { uploadFileToS3 } from '../../lib/s3';
import { prisma } from '../../lib/prisma';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Device-specific prompts for data extraction
export const DEVICE_PROMPTS = {
  inbody: `You are an expert at reading "InBody" body-composition reports.

When I give you an InBody page (image **or** OCR text) you must:

1. Extract these eight metrics ⬇️  
   • Total Body Water (lb)            ➜  tbw_lb  
   • Weight (lb)                      ➜  weight_lb  
   • Skeletal Muscle Mass (lb)        ➜  smm_lb  
   • Body Fat Mass (lb)               ➜  body_fat_lb  
   • Percent Body Fat (%)             ➜  pbf_pct  
   • ECW/TBW Ratio                    ➜  ecw_tbw  
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
   }

If a value is missing, return null for that key. Do not guess or interpolate. Do not include any extra keys or text. Do not include units in the values. Only output the JSON object.`,

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
  "water":            number,   // bar "E"
  "overall_balance_score": number // the red number at the right of the A–E Balance Diagram bar chart
}

Extraction hints
----------------
- Look for ANY section that contains Auracom data, even if it's part of a larger document
- Search for "Auracom", "Ava-Aura", "Ava Score", "Vigor", "Stability", "Activity", "Five Elements", "Wood", "Fire", "Earth", "Metal", "Water"
- "Ava:###" is usually printed in red, right of the aura photo; grab the digits only.
- Vigor & Stability use vertical coloured bar-charts with the value printed at the top of each bar.
- *Activity %* is the numeric value closest to the coloured diamond/marker on the horizontal "Activity – Relaxation" line.
- The Five-element balance bars are labelled **A B C D E** (Wood, Fire, Earth, Metal, Water); use the numbers above each bar.
- **The overall balance score is the red number at the right of the A–E Balance Diagram bar chart.**
- Ignore any units, words, or extra text; output bare numbers.
- Do **not** invent or estimate values; use \`null\` if the figure truly isn't visible.
- If you cannot find ANY Auracom data in this document, return all null values
- IMPORTANT: This page may be part of a compiled report with multiple devices. Look specifically for Auracom sections, headers, or data tables

**Output ONLY the JSON object, nothing else.**`,

  heartmath: `You are a precise data-extraction assistant for HeartMath "HRV Assessment" PDFs.

TASK  
–– Scan every page and section for HeartMath data, even if it's part of a larger document.  
–– Look for "HeartMath", "HRV", "Heart Rate Variability", "SDNN", "RMSSD", "LF", "HF", "Coherence", "RR intervals"
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
• Do **not** add explanation, comments, or extra fields.
• If you cannot find ANY HeartMath data in this document, return all null values
• IMPORTANT: This page may be part of a compiled report with multiple devices. Look specifically for HeartMath sections, headers, or data tables`,

  exbody: `You are an expert at extracting structured data from health reports.

This document may contain multiple device reports (such as InBody, ExBody, OmniFit, Auracom, HeartMath, etc.). Your task is to extract data **only from the ExBody Musculoskeletal Analysis section**.

- Scan all pages and find the section or page with the heading "ExBody Musculoskeletal Analysis" or similar.
- Ignore all other device sections.
- From the ExBody section, extract the following fields (numbers only, no units, use only the main summary row of each table):

- loss_of_height_in: Value under "Loss of height" in the "Musculoskeletal Deviation Information" table (inches, number only, e.g. 0.4)
- misalignment_deviation: Value under "Misalignment Deviation" (number)
- imbalance_deviation: Value under "Imbalance Deviation" (number)
- musculoskeletal_index: Value under "Musculoskeletal Index" (number)
- shoulder_inclination_deg: Value under "Shoulder Inclination" (degrees, number only, e.g. 0)
- shoulder_inclination_mm: Value under "Shoulder Inclination" (mm, number only, e.g. 2)
- fhp_deg: Value under "FHP" (degrees, number only, e.g. 2)
- fhp_mm: Value under "FHP" (mm, number only, e.g. 2)
- pcmt_lb: Value under "PCMT" (pounds, number only, e.g. 0.9)
- pelvic_tilt_deg: Value under "PelvicTilt" (degrees, number only, e.g. 12)
- pelvic_tilt_mm: Value under "PelvicTilt" (mm, number only, e.g. 72)
- knee_flexion_ext_deg: Value under "Knee Flexion/Ext." (degrees, number only, e.g. 176)
- knee_flexion_ext_mm: Value under "Knee Flexion/Ext." (mm, number only, e.g. 37)

If the ExBody section is not present, return all fields as null.
Output only the JSON object, nothing else.

Example output:
{
  "loss_of_height_in": 0.4,
  "misalignment_deviation": 18,
  "imbalance_deviation": 8,
  "musculoskeletal_index": 26,
  "shoulder_inclination_deg": 0,
  "shoulder_inclination_mm": 2,
  "fhp_deg": 2,
  "fhp_mm": 2,
  "pcmt_lb": 0.9,
  "pelvic_tilt_deg": 12,
  "pelvic_tilt_mm": 72,
  "knee_flexion_ext_deg": 176,
  "knee_flexion_ext_mm": 37
}
`,

  omnifit: `You are an expert at extracting structured data from OmniFit Stress Check reports (PPG section only).

This page is titled "Stress check result (PPG)". Extract the following metrics:
- hrv_index: Value next to "HRV-index"
- stress: Value next to "Stress"
- ans_health: Value next to "ANS Health"
- ans_age: Value next to "ANS age"
- lf: Value next to "LF"
- hf: Value next to "HF"

If a value is missing, use null. Output only the JSON object with these keys:
{
  "hrv_index": 10.6,
  "stress": 39,
  "ans_health": 8.94,
  "ans_age": 19,
  "lf": 7.06,
  "hf": 7.29
}
Output ONLY the JSON object, nothing else.`,

  omnifit_eeg: `You are an expert at extracting structured data from OmniFit Stress Check reports (EEG section only).

This page is titled "Stress check result (EEG)". Extract the following metrics:
- brain_score: Large number at top left labeled "Brain Score"
- mental_stress: Number next to "Mental Stress"
- intrinsic_eeg_pf: Number next to "Intrinsic EEG (PF)" (ignore 'Hz')
- brain_workload: Number next to "Brain WorkLoad" (ignore 'Hz')

If a value is missing, use null. Output only the JSON object with these keys:
{
  "brain_score": 56,
  "mental_stress": 8.7,
  "intrinsic_eeg_pf": 8.3,
  "brain_workload": 28.3
}
Output ONLY the JSON object, nothing else.`,

  omnifit_combined: `You are an expert at extracting structured data from OmniFit Stress Check Results reports that contain both PPG and EEG metrics on a single page.

Extract the following metrics (numbers only, no units):

// PPG metrics
- hrv_index: Value next to "HRV-index"
- stress: Value next to "Stress"
- ans_health: Value next to "ANS Health"
- ans_age: Value next to "ANS age"
- lf: Value next to "LF"
- hf: Value next to "HF"

// EEG metrics
- brain_score: Large number at top left labeled "Brain Score"
- mental_stress: Number next to "Mental Stress"
- intrinsic_eeg_pf: Number next to "Intrinsic EEG (PF)" (ignore 'Hz')
- brain_workload: Number next to "Brain WorkLoad" (ignore 'Hz')

Return a single JSON object with all 10 keys, like this:
{
  "hrv_index": 10.6,
  "stress": 39,
  "ans_health": 8.94,
  "ans_age": 19,
  "lf": 7.06,
  "hf": 7.29,
  "brain_score": 56,
  "mental_stress": 8.7,
  "intrinsic_eeg_pf": 8.3,
  "brain_workload": 28.3
}
If a value is missing, use null for that key. Output ONLY the JSON object, nothing else.`,

  unified: `You are an expert at reading comprehensive health assessment reports. You MUST extract data from ALL devices present in this document.

IMPORTANT: This document contains MULTIPLE device reports. You MUST find and extract from ALL of them, not just one.

STEP-BY-STEP PROCESS (FOLLOW EXACTLY):

STEP 1: SEARCH FOR INBODY
Look for ANY mention of "InBody", "Body Composition", "Total Body Water", "Skeletal Muscle Mass", "Body Fat Mass", "Visceral Fat Area", "Phase Angle". If found, extract:
{
  "inbody": {
    "tbw_lb": number,           // Total Body Water (lb)
    "weight_lb": number,        // Weight (lb) 
    "smm_lb": number,           // Skeletal Muscle Mass (lb)
    "body_fat_lb": number,      // Body Fat Mass (lb)
    "pbf_pct": number,          // Percent Body Fat (%)
    "ecw_tbw": number,          // ECW / TBW ratio
    "vfa_cm2": number,          // Visceral Fat Area (cm²)
    "phase_angle_deg": number   // Whole-Body Phase Angle (°)
  }
}

STEP 2: SEARCH FOR AURACOM
Look for ANY mention of "Auracom", "Ava-Aura", "Ava Score", "Vigor", "Stability", "Activity", "Five Elements", "Wood", "Fire", "Earth", "Metal", "Water". If found, extract:
{
  "auracom": {
    "ava_score": number,        // Big red-label "Ava:###"
    "vigor": number,            // Violet/magenta "Vigor" bar
    "stability": number,        // Purple "Stability" bar
    "activity_percent": number, // % at mid-point of Activity↔Relaxation gauge
    "wood": number,             // Five-element bar "A"
    "fire": number,             // Five-element bar "B"
    "earth": number,            // Five-element bar "C"
    "metal": number,            // Five-element bar "D"
    "water": number             // Five-element bar "E"
  }
}

STEP 3: SEARCH FOR HEARTMATH
Look for ANY mention of "HeartMath", "HRV", "Heart Rate Variability", "SDNN", "RMSSD", "LF", "HF", "Coherence", "RR intervals". If found, extract:
{
  "heartmath": {
    "rr_intervals": number,     // Number of RR intervals
    "mean_hr_bpm": number,      // Mean heart-rate
    "mean_ibi_ms": number,      // Mean inter-beat interval
    "sdnn_ms": number,          // SDNN
    "rmssd_ms": number,         // RMSSD
    "total_power": number,      // Total power
    "vlf_power": number,        // VLF power
    "lf_power": number,         // LF power
    "hf_power": number,         // HF power
    "lf_hf_ratio": number,      // LF / HF ratio
    "normalized_coherence_pct": number // Normalised coherence
  }
}

STEP 4: SEARCH FOR EXBODY
Look for ANY mention of "Exbody", "Posture", "Musculoskeletal", "FHP", "PCMT", "Pelvic Tilt", "Loss of height", "Misalignment". If found, extract:
{
  "exbody": {
    "loss_of_height_in": string,        // Loss of height (inches, e.g., "0.6inch")
    "misalignment_deviation": number,   // Misalignment Deviation
    "imbalance_deviation": number,      // Imbalance Deviation
    "musculoskeletal_index": number,    // Musculoskeletal Index
    "shoulder_inclination_deg": string, // Shoulder Inclination (degrees, e.g., "1°")
    "shoulder_inclination_mm": string,  // Shoulder Inclination (mm, e.g., "33mm")
    "fhp_deg": string,                  // FHP (degrees, e.g., "0°")
    "fhp_mm": string,                   // FHP (mm, e.g., "0mm")
    "pcmt_lb": string,                  // PCMT (pounds, e.g., "0.0Pound")
    "pelvic_tilt_deg": string,          // PelvicTilt (degrees, e.g., "25°")
    "pelvic_tilt_mm": string,           // PelvicTilt (mm, e.g., "91mm")
    "knee_flexion_ext_deg": string,     // Knee Flexion/Ext. (degrees, e.g., "173°")
    "knee_flexion_ext_mm": string       // Knee Flexion/Ext. (mm, e.g., "59mm")
  }
}

STEP 5: SEARCH FOR OMNIFIT
Look for ANY mention of "Omni-Fit", "OmniFit", "Stress check", "HRV-index", "Brain Score", "Mental Stress", "Brain WorkLoad", "ANS Health", "ANS Age". If found, extract:
{
  "omnifit": {
    "hrv_index": number,        // HRV-Index (PPG page)
    "stress": number,           // Stress score (PPG page)
    "ans_health": number,       // ANS Health score (PPG page)
    "ans_age": number,          // ANS Age (PPG page)
    "lf": number,               // LF power (PPG page)
    "hf": number,               // HF power (PPG page)
    "brain_score": number,      // Brain Score (EEG page, large white number)
    "mental_stress": number,    // Mental Stress (EEG page)
    "intrinsic_eeg_pf": number, // Intrinsic EEG (PF) in Hz
    "brain_workload": number    // Brain WorkLoad in Hz
  }
}

FINAL STEP: COMBINE ALL RESULTS
Combine ALL the device objects you found into a single JSON object. Include EVERY device you found, even if some values are null.

CRITICAL RULES:
- You MUST search for ALL 5 device types (InBody, Auracom, HeartMath, Exbody, OmniFit)
- Do NOT stop after finding one device
- Look for ANY mention of the keywords listed above
- If you find ANY evidence of a device, you MUST include it in the output
- Use null for missing values, but include the device object
- Output ONLY the final combined JSON object

Example output if you find InBody, Exbody, and OmniFit:
{
  "inbody": {
    "tbw_lb": 100.8,
    "weight_lb": 181.1,
    "smm_lb": 78.3,
    "body_fat_lb": 42.9,
    "pbf_pct": 23.7,
    "ecw_tbw": 0.372,
    "vfa_cm2": 78.7,
    "phase_angle_deg": 6.7
  },
  "exbody": {
    "loss_of_height_in": "0.6inch",
    "misalignment_deviation": 33,
    "imbalance_deviation": 12,
    "musculoskeletal_index": 45,
    "shoulder_inclination_deg": "1°",
    "shoulder_inclination_mm": "33mm",
    "fhp_deg": "0°",
    "fhp_mm": "0mm",
    "pcmt_lb": "0.0Pound",
    "pelvic_tilt_deg": "25°",
    "pelvic_tilt_mm": "91mm",
    "knee_flexion_ext_deg": "173°",
    "knee_flexion_ext_mm": "59mm"
  },
  "omnifit": {
    "hrv_index": 10.6,
    "stress": 39,
    "ans_health": 8.94,
    "ans_age": 19,
    "lf": 7.06,
    "hf": 7.29,
    "brain_score": 56,
    "mental_stress": 8.7,
    "intrinsic_eeg_pf": 8.3,
    "brain_workload": 28.3
  }
}`
};

// Function to extract data for a specific device type
async function extractDeviceData(deviceType: string, base64Image: string, mimeType: string): Promise<any> {
  const models = deviceType === "omnifit" 
    ? ["gpt-4o", "gpt-4o-mini"]
    : ["gpt-4o-mini", "gpt-4o"];
  
  let extractedData: any = null;
  let lastError: Error | null = null;

  // Clean and validate base64 image before sending to OpenAI
  if (!base64Image || base64Image.length < 100) {
    return { extractedData: null, lastError: new Error('Invalid or empty base64 image') };
  }

  // Only clean base64 if it contains invalid characters
  if (!/^[A-Za-z0-9+/=]+$/.test(base64Image)) {
    base64Image = base64Image.replace(/[^A-Za-z0-9+/=]/g, '');
    
    // Ensure proper padding
    const padding = 4 - (base64Image.length % 4);
    if (padding !== 4) {
      base64Image += '='.repeat(padding);
    }
  }

  // Validate mime type
  const validMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
  if (!validMimeTypes.includes(mimeType)) {
    return { extractedData: null, lastError: new Error(`Unsupported mime type: ${mimeType}`) };
  }

  for (const model of models) {
    try {
      console.log(`Attempting ${deviceType} extraction with ${model}...`);
      
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: DEVICE_PROMPTS[deviceType as keyof typeof DEVICE_PROMPTS]
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
        temperature: 0.1,
      });

      const extractedText = response.choices[0]?.message?.content;
      
      if (!extractedText) {
        throw new Error(`No response from ${model}`);
      }

      // Try to parse the JSON response
      try {
        const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
          console.log(`Successfully extracted ${deviceType} data with ${model}:`, extractedData);
          break; // Success! Exit the retry loop
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error(`Failed to parse ${deviceType} response from ${model}:`, extractedText);
        lastError = new Error(`Failed to parse JSON from ${model}: ${parseError.message}`);
        continue; // Try next model
      }

    } catch (error) {
      console.error(`Error with ${deviceType} extraction using ${model}:`, error);
      lastError = error;
      continue; // Try next model
    }
  }

  return { extractedData, lastError };
}

// Function to extract data from ordered PDF pages
async function extractFromOrderedPDF(filePath: string, mimeType: string): Promise<{ results: any, errors: string[] }> {
  const results: any = {};
  const errors: string[] = [];
  
  // Device page mapping based on your specified order
  const devicePages = {
    exbody: [1],      // Pages 1-4, but only extract from page 1
    inbody: [5],      // Page 5
    omnifit: [6, 7],  // Pages 6-7 (PPG and EEG)
    auracom: [8],     // Page 8
    heartmath: [9]    // Page 9
  };

  console.log("Starting ordered PDF extraction...");
  console.log(`File type: ${mimeType}, File path: ${filePath}`);

  try {
    // Initialize PDF conversion
    const convert = fromPath(filePath, {
      density: 300,
      saveFilename: "page",
      savePath: "/tmp",
      format: "png",
      width: 2480,
      height: 3508
    });

    // Get the number of pages (try up to 10 pages)
    let pageCount = 1;
    try {
      // Try to get page 2 to see if it exists
      await convert(2, { responseType: 'base64' });
      pageCount = 2;
      // Try more pages
      for (let i = 3; i <= 10; i++) {
        try {
          await convert(i, { responseType: 'base64' });
          pageCount = i;
        } catch {
          break; // No more pages
        }
      }
    } catch {
      // Only 1 page
    }

    console.log(`PDF has ${pageCount} pages`);

    // Process each device based on page assignment
    for (const [deviceType, pages] of Object.entries(devicePages)) {
      console.log(`Processing ${deviceType} from pages: ${pages.join(', ')}`);
      
      let deviceData: any = null;
      let deviceError: string | null = null;

      // For devices with multiple pages (like OmniFit), process each page
      for (const pageNum of pages) {
        if (pageNum > pageCount) {
          console.log(`Page ${pageNum} not available for ${deviceType} (PDF only has ${pageCount} pages)`);
          continue;
        }

        try {
          console.log(`Converting page ${pageNum} to image for ${deviceType}...`);
          const result = await convert(pageNum, { responseType: 'base64' });
          let base64Image = result.base64 || '';
          
          // Only clean base64 if it contains invalid characters
          if (!/^[A-Za-z0-9+/=]+$/.test(base64Image)) {
            base64Image = base64Image.replace(/[^A-Za-z0-9+/=]/g, '');
            
            // Ensure proper padding
            const padding = 4 - (base64Image.length % 4);
            if (padding !== 4) {
              base64Image += '='.repeat(padding);
            }
          }

          console.log(`Page ${pageNum} conversion result:`, {
            hasBase64: !!base64Image,
            base64Length: base64Image.length,
            startsWithPNG: base64Image.startsWith('iVBORw0KGgo'),
            startsWithJPEG: base64Image.startsWith('/9j/'),
            base64Start: base64Image.substring(0, 20)
          });

          if (!base64Image) {
            console.log(`No image data for page ${pageNum}`);
            continue;
          }

          // Validate base64 image format
          if (!base64Image.startsWith('iVBORw0KGgo') && !base64Image.startsWith('/9j/')) {
            console.log(`Invalid base64 format for page ${pageNum}, length: ${base64Image.length}`);
            console.log(`Base64 starts with: ${base64Image.substring(0, 50)}`);
            // Continue anyway, as the validation might be too strict
            console.log(`Warning: Base64 format validation failed, but attempting to process anyway`);
          }

          // Extract data for this device from this page
          const { extractedData: pageData, lastError: pageError } = await extractDeviceData(deviceType, base64Image, mimeType);
          
          if (pageData) {
            const hasData = Object.values(pageData).some(value => value !== null);
            if (hasData) {
              // For devices with multiple pages, merge the data
              if (deviceData) {
                // Merge data, preferring non-null values
                deviceData = { ...deviceData, ...pageData };
                console.log(`Merged ${deviceType} data from page ${pageNum}`);
              } else {
                deviceData = pageData;
                console.log(`Successfully extracted ${deviceType} data from page ${pageNum}:`, pageData);
              }
            } else {
              console.log(`No meaningful ${deviceType} data found on page ${pageNum} (all nulls)`);
            }
          } else if (pageError) {
            deviceError = `${deviceType}: ${pageError.message}`;
            console.log(`Error extracting ${deviceType} from page ${pageNum}:`, pageError.message);
          }

        } catch (error) {
          console.log(`Error processing page ${pageNum} for ${deviceType}:`, error);
          deviceError = `${deviceType}: Error processing page ${pageNum}`;
        }
      }

      // Add device data to results if we found any
      if (deviceData) {
        results[deviceType] = deviceData;
        console.log(`Final ${deviceType} data:`, deviceData);
      } else if (deviceError) {
        errors.push(deviceError);
        console.log(`No ${deviceType} data found:`, deviceError);
      } else {
        console.log(`No ${deviceType} data found (no pages available or all nulls)`);
      }
    }

  } catch (error) {
    console.error("Error in ordered PDF extraction:", error);
    errors.push(`PDF processing error: ${error}`);
  }

  return { results, errors };
}

// Function to extract data from a single device (legacy support)
async function extractSingleDeviceData(deviceType: string, base64Image: string, mimeType: string): Promise<any> {
  const prompt = DEVICE_PROMPTS[deviceType as keyof typeof DEVICE_PROMPTS];
  const models = deviceType === "omnifit" 
    ? ["gpt-4o", "gpt-4o-mini"]
    : ["gpt-4o-mini", "gpt-4o"];
  
  let extractedData: any = null;
  let lastError: Error | null = null;
  
  for (const model of models) {
    try {
      console.log(`Attempting extraction with ${model}...`);
      
      const response = await openai.chat.completions.create({
        model: model,
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
        temperature: 0.1,
      });

      const extractedText = response.choices[0]?.message?.content;
      
      if (!extractedText) {
        throw new Error(`No response from ${model}`);
      }

      // Try to parse the JSON response
      try {
        const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
          console.log(`Successfully extracted data with ${model}:`, extractedData);
          break; // Success! Exit the retry loop
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error(`Failed to parse response from ${model}:`, extractedText);
        lastError = new Error(`Failed to parse JSON from ${model}: ${parseError.message}`);
        continue; // Try next model
      }

    } catch (error) {
      console.error(`Error with ${model}:`, error);
      lastError = error;
      continue; // Try next model
    }
  }

  return { extractedData, lastError };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable();
    const [fields, files] = await form.parse(req);
    
    const deviceType = fields.deviceType?.[0] as string;
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    if (!deviceType || !DEVICE_PROMPTS[deviceType as keyof typeof DEVICE_PROMPTS]) {
      return res.status(400).json({ success: false, error: 'Invalid device type' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ success: false, error: 'OpenAI API key not configured' });
    }

    let mimeType = file.mimetype || 'image/jpeg';
    let base64Image: string;

    if (mimeType === 'application/pdf') {
      const outputDir = '/tmp/pdf2img_' + Date.now();
      await fs.mkdir(outputDir, { recursive: true });
      const convert = fromPath(file.filepath, {
        density: 200,
        saveFilename: 'page',
        savePath: outputDir,
        format: 'png',
        width: 1200,
        height: 1600,
      });
      const result = await convert(1, { responseType: 'base64' }); // first page, return as base64
      base64Image = result.base64 || '';
      mimeType = 'image/png';
    } else {
      const imageBuffer = await fs.readFile(file.filepath);
      base64Image = imageBuffer.toString('base64');
    }

    if (!base64Image) {
      return res.status(500).json({ success: false, error: 'Failed to convert PDF to image.' });
    }

    // Clean base64 image for processing
    base64Image = base64Image.replace(/[^A-Za-z0-9+/=]/g, '');
    
    // Ensure proper padding
    const padding = 4 - (base64Image.length % 4);
    if (padding !== 4) {
      base64Image += '='.repeat(padding);
    }
    
    // Use the single-device extraction function
    const { extractedData, lastError } = await extractSingleDeviceData(deviceType, base64Image, mimeType);

    if (!extractedData) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to extract data from all models',
        lastError: lastError?.message
      });
    }

    // Upload file to S3 and store reference
    let fileUrl: string | undefined;
    let fileKey: string | undefined;
    
    try {
      const fileBuffer = await fs.readFile(file.filepath);
      const uploadResult = await uploadFileToS3(
        fileBuffer,
        file.originalFilename || 'uploaded_file',
        mimeType,
        `device-reports/${deviceType}`
      );

      fileUrl = uploadResult.url;
      fileKey = uploadResult.key;
      
      // Store file reference in database if submissionId is provided
      const submissionId = fields.submissionId?.[0];
      if (submissionId) {
        try {
          await prisma.uploadedFile.create({
            data: {
              submissionId: submissionId,
              fileName: file.originalFilename || 'uploaded_file',
              fileKey: fileKey,
              fileUrl: fileUrl,
              contentType: mimeType,
              fileSize: fileBuffer.length,
              deviceType: deviceType,
            },
          });
        } catch (dbError) {
          console.error('Error storing file reference in database:', dbError);
          // Continue with extraction results even if DB storage fails
        }
      }
      
      console.log(`File uploaded to S3: ${fileKey}`);
    } catch (uploadError) {
      console.error('Error uploading file to S3:', uploadError);
      // Continue with extraction results even if upload fails
    }

    let finalData = extractedData;
    if (deviceType === 'inbody') {
      // Only keep the 8 required keys
      const {
        tbw_lb,
        weight_lb,
        smm_lb,
        body_fat_lb,
        pbf_pct,
        ecw_tbw,
        vfa_cm2,
        phase_angle_deg
      } = extractedData || {};
      finalData = {
        tbw_lb,
        weight_lb,
        smm_lb,
        body_fat_lb,
        pbf_pct,
        ecw_tbw,
        vfa_cm2,
        phase_angle_deg
      };
    }

    return res.status(200).json({
      success: true,
      data: finalData,
      deviceType,
      fileUrl,
      fileKey
    });

  } catch (error) {
    console.error('AI extraction error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An error occurred' 
    });
  }
} 