// components/steps/DiscomfortStep.jsx
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
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

  /* list of preset body areas (minus "Other") */
  const AREA_OPTS = [
    'Neck', 'Jaw', 'Shoulder',
    'Upper Back', 'Lower Back',
    'Elbow', 'Wrist', 'Hip',
    'Knee / Calf', 'Foot',
  ];

  /* --------------------------------------------------------------- */
  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold text-secondary-900">Your Current Discomfort</h2>
        <p className="text-secondary-600 mt-1 text-sm">Every detail helps us care for you better</p>
      </Card.Header>
      <Card.Body>
        <div className="space-y-6">
          {/* 1 — Feeling pain? */}
          <div>
            <label className="form-label">Are you feeling pain right now?</label>
            <select
              className="form-input w-full"
              value={dc.hasPain}
              onChange={upd('hasPain')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {/* pain-related questions appear only if "Yes" */}
          {dc.hasPain === 'yes' && (
            <>
              {/* 1a — intensity slider */}
              <SliderRow
                label="Pain intensity"
                val={dc.pain}
                onChange={(v) => setVal(['discomfort', 'pain'], v)}
                left="No pain"
                right="Worst"
              />

              {/* 1b — Areas of pain / weakness */}
              <div>
                <p className="form-label mb-2">Areas of Pain / Weakness <span className="text-xs font-normal">(check all that apply)</span></p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {AREA_OPTS.map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      active={dc.areas.includes(label)}
                      onClick={() => toggleArea(label)}
                      size="sm"
                    />
                  ))}
                  <Chip
                    label="Other"
                    active={dc.areas.includes('Other')}
                    onClick={() => toggleArea('Other')}
                    size="sm"
                  />
                </div>
                {dc.areas.includes('Other') && (
                  <input
                    type="text"
                    className="form-input w-full mt-2"
                    placeholder="e.g. Left ankle, whole body…"
                    value={dc.otherArea}
                    onChange={(e) => setVal(['discomfort', 'otherArea'], e.target.value)}
                  />
                )}
              </div>

              {/* 1c — Numbness / tingling */}
              <div>
                <label className="form-label">Do you also feel numbness or tingling?</label>
                <select
                  className="form-input w-full"
                  value={dc.numb ?? 'no'}
                  onChange={(e) => setVal(['discomfort', 'numb'], e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </>
          )}

          {/* 2 — Onset */}
          <div>
            <label className="form-label">When did this begin?</label>
            <select
              className="form-input w-full"
              value={dc.onset}
              onChange={upd('onset')}
            >
              <option value="<1wk">Within the last week</option>
              <option value="1-4w">1–4 weeks</option>
              <option value="1-12m">1–12 months</option>
              <option value=">1y">Over a year ago</option>
            </select>
          </div>

          {/* 3 — Progress */}
          <div>
            <label className="form-label">Since it started, has it…</label>
            <select
              className="form-input w-full"
              value={dc.progress}
              onChange={upd('progress')}
            >
              <option value="improved">Improved</option>
              <option value="same">Stayed about the same</option>
              <option value="worse">Gotten worse</option>
            </select>
          </div>

          {/* 4 — Seen provider */}
          <div>
            <label className="form-label">Have you seen anyone for this already?</label>
            <select
              className="form-input w-full"
              value={dc.seen}
              onChange={upd('seen')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            {dc.seen === 'yes' && (
              <input
                type="text"
                className="form-input w-full mt-2"
                placeholder="Type of provider / treatment tried"
                value={dc.provider}
                onChange={(e) => setVal(['discomfort', 'provider'], e.target.value)}
              />
            )}
          </div>

          {/* 5 — Trigger */}
          <div>
            <label className="form-label">Do you have a sense of what set it off?</label>
            <select
              className="form-input w-full"
              value={dc.trigger}
              onChange={upd('trigger')}
            >
              <option value="injury">Sudden injury</option>
              <option value="overuse">Gradual overuse / posture</option>
              <option value="stress">Stress-related</option>
              <option value="unsure">Not sure</option>
            </select>
          </div>

          {/* 6 — Notes */}
          <div>
            <label className="form-label">Anything that reliably eases or aggravates it? <span className="text-xs">(optional)</span></label>
            <textarea
              rows={2}
              className="form-input w-full"
              value={dc.notes}
              onChange={(e) => setVal(['discomfort', 'notes'], e.target.value)}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );            
}  