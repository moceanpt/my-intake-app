// components/Reasons.jsx
import Chip from './ui/Chip';

const ALL = [
  'Pain relief / injury care',
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
    setChoices((prev = []) => {
      const arr = [...prev];
      const idx = arr.indexOf(item);
      if (idx > -1) arr.splice(idx, 1);
      else arr.push(item); 
      return arr;
    });
  };

  const limitHit = false;  

  return (
    <div className="flex flex-col gap-2">
    {ALL.map((item) => (
      <Chip
        key={item}
        label={item}
        active={choices.includes(item)}
        disabled={false}
        onClick={() => toggle(item)}
        className=""  // Additional per-chip styling here if needed
      />
    ))}
    </div>
  );
}