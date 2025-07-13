/* ------------------------------------------------------------------
   components/steps/ReasonsStep.jsx - Redesigned with Design System
------------------------------------------------------------------- */
import React from 'react';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
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

  /* auto-add / remove "Something else" based on free-text -------- */
  React.useEffect(() => {
    if (otherText && !reasons.includes('Something else'))
      setVal(['reasons'], (prev=[]) => [...prev, 'Something else']);
    if (!otherText && reasons.includes('Something else'))
      setVal(['reasons'], (prev=[]) => prev.filter(r => r !== 'Something else'));
  }, [otherText]);          // eslint-disable-line react-hooks/exhaustive-deps

  /* ----- UI ----------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Main Reasons Card */}
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-secondary-900)' }}>
            What brings you to MOCEAN?
          </h2>
          <p className="mt-2" style={{ color: 'var(--color-secondary-600)' }}>
            Select all that apply to help us understand your goals
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {/* Reason Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OPTIONS.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  active={reasons.includes(label)}
                  onClick={() => onTick(label)}
                  variant="outline"
                  size="lg"
                  className="justify-start text-left"
                />
              ))}
            </div>

            {/* Free-text when "Something else" is chosen ---------------- */}
            {reasons.includes('Something else') && (
              <div className="form-field">
                <label className="form-label">Tell us more about your goals</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Please describe what brings you to MOCEAN..."
                  value={otherText}
                  onChange={onOtherChange}
                />
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Pain Assessment Card - only show if pain relief is selected */}
      {reasons.includes('Pain relief / injury care') && (
        <Card>
          <Card.Header>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--color-secondary-900)' }}>
              Pain Assessment
            </h3>
            <p className="mt-1" style={{ color: 'var(--color-secondary-600)' }}>
              Help us understand your pain better
            </p>
          </Card.Header>
          <Card.Body>
            <DiscomfortStep data={data} setVal={setVal} />
          </Card.Body>
        </Card>
      )}
    </div>
  );
}