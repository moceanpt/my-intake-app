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
          'Low stamina for daily tasks',
        ],
      },
      {
        id: 'sleep_symptoms',
        prompt: 'Sleep – check any that apply:',
        type: 'multi',
        options: [
          'Insomnia / trouble falling asleep',
          'Wake up in the middle of the night',
          'Wake unrefreshed / difficulty waking',
          'Snoring / possible sleep-apnoea',
        ],
      },
      {
        id: 'mood_symptoms',
        prompt: 'Mood – check any that apply:',
        type: 'multi',
        options: [
          'Low / irritable baseline',
          'Feeling overwhelmed or burned-out',
          'Anxiety or panic attacks',
          'Mood swings / emotional eating',
        ],
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
          'Joint swelling or redness',
          'Joint pain that limits daily activities',
          
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
          'Frequent dizziness or vertigo',
          'Poor coordination or balance',
          
        ],
        pillar: 'nervous',
        risk_logic: '1 each',
      },
    ],
  },

 /* ----------------------------------------------------------------
   2 · LIFESTYLE SECTIONS  (33 Qs ≈ 4-minute core survey)
------------------------------------------------------------------ */
lifestyle: {
    /* ─────────────🏃 MOVE (5)───────────── */
    move: [
      {
        id: 'intentional_move_days',
        prompt: 'How often do you get intentional movement?',
        type:  'single',
        options: ['0–1/wk', '2–3/wk', '4 +/wk'],
        lifestyle_pillar: 'move',
        risk_points: '2,1,0',
      },
      {
        id: 'resistance_sessions',
        prompt: 'Resistance-training sessions / wk',
        type:  'single',
        options: ['0–1', '2–3', '4 +'],
        lifestyle_pillar: 'move',
        risk_points: '2,1,0',
      },
      {
        id: 'daily_steps',
        prompt: 'Average steps per day',
        type:  'single',
        options: ['< 4 k', '4–7 k', '7–10 k', '10 k +'],
        lifestyle_pillar: 'move',
        risk_points: '2,1,0,0',
      },
      {
        id: 'sitting_hours',
        prompt: 'Total sitting hours / day',
        type:  'single',
        options: ['< 4 h','4–6 h','6–8 h','8 h +'],
        lifestyle_pillar: 'move',
        risk_points: '0,1,2,3',
      },
      {
        id: 'move_barrier',
        prompt: 'Biggest barrier to moving more',
        type:  'single',
        options: ['Pain', 'Time / Motivation / Unsure'],
        lifestyle_pillar: 'move',
        risk_points: '2,1',
      },
    ],
  
    /* ─────────────🧠 WORK & REST (5)───────────── */
    rest: [
      {
        id: 'sleep_hours',
        prompt: "Typical night's sleep",
        type:  'single',
        options: ['< 5 h','5–7 h','7–9 h','9 h +'],
        lifestyle_pillar: 'rest',
        risk_points: '3,1,0,1',
      },
      {
        id: 'refreshed_am',
        prompt: 'Feel refreshed on waking?',
        type:  'single',
        options: ['Yes','No'],
        lifestyle_pillar: 'rest',
        risk_points: '0,1',
      },
      {
        id: 'prebed_screen',
        prompt: 'Screen use within 60 min of sleep',
        type:  'single',
        options: ['Nightly','Few / wk','Rare'],
        lifestyle_pillar: 'rest',
        risk_points: '2,1,0',
      },
      {
        id: 'bedtime_variability',
        prompt: 'Bedtime varies > 2 h across week?',
        type:  'single',
        options: ['Yes','No'],
        lifestyle_pillar: 'rest',
        risk_points: '1,0',
      },
      {
        id: 'shift_pattern',
        prompt: 'Shift pattern',
        type:  'single',
        options: ['Day','Night / Rotating'],
        lifestyle_pillar: 'rest',
        risk_points: '0,2',
      },
    ],
  
    /* ─────────────💧 HYDRATION (5)───────────── */
    hydrate: [
      {
        id: 'water_habit',
        prompt: 'Plain-water (8-oz glasses / day)',
        type:  'single',
        options: ['< 4','4–7','8–10','10 +'],
        lifestyle_pillar: 'hydrate',
        risk_points: '2,1,0,0',
      },
      {
        id: 'sugary_drinks',
        prompt: 'Sugary / energy drinks',
        type:  'single',
        options: ['None','≤ 1 / wk','2–4 / wk','Daily'],
        lifestyle_pillar: 'hydrate',
        risk_points: '0,1,2,3',
      },
      {
        id: 'alcohol',
        prompt: 'Alcohol intake',
        type:  'single',
        options: ['Never','Occasional','Regular','Daily'],
        lifestyle_pillar: 'hydrate',
        risk_points: '0,1,2,3',
      },
      {
        id: 'thirsty_during_day',
        prompt: 'Feel noticeably thirsty during day?',
        type:  'single',
        options: ['Rarely','Sometimes','Often'],
        lifestyle_pillar: 'hydrate',
        risk_points: '0,1,2',
      },
      {
        id: 'start_with_water',
        prompt: 'Start day with water?',
        type:  'single',
        options: ['Yes','No'],
        lifestyle_pillar: 'hydrate',
        risk_points: '0,1',
      },
    ],
  
    /* ─────────────🍽️ NOURISHMENT (6)───────────── */
    nourish: [
      {
        id: 'produce_servings',
        prompt: 'Fruits & veggies per day',
        type:  'single',
        options: ['0–1','2–3','4 +'],
        lifestyle_pillar: 'nourish',
        risk_points: '2,1,0',
      },
      {
        id: 'protein_meals',
        prompt: 'Protein at most meals?',
        type:  'single',
        options: ['Rarely','About half','Most'],
        lifestyle_pillar: 'nourish',
        risk_points: '2,1,0',
      },
      {
        id: 'sweet_treats',
        prompt: 'Sugary drinks / desserts',
        type:  'single',
        options: ['Almost never','Few / wk','Daily +'],
        lifestyle_pillar: 'nourish',
        risk_points: '0,1,2',
      },
      {
        id: 'whole_grain',
        prompt: 'Whole-grain / high-fibre servings',
        type:  'single',
        options: ['Rarely','Some days','Most days'],
        lifestyle_pillar: 'nourish',
        risk_points: '2,1,0',
      },
      {
        id: 'healthy_fat',
        prompt: 'Healthy-fat sources daily?',
        type:  'single',
        options: ['Rarely','Some days','Most days'],
        lifestyle_pillar: 'nourish',
        risk_points: '2,1,0',
      },
      {
        id: 'cook_ratio',
        prompt: 'Eat-out vs cook-in',
        type:  'single',
        options: ['Home-cooked','Half-&-half','Mostly take-out'],
        lifestyle_pillar: 'nourish',
        risk_points: '0,1,2',
      },
    ],
  
    /* ─────────────😌 STRESS & MIND-BODY (5)───────────── */
    stress: [
      {
        id: 'stress_scale',
        prompt: 'Perceived stress (0-10)',
        type:  'input',
        lifestyle_pillar: 'stress',
        risk_points: '0-2',          // round(val / 5)
      },
      {
        id: 'stress_reset',
        prompt: 'Stress-reset tools (multi)',
        type:  'multi',
        options: ['Healthy tools','Still figuring'],
        lifestyle_pillar: 'stress',
        risk_points: 'rule',         // +1 only if sole = “Still figuring”
      },
      {
        id: 'social_support',
        prompt: 'Close confidant available?',
        type:  'single',
        options: ['Yes','No'],
        lifestyle_pillar: 'stress',
        risk_points: '0,1',
      },
      {
        id: 'work_life_balance',
        prompt: 'Work–life balance',
        type:  'single',
        options: ['Good','Adequate','Poor'],
        lifestyle_pillar: 'stress',
        risk_points: '0,1,2',
      },
      {
        id: 'mindfulness_minutes',
        prompt: 'Minutes of mindfulness most days',
        type:  'single',
        options: ['< 5','5–10','> 10'],
        lifestyle_pillar: 'stress',
        risk_points: '2,1,0',
      },
    ],
  
    /* ─────────────🛁 RECOVERY & SELF-CARE (7)───────────── */
    restore: [
      {
        id: 'recovery_tools',
        prompt: 'Recovery tools used? (multi)',
        type:  'multi',
        options: ['None','Any tool'],
        lifestyle_pillar: 'restore',
        risk_points: 'rule',         // +1 if only “None”
      },
      {
        id: 'leisure_screen_time',
        prompt: 'Leisure screen time / day',
        type:  'single',
        options: ['< 1 h','1–3 h','> 3 h'],
        lifestyle_pillar: 'restore',
        risk_points: '0,1,2',
      },
      {
        id: 'rest_days',
        prompt: 'Rest days from intense training / wk',
        type:  'single',
        options: ['0','1','2','3 +'],
        lifestyle_pillar: 'restore',
        risk_points: '2,1,0,0',
      },
      {
        id: 'time_outdoors',
        prompt: 'Time outdoors (natural light)',
        type:  'single',
        options: ['< 15 min','15–30','30–60','60 +'],
        lifestyle_pillar: 'restore',
        risk_points: '2,1,0,0',
      },
      {
        id: 'morning_sun',
        prompt: 'Morning sunlight within 1 h of waking?',
        type:  'single',
        options: ['Yes','No'],
        lifestyle_pillar: 'restore',
        risk_points: '0,1',
      },
      {
        id: 'bedroom_environment',
        prompt: 'Bedroom environment',
        type:  'single',
        options: ['Optimal','Needs work','Poor'],
        lifestyle_pillar: 'restore',
        risk_points: '0,1,2',
      },
      {
        id: 'digital_shutdown',
        prompt: 'Digital shut-down ≥ 30 min before bed?',
        type:  'single',
        options: ['Never','Some nights','Most nights'],
        lifestyle_pillar: 'restore',
        risk_points: '2,1,0',
      },
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*                                  EXPORT                           */
/* ------------------------------------------------------------------ */

export default questionSchema;