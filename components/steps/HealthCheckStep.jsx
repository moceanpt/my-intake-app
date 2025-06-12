import { Fragment } from 'react';
import Chip from '../ui/Chip';
import questionSchema from '../questions/questionSchema';

export default function HealthCheckStep({ data, setVal, toggle }) {
  const hc = data.hc;
  const notes = data.hcNotes;
  const openMap = data.hcOpen;

  const pick = (cat, chip) => toggle(['hc', cat], chip);
  const setOpen = (cat, v) => setVal(['hcOpen', cat], v);
  const setNote = (cat, txt) => setVal(['hcNotes', cat], txt);

  const Section = ({ heading, cat, questions }) => {
    const isOpen = openMap[cat];
    const any = hc[cat]?.length > 0;

    return (
      <div className="border rounded p-4 space-y-3">
        <h3 className="font-semibold">{heading}</h3>

        {/* YES / NO toggle */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={(e) => {
              const v = e.target.checked;
              setOpen(cat, v);
              if (!v) {
                setVal(['hc', cat], []);
                setNote(cat, '');
              }
            }}
          />
          <span className="font-medium">
            Do you experience symptoms in this area?
          </span>
        </label>

        {isOpen && (
          <>
            <p className="text-xs text-gray-500 -mt-1">
              Select all that apply
            </p>

            {questions.map((q) => (
              <div key={q.id} className="space-y-1 mb-2">
                <p className="text-sm font-semibold">{q.prompt}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((label, i) => {
                    const code = `${q.id}_${i}`;
                    return (
                      <Chip
                        key={code}
                        label={label}
                        code={code}
                        active={hc[cat]?.includes(code)}
                        onClick={() => pick(cat, code)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {any && (
              <textarea
                rows={2}
                className="w-full rounded border p-2 text-sm"
                placeholder="Add note (optional)"
                value={notes[cat]}
                onChange={(e) => setNote(cat, e.target.value)}
              />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium mb-2">5. MOCEAN Health Check</h2>

      {Object.entries(questionSchema.health).map(([cat, questions]) => (
        <Section
          key={cat}
          heading={cat
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())}
          cat={cat}
          questions={questions}
        />
      ))}
    </section>
  );
}