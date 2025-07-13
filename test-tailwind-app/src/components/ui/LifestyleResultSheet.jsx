import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const PILLAR_LABEL = {
  move: 'Physical Activity',
  rest: 'Sleep & Rhythm',
  nourish: 'Nutrition',
  hydrate: 'Hydration',
  restore: 'Recovery & Self-care',
  connect: 'Mind-Body & Relationships',
};

export default function LifestyleResultSheet({ life = {}, score }) {
  if (!life || !score || Object.keys(score).length === 0) return null;

  const filtered = Object.entries(life).filter(
    ([, val]) => val !== '' && val !== undefined && !(Array.isArray(val) && val.length === 0)
  );

  const orderedKeys = Object.keys(PILLAR_LABEL);
  const labels = orderedKeys.map((key) => PILLAR_LABEL[key]);
  const values = orderedKeys.map((key) => score[key] * 10); // scale to 0–100

  const data = {
    labels,
    datasets: [
      {
        label: 'Lifestyle Habits',
        data: values,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">Lifestyle Score Breakdown</h2>

      {/*  ➜ 400 × 400 (desktop) · 300 × 300 (mobile) */}
      <div className="mx-auto w-full h-[400px] max-w-[400px] sm:h-[300px] sm:max-w-[300px]">
      <Radar
          data={data}
          options={{
            maintainAspectRatio: false,
            aspectRatio: 1,
            scales: {
              r: {
                min: 0,
                max: 100,            // ■ clamp to 0-100 so no negatives appear
                ticks: {
                  stepSize: 20,      // 0 · 20 · 40 · 60 · 80 ·100
                  callback: v => (v % 20 === 0 ? v : ''),
                },
                grid: { color: '#e2e8f0' }, // light gray rings
                pointLabels: { font: { size: 12 } },
              },
            },
            plugins: { legend: { display: false } }, // hide legend (1 dataset)
          }}
        />
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-1 text-left">Pillar</th>
            <th className="p-1 text-center">Score (0–10)</th>
          </tr>
        </thead>
        <tbody>
          {orderedKeys.map((p) => (
            <tr key={p} className="even:bg-gray-50">
              <td className="p-1">{PILLAR_LABEL[p]}</td>
              <td className="p-1 text-center">{score[p]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length > 0 && (
        <>
          <h3 className="text-md font-medium mt-4">Your Lifestyle Responses</h3>
          <ul className="text-sm space-y-1">
            {filtered.map(([k, v]) => (
              <li key={k}>
                <span className="font-semibold">{k}</span>: {Array.isArray(v) ? v.join(', ') : v}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}