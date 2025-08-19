/**
 * Chip Code Mapping System
 * Maps old generic chip codes to new weighted symptom codes
 */

import { SYMPTOM_WEIGHTS } from './symptomScoring';

// Legacy chip code patterns (from current intake form)
// Format: ${q.id}_${index} -> specific symptom code

export const CHIP_CODE_MAPPING: Record<string, string> = {
  // MUSCULOSKELETAL SYSTEM (muscle_symptoms_X format)
  'muscle_symptoms_0': 'MSK_NeckTension',      // "Persistent neck/shoulder tension"
  'muscle_symptoms_1': 'MSK_LowBackTight',     // "Low-back tightness or spasms"
  'muscle_symptoms_2': 'MSK_Cramps',           // "Muscle cramps or restless legs"
  'muscle_symptoms_3': 'MSK_MuscleSoreness',   // "General muscle soreness"
  'muscle_symptoms_4': 'MSK_Stiffness',        // "Morning stiffness or rigidity"
  'muscle_symptoms_5': 'MSK_JointPopping',     // "Frequent joint popping or clicking"
  'muscle_symptoms_6': 'MSK_Weakness',         // "Muscle weakness or poor exercise tolerance"
  'muscle_symptoms_7': 'MSK_SlowRecovery',     // "Slow recovery after workouts"
  'muscle_symptoms_8': 'MSK_RecurrentStrain',  // "Recurring muscle strains or tears"
  'muscle_symptoms_9': 'MSK_TriggerPoints',    // "Muscle trigger points or knots"
  'muscle_symptoms_10': 'MSK_JointStiffness',  // "Joint stiffness or reduced mobility"
  'muscle_symptoms_11': 'MSK_WakingPain',      // "Waking up with muscle or joint pain"
  'muscle_symptoms_12': 'MSK_StrengthLoss',    // "Noticeable strength loss"
  'muscle_symptoms_13': 'MSK_TendonChronic',   // "Chronic tendon pain"
  'muscle_symptoms_14': 'MSK_ExercisePain',    // "Pain that worsens with movement or exercise"

  // ORGAN/DIGESTION/HORMONE/DETOX SYSTEM (organ_symptoms_X format)
  'organ_symptoms_0': 'ORG_Bloat',           // "Bloating or gas after meals"
  'organ_symptoms_1': 'ORG_Reflux',          // "Heartburn or acid reflux"
  'organ_symptoms_2': 'ORG_PostMealFatigue', // "Fatigue right after meals"
  'organ_symptoms_3': 'ORG_FoodSens',        // "Food sensitivities or sugar-carb cravings"
  'organ_symptoms_4': 'ORG_ConstDiarr',      // "Constipation or diarrhea"
  'organ_symptoms_5': 'ORG_ChemSens',        // "Chemical or alcohol sensitivity"
  'organ_symptoms_6': 'ORG_Antibiotic',      // "Frequent antibiotics or chronic sinus-yeast"
  'organ_symptoms_7': 'ORG_IBS',             // "IBS diagnosis"
  'organ_symptoms_8': 'ORG_AbdominalPain',   // "Abdominal pain or discomfort"
  'organ_symptoms_9': 'ORG_Nausea',          // "Nausea or poor appetite"
  'organ_symptoms_10': 'ORG_HormoneImbalance', // "Hormonal imbalances or irregularities"
  'organ_symptoms_11': 'ORG_DetoxIssues',    // "Poor detoxification or toxin buildup"
  'organ_symptoms_12': 'ORG_Metabolic',      // "Metabolic syndrome"
  'organ_symptoms_13': 'ORG_LiverSkin',      // "Liver or skin changes"
  'organ_symptoms_14': 'ORG_WeightChanges',  // "Unexplained weight gain or loss"
  'organ_symptoms_15': 'ORG_Autoimmune',     // "Autoimmune conditions"
  'organ_symptoms_16': 'ORG_ChronicInflammation', // "Chronic inflammatory conditions"

  // CIRCULATION SYSTEM (circulation_symptoms_X format)
  'circulation_symptoms_0': 'CIRC_Raynaud',         // "Cold or numb hands/feet (Raynaud's)"
  'circulation_symptoms_1': 'CIRC_LowImmunity',     // "Frequent cold sores or slow immune recovery"
  'circulation_symptoms_2': 'CIRC_ColdIntolerance', // "Cold intolerance"
  'circulation_symptoms_3': 'CIRC_Varicose',        // "Varicose veins or leg cramps"
  'circulation_symptoms_4': 'CIRC_Swelling',        // "Swelling, puffiness, or limb heaviness"
  'circulation_symptoms_5': 'CIRC_SkinFlares',      // "Skin issues or flares (eczema, rashes)"
  'circulation_symptoms_6': 'CIRC_Orthostatic',     // "Dizzy or light-headed on standing"
  'circulation_symptoms_7': 'CIRC_SlowHealing',     // "Slow healing or easy bruising"
  'circulation_symptoms_8': 'CIRC_SkinRedness',     // "Visible redness, flushing or mottling of skin"
  'circulation_symptoms_9': 'CIRC_ChestTightness',  // "Chest tightness or irregular heartbeat"
  'circulation_symptoms_10': 'CIRC_LymphIssues',    // "Lymphatic system problems"
  'circulation_symptoms_11': 'CIRC_AutoInflam',     // "Inflammatory or auto-immune issues"
  'circulation_symptoms_12': 'CIRC_HighCRP',        // "Lab-high inflammation (CRP, ESR)"
  'circulation_symptoms_13': 'CIRC_HighBP',         // "High or low blood pressure"
  'circulation_symptoms_14': 'CIRC_HeartIssues',    // "Heart-related symptoms"
  'circulation_symptoms_15': 'CIRC_PoorCirculation', // "Poor blood circulation"

  // ENERGY SYSTEM (energy_symptoms_X format)
  'energy_symptoms_0': 'ENE_Overheat',          // "Overheating easily or night sweats"
  'energy_symptoms_1': 'ENE_CaffeineNeed',      // "Need for caffeine to function"
  'energy_symptoms_2': 'ENE_SleepTrouble',      // "Insomnia or trouble falling asleep"
  'energy_symptoms_3': 'ENE_MidNightWake',      // "Wake up in the middle of the night"
  'energy_symptoms_4': 'ENE_Unrefreshed',       // "Wake unrefreshed or difficulty waking"
  'energy_symptoms_5': 'ENE_Anxiety',           // "Anxiety or panic attacks"
  'energy_symptoms_6': 'ENE_MoodSwings',        // "Mood swings or emotional eating"
  'energy_symptoms_7': 'ENE_StressManage',      // "Poor stress management"
  'energy_symptoms_8': 'ENE_Disconnect',        // "Feeling disconnected or overwhelmed"
  'energy_symptoms_9': 'ENE_EmotionalReactive', // "Emotional reactivity"
  'energy_symptoms_10': 'ENE_LowStamina',       // "Low stamina for daily tasks"
  'energy_symptoms_11': 'ENE_LowDrive',         // "Low morning drive or low libido"
  'energy_symptoms_12': 'ENE_InsomniaRestless', // "Severe insomnia or restlessness"
  'energy_symptoms_13': 'ENE_Apnea',            // "Snoring or possible sleep apnea"
  'energy_symptoms_14': 'ENE_Burnout',          // "Feeling burned out or overwhelmed"
  'energy_symptoms_15': 'ENE_BodyComp',         // "Body composition problems"
  'energy_symptoms_16': 'ENE_AfternoonCrash',   // "Crash in energy between 2–5 PM"
  'energy_symptoms_17': 'ENE_Fatigue',          // "Persistent fatigue or energy crashes"
  'energy_symptoms_18': 'ENE_CFS',              // "Chronic fatigue syndrome"

  // ARTICULAR/JOINT SYSTEM (articular_symptoms_X format)
  'articular_symptoms_0': 'ART_StiffKneeHip',      // "Stiff knees or hips on waking"
  'articular_symptoms_1': 'ART_ShoulderPinch',     // "Shoulder pinch or limited reach"
  'articular_symptoms_2': 'ART_Clicking',          // "Clicking or grinding joints"
  'articular_symptoms_3': 'ART_WeatherFlare',      // "Pain that flares with weather"
  'articular_symptoms_4': 'ART_Stiffness',         // "General joint stiffness"
  'articular_symptoms_5': 'ART_Cracking',          // "Joint cracking or popping"
  'articular_symptoms_6': 'ART_AnklePain',         // "Ankle or foot pain during gait"
  'articular_symptoms_7': 'ART_Swelling',          // "Joint swelling or redness"
  'articular_symptoms_8': 'ART_RecentSprain',      // "Recent joint sprain or injury"
  'articular_symptoms_9': 'ART_SittingPain',       // "Joint pain worsens after sitting too long"
  'articular_symptoms_10': 'ART_StairPain',        // "Pain or stiffness when going up/down stairs"
  'articular_symptoms_11': 'ART_Instability',      // "Joint instability or giving way"
  'articular_symptoms_12': 'ART_JointSurgery',     // "Joint surgery or replacement"
  'articular_symptoms_13': 'ART_LimitsADL',        // "Joint pain that limits daily activities"
  'articular_symptoms_14': 'ART_ExercisePain',     // "Pain that worsens with movement or exercise"

  // NERVOUS SYSTEM (nervous_symptoms_X format)
  'nervous_symptoms_0': 'NERV_ScreenHigh',      // "Screen sensitivity or eye strain"
  'nervous_symptoms_1': 'NERV_Focus',           // "Trouble focusing or distractibility"
  'nervous_symptoms_2': 'NERV_BrainFog',        // "Brain fog or memory lapses"
  'nervous_symptoms_3': 'NERV_Tinnitus',        // "Tinnitus or ear pressure"
  'nervous_symptoms_4': 'NERV_Headache',        // "Headaches or migraines"
  'nervous_symptoms_5': 'NERV_TempDysreg',      // "Temperature dysregulation"
  'nervous_symptoms_6': 'NERV_Balance',         // "Poor coordination or balance"
  'nervous_symptoms_7': 'NERV_PinsNeedles',     // "Pins and needles or numbness"
  'nervous_symptoms_8': 'NERV_Overstimulation', // "Feel overstimulated in noisy or bright environments"
  'nervous_symptoms_9': 'NERV_Trembling',       // "Trembling or shakiness when stressed or fatigued"
  'nervous_symptoms_10': 'NERV_MuscleTwitching', // "Unexplained muscle twitching or facial tics"
  'nervous_symptoms_11': 'NERV_Dizziness',      // "Frequent dizziness or vertigo"
  'nervous_symptoms_12': 'NERV_NervePain',      // "Nerve pain or neuropathy"
  'nervous_symptoms_13': 'NERV_Concussion',     // "History of concussion or head injury"
  'nervous_symptoms_14': 'NERV_Neurological',   // "Serious neurological symptoms"
};

// Reverse mapping for converting new codes back to old (if needed)
export const REVERSE_CHIP_MAPPING: Record<string, string> = {};
Object.entries(CHIP_CODE_MAPPING).forEach(([oldCode, newCode]) => {
  REVERSE_CHIP_MAPPING[newCode] = oldCode;
});

// Health area mapping (old pillar names to new area names)
export const PILLAR_TO_AREA_MAPPING: Record<string, string> = {
  'musculoskeletal': 'musculoskeletal',
  'organ_digest_hormone_detox': 'organ_digest_hormone_detox', 
  'circulation': 'circulation',
  'energy': 'energy',
  'articular_joint': 'articular_joint',
  'nervous_system': 'nervous_system'
};

/**
 * Convert old chip codes to new weighted symptom codes
 */
export function mapChipCodes(chips: string[]): string[] {
  return chips.map(chip => CHIP_CODE_MAPPING[chip] || chip).filter(Boolean);
}

/**
 * Convert old health check data structure to new format
 */
export function mapHealthCheckData(
  oldHc: Record<string, string[]>
): Record<string, string[]> {
  const newHc: Record<string, string[]> = {};
  
  Object.entries(oldHc).forEach(([pillar, chips]) => {
    const areaName = PILLAR_TO_AREA_MAPPING[pillar] || pillar;
    newHc[areaName] = mapChipCodes(chips);
  });
  
  return newHc;
}

/**
 * Check if a chip code is in the old format
 */
export function isOldChipCode(code: string): boolean {
  return code.includes('_') && /^[a-z]+_\d+$/.test(code);
}

/**
 * Get all available symptoms for a health area (for UI dropdowns)
 */
export function getAvailableSymptoms(areaName: string) {
  const areaConfig = SYMPTOM_WEIGHTS[areaName];
  if (!areaConfig) return [];
  
  return areaConfig.symptoms.map(symptom => ({
    code: symptom.code,
    label: symptom.label,
    weight: symptom.weight,
    category: symptom.category,
    description: symptom.description
  }));
} 