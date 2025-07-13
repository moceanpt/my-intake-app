import DeviceForm from '../../../../components/DeviceForm';
import { omnifitPPGMetricSchema } from '../../../../lib/objective/omnifit';

export default function OmniFitPPGPage() {
  console.log('omnifitPPGMetricSchema', omnifitPPGMetricSchema);
  return (
    <DeviceForm
      schema={omnifitPPGMetricSchema}
      deviceType="omnifit"
      title="OmniFit Stress Check Results (PPG)"
      description="Upload and review OmniFit PPG (Heart/HRV) metrics only."
    />
  );
} 