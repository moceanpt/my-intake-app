/* ----------------------------------------------------------
   Health-Check v4   (slider + auto-show chips)
---------------------------------------------------------- */
import Chip           from '../ui/Chip';
import questionSchema from '../questions/questionSchema';

/* prettier slider with value badge */
function PillarSlider({ id, value, onChange, question, low, high }) {
  return (
    <div className="mb-4">
      <label className="flex justify-between items-baseline text-sm font-medium mb-1">
        <span>{question}</span>
        <span className="text-blue-600 font-semibold text-xs">{value}</span>
      </label>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={e => onChange(id, +e.target.value)}
        className="w-full accent-blue-600"
      />

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

/* friendly card titles */
const SECTION_LABEL = {
  musculoskeletal:             'Musculoskeletal',
  organ_digest_hormone_detox:  'Digestion · Detox',
  circulation:                 'Circulation',
  energy_sleep_emotion:        'Energy · Sleep · Mood', 
  articular_joint:             'Joints',
  nervous_system:              'Nervous System',
};

/* slider copy (question, anchors) ------------------------ */
const SLIDER_META = {
  musculoskeletal: {
    items: [
      { id:'main', q:'Overall, how do your muscles feel most days?',
        low:'Knotted / weak', high:'Loose & strong' },
    ],
  },
  organ_digest_hormone_detox: {
    items: [
      { id:'main', q:'How comfortable is your digestion overall?',
        low:'Bloating / cramps', high:'Smooth & easy' },
    ],
  },
  circulation: {
    items: [
      { id:'main', q:'Overall sense of blood & fluid flow in your body?',
        low:'Cold limbs / swelling', high:'Warm, steady' },
    ],
  },
  energy_sleep_emotion: {
    items: [
      { id:'energy', q:'Energy level?',  low:'Exhausted',   high:'Boundless' },
      { id:'sleep',  q:'Sleep quality?', low:'Restless',    high:'Deep & rested' },
      { id:'mood',   q:'Usual mood?',    low:'Low / irrit.',high:'Positive' },
    ],
  },
  articular_joint: {
    items: [
      { id:'main', q:'Overall joint comfort & mobility?',
        low:'Stiff / painful', high:'Free & mobile' },
    ],
  },
  nervous_system: {
    items: [
      { id:'main', q:'Mental clarity and focus?',
        low:'Foggy / distracted', high:'Sharp & calm' },
    ],
  },
};

/* -------------------------------------------------
   ENERGY · SLEEP · MOOD  triple-slider section
-------------------------------------------------- */
const ENERGY_META = {
  energy: { low:'Exhausted',      high:'Boundless',      label:'Energy level' },
  sleep : { low:'Restless',       high:'Deep & rested',  label:'Sleep quality' },
  mood  : { low:'Low / irritable',high:'Positive',       label:'Usual mood' },
};

function EnergySection({ data, setVal, toggle }) {
  const { hcSlider, hc, hcNotes } = data;

  const Sub = subKey => {
    const sliderVal = hcSlider.energy_sleep_emotion[subKey];
    const chips     = hc[subKey] ?? [];
    const any       = chips.length > 0;
    const autoOpen  = sliderVal <= 7;

    const setSlider = v =>
      setVal(['hcSlider','energy_sleep_emotion', subKey], v);
    const pick = code => toggle(['hc', subKey], code);

    const q = questionSchema.health.energy_sleep_emotion
    .find(obj => obj.id.startsWith(subKey));   // energy_symptoms, etc.

    return (
      <div className="border rounded p-4 space-y-3 mb-6">
        <h3 className="font-semibold">
          {ENERGY_META[subKey].label}
          <span className="ml-2 text-xs text-gray-500">
            ({sliderVal})
          </span>
        </h3>

        {/* 0-10 slider */}
        <div className="space-y-1">
          <input
            type="range" min={0} max={10}
            value={sliderVal}
            onChange={e => setSlider(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{ENERGY_META[subKey].low}</span>
            <span>{ENERGY_META[subKey].high}</span>
          </div>
        </div>

        {autoOpen && (
          <>
            <p className="text-xs text-gray-500 -mt-1">(check all that apply)</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {q.options.map((lbl,i) => {
                const code = `${q.id}_${i}`;
                return (
                  <Chip
                    key={code}
                    label={lbl}
                    code={code}
                    active={chips.includes(code)}
                    onClick={() => pick(code)}
                  />
                );
              })}
            </div>

            {any && (
              <textarea
                rows={2}
                className="w-full rounded border p-2 text-sm"
                placeholder="Add note (optional)"
                value={hcNotes[subKey] ?? ''}
                onChange={e => setVal(['hcNotes', subKey], e.target.value)}
              />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {['energy','sleep','mood'].map(Sub)}
    </>
  );
}

/* -------------------------------------------------------- */
export default function HealthCheckStep({ data, setVal, toggle }) {
  const { hc, hcNotes, hcOpen, hcSlider } = data;

  /* helpers */
  const pick     = (cat, chip)  => toggle(['hc', cat], chip);
  const setOpen  = (cat,v)      => setVal (['hcOpen',  cat], v);
  const setNote  = (cat,txt)    => setVal (['hcNotes', cat], txt);
  const setSlide = (cat,id,v)   =>
    setVal(['hcSlider', cat, id], v);

/* -------------- single pillar card -------------- */
const GenericSection = ({ cat, questions }) => {
  /* if the pillar isn’t described in SLIDER_META, render nothing */
  const meta = SLIDER_META[cat];
  if (!meta) return null;

  /* slider values: use state if present, else default every slider to 10 */
  const slideVals =
    hcSlider[cat] ??
    Object.fromEntries(meta.items.map(it => [it.id, 10]));

  const anyChip = hc[cat]?.length > 0;

    /* TRUE  ⇢ any slider ≤ 7  OR  the user manually opened */
    const autoOpen      = Object.values(slideVals).some(v => v <= 7);
    const manuallyOpen  = hcOpen[cat] ?? false;
    const isOpen        = autoOpen || manuallyOpen;

    return (
      <div className="border rounded p-4 space-y-3">
        <h3 className="font-semibold">{SECTION_LABEL[cat]}</h3>

        {/* sliders */}
        {meta.items.map(it => (
          <PillarSlider
            key={it.id}
            id={it.id}
            question={it.q}
            low={it.low}
            high={it.high}
            value={slideVals[it.id]}
            onChange={(id,v) => setSlide(cat,id,v)}
          />
        ))}

        {/* manual show / hide switch (visible only if autoOpen false) */}
        {!autoOpen && (
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={manuallyOpen}
              onChange={() => setOpen(cat, !manuallyOpen)}
            />
            <span>{isOpen ? 'Hide details' : 'Show details'}</span>
          </label>
        )}

        {/* chips + note */}
        {isOpen && (
          <>
            <p className="text-xs text-gray-500 -mt-1">(check all that apply)</p>

            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-1 mb-2">
                {idx !== 0 && (
                  <p className="text-sm font-semibold">{q.prompt}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {q.options.map((label,i) => {
                    const code = `${q.id}_${i}`;
                    return (
                      <Chip
                        key={code}
                        label={label}
                        active={hc[cat]?.includes(code)}
                        onClick={() => pick(cat, code)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {anyChip && (
              <textarea
                rows={2}
                className="w-full rounded border p-2 text-sm"
                placeholder="Add note (optional)"
                value={hcNotes[cat] ?? ''}
                onChange={e => setNote(cat, e.target.value)}
              />
            )}
          </>
        )}
      </div>
    );
  };

  /* ---------- render ---------- */
return (
  <section className="space-y-6">
    <h2 className="text-lg font-medium mb-2">
      5. MOCEAN Health Check
    </h2>

    {/* one card per pillar */}
    {Object.entries(questionSchema.health).map(([cat, qs]) => (
      cat === 'energy_sleep_emotion'
        ? (
            <EnergySection           /* triple-slider card */
              key={cat}
              data={data}
              setVal={setVal}
              toggle={toggle}
            />
          )
        : (
            <GenericSection          /* all other pillars */
              key={cat}
              cat={cat}
              questions={qs}
            />
          )
    ))}

  </section>
);
}