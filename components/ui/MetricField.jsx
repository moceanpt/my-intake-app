/* components/ui/MetricField.tsx */
import { useFormContext } from 'react-hook-form';

interface Props {
  name : string;
  label: string;
  step?: string | number;
}

export default function MetricField({ name, label, step = 'any' }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label className="block font-medium">{label}</label>

      <input
        type="number"
        step={step}
        {...register(name, { valueAsNumber: true, required: 'Required' })}
        className="input input-bordered w-full"
      />

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}