/* --------------------------------------------------------------
   components/steps/ThankYouStep.jsx
-------------------------------------------------------------- */
import Card from '@/components/ui/Card';

export default function ThankYouStep({ onEdit }) {
  return (
    <Card>
      <Card.Body>
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-primary-700">🎉 All set – thank you!</h2>
          <p className="text-secondary-700">Your answers have been saved.</p>
          <p className="text-secondary-600">
            Your MOCEAN therapist will review them with you<br />
            during your visit.
          </p>
          {typeof onEdit === 'function' && (
            <button
              type="button"
              onClick={onEdit}
              className="btn btn-secondary mt-4"
            >
              ← Back to Health Check
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
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

