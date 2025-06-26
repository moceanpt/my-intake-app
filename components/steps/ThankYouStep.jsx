/* --------------------------------------------------------------
   components/steps/ThankYouStep.jsx
-------------------------------------------------------------- */
export default function ThankYouStep({ onEdit }) {
    return (
      <section className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold">🎉 All set – thank you!</h2>
  
        <p>Your answers have been saved.</p>
        <p>
          Your MOCEAN therapist will review them with you
          during your visit.
        </p>
  
        {/* DEV-ONLY “Edit” button (shows only when onEdit is passed) */}
        {typeof onEdit === 'function' && (
          <button
            type="button"
            onClick={onEdit}
            className="mt-4 inline-block rounded bg-gray-200 px-4 py-2
                       text-sm hover:bg-gray-300 transition-colors"
          >
            ← Back to Health Check
          </button>
        )}
      </section>
    );
  }
  
// export default function ThankYouStep() {
//    return (
//      <section className="text-center space-y-4 p-6">
//        <h2 className="text-xl font-semibold text-green-700">
//          🎉  All set – thank you!
//        </h2>
//        <p className="text-sm text-gray-600">
//          Your answers have been saved. <br />
//         Your MOCEAN therapist will review them with you during your visit.
//        </p>
//      </section>
//    );
//  }

