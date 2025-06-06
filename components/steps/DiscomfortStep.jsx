// components/steps/DiscomfortStep.jsx
import SliderRow from '../ui/SliderRow';

export default function DiscomfortStep({ data, setVal }) {
  const dc = data.discomfort;

  /* quick helpers -------------------------------------------------- */
  const upd      = (key) => (e) => setVal(['discomfort', key], e.target.value);
  const toggleArea = (area) => {
    const s = new Set(dc.areas);
    s.has(area) ? s.delete(area) : s.add(area);
    setVal(['discomfort', 'areas'], [...s]);
  };

  /* list of preset body areas (minus “Other”) */
  const AREA_OPTS = [
    'Neck', 'Jaw', 'Shoulder',
    'Upper Back', 'Lower Back',
    'Elbow', 'Wrist', 'Hip',
    'Knee / Calf', 'Foot',
  ];

  /* --------------------------------------------------------------- */
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium">
        Your Current Discomfort
        <span className="block text-sm font-normal text-slate-500">
          Every detail helps us care for you better
        </span>
      </h2>

      {/* 1 — Feeling pain? */}
      <div>
        <label className="block text-sm mb-1">Are you feeling pain right now?</label>
        <select className="border rounded w-full"
                value={dc.hasPain} onChange={upd('hasPain')}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      {/* pain intensity + area grid appear only if “yes” */}
      {dc.hasPain === 'yes' && (
        <>
          <SliderRow
            label="Pain intensity"
            val={dc.pain}
            onChange={(v) => setVal(['discomfort', 'pain'], v)}
            left="No pain"
            right="Worst"
          />

          {/* 1a — Areas of pain / weakness */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Areas of Pain / Weakness <span className="text-xs font-normal">(check all that apply)</span>
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {AREA_OPTS.map((label) => (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dc.areas.includes(label)}
                    onChange={() => toggleArea(label)}
                  />
                  {label}
                </label>
              ))}

              {/* “Other” checkbox spans full width */}
              <label className="flex items-center gap-2 col-span-2 mt-1">
                <input
                  type="checkbox"
                  checked={dc.areas.includes('Other')}
                  onChange={() => toggleArea('Other')}
                />
                Other (specify)
              </label>

              {dc.areas.includes('Other') && (
                <input
                  type="text"
                  className="border rounded w-full col-span-2 p-1 text-sm"
                  placeholder="e.g. Left ankle, whole body…"
                  value={dc.otherArea}
                  onChange={(e) => setVal(['discomfort', 'otherArea'], e.target.value)}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* 2 — Onset */}
      <div className="mt-4">
        <label className="block text-sm mb-1">When did this begin?</label>
        <select className="border rounded w-full"
                value={dc.onset} onChange={upd('onset')}>
          <option value="<1wk">Within the last week</option>
          <option value="1-4w">1–4 weeks</option>
          <option value="1-12m">1–12 months</option>
          <option value=">1y">Over a year ago</option>
        </select>
      </div>

      {/* 3 — Progress */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Since it started, has it…</label>
        <select className="border rounded w-full"
                value={dc.progress} onChange={upd('progress')}>
          <option value="improved">Improved</option>
          <option value="same">Stayed about the same</option>
          <option value="worse">Gotten worse</option>
        </select>
      </div>

      {/* 4 — Seen provider */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Have you seen anyone for this already?</label>
        <select className="border rounded w-full"
                value={dc.seen} onChange={upd('seen')}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

        {dc.seen === 'yes' && (
          <input
            type="text"
            className="border rounded w-full mt-2 p-1 text-sm"
            placeholder="Type of provider / treatment tried"
            value={dc.provider}
            onChange={(e) => setVal(['discomfort', 'provider'], e.target.value)}
          />
        )}
      </div>

      {/* 5 — Trigger */}
      <div className="mt-4">
        <label className="block text-sm mb-1">Do you have a sense of what set it off?</label>
        <select className="border rounded w-full"
                value={dc.trigger} onChange={upd('trigger')}>
          <option value="injury">Sudden injury</option>
          <option value="overuse">Gradual overuse / posture</option>
          <option value="stress">Stress-related</option>
          <option value="unsure">Not sure</option>
        </select>
      </div>

      {/* 6 — Notes */}
      <div className="mt-4">
        <label className="block text-sm mb-1">
          Anything that reliably eases or aggravates it? <span className="text-xs">(optional)</span>
        </label>
        <textarea
          rows={2}
          className="border rounded w-full p-1 text-sm"
          value={dc.notes}
          onChange={(e) => setVal(['discomfort', 'notes'], e.target.value)}
        />
      </div>
    </section>
  );
}