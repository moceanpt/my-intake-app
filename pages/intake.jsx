import { useState } from 'react';
import Head          from 'next/head';
import Progress      from '../components/ui/Progress';

/* step screens */
import ReasonsStep     from '../components/steps/ReasonsStep';
import SnapshotStep    from '../components/steps/SnapshotStep';
import DiscomfortStep  from '../components/steps/DiscomfortStep';
import HistoryStep     from '../components/steps/HistoryStep';
import HealthCheckStep from '../components/steps/HealthCheckStep';
import LifestyleStep   from '../components/steps/LifestyleStep';

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
    hc:       { digestive:[], sleep:[], circ:[], cog:[], energy:[] },
    hcNotes:  { digestive:'', sleep:'', circ:'', cog:'', energy:'' },
    hcOpen:   { digestive:false, sleep:false, circ:false, cog:false, energy:false },
    life: {
      /* 1 ─ Move */
      moveDays:   '0-1',
      moveLen:    '<20',
      moveTypes:  [],
      steps:      '',
      moveBarrier:'',
  
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

  /* ---------- light-weight helpers ---------- */
  const setVal  = (path, v) => setData(p => {
    const draft = structuredClone(p);
    let cur = draft;
    path.slice(0, -1).forEach(k => (cur = cur[k]));
    cur[path.at(-1)] = typeof v === 'function' ? v(cur[path.at(-1)]) : v;
    return draft;
  });
  const toggle  = (path, v)   => setVal(path, prev => {
    const s = new Set(prev);
    s.has(v) ? s.delete(v) : s.add(v);
    return [...s];
  });

  /* ---------- step array ---------- */
  const steps = [
    <ReasonsStep     key={0} data={data} set={setData} />,
    <SnapshotStep    key={1} data={data} setVal={setVal} />,
    <DiscomfortStep  key={2} data={data} setVal={setVal} />,
    <HistoryStep     key={3} data={data} setVal={setVal} />,
    <HealthCheckStep key={4} data={data} setVal={setVal} toggle={toggle} />,
    <LifestyleStep   key={5} data={data} setVal={setVal} toggle={toggle} />,
  ];
  const [step, setStep] = useState(0);

  /* ---------- render ---------- */
  return (
    <main className="p-6 max-w-xl mx-auto">
      <Head><title>MOCEAN Intake</title></Head>

      <Progress step={step} total={steps.length} />
      {steps[step]}

      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setStep(s => s - 1)}>Back</button>
        )}
        {step < steps.length - 1 ? (
          <button className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => setStep(s => s + 1)}>Next</button>
        ) : (
          <button className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={() => alert(JSON.stringify(data, null, 2))}>
            Submit
          </button>
        )}
      </div>
    </main>
  );
}