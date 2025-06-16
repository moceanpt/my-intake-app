// components/ResultView.jsx
import SymptomResultSheet   from '@/components/ui/SymptomResultSheet';
import LifestyleResultSheet from '@/components/ui/LifestyleResultSheet';

export default function ResultView({ data, onBack }) {
  const { health, lifestyle } = data ?? {};

  return (
    <main className="p-6 max-w-xl mx-auto space-y-10">
      {/* ── Health-check radar ── */}
      {health && Object.keys(health).length > 0 && (
        <SymptomResultSheet health={health} />
      )}

      {/* ── Lifestyle radar ── */}
      {lifestyle && Object.keys(lifestyle).length > 0 && (
        <LifestyleResultSheet score={lifestyle} />
      )}

      {/* ── Back button ── */}
      {typeof onBack === 'function' && (
        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="mt-6 inline-block rounded bg-gray-200 px-4 py-2 text-sm
                       hover:bg-gray-300 transition-colors"
          >
            ← Back to Health Check
          </button>
        </div>
      )}
    </main>
  );
}