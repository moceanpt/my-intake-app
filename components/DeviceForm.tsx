/* components/DeviceForm.tsx */
import { FormProvider, useForm } from 'react-hook-form';
import MetricField               from '@/components/ui/MetricField';
import type { MetricSchema }     from '@/lib/metrics/types';

interface Props {
  schema       : MetricSchema;
  submissionId : string;
  onDone       : () => void;
}

export default function DeviceForm({ schema, submissionId, onDone }: Props) {
  const methods = useForm();
  const { handleSubmit } = methods;

  const save = async (values: Record<string, number>) => {
    await fetch('/api/metrics', {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify({ submissionId, device: schema.slug, values }),
    });
    onDone();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(save)} className="space-y-4">
        {schema.fields.map(f => (
          <MetricField key={f.name} {...f} />
        ))}

        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary">
            Save&nbsp;{schema.title}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}