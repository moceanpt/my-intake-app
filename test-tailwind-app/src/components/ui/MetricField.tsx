/* ---------------------------------------------------------------
   components/ui/MetricField.tsx - Redesigned with Design System
   – safe in both "context" and "prop" modes
---------------------------------------------------------------- */
import { useFormContext } from 'react-hook-form';
import type { UseFormRegister } from 'react-hook-form';

interface Props {
  name     : string;
  label    : string;
  step?    : string | number;
  register?: UseFormRegister<any>;   // ← optional explicit register
}

/**
 * MetricField
 * ----------
 * • If a `register` prop is supplied we use it.
 * • Otherwise we fall back to `useFormContext()`.
 * • When neither is available we render nothing and log a warning,
 *   preventing the dreaded "reading '_f' of undefined" runtime error.
 */
export default function MetricField({
  name,
  label,
  step = 'any',
  register: propRegister,
}: Props) {
  // 1️⃣ prefer the explicit prop, else try FormContext
  const ctx = useFormContext();          // returns undefined if no provider
  const register = propRegister ?? ctx?.register;

  // 2️⃣ guard against missing register()
  if (!register) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `MetricField: no register() function found for "${name}". ` +
        'Either wrap the field with <FormProvider> or pass the register prop.'
      );
    }
    return null;                         // graceful fail
  }

  const errors = ctx?.formState?.errors ?? {};

  return (
    <div className="form-field">
      <label className="form-label">{label}</label>

      <input
        type="number"
        step={step}
        {...register(name, { valueAsNumber: true, required: 'Required' })}
        className="form-input"
        placeholder="Enter value..."
      />

      {errors[name] && (
        <span className="form-error">
          {String(errors[name]?.message)}
        </span>
      )}
    </div>
  );
}