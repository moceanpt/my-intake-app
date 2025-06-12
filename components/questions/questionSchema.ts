/* --------------------------------------------------------------------------
   components/questions/questionSchema.ts
   Fully typed question-schema for Health-&-Lifestyle intake
-------------------------------------------------------------------------- */

export type MoceanPillar =
  | 'muscle'
  | 'organ'
  | 'circulation'
  | 'emotion'
  | 'articular'
  | 'nervous';

export type LifestylePillar =
  | 'physical'
  | 'sleep'
  | 'nutrition'
  | 'hydration'
  | 'stress'
  | 'recovery';

export type Pillar = MoceanPillar | LifestylePillar;

export type QuestionType = 'single' | 'multi' | 'input';

export interface BaseQ {
  id: string;
  prompt: string;
  type: QuestionType;
  pillar: Pillar;
  risk_logic?: string;
  risk_points?: string;
}

export interface ChoiceQ extends BaseQ {
  type: 'single' | 'multi';
  options: string[];
}

export interface InputQ extends BaseQ {
  type: 'input';
}

export type Question = ChoiceQ | InputQ;

export type SectionMap = Record<string, Question[]>;

export interface QuestionSchema {
  health: SectionMap;
  lifestyle: SectionMap;
}

/* ------------------------------------------------------------------ */
/* ⚠️  The big constant.  Edit here to add/remove questions & options */
/* ------------------------------------------------------------------ */

const questionSchema: QuestionSchema = {
  /* ----------------------------------------------------------------
     1 · MOCEAN HEALTH CHECK SECTIONS
  ---------------------------------------------------------------- */
  health: {
    musculoskeletal: [
      {
        id: 'muscle_symptoms',
        prompt:
          'Do your muscles often feel tight, sore, or weak? (check all that apply)',
        type: 'multi',
        options: [
          'Persistent neck / shoulder tension',
          'Low-back tightness or spasms',
          'Muscle cramps or restless legs',
          'Slow recovery after workouts',
          'Muscle weakness / poor exercise tolerance',
          'Noticeable strength loss',
          'Recurring muscle strains / tears',
          'Chronic tendon pain (Achilles, elbow, rotator cuff)',
        ],
        pillar: 'muscle',
        risk_logic: '1 point per checked item',
      },
    ],

    organ_digest_hormone_detox: [
      {
        id: 'organ_symptoms',
        prompt:
          'Do you experience digestion, hormone, or detox troubles? (check all that apply)',
        type: 'multi',
        options: [
          'Bloating / gas',
          'Heartburn / reflux',
          'Constipation or diarrhea',
          'Food sensitivities / sugar-carb cravings',
          'Fatigue right after meals',
          'Liver / skin changes (itchy skin, dark urine)',
          'Chemical or alcohol sensitivity',
          'Frequent antibiotics / chronic sinus-yeast',
          'Metabolic syndrome (high cholesterol, sugar)',
          'IBS diagnosis',
        ],
        pillar: 'organ',
        risk_logic: '1 per checked',
      },
    ],

    circulation: [
      {
        id: 'circulation_symptoms',
        prompt:
          'Do you notice poor blood or lymph flow? (check all that apply)',
        type: 'multi',
        options: [
          'Cold or numb hands / feet (Raynaud’s)',
          'Varicose veins or leg cramps',
          'Swelling / puffiness / limb heaviness',
          'Skin issues / flares (eczema, rashes)',
          'Slow healing or easy bruising',
          'Inflammatory / auto-immune issue',
          'Lab-high inflammation (CRP, ESR)',
          'Dizzy or light-headed on standing',
          'Frequent cold sores / slow immune recovery',
          'High blood pressure',
          'Cold intolerance',
        ],
        pillar: 'circulation',
        risk_logic: '1 per checked',
      },
      {
        id: 'bp_recent',
        prompt: 'Most recent blood-pressure reading (within 12 months)',
        type: 'single',
        options: [
          'Normal (< 120/80)',
          'Elevated (120–129/<80)',
          'High (≥ 130/80) or on BP meds',
          'Unsure / Not checked',
        ],
        pillar: 'circulation',
        risk_logic: '0,1,2,1 points in listed order',
      },
    ],

    energy_sleep_emotion: [
      {
        id: 'energy_symptoms',
        prompt: 'Energy – check any that apply:',
        type: 'multi',
        options: [
          'Persistent fatigue / energy crashes',
          'Overheating easily or night-sweats',
          'Low morning drive / low libido',
          'Need caffeine to function',
          'Diagnosed CFS / fibromyalgia / post-infection',
          'Body-composition change (belly fat, muscle loss)',
        ],
        pillar: 'emotion',
        risk_logic: '1 each',
      },
      {
        id: 'sleep_symptoms',
        prompt: 'Sleep – check any that apply:',
        type: 'multi',
        options: [
          'Trouble falling asleep / busy mind',
          'Wake up in the middle of the night',
          'Sleep disturbances (insomnia, restless legs)',
          'Waking up tired / unrefreshed',
          'Difficulty waking up in the morning',
          'Snoring / possible sleep-apnea',
        ],
        pillar: 'nervous',
        risk_logic: '1 each',
      },
      {
        id: 'emotion_symptoms',
        prompt: 'Emotion & mood – check any that apply:',
        type: 'multi',
        options: [
          'Anxiety or panic attacks',
          'Mood swings / emotional eating',
          'Low motivation / lack of joy',
          'Feeling overwhelmed or burned out',
          'Difficulty managing stress',
          'Feeling disconnected from your body',
          'Feeling emotionally reactive / easily triggered',
        ],
        pillar: 'emotion',
        risk_logic: '1 each',
      },
    ],

    articular_joint: [
      {
        id: 'joint_symptoms',
        prompt:
          'Do joints limit your daily movement or exercise? (check all that apply)',
        type: 'multi',
        options: [
          'Stiff knees / hips on waking',
          'Shoulder pinch or limited reach',
          'Ankle / foot pain during gait',
          'Clicking or grinding joints',
          'Pain that flares with weather',
          'Recent sprain / overuse injury',
          'Joint swelling or redness',
          'Joint pain that limits daily activities',
          'History of joint surgery / replacement',
        ],
        pillar: 'articular',
        risk_logic: '1 each',
      },
    ],

    nervous_system: [
      {
        id: 'nervous_symptoms',
        prompt:
          'Do focus, headaches, or nerve issues bother you? (check all that apply)',
        type: 'multi',
        options: [
          'Brain-fog / memory lapses',
          'Trouble focusing / distractibility',
          'Headaches / migraines',
          'Tinnitus or ear pressure',
          'Concussion or head-injury history',
          'Pins-and-needles / numb patches',
          'High screen time (6 + hrs)',
          'Poor coordination or balance',
          'Burning or electric nerve pain',
          'Difficulty regulating body temperature',
        ],
        pillar: 'nervous',
        risk_logic: '1 each',
      },
    ],
  },

 /* ----------------------------------------------------------------
   2 · LIFESTYLE SECTIONS (with explicit risk_points matching your table)
------------------------------------------------------------------ */
lifestyle: {
    move: [
      {
        id: 'intentional_move_days',
        prompt: 'How often do you get intentional movement?',
        type: 'single',
        options: ['0–1 day/wk', '2–3 days', '4 days +'],
        pillar: 'muscle',
        risk_points: '2,1,0',
      },
      {
        id: 'session_length',
        prompt: 'Typical session length',
        type: 'single',
        options: ['< 20 min', '20–40 min', '40–60 min', '60 min +'],
        pillar: 'muscle',
        risk_points: '2,1,0,0',
      },
      {
        id: 'move_types',
        prompt: 'Favourite ways to move (multi-select)',
        type: 'multi',
        options: [
          'Strength / Cardio',
          'Yoga / Mobility',
          'Sports / Walking',
        ],
        pillar: 'muscle',
        risk_points: 'rule', // you'll apply: 0 pts if ≥2 chosen, 1 pt if 1 chosen, 2 pts if none
      },
      {
        id: 'daily_steps',
        prompt: 'Average steps per day',
        type: 'single',
        options: ['< 4k', '4–7k', '7–10k', '10k +'],
        pillar: 'circulation',
        risk_points: '2,1,0,0',
      },
      {
        id: 'move_barrier',
        prompt: 'Biggest barrier to moving more',
        type: 'single',
        options: ['Pain', 'Time', 'Motivation', 'Unsure where to start'],
        pillar: 'articular',
        risk_points: '2,1,0,0',
      },
      {
        id: 'resistance_sessions',
        prompt: 'Resistance‑training sessions / wk',
        type: 'single',
        options: ['0–1', '2–3', '4+'],
        pillar: 'muscle',
        risk_points: '2,1,0',
      },
      {
        id: 'hiit_sessions',
        prompt: 'Vigorous / HIIT sessions / wk',
        type: 'single',
        options: ['0', '1', '2', '3+'],
        pillar: 'muscle',
        risk_points: '2,1,0,0',
      },
      {
        id: 'balance_routine',
        prompt: 'Balance / mobility routine frequency',
        type: 'single',
        options: ['Rarely', '1–2× wk', '3× wk+'],
        pillar: 'muscle',
        risk_points: '2,1,0',
      },
      {
        id: 'sitting_hours',
        prompt: 'Total sitting hours / day',
        type: 'single',
        options: ['< 4 h', '4–6 h', '6–8 h', '8 h+'],
        pillar: 'circulation',
        risk_points: '0,1,2,3',
      },
      {
        id: 'post_stretch',
        prompt: 'Post‑exercise stretch ≥ 5 min',
        type: 'single',
        options: ['Almost never', 'Sometimes', 'After most workouts'],
        pillar: 'muscle',
        risk_points: '2,1,0',
      },
    ],
  
    work_rest: [
      {
        id: 'work_rhythm',
        prompt: 'Work rhythm',
        type: 'single',
        options: ['Mostly seated', 'Mix', 'On feet'],
        pillar: 'circulation',
        risk_points: '2,1,0',
      },
      {
        id: 'shift_pattern',
        prompt: 'Shift pattern',
        type: 'single',
        options: ['Day', 'Night', 'Rotating'],
        pillar: 'nervous',
        risk_points: '0,2,2',
      },
      {
        id: 'sleep_hours',
        prompt: "Typical night's sleep",
        type: 'single',
        options: ['< 5 h', '5–7 h', '7–9 h', '9 h+'],
        pillar: 'nervous',
        risk_points: '3,1,0,1',
      },
      {
        id: 'refreshed_am',
        prompt: 'Feel refreshed on waking?',
        type: 'single',
        options: ['Yes', 'No'],
        pillar: 'nervous',
        risk_points: '0,1',
      },
      {
        id: 'prebed_screen',
        prompt: 'Screen use within 60 min of sleep',
        type: 'single',
        options: ['Nightly', 'Few nights/wk', 'Rarely / never'],
        pillar: 'nervous',
        risk_points: '2,1,0',
      },
      {
        id: 'microbreaks',
        prompt: 'Micro‑screen breaks per hour',
        type: 'single',
        options: ['0–1', '2–3', '4+'],
        pillar: 'nervous',
        risk_points: '2,1,0',
      },
      {
        id: 'unwind_methods',
        prompt: 'How do you unwind? (multi)',
        type: 'multi',
        options: [
          'Screen time',
          'Other methods',
        ],
        pillar: 'emotion',
        risk_points: 'rule', // +1 only if Screen-time is sole
      },
      {
        id: 'bedtime_variability',
        prompt: 'Bedtime varies >2 h across week?',
        type: 'single',
        options: ['Yes', 'No'],
        pillar: 'nervous',
        risk_points: '1,0',
      },
    ],
  
    hydration: [
      {
        id: 'water_habit',
        prompt: 'Plain-water (glasses/day)',
        type: 'single',
        options: ['< 4', '4–7', '8–10', '10+'],
        pillar: 'circulation',
        risk_points: '2,1,0,0',
      },
      {
        id: 'coffee_tea',
        prompt: 'Coffee / tea per day',
        type: 'single',
        options: ['0', '1', '2–3', '4+'],
        pillar: 'nervous',
        risk_points: '0,0,1,2',
      },
      {
        id: 'sugary_drinks',
        prompt: 'Sugary drinks / soda',
        type: 'single',
        options: ['None', '≤1/wk', '2–4/wk', 'Daily'],
        pillar: 'organ',
        risk_points: '0,1,2,3',
      },
      {
        id: 'alcohol',
        prompt: 'Alcohol intake',
        type: 'single',
        options: ['Never', 'Occasional', 'Regular', 'Daily'],
        pillar: 'organ',
        risk_points: '0,1,2,3',
      },
      {
        id: 'electrolytes',
        prompt: 'Electrolyte drinks ≥ 3×/wk?',
        type: 'single',
        options: ['Yes', 'No'],
        pillar: 'circulation',
        risk_points: '0,0',
      },
      {
        id: 'start_with_water',
        prompt: 'Start day with water?',
        type: 'single',
        options: ['Yes', 'No'],
        pillar: 'circulation',
        risk_points: '0,1',
      },
      {
        id: 'thirsty_during_day',
        prompt: 'Feel thirsty during day?',
        type: 'single',
        options: ['Rarely', 'Sometimes', 'Often'],
        pillar: 'circulation',
        risk_points: '0,1,2',
      },
      {
        id: 'add_salt_meals',
        prompt: 'Add salt to meals?',
        type: 'single',
        options: ['Never', 'Occasionally', 'Often'],
        pillar: 'circulation',
        risk_points: '0,1,2',
      },
      {
        id: 'sports_drinks',
        prompt: 'Use sports drinks?',
        type: 'single',
        options: ['Never', 'Occasionally', 'Every hard workout'],
        pillar: 'circulation',
        risk_points: '0,1,2',
      },
      {
        id: 'track_hydration',
        prompt: 'Track hydration?',
        type: 'single',
        options: ['Yes', 'No'],
        pillar: 'circulation',
        risk_points: '0,1',
      },
    ],
  
    nourishment: [
      // keep your existing 11 nourishment questions—no changes
    ],
  
    stress_mind_body: [
      {
        id: 'stress_reset',
        prompt: 'Stress-reset tools? (multi)',
        type: 'multi',
        options: [
          'Healthy tools',
          'Still figuring this out',
        ],
        pillar: 'emotion',
        risk_points: 'rule',
      },
      {
        id: 'stress_scale',
        prompt: 'Perceived stress (0–10)',
        type: 'input',
        pillar: 'emotion',
        risk_points: '0-2', // computed by value => round(value / 5)
      },
      {
        id: 'social_support',
        prompt: 'Close confidant available?',
        type: 'single',
        options: ['Yes', 'No'],
        pillar: 'emotion',
        risk_points: '0,1',
      },
      {
        id: 'mental_stimulation',
        prompt: 'Mentally stimulating hobbies / wk',
        type: 'single',
        options: ['< 1 h', '1–3 h', '> 3 h'],
        pillar: 'nervous',
        risk_points: '2,1,0',
      },
      {
        id: 'mindfulness_minutes',
        prompt: 'Mindfulness minutes most days',
        type: 'single',
        options: ['< 5', '5–10', '> 10'],
        pillar: 'emotion',
        risk_points: '2,1,0',
      },
      {
        id: 'work_life_balance',
        prompt: 'Work–life balance',
        type: 'single',
        options: ['Good', 'Adequate', 'Poor'],
        pillar: 'emotion',
        risk_points: '0,1,2',
      },
      {
        id: 'purpose_meaning',
        prompt: 'Purpose / meaning (1–5)',
        type: 'single',
        options: ['1','2','3','4','5'],
        pillar: 'emotion',
        risk_points: '2,2,1,0,0',
      },
      {
        id: 'laughter_daily',
        prompt: 'Laughter each day',
        type: 'single',
        options: ['Rarely','Few times','Many times'],
        pillar: 'emotion',
        risk_points: '2,1,0',
      },
      {
        id: 'seen_therapist',
        prompt: 'Seen therapist in past year?',
        type: 'single',
        options: ['Yes','No'],
        pillar: 'emotion',
        risk_points: '0,1',
      },
    ],
  
    recovery_selfcare: [
      {
        id: 'recovery_tools',
        prompt: 'Recovery tools used? (multi)',
        type: 'multi',
        options: ['None','Any tool'],
        pillar: 'muscle',
        risk_points: 'rule',
      },
      {
        id: 'leisure_screen_time',
        prompt: 'Leisure screen time / day',
        type: 'single',
        options: ['< 1 h','1–3 h','> 3 h'],
        pillar: 'nervous',
        risk_points: '0,1,2',
      },
      {
        id: 'rest_days',
        prompt: 'Rest days from intense training / wk',
        type: 'single',
        options: ['0','1','2','3+'],
        pillar: 'muscle',
        risk_points: '2,1,0,0',
      },
      {
        id: 'active_recovery_sessions',
        prompt: 'Active‑recovery sessions / wk',
        type: 'single',
        options: ['0','1–2','3+'],
        pillar: 'muscle',
        risk_points: '2,1,0',
      },
      {
        id: 'time_outdoors',
        prompt: 'Time outdoors / day',
        type: 'single',
        options: ['< 15 min','15–30 min','30–60 min','60+'],
        pillar: 'emotion',
        risk_points: '2,1,0,0',
      },
      {
        id: 'morning_sun',
        prompt: 'Morning sunlight within 1 h?',
        type: 'single',
        options: ['Yes','No'],
        pillar: 'nervous',
        risk_points: '0,1',
      },
      {
        id: 'annual_checkup',
        prompt: 'Annual medical/dental check‑up done?',
        type: 'single',
        options: ['Yes','No'],
        pillar: 'emotion',
        risk_points: '0,1',
      },
      {
        id: 'bedroom_environment',
        prompt: 'Bedroom environment',
        type: 'single',
        options: ['Optimal','Needs work','Poor'],
        pillar: 'emotion',
        risk_points: '0,1,2',
      },
      {
        id: 'digital_shutdown',
        prompt: 'Digital shut‑down ≥30 min before bed?',
        type: 'single',
        options: ['Never','Some nights','Most nights'],
        pillar: 'nervous',
        risk_points: '2,1,0',
      },
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*                                  EXPORT                           */
/* ------------------------------------------------------------------ */

export default questionSchema;