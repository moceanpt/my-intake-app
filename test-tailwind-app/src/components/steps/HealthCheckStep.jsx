/* ----------------------------------------------------------
   MOCEAN Health-Check v5 - Redesigned with Design System
   (one slider + chips per pillar)
---------------------------------------------------------- */
import React from 'react';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import SliderRow from '@/components/ui/SliderRow';
import questionSchema from '../questions/questionSchema';

/* ───────── pretty titles ───────── */
const SECTION_LABEL = {
  musculoskeletal:            'Musculoskeletal',
  organ_digest_hormone_detox: 'Organ · Digestion',
  circulation:                'Circulation',
  energy:                     'Energy',
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
      <Card className="mb-6">
        <Card.Header>
          <h3 className="text-xl font-semibold text-secondary-900">
            {SECTION_LABEL[cat]}
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            {/* Sliders */}
            {meta.items.map(it => (
              <SliderRow
                key={it.id}
                id={it.id}
                question={it.q}
                low={it.low}
                high={it.high}
                value={slideVals[it.id]}
                onChange={(id,v) => setSlide(cat,id,v)}
              />
            ))}

            {/* Chips + optional note - only show if slider indicates issues */}
            {isOpen && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-secondary-700 mb-3">
                    Please select all symptoms you're experiencing
                  </p>

                  {questions.map((q, idx) => (
                    <div key={q.id} className="space-y-3 mb-4">
                      {idx !== 0 && (
                        <p className="text-sm font-semibold text-secondary-900">
                          {q.prompt}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((label, i) => {
                          const code = `${q.id}_${i}`;
                          return (
                            <Chip
                              key={code}
                              label={label}
                              active={hc[cat]?.includes(code)}
                              onClick={() => pick(cat, code)}
                              variant="outline"
                              size="sm"
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes field */}
                {anyChip && (
                  <div className="form-field">
                    <label className="form-label">Additional notes (optional)</label>
                    <textarea
                      rows={2}
                      className="form-input"
                      placeholder="Add any additional details about your symptoms..."
                      value={hcNotes[cat] ?? ''}
                      onChange={e => setNote(cat, e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  };

  /* ───────── render ───────── */
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-semibold text-secondary-900">
            MOCEAN Health Check
          </h2>
          <p className="text-secondary-600 mt-2">
            Rate each area of your health and select any symptoms you're experiencing
          </p>
        </Card.Header>
      </Card>

      {/* Health Pillars */}
      {Object.entries(questionSchema.health).map(([cat, qs]) => (
        <GenericSection key={cat} cat={cat} questions={qs} />
      ))}
    </div>
  );
}