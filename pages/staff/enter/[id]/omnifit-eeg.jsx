import DeviceForm from '../../../../components/DeviceForm';
import { omnifitEEGMetricSchema } from '../../../../lib/objective/omnifit';

export default function OmniFitEEGPage() {
  console.log('omnifitEEGMetricSchema', omnifitEEGMetricSchema);
  return (
    <DeviceForm
      schema={omnifitEEGMetricSchema}
      deviceType="omnifit_eeg"
      title="OmniFit Stress Check Results (EEG)"
      description="Upload and review OmniFit EEG (Brain) metrics only."
    />
  );
} 