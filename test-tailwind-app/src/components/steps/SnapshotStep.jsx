import SliderRow from '../ui/SliderRow';

/* -------------------------------------------------------------------
   Quick Health Snapshot
   — eight sliders, 0 to 10, with the long anchors you provided
-------------------------------------------------------------------- */
export default function SnapshotStep({ data, setVal }) {
  const s = data.snapshot;

  /* label, state-key, anchor-0, anchor-10  */
  const rows = [
    [
      'Overall Health',
      'overall',
      'Extremely poor — feel unwell daily',
      'Vibrant & healthy',
    ],
    [
      'Daily Energy',
      'energy',
      'Exhausted all day',
      'Boundless energy',
    ],
    [
      'Sleep Quality',
      'sleep',
      'Very unrestful — wake often',
      'Deep, restorative sleep',
    ],
    [
      'Mood',
      'mood',
      'Consistently low / negative',
      'Consistently positive, upbeat',
    ],
    [
      'Stress Resilience',
      'stress',
      'No stress — calm & centered',
      'Overwhelming stress (max)',
    ],
    [
      'Pain or Discomfort',
      'pain',
      'Completely pain-free',
      'Chronic pain & aches',
    ],
    [
      'Digestion Comfort',
      'digestion',
      'Severe daily gut issues',
      'Smooth, comfortable digestion',
    ],
  ];

  return (
    <section>
      <h2 className="text-lg font-medium mb-2">
        Quick Health Snapshot
        <span className="block text-sm font-normal">
          Use each slider (0 → 10) with anchors below
        </span>
      </h2>

      {rows.map(([label, key, left, right]) => (
        <SliderRow
          key={key}
          label={label}
          val={s[key]}
          onChange={v => setVal(['snapshot', key], v)}
          left={left}
          right={right}
        />
      ))}
    </section>
  );
}