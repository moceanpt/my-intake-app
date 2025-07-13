/* ------------------------------------------------------------------
   lib/historySchema.ts
   – central place for the medical-history questionnaire
------------------------------------------------------------------- */
export const HISTORY_SECTIONS = [
    {
      id   : 'heart',
      title: 'Heart / vascular history',
      items: [
        ['heart',  'Heart disease / stent'],
        ['bp',     'High blood pressure'],
        ['clots',  'History of clots / stroke'],
        ['pacer',  'Pacemaker / ICD / heart-valve implant'],
      ],
    },
    {
      id   : 'metabolic',
      title: 'Metabolic & hormone',
      items: [
        ['diab1',   'Diabetes – type 1'],
        ['diab2',   'Diabetes – type 2'],
        ['prediab', 'Pre-diabetes'],
        ['hypo',    'Hypothyroidism / Hashimoto\'s'],
        ['hyper',   'Hyperthyroidism / Graves\'s'],
        ['pcos',    'Endometriosis and/or PCOS'],
        ['hormone', 'Low testosterone / HRT / menopause'],
        ['steroid', 'Long-term corticosteroid use (> 3 mo)'],
        ['metaOther','Other endocrine / hormone issue', true],
      ],
    },
    {
      id   : 'immune',
      title: 'Immune / auto-immune',
      items: [
        ['ra',     'Rheumatoid arthritis'],
        ['sle',    'Systemic lupus'],
        ['psa',    'Psoriasis / psoriatic arthritis'],
        ['axspa',  'Ankylosing spondylitis / axial SpA'],
        ['ibd',    'Inflammatory bowel (Crohn\'s / UC)'],
        ['celiac', 'Coeliac disease'],
        ['ms',     'Multiple sclerosis'],
        ['sj',     'Sjögren\'s syndrome'],
        ['immOther','Other auto-immune', true],
      ],
    },
    { id:'cancer',  title:'Cancer history', items:[['cancer','Type & year',true]] },
  
    {
      id:'surgery',
      title:'Surgery / implants',
      items:[
        ['majorSx','Major surgery — year', true],
        ['joint',  'Joint replacement / metal hardware'],
        ['spinal', 'Spinal fusion or disc implant'],
        ['device', 'Other implanted device — type & year', true],
      ],
    },
    {
      id:'neuro',
      title:'Neurological history',
      items:[
        ['seizure',   'Seizure disorder'],
        ['neuroPathy','Neuropathy / nerve damage'],
        ['tbi',       'Concussion / TBI history'],
      ],
    },
    {
      id:'respRenal',
      title:'Respiratory / kidney / liver',
      items:[
        ['asthma','Asthma / COPD'],
        ['ckd',   'Chronic kidney disease'],
        ['liver', 'Liver disease / hepatitis'],
      ],
    },
    {
      id:'blood',
      title:'Bleeding / clotting',
      items:[
        ['bleed',  'Bleeding / clotting disorder'],
        ['thinner','Currently on blood thinners'],
      ],
    },
    {
      id:'boneSkin',
      title:'Bone density / photosensitivity',
      items:[
        ['osteo',     'Osteoporosis / osteopenia — year', true],
        ['photoNerve','Photosensitive migraines / seizures'],
        ['photoSkin', 'Photosensitive skin condition'],
      ],
    },
    {
      id:'preg',
      title:'Pregnancy',
      items:[
        ['preg','Currently pregnant'],
        ['pp',  'Post-partum (< 6 months)'],
      ],
    },
  ] as const;
  
  /* ------------------------------------------------------------------
     AUTO-DERIVED  key → label dictionary
  ------------------------------------------------------------------- */
  export const HISTORY_LABEL: Record<string,string> = Object.fromEntries(
    HISTORY_SECTIONS.flatMap(sec =>
      sec.items.map(item => [item[0] as string, item[1] as string]),
    ),
  );