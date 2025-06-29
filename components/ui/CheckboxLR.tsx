/* components/ui/CheckboxLR.tsx ----------------------------------------- */
import type { FC } from 'react';

const box = 'checkbox checkbox-sm';

const CheckboxLR: FC<{
  value: { L: boolean; R: boolean } | undefined;
  onChange: (v: { L: boolean; R: boolean }) => void;
}> = ({ value = { L: false, R: false }, onChange }) => (
  <div className="flex items-center gap-4">
    <input
      type="checkbox"
      className={box}
      checked={value.L}
      onChange={(e) => onChange({ ...value, L: e.target.checked })}
    />
    <input
      type="checkbox"
      className={box}
      checked={value.R}
      onChange={(e) => onChange({ ...value, R: e.target.checked })}
    />
  </div>
);

export default CheckboxLR;