import questionSchema from '../questions/questionSchema';

export default function LifestyleStep({ data, setVal, toggle }) {
  const lf = data.life;

  const pick = (key, val) => toggle(['life', key], val);
  const set = (key, val) => setVal(['life', key], val);

  const sel = (opts, value, onChange) => (
    <select
      className="border rounded w-full max-w-xs text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">— select —</option>
      {opts.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt[0]} value={opt[0]}>
            {opt[1]}
          </option>
        )
      )}
    </select>
  );

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium mb-2">6. MOCEAN Lifestyle Profile</h2>

      {Object.entries(questionSchema.lifestyle).map(([section, items]) => (
        <div key={section} className="border rounded p-4 space-y-4">
          <h3 className="font-semibold text-md">
            {section.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </h3>

          {items.map((q) => (
            <div key={q.id}>
              <p className="text-sm font-medium mb-1">{q.prompt}</p>

              {q.type === 'multi' && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => pick(q.id, opt)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        lf[q.id]?.includes(opt)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : ''
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'single' &&
                sel(q.options, lf[q.id] ?? '', (val) => set(q.id, val))}

              {q.type === 'input' && (
                <input
                  type="number"
                  className="border rounded w-20 text-sm p-1"
                  value={lf[q.id] ?? ''}
                  onChange={(e) => set(q.id, e.target.value)}
                  min="0"
                  max="10"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}