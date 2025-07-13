/* --------------------------------------------------------------
   components/steps/ThankYouStep.jsx
-------------------------------------------------------------- */
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ThankYouStep({ onEdit }) {
  return (
    <Card>
      <Card.Body>
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-primary-700)' }}>🎉 All set – thank you!</h2>
          <p style={{ color: 'var(--color-secondary-700)' }}>Your answers have been saved.</p>
          <p style={{ color: 'var(--color-secondary-600)' }}>
            Your MOCEAN therapist will review them with you<br />
            during your visit.
          </p>
          {typeof onEdit === 'function' && (
            <Button
              variant="secondary"
              onClick={onEdit}
              className="mt-4"
            >
              ← Back to Health Check
            </Button>
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

