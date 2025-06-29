/* components/ui/SingleCheckbox.tsx */
import type { FC } from 'react';

const SingleCheckbox: FC<{ value?: boolean; onChange: (v: boolean) => void }> = ({
  value = false,
  onChange,
}) => (
  <input
    type="checkbox"
    className="checkbox checkbox-sm"
    checked={value}
    onChange={(e) => onChange(e.target.checked)}
  />
);

export default SingleCheckbox;