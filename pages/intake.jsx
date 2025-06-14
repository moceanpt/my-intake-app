import { useState } from 'react';
import Head          from 'next/head';
import Progress      from '../components/ui/Progress';

/* step screens */
import ReasonsStep     from '../components/steps/ReasonsStep';
import SnapshotStep    from '../components/steps/SnapshotStep';
import HistoryStep     from '../components/steps/HistoryStep';
import HealthCheckStep from '../components/steps/HealthCheckStep';
import LifestyleStep   from '../components/steps/LifestyleStep';
import ResultSheet from '../components/ui/ResultSheet'
import { calcLifestyleScore } from '@/lib/score';
import LifestyleResultSheet from '@/components/ui/LifestyleResultSheet';
import ResultView from '@/components/ResultView';

export default function Intake() {
  /* ---------- full form state ---------- */
  const [data, setData] = useState({
    reasons: [],
    snapshot: { overall:5, energy:5, sleep:5, mood:5,
                stress:5, pain:5, digestion:5, clarity:5 },
    discomfort: { hasPain:'no', pain:0, areas:[], otherArea:'', numb:'no',
                  onset:'<1wk', progress:'same',
                  seen:'no', provider:'', trigger:'unsure', notes:'' },
                  history: {
                    /* --- section Yes/No answers (undefined = not answered yet) --- */
                    heart:      false,
                    metabolic:  false,
                    immune:     false,
                    cancer:     false,
                    surgery:    false,
                    neuro:      false,   
                    respRenal:  false,
                    blood:      false,
                    boneSkin:   false,
                    preg:       false,
                  
                    /* ---------- Heart & Vascular checklist ---------- */
                    heart:  false,
                    bp:     false,
                    clots:  false,
                    pacer:  false,
                  
                    /* ---------- Metabolic & Hormone ---------- */
                    diab1: false, diab2: false, prediab:false,
                    hypo:false, hyper:false, pcos:false,
                    hormone:false,          // low-T / HRT / menopause support
                    steroid:false,
                    metaOther:'',           // free-text
                  
                    /* ---------- Immune & Auto-immune ---------- */
                    ra:false, lupus:false, psoriasis:false, axspa:false,
                    ibd:false, celiac:false, ms:false, sjogren:false,
                    immOther:'',
                  
                    /* ---------- Cancer ---------- */
                    cancer:false,
                    cancerType:'',
                  
                    /* ---------- Surgery / Implants ---------- */
                    surgery:false,  surgeryDetail:'',
                    joint:false,    spinal:false,
                    otherImplant:false, implantDetail:'',
                  
                    /* ---------- Neurological ---------- */
                    seizure:false, neuroPathy:false, tbi:false,
                  
                    /* ---------- Respiratory / Renal / Hepatic ---------- */
                    asthma:false, kidney:false, liver:false,
                  
                    /* ---------- Blood & Healing ---------- */
                    bleed:false, thinner:false,
                  
                    /* ---------- Bone & Skin sensitivity ---------- */
                    osteo:false,   osteoYear:'',
                    photoNerve:false, photoSkin:false,
                  
                    /* ---------- Pregnancy ---------- */
                    preg:false, postpartum:false,
                  
                    /* ---------- Misc ---------- */
                    notes:'',
                  },
                  hc: {
                    msk:  [],         // Musculoskeletal
                    org:  [],         // Organ
                    circ: [],         // Circulatory
                    ene:  [],         // Energy & Emotional
                    art:  [],         // Articular joints
                    nerv: [],         // Nervous
                  },
                  hcNotes:  { msk:'', org:'', circ:'', ene:'', art:'', nerv:'' },
                  hcOpen:   { msk:false, org:false, circ:false, ene:false, art:false, nerv:false },
                  hcSlider: {
                    musculoskeletal            : { main: 10 },
                    organ_digest_hormone_detox : { main: 10 },
                    circulation                : { main: 10 },
                  
                    hc: {
                      msk:  [],
                      org:  [],
                      circ: [],
                      art:  [],
                      nerv: [],
                      /* new */
                      energy: [],
                      sleep:  [],
                      mood:   [],
                    },
                    hcNotes: {
                      msk:'', org:'', circ:'', art:'', nerv:'',
                      /* new */
                      energy:'', sleep:'', mood:'',
                    },
                    
                    /* combined 3-slider pillar */
                    energy_sleep_emotion       : { energy: 10, sleep: 10, mood: 10 }, // ✅
                  
                    articular_joint            : { main: 10 },
                    nervous_system             : { main: 10 },
                  },
    life: {
      /* 1 ─ Move */
      moveDays:   '0-1',
      moveLen:    '<20',
      moveTypes:  [],
      steps:      '',
      moveBarrier:'',
      supplements: [], 
  
      /* 2 ─ Work & rest */
      work:       'desk',
      sleep:      '5-7',
      screen:     'nightly',
      unwind:     [],
      otherUnwind:'',
  
      /* 3 ─ Hydration & boosters */
      water: '',
      caf:   '0',
      soda:  'none',
      alc:   'never',
  
      /* 4 ─ Nourishment */
      meals:        '3',
      produce:      '2-3',
      protein:      'some',
      sugar:        'few',
      cookRatio:    'cook',
      lastMeal:     '',
      dietApproach: [],
      otherApproach:'',
  
      /* 5 ─ Stress & mind-body */
      stressEat:   'same',
      stressReset: [],
      stressScore: 5,
  
      /* 6 ─ Recovery & self-care */
      recovery: [],
  
      /* misc */
      otherMove: '',
    },
  
  });

  /* helpers ------------------------------------------------ */
const setVal = (path, v) =>
  setData(prev => {
    const copy = structuredClone(prev);
    let cur = copy;
    path.slice(0, -1).forEach(k => (cur = cur[k]));
    cur[path.at(-1)] = typeof v === 'function' ? v(cur[path.at(-1)]) : v;
    return copy;
  });

const toggle = (path, v) => setVal(path, prev => {
  const s = new Set(prev);
  s.has(v) ? s.delete(v) : s.add(v);
  return [...s];
});

  /* ---------- step array ---------- */
  const steps = [
    <ReasonsStep     key="0" data={data} set={setData} setVal={setVal} />,
    <SnapshotStep    key="1" data={data} setVal={setVal} />,
    <HistoryStep     key="2" data={data} setVal={setVal} />,
    <HealthCheckStep key="3" data={data} setVal={setVal} toggle={toggle} />,
    <LifestyleStep
        key="4"
        data={data}
        setVal={setVal}
        toggle={toggle}
        onComplete={() => setStep((s) => s + 1)}
      />,
  ];
  const [step,   setStep]   = useState(0);
  const [busy,   setBusy]   = useState(false);
  const [result, setResult] = useState(null); 


  /* ------------------------------------------------------ */
/* SUBMIT HANDLER – keep the closing brace right here ⬇︎  */
/* ------------------------------------------------------ */
const submit = async () => {
  setBusy(true);
  try {
    // 1) save
    const save = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const { id } = await save.json();

    // 2) score
    const score = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hc: data.hc, life: data.life }),
    });
    const payload = await score.json();          // { stress, support, focus }
    setResult(payload);                          // show result screen
  } catch (err) {
    console.error(err);
    alert('Sorry, please try again.');
  } finally {
    setBusy(false);
  }
};   

/* ──────────────── RESULT VIEW ──────────────── */
if (result) {
  return <ResultView data={result} />;
}

/* ──────────────── WIZARD VIEW ──────────────── */
return (
  <main className="max-w-lg w-full mx-auto px-4 py-6">
    <Head>
      <title>MOCEAN Intake</title>
    </Head>

    <Progress step={step} total={steps.length} />
    {steps[step]}

    {/* navigation buttons */}
    <div className="mt-6 flex justify-between gap-6">
      {step > 0 && (
        <button
          type="button"
          className="w-28 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </button>
      )}

      {step < steps.length - 1 ? (
        <button
          type="button"
          className="w-28 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setStep((s) => s + 1)}
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          className="w-28 px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          onClick={submit}
          disabled={busy}
        >
          {busy ? 'Wait…' : 'Submit'}
        </button>
      )}
    </div>
  </main>
);
}