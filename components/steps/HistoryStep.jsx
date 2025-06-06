import { Fragment } from 'react';

export default function HistoryStep({ data, setVal }) {
  const h = data.history;

  /* ――― small helpers ――― */
  const flip = (key) => setVal(['history', key], !h[key]);
  const write = (key) => (e) => setVal(['history', key], e.target.value);

  /* “None of the above” toggles everything else off */
  const toggleNone = () => {
    const cleared = Object.fromEntries(
      Object.keys(h).map((k) => [k, typeof h[k] === 'boolean' ? false : ''])
    );
    cleared.none = !h.none;
    setVal(['history'], cleared);
  };

  /* reusable checkbox row */
  const Box = ({ k, label }) => (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={h[k]} onChange={() => flip(k)} />
      {label}
    </label>
  );

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium mb-2">
        Health Background <span className="text-xs font-normal">(diagnoses / safety flags only)</span>
      </h2>

      {/* 1 — Heart & Vascular */}
      <div>
        <h3 className="font-semibold mb-1">Heart &amp; Vascular</h3>
        <div className="space-y-1">
          <Box k="heart"  label="Heart disease or stent" />
          <Box k="bp"     label="High blood pressure" />
          <Box k="clots"  label="History of blood clots / stroke" />
          <Box k="pacer"  label="Pacemaker / defibrillator / heart-valve implant" />
        </div>
      </div>

      {/* 2 — Metabolic & Hormone */}
      <div>
        <h3 className="font-semibold mb-1">Metabolic &amp; Hormone</h3>
        <div className="space-y-1">
          <Box k="diab"    label="Diabetes (type 1 / 2 / pre-diabetes)" />
          <Box k="thyroid" label="Thyroid disorder" />
          <Box k="steroid" label="Long-term steroid use" />
        </div>
      </div>

      {/* 3 — Immune */}
      <div>
        <h3 className="font-semibold mb-1">Immune &amp; Auto-immune</h3>
        <Box k="auto" label="Auto-immune diagnosis (RA, lupus, psoriasis…)" />
        {h.auto && (
          <input
            type="text"
            className="border rounded w-full mt-1 p-1 text-sm"
            placeholder="Type of condition"
            value={h.autoType}
            onChange={write('autoType')}
          />
        )}
      </div>

      {/* 4 — Cancer */}
      <div>
        <h3 className="font-semibold mb-1">Cancer</h3>
        <Box k="cancer" label="Past or current cancer diagnosis" />
        {h.cancer && (
          <input
            type="text"
            className="border rounded w-full mt-1 p-1 text-sm"
            placeholder="Type & year"
            value={h.cancerType}
            onChange={write('cancerType')}
          />
        )}
      </div>

      {/* 5 — Surgeries & Implants */}
      <div>
        <h3 className="font-semibold mb-1">Surgeries &amp; Implants</h3>
        <div className="space-y-1">
          <Box k="surgery" label="Major surgery" />
          {h.surgery && (
            <input
              type="text"
              className="border rounded w-full mt-1 p-1 text-sm"
              placeholder="Year & body area"
              value={h.surgeryDetail}
              onChange={write('surgeryDetail')}
            />
          )}
          <Box k="joint"  label="Joint replacement / metal hardware" />
          <Box k="spinal" label="Spinal fusion or disc implant" />
        </div>
      </div>

      {/* 6 — Neurological */}
      <div>
        <h3 className="font-semibold mb-1">Neurological</h3>
        <div className="space-y-1">
          <Box k="seizure" label="Seizure disorder" />
          <Box k="neuro"   label="Neuropathy / nerve damage" />
          <Box k="tbi"     label="Concussion / TBI history" />
        </div>
      </div>

      {/* 7 — Respiratory & Renal / Hepatic */}
      <div>
        <h3 className="font-semibold mb-1">Respiratory &amp; Renal / Hepatic</h3>
        <div className="space-y-1">
          <Box k="asthma" label="Asthma / COPD" />
          <Box k="kidney" label="Chronic kidney disease" />
          <Box k="liver"  label="Liver disease / hepatitis" />
        </div>
      </div>

      {/* 8 — Blood & Healing */}
      <div>
        <h3 className="font-semibold mb-1">Blood &amp; Healing</h3>
        <div className="space-y-1">
          <Box k="bleed"   label="Bleeding / clotting disorder" />
          <Box k="thinner" label="On blood thinners" />
        </div>
      </div>

      {/* 9 — Pregnancy */}
      <div>
        <h3 className="font-semibold mb-1">Pregnancy (if applicable)</h3>
        <div className="space-y-1">
          <Box k="preg"       label="Currently pregnant" />
          <Box k="postpartum" label="Post-partum (&lt; 6 months)" />
        </div>
      </div>

      {/* None of the above */}
      <label className="flex items-center gap-2 text-sm pt-3 border-t">
        <input type="checkbox" checked={h.none} onChange={toggleNone} />
        <span className={h.none ? 'font-semibold' : ''}>None of the above</span>
      </label>

      {/* Optional notes */}
      <div className="mt-4">
        <label className="block text-sm mb-1">
          Anything else your MOCEAN team should know for your safety? <span className="text-xs">(optional)</span>
        </label>
        <textarea
          rows={2}
          className="border rounded w-full p-1 text-sm"
          value={h.notes}
          onChange={write('notes')}
        />
      </div>
    </section>
  );
}