/* ----------------------------------------------------------
   MOCEAN Health-Check v5  (one slider + chips per pillar)
---------------------------------------------------------- */
import Chip from '../ui/Chip';
import questionSchema from '../questions/questionSchema';

/* ───────── slider component ───────── */
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
        <span>{low}</span><span>{high}</span>
      </div>

      {/* tiny ticks 0-10 */}
      <div className="mt-0.5 flex justify-between text-[10px] leading-none text-gray-400 px-0.5 select-none">
        {Array.from({ length: 11 }, (_, i) => <span key={i}>{i}</span>)}
      </div>
    </div>
  );
}

/* ───────── pretty titles ───────── */
const SECTION_LABEL = {
  musculoskeletal:            'Musculoskeletal',
  organ_digest_hormone_detox: 'Organ · Digestion',
  circulation:                'Circulation',
  energy:                     'Energy',          // now a normal pillar
  articular_joint:            'Articular Joints',
  nervous_system:             'Nervous System',
};

/* ───────── slider copy ───────── */
const SLIDER_META = {
  musculoskeletal: {
    items: [{ id:'main', q:'Overall, how do your muscles feel most days?',
              low:'Knotted / weak', high:'Loose & strong' }],
  },
  organ_digest_hormone_detox: {
    items: [{ id:'main', q:'How comfortable is your digestion overall?',
              low:'Bloating / cramps', high:'Smooth & easy' }],
  },
  circulation: {
    items: [{ id:'main', q:'Overall blood / fluid flow?',
              low:'Cold limbs / swelling', high:'Warm & steady' }],
  },
  energy: {
    items: [{ id:'main', q:'Energy level?',
              low:'Exhausted', high:'Boundless' }],
  },
  articular_joint: {
    items: [{ id:'main', q:'Joint comfort & mobility?',
              low:'Stiff / painful', high:'Free & mobile' }],
  },
  nervous_system: {
    items: [{ id:'main', q:'Mental clarity & focus?',
              low:'Foggy / distracted', high:'Sharp & calm' }],
  },
};

/* -------------------------------------------------------- */
export default function HealthCheckStep({ data, setVal, toggle }) {
  const { hc, hcNotes, hcSlider } = data;

  /* helpers */
  const pick     = (cat, chip) => toggle(['hc', cat], chip);
  const setNote  = (cat, v)    => setVal(['hcNotes',  cat], v);
  const setSlide = (cat,id,v)  => setVal(['hcSlider', cat, id], v);

  /* generic pillar card */
  const GenericSection = ({ cat, questions }) => {
    const meta = SLIDER_META[cat];
    if (!meta) return null;

    const slideVals =
      hcSlider[cat] ?? Object.fromEntries(meta.items.map(it => [it.id, 5]));

    const isOpen = Object.values(slideVals).some(v => v <= 7);
    const anyChip = hc[cat]?.length > 0;

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

        {/* chips + optional note */}
        {isOpen && (
          <>
            <p className="text-xs text-gray-500 -mt-1">
              Please select all symptoms you’re experiencing
            </p>

            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-1 mb-2">
                {idx !== 0 && <p className="text-sm font-semibold">{q.prompt}</p>}
                <div className="flex flex-wrap gap-2">
                  {q.options.map((label, i) => {
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

  /* ───────── render ───────── */
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium mb-2">MOCEAN Health Check</h2>

      {Object.entries(questionSchema.health).map(([cat, qs]) => (
        <GenericSection key={cat} cat={cat} questions={qs} />
      ))}
    </section>
  );
}