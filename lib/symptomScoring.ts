// Comprehensive Weighted Symptom Scoring System
// This system allows for easy customization of symptom weights and severity calculations

export interface SymptomWeight {
  code: string;
  label: string;
  weight: number;
  category: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface HealthAreaScoring {
  area: string;
  areaLabel: string;
  baseMultiplier: number;
  maxChips: number;
  symptoms: SymptomWeight[];
}

// ============================================================================
// CUSTOMIZABLE SYMPTOM WEIGHTS - EASILY MODIFIABLE
// ============================================================================

export const SYMPTOM_WEIGHTS: Record<string, HealthAreaScoring> = {
  musculoskeletal: {
    area: 'musculoskeletal',
    areaLabel: 'Musculoskeletal',
    baseMultiplier: 1.0,
    maxChips: 15,
    symptoms: [
      // Low Impact (1.0) - Common, manageable issues
      { code: 'MSK_NeckTension', label: 'Neck/Shoulder Tension', weight: 1.0, category: 'low', description: 'Persistent neck or shoulder tension' },
      { code: 'MSK_LowBackTight', label: 'Low Back Tightness', weight: 1.0, category: 'low', description: 'Low-back tightness or spasms' },
      { code: 'MSK_Cramps', label: 'Muscle Cramps', weight: 1.0, category: 'low', description: 'Muscle cramps or restless legs' },
      { code: 'MSK_MuscleSoreness', label: 'Muscle Soreness', weight: 1.0, category: 'low', description: 'General muscle soreness' },
      { code: 'MSK_Stiffness', label: 'Morning Stiffness', weight: 1.0, category: 'low', description: 'Morning stiffness or rigidity' },
      { code: 'MSK_JointPopping', label: 'Frequent Joint Popping', weight: 1.0, category: 'low', description: 'Frequent joint popping or clicking' },
      
      // Medium Impact (1.5) - More concerning symptoms
      { code: 'MSK_Weakness', label: 'Muscle Weakness', weight: 1.5, category: 'medium', description: 'Muscle weakness or poor exercise tolerance' },
      { code: 'MSK_SlowRecovery', label: 'Slow Recovery', weight: 1.5, category: 'medium', description: 'Slow recovery after workouts' },
      { code: 'MSK_RecurrentStrain', label: 'Recurrent Strains', weight: 1.5, category: 'medium', description: 'Recurring muscle strains or tears' },
      { code: 'MSK_TriggerPoints', label: 'Trigger Points', weight: 1.5, category: 'medium', description: 'Muscle trigger points or knots' },
      { code: 'MSK_JointStiffness', label: 'Joint Stiffness', weight: 1.5, category: 'medium', description: 'Joint stiffness or reduced mobility' },
      { code: 'MSK_WakingPain', label: 'Waking with Pain', weight: 1.5, category: 'medium', description: 'Waking up with muscle or joint pain' },
      
      // High Impact (2.0) - Serious functional issues
      { code: 'MSK_StrengthLoss', label: 'Strength Loss', weight: 2.0, category: 'high', description: 'Noticeable strength loss' },
      { code: 'MSK_TendonChronic', label: 'Chronic Tendon Pain', weight: 2.0, category: 'high', description: 'Chronic tendon pain (Achilles, elbow, rotator cuff)' },
      { code: 'MSK_MuscleAtrophy', label: 'Muscle Atrophy', weight: 2.0, category: 'high', description: 'Muscle wasting or atrophy' },
      { code: 'MSK_ExercisePain', label: 'Exercise-Induced Pain', weight: 2.0, category: 'high', description: 'Pain that worsens with movement or exercise' },
    ]
  },

  organ_digest_hormone_detox: {
    area: 'organ_digest_hormone_detox',
    areaLabel: 'Organ/Digestion/Hormone/Detox',
    baseMultiplier: 1.0,
    maxChips: 18,
    symptoms: [
      // Low Impact (1.0) - Common digestive issues
      { code: 'ORG_Bloat', label: 'Bloating/Gas', weight: 1.0, category: 'low', description: 'Bloating or gas after meals' },
      { code: 'ORG_Reflux', label: 'Heartburn/Reflux', weight: 1.0, category: 'low', description: 'Heartburn or acid reflux' },
      { code: 'ORG_PostMealFatigue', label: 'Post-Meal Fatigue', weight: 1.0, category: 'low', description: 'Fatigue right after meals' },
      { code: 'ORG_FoodSens', label: 'Food Sensitivities', weight: 1.0, category: 'low', description: 'Food sensitivities or sugar-carb cravings' },
      
      // Medium Impact (1.5) - More systemic issues
      { code: 'ORG_ConstDiarr', label: 'Constipation/Diarrhea', weight: 1.5, category: 'medium', description: 'Constipation or diarrhea' },
      { code: 'ORG_ChemSens', label: 'Chemical Sensitivity', weight: 1.5, category: 'medium', description: 'Chemical or alcohol sensitivity' },
      { code: 'ORG_Antibiotic', label: 'Antibiotic Use', weight: 1.5, category: 'medium', description: 'Frequent antibiotics or chronic sinus-yeast' },
      { code: 'ORG_IBS', label: 'IBS Diagnosis', weight: 1.5, category: 'medium', description: 'IBS diagnosis' },
      { code: 'ORG_AbdominalPain', label: 'Abdominal Pain', weight: 1.5, category: 'medium', description: 'Abdominal pain or discomfort' },
      { code: 'ORG_Nausea', label: 'Nausea/Poor Appetite', weight: 1.5, category: 'medium', description: 'Nausea or poor appetite' },
      { code: 'ORG_HormoneImbalance', label: 'Hormone Imbalance', weight: 1.5, category: 'medium', description: 'Hormonal imbalances or irregularities' },
      { code: 'ORG_DetoxIssues', label: 'Detox Issues', weight: 1.5, category: 'medium', description: 'Poor detoxification or toxin buildup' },
      
      // High Impact (2.0) - Serious metabolic issues
      { code: 'ORG_Metabolic', label: 'Metabolic Syndrome', weight: 2.0, category: 'high', description: 'Metabolic syndrome (high cholesterol, sugar)' },
      { code: 'ORG_LiverSkin', label: 'Liver/Skin Issues', weight: 2.0, category: 'high', description: 'Liver or skin changes (itchy skin, dark urine)' },
      { code: 'ORG_WeightChanges', label: 'Unexplained Weight Changes', weight: 2.0, category: 'high', description: 'Unexplained weight gain or loss' },
      { code: 'ORG_Autoimmune', label: 'Autoimmune Issues', weight: 2.0, category: 'high', description: 'Autoimmune conditions' },
      { code: 'ORG_ChronicInflammation', label: 'Chronic Inflammation', weight: 2.0, category: 'high', description: 'Chronic inflammatory conditions' },
    ]
  },

  circulation: {
    area: 'circulation',
    areaLabel: 'Circulation',
    baseMultiplier: 1.0,
    maxChips: 16,
    symptoms: [
      // Low Impact (1.0) - Common circulation issues
      { code: 'CIRC_Raynaud', label: "Raynaud's", weight: 1.0, category: 'low', description: "Cold or numb hands/feet (Raynaud's)" },
      { code: 'CIRC_LowImmunity', label: 'Low Immunity', weight: 1.0, category: 'low', description: 'Frequent cold sores or slow immune recovery' },
      { code: 'CIRC_ColdIntolerance', label: 'Cold Intolerance', weight: 1.0, category: 'low', description: 'Cold intolerance' },
      { code: 'CIRC_Varicose', label: 'Varicose Veins', weight: 1.0, category: 'low', description: 'Varicose veins or leg cramps' },
      
      // Medium Impact (1.5) - More concerning issues
      { code: 'CIRC_Swelling', label: 'Swelling/Puffiness', weight: 1.5, category: 'medium', description: 'Swelling, puffiness, or limb heaviness' },
      { code: 'CIRC_SkinFlares', label: 'Skin Issues', weight: 1.5, category: 'medium', description: 'Skin issues or flares (eczema, rashes)' },
      { code: 'CIRC_Orthostatic', label: 'Orthostatic Issues', weight: 1.5, category: 'medium', description: 'Dizzy or light-headed on standing' },
      { code: 'CIRC_SlowHealing', label: 'Slow Healing', weight: 1.5, category: 'medium', description: 'Slow healing or easy bruising' },
      { code: 'CIRC_SkinRedness', label: 'Skin Redness/Flushing', weight: 1.5, category: 'medium', description: 'Visible redness, flushing or mottling of skin' },
      { code: 'CIRC_ChestTightness', label: 'Chest Tightness/Irregular Heartbeat', weight: 1.5, category: 'medium', description: 'Chest tightness or irregular heartbeat' },
      { code: 'CIRC_LymphIssues', label: 'Lymphatic Issues', weight: 1.5, category: 'medium', description: 'Lymphatic system problems' },
      
      // High Impact (2.0) - Serious cardiovascular issues
      { code: 'CIRC_AutoInflam', label: 'Auto-Inflammatory', weight: 2.0, category: 'high', description: 'Inflammatory or auto-immune issues' },
      { code: 'CIRC_HighCRP', label: 'High Inflammation', weight: 2.0, category: 'high', description: 'Lab-high inflammation (CRP, ESR)' },
      { code: 'CIRC_HighBP', label: 'Blood Pressure Issues', weight: 2.0, category: 'high', description: 'High or low blood pressure' },
      { code: 'CIRC_HeartIssues', label: 'Heart Issues', weight: 2.0, category: 'high', description: 'Heart-related symptoms' },
      { code: 'CIRC_PoorCirculation', label: 'Poor Circulation', weight: 2.0, category: 'high', description: 'Poor blood circulation' },
    ]
  },

  energy: {
    area: 'energy',
    areaLabel: 'Energy',
    baseMultiplier: 1.2, // Energy issues affect everything
    maxChips: 19,
    symptoms: [
      // Low Impact (1.0) - Common energy issues
      { code: 'ENE_Overheat', label: 'Overheating', weight: 1.0, category: 'low', description: 'Overheating easily or night sweats' },
      { code: 'ENE_CaffeineNeed', label: 'Caffeine Dependence', weight: 1.0, category: 'low', description: 'Need for caffeine to function' },
      { code: 'ENE_SleepTrouble', label: 'Sleep Trouble', weight: 1.0, category: 'low', description: 'Insomnia or trouble falling asleep' },
      { code: 'ENE_MidNightWake', label: 'Mid-Night Waking', weight: 1.0, category: 'low', description: 'Wake up in the middle of the night' },
      { code: 'ENE_Unrefreshed', label: 'Unrefreshed Sleep', weight: 1.0, category: 'low', description: 'Wake unrefreshed or difficulty waking' },
      { code: 'ENE_Anxiety', label: 'Anxiety', weight: 1.0, category: 'low', description: 'Anxiety or panic attacks' },
      { code: 'ENE_MoodSwings', label: 'Mood Swings', weight: 1.0, category: 'low', description: 'Mood swings or emotional eating' },
      { code: 'ENE_StressManage', label: 'Stress Management', weight: 1.0, category: 'low', description: 'Poor stress management' },
      { code: 'ENE_Disconnect', label: 'Disconnection', weight: 1.0, category: 'low', description: 'Feeling disconnected or overwhelmed' },
      { code: 'ENE_EmotionalReactive', label: 'Emotional Reactivity', weight: 1.0, category: 'low', description: 'Emotional reactivity' },
      { code: 'ENE_LowStamina', label: 'Low Stamina', weight: 1.0, category: 'low', description: 'Low stamina for daily tasks' },
      
      // Medium Impact (1.5) - More concerning energy issues
      { code: 'ENE_LowDrive', label: 'Low Drive', weight: 1.5, category: 'medium', description: 'Low morning drive or low libido' },
      { code: 'ENE_InsomniaRestless', label: 'Insomnia/Restlessness', weight: 1.5, category: 'medium', description: 'Severe insomnia or restlessness' },
      { code: 'ENE_Apnea', label: 'Sleep Apnea', weight: 1.5, category: 'medium', description: 'Snoring or possible sleep apnea' },
      { code: 'ENE_Burnout', label: 'Burnout', weight: 1.5, category: 'medium', description: 'Feeling burned out or overwhelmed' },
      { code: 'ENE_BodyComp', label: 'Body Composition Issues', weight: 1.5, category: 'medium', description: 'Body composition problems' },
      { code: 'ENE_AfternoonCrash', label: 'Afternoon Energy Crash', weight: 1.5, category: 'medium', description: 'Crash in energy between 2–5 PM' },
      
      // High Impact (2.0) - Serious energy/CFS issues
      { code: 'ENE_Fatigue', label: 'Chronic Fatigue', weight: 2.0, category: 'high', description: 'Persistent fatigue or energy crashes' },
      { code: 'ENE_CFS', label: 'CFS', weight: 2.0, category: 'high', description: 'Chronic fatigue syndrome' },
    ]
  },

  articular_joint: {
    area: 'articular_joint',
    areaLabel: 'Articular/Joints',
    baseMultiplier: 1.0,
    maxChips: 16,
    symptoms: [
      // Low Impact (1.0) - Common joint issues
      { code: 'ART_StiffKneeHip', label: 'Stiff Knees/Hips', weight: 1.0, category: 'low', description: 'Stiff knees or hips on waking' },
      { code: 'ART_ShoulderPinch', label: 'Shoulder Pinch', weight: 1.0, category: 'low', description: 'Shoulder pinch or limited reach' },
      { code: 'ART_Clicking', label: 'Joint Clicking', weight: 1.0, category: 'low', description: 'Clicking or grinding joints' },
      { code: 'ART_WeatherFlare', label: 'Weather Flares', weight: 1.0, category: 'low', description: 'Pain that flares with weather' },
      { code: 'ART_Stiffness', label: 'Joint Stiffness', weight: 1.0, category: 'low', description: 'General joint stiffness' },
      { code: 'ART_Cracking', label: 'Joint Cracking', weight: 1.0, category: 'low', description: 'Joint cracking or popping' },
      
      // Medium Impact (1.5) - More concerning joint issues
      { code: 'ART_AnklePain', label: 'Ankle Pain', weight: 1.5, category: 'medium', description: 'Ankle or foot pain during gait' },
      { code: 'ART_Swelling', label: 'Joint Swelling', weight: 1.5, category: 'medium', description: 'Joint swelling or redness' },
      { code: 'ART_RecentSprain', label: 'Recent Sprain', weight: 1.5, category: 'medium', description: 'Recent joint sprain or injury' },
      { code: 'ART_SittingPain', label: 'Sitting-Related Pain', weight: 1.5, category: 'medium', description: 'Joint pain worsens after sitting too long' },
      { code: 'ART_StairPain', label: 'Stair Pain/Stiffness', weight: 1.5, category: 'medium', description: 'Pain or stiffness when going up/down stairs' },
      { code: 'ART_Instability', label: 'Joint Instability', weight: 1.5, category: 'medium', description: 'Joint instability or giving way' },
      
      // High Impact (2.0) - Serious joint issues
      { code: 'ART_JointSurgery', label: 'Joint Surgery', weight: 2.0, category: 'high', description: 'Joint surgery or replacement' },
      { code: 'ART_LimitsADL', label: 'Limits Daily Activities', weight: 2.0, category: 'high', description: 'Joint pain that limits daily activities' },
      { code: 'ART_ExercisePain', label: 'Exercise-Induced Pain', weight: 2.0, category: 'high', description: 'Pain that worsens with movement or exercise' },
    ]
  },

  nervous_system: {
    area: 'nervous_system',
    areaLabel: 'Nervous System',
    baseMultiplier: 1.3, // Nervous system issues are often more impactful
    maxChips: 15,
    symptoms: [
      // Low Impact (1.0) - Common nervous system issues
      { code: 'NERV_ScreenHigh', label: 'Screen Sensitivity', weight: 1.0, category: 'low', description: 'Screen sensitivity or eye strain' },
      { code: 'NERV_Focus', label: 'Focus Issues', weight: 1.0, category: 'low', description: 'Trouble focusing or distractibility' },
      { code: 'NERV_BrainFog', label: 'Brain Fog', weight: 1.0, category: 'low', description: 'Brain fog or memory lapses' },
      { code: 'NERV_Tinnitus', label: 'Tinnitus', weight: 1.0, category: 'low', description: 'Tinnitus or ear pressure' },
      
      // Medium Impact (1.5) - More concerning nervous system issues
      { code: 'NERV_Headache', label: 'Headaches', weight: 1.5, category: 'medium', description: 'Headaches or migraines' },
      { code: 'NERV_TempDysreg', label: 'Temperature Dysregulation', weight: 1.5, category: 'medium', description: 'Temperature dysregulation' },
      { code: 'NERV_Balance', label: 'Balance Issues', weight: 1.5, category: 'medium', description: 'Poor coordination or balance' },
      { code: 'NERV_PinsNeedles', label: 'Pins & Needles', weight: 1.5, category: 'medium', description: 'Pins and needles or numbness' },
      { code: 'NERV_Overstimulation', label: 'Environmental Overstimulation', weight: 1.5, category: 'medium', description: 'Feel overstimulated in noisy or bright environments' },
      { code: 'NERV_Trembling', label: 'Trembling/Shakiness', weight: 1.5, category: 'medium', description: 'Trembling or shakiness when stressed or fatigued' },
      { code: 'NERV_MuscleTwitching', label: 'Muscle Twitching/Tics', weight: 1.5, category: 'medium', description: 'Unexplained muscle twitching or facial tics' },
      { code: 'NERV_Dizziness', label: 'Dizziness', weight: 1.5, category: 'medium', description: 'Frequent dizziness or vertigo' },
      
      // High Impact (2.0) - Serious nervous system issues
      { code: 'NERV_NervePain', label: 'Nerve Pain', weight: 2.0, category: 'high', description: 'Nerve pain or neuropathy' },
      { code: 'NERV_Concussion', label: 'Concussion History', weight: 2.0, category: 'high', description: 'History of concussion or head injury' },
      { code: 'NERV_Neurological', label: 'Neurological Issues', weight: 2.0, category: 'high', description: 'Serious neurological symptoms' },
    ]
  }
};

// ============================================================================
// SCORING ALGORITHMS
// ============================================================================

export interface ScoringResult {
  totalScore: number;
  baseScore: number;
  symptomPenalty: number;
  combinationPenalty: number;
  severityTier: 'low' | 'moderate' | 'high' | 'critical';
  breakdown: {
    sliderValue: number;
    symptomCount: number;
    weightedSymptoms: Array<{ code: string; weight: number; label: string }>;
    areaMultiplier: number;
  };
}

export function calculateWeightedSymptomScore(
  sliderValue: number,
  symptoms: string[],
  healthArea: string
): ScoringResult {
  const areaConfig = SYMPTOM_WEIGHTS[healthArea];
  if (!areaConfig) {
    return {
      totalScore: sliderValue || 0,
      baseScore: sliderValue || 0,
      symptomPenalty: 0,
      combinationPenalty: 0,
      severityTier: getSeverityTier(sliderValue || 0),
      breakdown: {
        sliderValue: sliderValue || 0,
        symptomCount: 0,
        weightedSymptoms: [],
        areaMultiplier: 1.0
      }
    };
  }

  // Base score from slider (0-10, where 10 is worst)
  const baseScore = sliderValue || 0;

  // Calculate weighted symptom penalty
  const weightedSymptoms = symptoms.map(symptomCode => {
    const symptom = areaConfig.symptoms.find(s => s.code === symptomCode);
    return {
      code: symptomCode,
      weight: symptom?.weight || 1.0,
      label: symptom?.label || symptomCode
    };
  });

  const symptomPenalty = weightedSymptoms.reduce((sum, symptom) => sum + symptom.weight, 0);

  // Apply area multiplier
  const adjustedPenalty = symptomPenalty * areaConfig.baseMultiplier;

  // Calculate combination penalties
  const combinationPenalty = calculateCombinationPenalty(symptoms, healthArea);

  // Calculate total score (capped at 10)
  const totalScore = Math.min(baseScore + adjustedPenalty + combinationPenalty, 10);

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    baseScore,
    symptomPenalty: adjustedPenalty,
    combinationPenalty,
    severityTier: getSeverityTier(totalScore),
    breakdown: {
      sliderValue: baseScore,
      symptomCount: symptoms.length,
      weightedSymptoms,
      areaMultiplier: areaConfig.baseMultiplier
    }
  };
}

function calculateCombinationPenalty(symptoms: string[], healthArea: string): number {
  let penalty = 0;

  // Pain + Fatigue combination (very common and impactful)
  if (hasPainAndFatigue(symptoms, healthArea)) {
    penalty += 0.5;
  }

  // Sleep + Energy combination
  if (hasSleepAndEnergyIssues(symptoms, healthArea)) {
    penalty += 0.3;
  }

  // Inflammation + Pain combination
  if (hasInflammationAndPain(symptoms, healthArea)) {
    penalty += 0.4;
  }

  // Multiple high-impact symptoms
  const highImpactCount = symptoms.filter(s => {
    const areaConfig = SYMPTOM_WEIGHTS[healthArea];
    const symptom = areaConfig?.symptoms.find(symp => symp.code === s);
    return symptom?.category === 'high' || symptom?.category === 'critical';
  }).length;

  if (highImpactCount >= 2) {
    penalty += 0.3;
  }

  return penalty;
}

function hasPainAndFatigue(symptoms: string[], healthArea: string): boolean {
  const painSymptoms = ['MSK_NeckTension', 'MSK_LowBackTight', 'MSK_Cramps', 'ART_StiffKneeHip', 'ART_ShoulderPinch', 'ART_AnklePain'];
  const fatigueSymptoms = ['ENE_Fatigue', 'ENE_CFS', 'ENE_LowDrive', 'ENE_Burnout'];
  
  return symptoms.some(s => painSymptoms.includes(s)) && symptoms.some(s => fatigueSymptoms.includes(s));
}

function hasSleepAndEnergyIssues(symptoms: string[], healthArea: string): boolean {
  const sleepSymptoms = ['ENE_SleepTrouble', 'ENE_MidNightWake', 'ENE_Unrefreshed', 'ENE_Apnea'];
  const energySymptoms = ['ENE_Fatigue', 'ENE_LowDrive', 'ENE_Burnout'];
  
  return symptoms.some(s => sleepSymptoms.includes(s)) && symptoms.some(s => energySymptoms.includes(s));
}

function hasInflammationAndPain(symptoms: string[], healthArea: string): boolean {
  const inflammationSymptoms = ['CIRC_HighCRP', 'CIRC_AutoInflam', 'ORG_ChronicInflammation'];
  const painSymptoms = ['MSK_NeckTension', 'MSK_LowBackTight', 'MSK_Cramps', 'ART_StiffKneeHip', 'ART_ShoulderPinch'];
  
  return symptoms.some(s => inflammationSymptoms.includes(s)) && symptoms.some(s => painSymptoms.includes(s));
}

export function getSeverityTier(score: number): 'low' | 'moderate' | 'high' | 'critical' {
  if (score >= 8) return 'critical';
  if (score >= 6) return 'high';
  if (score >= 3) return 'moderate';
  return 'low';
}

export function getSeverityInfo(score: number) {
  const tier = getSeverityTier(score);
  const severityMap = {
    low: { tier: '🟢 Low', color: 'text-green-600', bg: 'bg-green-50', description: 'Minimal impact on daily function' },
    moderate: { tier: '🟡 Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50', description: 'Some impact on daily activities' },
    high: { tier: '🟠 High', color: 'text-orange-600', bg: 'bg-orange-50', description: 'Significant impact on quality of life' },
    critical: { tier: '🔴 Critical', color: 'text-red-600', bg: 'bg-red-50', description: 'Severe impact requiring immediate attention' }
  };
  
  return severityMap[tier];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getSymptomByCode(code: string): SymptomWeight | null {
  for (const area of Object.values(SYMPTOM_WEIGHTS)) {
    const symptom = area.symptoms.find(s => s.code === code);
    if (symptom) return symptom;
  }
  return null;
}

export function getAllSymptoms(): SymptomWeight[] {
  return Object.values(SYMPTOM_WEIGHTS).flatMap(area => area.symptoms);
}

export function getSymptomsByArea(area: string): SymptomWeight[] {
  return SYMPTOM_WEIGHTS[area]?.symptoms || [];
}

export function getAreaConfig(area: string): HealthAreaScoring | null {
  return SYMPTOM_WEIGHTS[area] || null;
} 