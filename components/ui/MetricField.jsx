export default function MetricField({ label, name, register, error, step = "any" }) {
    return (
      <div>
        <label className="block font-medium">{label}</label>
        <input type="number" step={step} {...register(name, { valueAsNumber: true, required: true })} className="input input-bordered w-full"/>
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    );
  }