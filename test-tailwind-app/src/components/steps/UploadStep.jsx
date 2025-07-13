// components/steps/UploadStep.jsx
import { useState }          from 'react';
import UploadPDF             from '@/components/ui/UploadPDF';   // ✓ path in ui folder
import { useEffect } from 'react';

useEffect(() => {
  if (!choices.includes('Something else') && other) {
    setOther('');
  }
}, [choices, other]);


export default function UploadStep({ data, setResult, onNext }) {
  const [done, setDone] = useState(false);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-medium">Upload your assessment PDFs</h2>
      <p className="text-sm text-gray-600">
        After the in-clinic scans are completed, choose the PDF files and we’ll
        extract the metrics automatically.
      </p>

      {/* ── file-picker component ─────────────────────────────── */}
      <UploadPDF
        data={data}
        setResult={(plan) => {
          setResult(plan);   // bubble up → ResultView will render
          setDone(true);     // show ✓ message + enable Continue
        }}
      />

      {/* ✓ confirmation */}
      {done && (
        <p className="text-green-600 text-sm">
          ✓ Metrics processed – click <b>Continue</b> to view the plan.
        </p>
      )}

      {/* navigation buttons */}
      <div className="flex gap-4">
        {/* optional Skip / Later */}
        {typeof onNext === 'function' && (
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200"
            onClick={onNext}
          >
            I’ll upload later
          </button>
        )}

        {/* Continue (enabled only when OCR finished) */}
        <button
          type="button"
          disabled={!done}
          onClick={onNext}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-40"
        >
          Continue ›
        </button>
      </div>
    </section>
  );
}