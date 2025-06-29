/* components/ui/TwoSideSelector.tsx */
import type { FC } from 'react';
import clsx from 'clsx';

export type TwoSide = 'NONE' | 'L' | 'R';

const TwoSideSelector: FC<{
  value: TwoSide | undefined;
  onChange: (v: TwoSide) => void;
  activeColor?: string;           // e.g. 'blue-600'
}> = ({ value = 'NONE', onChange, activeColor = 'blue-600' }) => (
  <div className="inline-flex rounded border overflow-hidden select-none">
    {(['L', 'R'] as TwoSide[]).map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onChange(value === opt ? 'NONE' : opt); // toggle off on 2nd click
        }}
        className={clsx(
          'w-10 text-xs border-r last:border-r-0 focus:outline-none transition-colors',
          value === opt
            ? `bg-${activeColor} text-white`
            : 'bg-white text-gray-700 hover:bg-gray-100'
        )}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default TwoSideSelector;