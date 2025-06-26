/* ------------------------------------------------------------------
   pages/intake.jsx  (client wizard)
------------------------------------------------------------------- */
import { useState } from 'react';
import Head          from 'next/head';
import Progress      from '@/components/ui/Progress';

import ReasonsStep      from '@/components/steps/ReasonsStep';
import HistoryStep      from '@/components/steps/HistoryStep';
import HealthCheckStep  from '@/components/steps/HealthCheckStep';
import LifestyleStep    from '@/components/steps/LifestyleStep';
import ThankYouStep     from '@/components/steps/ThankYouStep';

/* ──────────────────────────────────────────────────────────
   Lifestyle template (used when the client opts-in)
   ────────────────────────────────────────────────────────── */
const defaultLifestyle = {
  /* 1 – Move */
  moveDays: '0-1',
  moveLen : '<20',
  moveTypes: [],
  steps: '',
  moveBarrier: '',
  supplements: [],

  /* 2 – Work & rest */
  work : 'desk',
  sleep: '5-7',
  screen: 'nightly',
  unwind: [],
  otherUnwind: '',

  /* 3 – Hydration */
  water: '',
  caf  : '0',
  soda : 'none',
  alc  : 'never',

  /* 4 – Nourishment */
  meals : '3',
  produce: '2-3',
  protein: 'some',
  sugar  : 'few',
  cookRatio: 'cook',
  lastMeal: '',
  dietApproach: [],
  otherApproach: '',

  /* 5 – Stress */
  stressEat  : 'same',
  stressReset: [],
  stressScore: 5,

  /* 6 – Recovery */
  recovery: [],

  /* misc */
  otherMove: '',
};

/* =================================================================
   COMPONENT
================================================================= */
export default function Intake() {

  /* ---------- master state ---------- */
  const [data, setData] = useState({
    /* -------------- goals & medical -------------- */
    reasons    : [],
    discomfort : { hasPain:'no', pain:0, areas:[], otherArea:'', numb:'no',
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
                  /* ---------- Health-Check slices ---------- */
                    hc: {
                      musculoskeletal            : [],
                      organ_digest_hormone_detox : [],
                      circulation                : [],
                      energy                     : [],   // ⚡ NEW
                      articular_joint            : [],
                      nervous_system             : [],
                    },

                    hcNotes: {
                      musculoskeletal            : '',
                      organ_digest_hormone_detox : '',
                      circulation                : '',
                      energy                     : '',
                      articular_joint            : '',
                      nervous_system             : '',
                    },

                    hcOpen: {
                      musculoskeletal            : false,
                      organ_digest_hormone_detox : false,
                      circulation                : false,
                      energy                     : false,
                      articular_joint            : false,
                      nervous_system             : false,
                    },

                    hcSlider: {
                      musculoskeletal            : { main: 10 },
                      organ_digest_hormone_detox : { main: 10 },
                      circulation                : { main: 10 },
                      energy                     : { main: 10 },   // ⚡
                      articular_joint            : { main: 10 },
                      nervous_system             : { main: 10 },
                    },   // ← **comma** before life
    

/* -------------- lifestyle -------------- */
life      : {},     // empty until client says “yes”
lifeOptIn : null,   // null = undecided
});


   /* ---------- helpers ---------- */
const setVal = (path, v) =>
  setData(prev => {
    /* always treat path as array */
    const parts = Array.isArray(path) ? path : [path];

    const copy = structuredClone(prev);
    let cur    = copy;
    parts.slice(0, -1).forEach(k => { cur = cur[k]; });

    /* if the leaf does not exist yet, initialise it with
       a sensible default so the updater function won’t explode */
    const leaf   = cur[parts.at(-1)];
    const newVal = typeof v === 'function' ? v(leaf) : v;
    cur[parts.at(-1)] = newVal;

    return copy;
  });

const toggle = (path, value) =>
  setVal(path, prev => {
    /* ensure we always toggle on an array */
    const arr = Array.isArray(prev) ? prev : [];

    const set = new Set(arr);
    set.has(value) ? set.delete(value) : set.add(value);
    return [...set];
  });


 /* ────────────────────────────────────────────────────────
     2. Lifestyle-opt-in micro-step
     ──────────────────────────────────────────────────────── */
     function LifestyleOptInStep({ onYes, onNo }) {
      return (
        <section className="space-y-6">
          <h2 className="text-lg font-semibold">Optional Lifestyle Survey</h2>
          <p>
            These extra questions take about&nbsp;5&nbsp;minutes and help us tailor
            your plan. &nbsp;Would you like to fill them in?
          </p>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white"
              onClick={() => {
                setVal(['lifeOptIn'], true);
                setVal(['life'], defaultLifestyle);
                onYes();            // advance to LifestyleStep
              }}
            >
              Yes, let’s do it
            </button>
  
            <button
              className="px-4 py-2 rounded bg-gray-300"
              onClick={() => {
                setVal(['lifeOptIn'], false);
                setVal(['life'], {});  // keep empty
                onNo();               // skip ahead
              }}
            >
              No thanks
            </button>
          </div>
        </section>
      );
    }
  

 /* ---------- wizard pages ---------- */
 const [step, setStep] = useState(0);
 const [busy, setBusy] = useState(false);

 const steps = [
   /* 0 */ <ReasonsStep key={0} data={data} setVal={setVal} toggle={toggle} />,
   /* 1 */ <HistoryStep      key={1} data={data} setVal={setVal} />,
   /* 2 */ <HealthCheckStep  key={2} data={data} setVal={setVal} toggle={toggle} />,
   /* 3 */ <LifestyleOptInStep key={3}
            onYes={() => setStep(4)}
            onNo ={() => setStep(5)} />,
   /* 4 */ <LifestyleStep    key={4}
            data={data} setVal={setVal} toggle={toggle}
            onComplete={() => setStep(5)} />,
    /* 5 ─ Thank-you screen (dev build gets an Edit button) */
  process.env.NODE_ENV === 'development'
  ? <ThankYouStep key={5} onEdit={() => setStep(2)} />
  : <ThankYouStep key={5} />,
];




/* ---------- submit ---------- */
const submit = async () => {
  setBusy(true);
  try {
    const save = await fetch('/api/intake', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    });
    const { id: submissionId } = await save.json();

    await fetch('/api/preview', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ submissionId }),
    });

    setStep(5);   // Thank-you page
  } catch (err) {
    console.error(err);
    alert('Sorry, please try again.');
  } finally {
    setBusy(false);
  }
};

/* ──────────────── UI ──────────────── */
return (
  <main className="max-w-lg w-full mx-auto px-4 py-6">
    <Head><title>MOCEAN Intake</title></Head>

    <Progress step={step} total={steps.length} />
    {steps[step]}

    {/* nav buttons */}
    <div className="mt-6 flex justify-between gap-6">
      {step > 0 && step < 5 && (
        <button
          type="button"
          className="w-28 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setStep(s => s - 1)}
        >
          Back
        </button>
      )}

      {step < 4 && (            /* normal “Next” */
        <button
          type="button"
          className="w-28 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setStep(s => s + 1)}
        >
          Next
        </button>
      )}

      {step === 4 && (          /* LifestyleStep finished */
        <button
          type="button"
          className="w-28 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setStep(5)}
        >
          Next
        </button>
      )}

      {step === 5 && (          /* final submit */
        <button
          type="button"
          className="w-28 px-3 py-2 rounded bg-green-600 text-white
                     hover:bg-green-700 disabled:opacity-50"
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