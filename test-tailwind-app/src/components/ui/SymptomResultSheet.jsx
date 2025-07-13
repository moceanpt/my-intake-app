/* ------------------------------------------------------------------
   components/ui/SymptomResultSheet.jsx   ⟨Option B version⟩
   – Draws 1-N radar datasets.
   – Backward-compatible with health & overlay props.
------------------------------------------------------------------- */
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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/* Friendly pillar labels (one place only) */
const PILLAR_LABEL = {
  musculoskeletal:            'Musculoskeletal',
  organ_digest_hormone_detox: 'Organ · Digestion',
  circulation:                'Circulation',
  energy:                     'Energy · Emotion',
  articular_joint:            'Articular Joints',
  nervous_system:             'Nervous System',
};

/* Colour palette for multiple polygons  */
const PAL = [
  { bg: 'rgba(54,162,235,0.15)', bd: 'rgba(54,162,235,1)'  }, // blue
  { bg: 'rgba(255,99,132,0.10)', bd: 'rgba(255,99,132,0.9)'}, // red
  { bg: 'rgba(255,206,86,0.12)', bd: 'rgba(255,206,86,0.9)'}, // yellow
  { bg: 'rgba(75,192,192,0.12)', bd: 'rgba(75,192,192,0.9)'}, // teal
];

/* ---------- helper: convert score → tier text -------------------- */
function tier(v){
  const pct = (10 - v) * 10;
  if (pct >= 50) return '🔴 High strain';
  if (pct >= 25) return '🟠 Moderate';
  if (pct >= 10) return '🟡 Mild';
  return '🟢 Optimal';
}

/* ---------- COMPONENT ------------------------------------------- */
export default function SymptomResultSheet(props){
  /* 1 ▸ normalise input ------------------------------------------ */
  let radarDefs = props.radars ?? null;

  // Back-compat: health + overlay → radars[2]
  if (!radarDefs){
    const { health = {}, overlay = {} } = props;
    if (Object.keys(health).length){
      radarDefs = [
        { data: health , label:'Subjective (client)'},
        { data: overlay, label:'Objective (device)'},
      ];
    }
  }

  /* Nothing to draw */
  if (!radarDefs || radarDefs.length === 0) return null;

  /* 2 ▸ build chart datasets ------------------------------------- */
  const keys   = Object.keys(PILLAR_LABEL).filter(k => k in radarDefs[0].data);
  const labels = keys.map(k => PILLAR_LABEL[k]);

  const datasets = radarDefs
    .filter(r => Object.values(r.data).some(v => v !== undefined))
    .map((r, i) => {
      const { bg, bd } = PAL[i % PAL.length];
      return {
        label : r.label ?? `Set ${i+1}`,
        data  : keys.map(k => r.data[k] ?? null),
        backgroundColor: r.color?.bg ?? bg,
        borderColor    : r.color?.bd ?? bd,
        borderWidth: 1,
        pointRadius: 3,
      };
    });

  if (datasets.length === 0) return null; // all empty

  /* 3 ▸ chart.js config ------------------------------------------ */
  const data = { labels, datasets };
  const options = {
    maintainAspectRatio:false,
    scales:{ r:{
      min:0, max:10, ticks:{ stepSize:2 },
      grid:{ color:'#e2e8f0' },
      pointLabels:{ font:{ size:11 } },
    }},
    plugins:{ legend:{ display:true, position:'bottom' } },
  };

  /* 4 ▸ render ---------------------------------------------------- */
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">MOCEAN&nbsp;Health Snapshot</h2>

      <div className="mx-auto w-full h-[400px] max-w-[400px] sm:h-[300px] sm:max-w-[300px]">
        <Radar data={data} options={options}/>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-1 text-left">Pillar</th>
            {datasets.map(d => (
              <th key={d.label} className="p-1 text-center">{d.label}</th>
            ))}
            <th className="p-1 text-center">Tier</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k, rowIdx) => (
            <tr key={k} className="even:bg-gray-50">
              <td className="p-1">{PILLAR_LABEL[k]}</td>
              {datasets.map((d, colIdx) => (
                <td key={colIdx} className="p-1 text-center">
                  {d.data[rowIdx] ?? '—'}
                </td>
              ))}
              <td className="p-1 text-center">{tier(datasets[0].data[rowIdx])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}