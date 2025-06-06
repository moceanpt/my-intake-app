/* components/Reasons.jsx ----------------------------------------- */
import { Fragment } from 'react';
import Chip from './ui/Chip';        // <- adjust path if needed

const ALL = [
  'Lasting pain relief',
  'Better posture & alignment',
  'Build strength & resilience',
  'Calm digestion & gut health',
  'Stress relief & relaxation',
  'Clear & focused mind',
  'Healthy body composition',
  'Longevity & healthy aging',
  'Sports performance & injury care',
  'Something else',
];

export default function Reasons({ choices, setChoices }) {
  const toggle = (item) => {
    setChoices((prev) => {
      const arr = typeof prev === 'function' ? prev([]) : [...prev];
      const i = arr.indexOf(item);
      if (i > -1) arr.splice(i, 1);
      else if (arr.length < 3) arr.push(item);
      return arr;
    });
  };

  const limitHit = choices.length >= 3;

  return (
    <div className="flex flex-wrap gap-2">
      {ALL.map((item) => (
        <Fragment key={item}>
          <Chip
            label={item}
            active={choices.includes(item)}
            disabled={limitHit && !choices.includes(item)}
            onClick={() => toggle(item)}
          />
        </Fragment>
      ))}
    </div>
  );
}