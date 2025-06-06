export default function SliderRow({
    label, val, onChange, left, right,
  }) {
    return (
      <div className="my-6">
        <label className="block text-sm font-medium mb-2 text-center">
          {label}: <span className="font-semibold">{val}</span>
        </label>
  
        <div className="max-w-md mx-auto">
          <input
            type="range"
            min={0}
            max={10}
            value={val}
            onChange={e => onChange(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{left}</span>
            <span>{right}</span>
          </div>
        </div>
      </div>
    );
  }