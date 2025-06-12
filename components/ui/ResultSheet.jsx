import QuickChart from 'quickchart-js';

const PILLAR_LABEL = {
  muscle: 'Musculoskeletal',
  organ: 'Organ',
  circulation: 'Circulatory',
  emotion: 'Energy & Emotional',
  articular: 'Articular',
  nervous: 'Nervous',
};

const tier = (pct) => {
  if (pct >= 50) return { label: 'High strain', color: 'red', emoji: '🔴' };
  if (pct >= 25) return { label: 'Moderate', color: 'amber', emoji: '🟠' };
  if (pct >= 10) return { label: 'Mild strain', color: 'yellow', emoji: '🟡' };
  return { label: 'Optimal', color: 'green', emoji: '🟢' };
};

export default function ResultSheet({ result }) {
  const { stress: symptoms, support, focus } = result;

  const qc = new QuickChart()
    .setConfig({
      type: 'radar',
      data: {
        labels: Object.keys(PILLAR_LABEL).map(p => PILLAR_LABEL[p]),
        datasets: [
          { label: 'Body-Strain %', data: Object.values(symptoms) },
          { label: 'Support', data: Object.values(support) },
        ],
      },
      options: {
        scales: {
          r: { min: 0, max: 10, ticks: { stepSize: 2 } },
        },
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    })
    .setWidth(300)
    .setHeight(300)
    .setBackgroundColor('transparent');

  const chartUrl = qc.getUrl();

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">MOCEAN Health Snapshot</h2>

      <img src={chartUrl} alt="Stress vs Support radar" className="mx-auto" />

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-1 text-left">Pillar</th>
            <th className="p-1 text-center">Body-Strain %</th>
            <th className="p-1 text-center">Tier</th>
            <th className="p-1 text-center">Support (0–10)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(symptoms).map(([pillar, val]) => (
            <tr key={pillar} className="even:bg-gray-50">
              <td className="p-1">{PILLAR_LABEL[pillar]}</td>
              <td className="p-1 text-center">{Math.round(val * 10)}%</td>
              <td className="p-1 text-center">{tier(val * 10).emoji} {tier(val * 10).label}</td>
              <td className="p-1 text-center">{support?.[pillar]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-sm mt-4">
        <h3 className="font-medium mb-1">Top Focus Areas</h3>
        <ul className="list-disc list-inside">
          {focus.map(f => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-500">
        *A full PDF with personalised recommendations will be sent to your inbox.
      </p>
    </section>
  );
}