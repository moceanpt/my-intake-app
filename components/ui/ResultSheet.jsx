/* components/ui/ResultSheet.jsx
   --------------------------------
   Props
   ────
   result = {
     stress:  { msk:4, org:3, circ:… },
     support: { msk:10, ... },
     focus:   [ 'Gut Optimisation', 'Energy Optimisation' ]
   }
*/
import QuickChart from 'quickchart-js'

const PILLAR_LABEL = {
  msk: 'Musculoskeletal',
  org: 'Organ',
  circ: 'Circulatory',
  ene: 'Energy & Emotional',
  art: 'Articular',
  nerv: 'Nervous',
}

// helper → coloured pill
const Tag = ({ text }) => (
  <span className="inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
    {text}
  </span>
)

// helper → score color
const toPct = (v) => `${Math.round(v * 10)}%`;


const getColorClass = (val) => {
  if (val >= 7) return 'text-red-600'
  if (val >= 4) return 'text-orange-500'
  return 'text-green-600'
}

const tier = (pct) => {
    if (pct >= 50) return { label: 'High strain', color: 'red', emoji: '🔴' };
    if (pct >= 25) return { label: 'Moderate', color: 'amber', emoji: '🟠' };
    if (pct >= 10) return { label: 'Mild strain', color: 'yellow', emoji: '🟡' };
    return { label: 'Optimal', color: 'green', emoji: '🟢' };
  };

export default function ResultSheet ({ result }) {
  const { stress, support, focus } = result

  const stressPct = Object.fromEntries(
    Object.entries(stress).map(([p, val]) => [p, Math.round(val * 10)])
  );
  /* ---------- build radar chart ---------- */
  const qc = new QuickChart()
    .setConfig({
      type: 'radar',
      data: {
        labels: Object.keys(PILLAR_LABEL),
        datasets: [
          { label: 'Body-Strain',  data: Object.values(stress)  },
          { label: 'Support', data: Object.values(support) }
        ]
      },
      options: { scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } } } }
    })
    .setWidth(300)
    .setHeight(300)
    .setBackgroundColor('transparent')

  const chartUrl = qc.getUrl()

  return (
    <section className="space-y-6 text-left">
      <h2 className="text-lg font-semibold">MOCEAN Health Snapshot</h2>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* radar chart */}
        <img src={chartUrl} alt="Stress vs Support radar" className="w-80 mx-auto" />

        {/* % strain list (pretty) */}
        <div className="text-sm space-y-1">
          <h3 className="font-medium mb-2">Body-Strain&nbsp;%</h3>
          {Object.keys(PILLAR_LABEL).map((p) => (
            <p key={p}>
              <span className="inline-block w-40">{PILLAR_LABEL[p]}</span>
              <span className={getColorClass(stress[p])}>
                {toPct(stress[p])}
              </span>
            </p>
          ))}
        </div>
      </div>

      {/* table */}
      <table className="w-full text-sm border">
        <thead>
            <tr className="bg-gray-100">
            <th className="p-1 text-left">Pillar</th>
            <th className="p-1 text-center">Body-Strain %</th>
            <th className="p-1 text-center">Tier</th>
            <th className="p-1 text-center">Support (0–10)</th>
            </tr>
        </thead>
        <tbody>
            {Object.entries(stressPct).map(([p, pct]) => {
            const { label, color, emoji } = tier(pct);
            return (
                <tr key={p} className="even:bg-gray-50">
                <td className="p-1">{PILLAR_LABEL[p]}</td>
                <td className="p-1 text-center">{pct}%</td>
                <td className={`p-1 text-${color}-600 font-semibold text-center`}>
                    {emoji} {label}
                </td>
                <td className="p-1 text-center">{support[p]}</td>
                </tr>
            );
            })}
        </tbody>
        </table>

        <div className="mt-6 text-sm">
  <h3 className="font-medium mb-2">Tier Guide</h3>
  <table className="w-full text-left border text-sm">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-1">Body-Strain %</th>
        <th className="p-1">Tier Name</th>
        <th className="p-1">Traffic-Light</th>
        <th className="p-1">Meaning</th>
      </tr>
    </thead>
    <tbody>
      <tr className="even:bg-gray-50">
        <td className="p-1">0 – 9%</td>
        <td className="p-1">Optimal</td>
        <td className="p-1 text-green-600">🟢 Green</td>
        <td className="p-1">No relevant issues</td>
      </tr>
      <tr className="even:bg-gray-50">
        <td className="p-1">10 – 24%</td>
        <td className="p-1">Mild strain</td>
        <td className="p-1 text-yellow-500">🟡 Yellow</td>
        <td className="p-1">Occasional / light strain</td>
      </tr>
      <tr className="even:bg-gray-50">
        <td className="p-1">25 – 49%</td>
        <td className="p-1">Moderate</td>
        <td className="p-1 text-amber-500">🟠 Amber</td>
        <td className="p-1">Needs attention</td>
      </tr>
      <tr className="even:bg-gray-50">
        <td className="p-1">≥ 50%</td>
        <td className="p-1">High strain</td>
        <td className="p-1 text-red-600">🔴 Red</td>
        <td className="p-1">Priority focus</td>
      </tr>
    </tbody>
  </table>
</div>

      {/* focus tracks */}
      <div>
        <h3 className="font-medium mb-1">Top Focus Areas</h3>
        <div className="flex flex-wrap gap-2">
          {focus.map((f) => <Tag key={f} text={f} />)}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        *A full PDF with personalised recommendations will be sent to your inbox.
      </p>
    </section>
  )
}