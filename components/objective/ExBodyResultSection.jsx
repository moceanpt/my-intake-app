import React from 'react';

const ExBodyResultSection = ({ data, history }) => {
  if (!data) return null;

  // Helper to get trend values from history
  const getTrendValues = key => history ? history.map(h => h[key]).filter(v => v !== undefined) : [];

  // Simple sparkline component
  const TrendSparkline = ({ values }) => {
    if (!values || values.length < 2) return <span className="text-xs text-gray-400">No trend</span>;
    
    const width = 80;
    const height = 20;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />
      </svg>
    );
  };

  // Status indicator based on score
  const getStatus = (score) => {
    if (score >= 85) return '🟢';
    if (score >= 75) return '🟡';
    if (score >= 65) return '🟠';
    return '🔴';
  };

  const metrics = [
    { label: 'Muscle Quality', key: 'muscle_quality' },
    { label: 'Muscle Balance', key: 'muscle_balance' },
    { label: 'Posture Score', key: 'posture_score' },
    { label: 'Movement Quality', key: 'movement_quality' },
    { label: 'Stability Score', key: 'stability_score' },
  ];

  // Calculate overall ExBody score
  const overallScore = metrics.reduce((sum, metric) => sum + (data[metric.key] || 0), 0) / metrics.length;

  return (
    <section className="result-section mt-8">
      <h3 className="result-header">ExBody - Posture & Movement Analysis</h3>
      <div className="result-score mb-4">
        Overall ExBody Score: {overallScore.toFixed(1)}%
        <span className={`status-badge ml-2 ${
          overallScore >= 85 ? 'status-badge-success' : 
          overallScore >= 75 ? 'status-badge-warning' :
          overallScore >= 65 ? 'status-badge-warning' : 'status-badge-error'
        }`}>
          {overallScore >= 85 ? 'Excellent' : 
           overallScore >= 75 ? 'Good' :
           overallScore >= 65 ? 'Fair' : 'Needs Attention'}
        </span>
      </div>
      
      <table className="result-table">
        <thead>
          <tr>
            <th></th>
            <th className="text-left">Metric</th>
            <th className="text-left">Score</th>
            <th className="text-left">Trend</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(metric => (
            <tr key={metric.key}>
              <td className="w-6 text-center">
                <span className="text-lg">{getStatus(data[metric.key])}</span>
              </td>
              <td>{metric.label}</td>
              <td>{data[metric.key]}%</td>
              <td><TrendSparkline values={getTrendValues(metric.key)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ExBodyResultSection;
