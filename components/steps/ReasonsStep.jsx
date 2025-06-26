/* ------------------------------------------------------------------
   components/steps/ReasonsStep.jsx   (updated for new helpers)
------------------------------------------------------------------- */
import React from 'react';
import DiscomfortStep from '@/components/steps/DiscomfortStep';

const OPTIONS = [
  'Pain relief / injury care',
  'Better posture & alignment',
  'Build strength & resilience',
  'Calm digestion & gut health',
  'Stress relief & relaxation',
  'Clear & focused mind',
  'Healthy body composition',
  'Longevity & healthy aging',
  'Sports performance & injury care',
  'Something else',
];

export default function ReasonsStep({ data, setVal, toggle }) {
  const reasons      = data.reasons ?? [];
  const otherText    = data.reasonsOther ?? '';

  /* ----- event handlers ---------------------------------------- */
  const onTick = (label) => toggle(['reasons'], label);

  const onOtherChange = (e) =>
    setVal(['reasonsOther'], e.target.value);

  /* auto-add / remove “Something else” based on free-text -------- */
  React.useEffect(() => {
    if (otherText && !reasons.includes('Something else'))
      setVal(['reasons'], (prev=[]) => [...prev, 'Something else']);
    if (!otherText && reasons.includes('Something else'))
      setVal(['reasons'], (prev=[]) => prev.filter(r => r !== 'Something else'));
  }, [otherText]);          // eslint-disable-line react-hooks/exhaustive-deps

  /* ----- UI ----------------------------------------------------- */
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">
        What brings you to&nbsp;MOCEAN? <span className="font-normal text-sm">(select all that apply)</span>
      </h2>

      <ul className="grid gap-2">
        {OPTIONS.map((label) => (
          <li key={label} className="flex items-center gap-2">
            <input
              id={label}
              type="checkbox"
              checked={reasons.includes(label)}
              onChange={() => onTick(label)}
              className="h-4 w-4 accent-blue-600"
            />
            <label htmlFor={label} className="select-none">
              {label}
            </label>
          </li>
        ))}
      </ul>

      {/* free-text when “Something else” is chosen ---------------- */}
      {reasons.includes('Something else') && (
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Tell us more…"
          value={otherText}
          onChange={onOtherChange}
        />
      )}
{/* 2 ▸ follow-up pain questionnaire -------------------------- */}
     {reasons.includes('Pain relief / injury care') && (
       <div className="mt-8">
         <DiscomfortStep data={data} setVal={setVal} />
       </div>
     )}
    </section>
  );
}