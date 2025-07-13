import React from 'react';

// Deterministic demo status mapping
const getStatus = (metric, value, sex, age) => {
  const statusMap = {
    hydration: '🟡',
    smm_pct: '🟢',
    body_fat_pct: '🟠',
    ecw_tbw: '🟢',
    vfa: '🟢',
    phase_angle: '🟡',
  };
  return statusMap[metric] || '';
};

// SVG sparkline for trend with dots, values, and dates
const TrendSparkline = ({ values, dates }) => {
  if (!values || values.length === 0) return null;
  // Add y-axis padding: 5% of the range, expand if last value is near max/min
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  let padTop = range * 0.05;
  let padBottom = range * 0.05;
  // If last value is within 2% of max, double top padding
  if (Math.abs(values[values.length - 1] - max) < range * 0.02) padTop *= 2;
  // If first or last value is within 2% of min, double bottom padding
  if (Math.abs(values[0] - min) < range * 0.02 || Math.abs(values[values.length - 1] - min) < range * 0.02) padBottom *= 2;
  const paddedMin = min - padBottom;
  const paddedMax = max + padTop;
  // Normalise with padding: y=20 (top, for label), y=50 (bottom)
  const norm = v => 50 - ((v - paddedMin) / (paddedMax - paddedMin)) * 30;
  const points = values.map((v, i) => `${i * 30},${norm(v)}`).join(' ');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={30 * (values.length - 1) + 8} height={70} style={{ verticalAlign: 'middle' }}>
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          points={points}
        />
        {values.map((v, i) => (
          <g key={i}>
            <text x={i * 30} y={norm(v) - 8} textAnchor="middle" fontSize="10" fill="#222">{v}</text>
            <circle cx={i * 30} cy={norm(v)} r={4} fill="#2563eb" stroke="#fff" strokeWidth={2} />
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 10, color: '#888', marginTop: 2 }}>
        {dates && dates.length > 0 && dates.map((d, i) => (
          <span key={i} style={{ minWidth: 30, textAlign: 'center' }}>{d.slice(5, 10)}</span>
        ))}
      </div>
    </div>
  );
};

const InBodyResultSection = ({ data, history, sex, age }) => {
  // All metrics in unified order
  const allMetrics = [
    { label: 'Hydration %', key: 'hydration', scored: true },
    { label: 'SMM %', key: 'smm_pct', scored: true },
    { label: 'Body Fat %', key: 'body_fat_pct', scored: true },
    { label: 'ECW/TBW Ratio', key: 'ecw_tbw', scored: true },
    { label: 'Visceral Fat Area (cm²)', key: 'vfa', scored: true },
    { label: 'Phase Angle (°)', key: 'phase_angle', scored: true },
    { label: 'Weight (lb)', key: 'weight', scored: false },
    { label: 'Body Fat Mass (lb)', key: 'body_fat_mass', scored: false },
    { label: 'SMM Mass (lb)', key: 'smm_mass', scored: false },
    { label: 'Total Body Water (lb)', key: 'tbw', scored: false },
  ];

  // Helper to get trend values and dates from history
  const getTrendValues = key => history ? history.map(h => h[key]).filter(v => v !== undefined) : [];
  const getTrendDates = () => history ? history.map(h => h.date).filter(d => d !== undefined) : [];

  // Placeholder for total organ score (replace with real calculation)
  const totalOrganScore = '87.5%';

  return (
    <section style={{ margin: '2rem 0', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Organ System Result</h3>
      <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '1.5rem' }}>
        Total Organ Score: {totalOrganScore}
      </div>
      {/* Unified Metrics Table */}
      <table style={{ width: '100%', marginBottom: '2rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th></th>
            <th align="left">Metric</th>
            <th align="left">Value</th>
            <th align="left">Trend</th>
          </tr>
        </thead>
        <tbody>
          {allMetrics.map(m => (
            <tr key={m.key} style={{ borderBottom: '1px solid #f3f3f3' }}>
              <td style={{ width: 24, textAlign: 'center' }}>{m.scored ? <span style={{ fontSize: 18 }}>{getStatus(m.key, data[m.key], sex, age)}</span> : null}</td>
              <td>{m.label}</td>
              <td>{data[m.key]}</td>
              <td><TrendSparkline values={getTrendValues(m.key)} dates={getTrendDates()} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default InBodyResultSection; 