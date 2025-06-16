// components/ui/ChipSingle.jsx
//----------------------------------------------------
import Chip from './Chip';

/**
 * Single-select pill row (radio-button behavior).
 *
 * @param {string}   value    – currently-selected option
 * @param {string[]} options  – array of display strings
 * @param {Function} onChange – fn(opt) when user picks a pill
 */
export default function ChipSingle({ value, options = [], onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Chip
          key={opt}
          label={opt}
          active={value === opt}
          onClick={() => onChange(opt)}
        />
      ))}
    </div>
  );
}