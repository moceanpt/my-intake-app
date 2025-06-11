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

export default function Intake() {
  /* ---------- full form state ---------- */
  const [data, setData] = useState({
    reasons: [],
    snapshot: { overall:5, energy:5, sleep:5, mood:5,
                stress:5, pain:5, digestion:5, clarity:5 },
    discomfort: { hasPain:'no', pain:0, areas:[], otherArea:'',
                  onset:'<1wk', progress:'same',
                  seen:'no', provider:'', trigger:'unsure', notes:'' },
                  history: {
                    heart: false,         // heart disease / stent
                    bp: false,            // high blood pressure
                    clots: false,         // blood clots / stroke
                    pacer: false,         // pacemaker / valve implant
                  
                    diab: false, thyroid: false, steroid: false,
                  
                    auto: false,   autoType: '',
                  
                    cancer: false, cancerType: '',
                  
                    surgery: false, surgeryDetail: '',   // major surgery
                    joint: false,  spinal: false,
                  
                    seizure: false, neuro: false, tbi: false,
                  
                    asthma: false, kidney: false, liver: false,
                  
                    bleed: false,  thinner: false,
                  
                    preg: false, postpartum: false,
                  
                    notes: '', none: false,
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
    <LifestyleStep   key="4" data={data} setVal={setVal} toggle={toggle} />,
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
  return (
    <main className="p-6 max-w-xl mx-auto">
      <ResultSheet result={result} />
    </main>
  );
}

/* ──────────────── WIZARD VIEW ──────────────── */
return (
  <main className="p-6 max-w-xl mx-auto">
    <Head><title>MOCEAN Intake</title></Head>

    <Progress step={step} total={steps.length} />
    {steps[step]}

    <div className="flex justify-between mt-6">
      {step > 0 && (
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => setStep(s => s - 1)}
        >
          Back
        </button>
      )}

      {step < steps.length - 1 ? (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setStep(s => s + 1)}
        >
          Next
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          onClick={submit}
          disabled={busy}
        >
          {busy ? 'Submitting…' : 'Submit'}
        </button>
      )}
    </div>
  </main>
);
}