import React from 'react';
import { scoreROM } from '../../lib/objective/rom';

const ROMResultSection = ({ data, history }) => {
  if (!data) return null;

  // Score the ROM data using the new scoring function
  const romResults = scoreROM(data);

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
          stroke="#10b981"
          strokeWidth="2"
        />
      </svg>
    );
  };

  // Get status emoji based on measurement status
  const getStatusEmoji = (status) => {
    switch (status) {
      case 'optimal': return '🟢';
      case 'mild': return '🟡';
      case 'moderate': return '🟠';
      case 'severe': return '🔴';
      default: return '⚪';
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'optimal': return 'status-badge-success';
      case 'mild': return 'status-badge-warning';
      case 'moderate': return 'status-badge-warning';
      case 'severe': return 'status-badge-error';
      default: return '';
    }
  };

  // Get overall status label
  const getOverallLabel = (status) => {
    switch (status) {
      case 'optimal': return 'Excellent';
      case 'mild': return 'Good';
      case 'moderate': return 'Fair';
      case 'severe': return 'Limited';
      default: return 'Unknown';
    }
  };

  return (
    <section className="result-section mt-8">
      <h3 className="result-header">Range of Motion Assessment</h3>
      <div className="result-score mb-4">
        Overall ROM Score: {romResults.score}%
        <span className={`status-badge ml-2 ${getStatusBadgeClass(romResults.overallStatus)}`}>
          {getOverallLabel(romResults.overallStatus)}
        </span>
      </div>
      
      {/* Summary Stats */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-green-600 font-semibold">{romResults.summary.optimal}</div>
            <div className="text-xs text-gray-600">Optimal</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-600 font-semibold">{romResults.summary.mild}</div>
            <div className="text-xs text-gray-600">Mild</div>
          </div>
          <div className="text-center">
            <div className="text-orange-600 font-semibold">{romResults.summary.moderate}</div>
            <div className="text-xs text-gray-600">Moderate</div>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-semibold">{romResults.summary.severe}</div>
            <div className="text-xs text-gray-600">Severe</div>
          </div>
        </div>
      </div>
      
      <table className="result-table">
        <thead>
          <tr>
            <th></th>
            <th className="text-left">Joint Movement</th>
            <th className="text-left">Current (°)</th>
            <th className="text-left">Normal Range</th>
            <th className="text-left">% of Normal</th>
            <th className="text-left">Trend</th>
          </tr>
        </thead>
        <tbody>
          {romResults.measurements.map(measurement => (
            <tr key={measurement.key}>
              <td className="w-6 text-center">
                <span className="text-lg">{getStatusEmoji(measurement.status)}</span>
              </td>
              <td>{measurement.label}</td>
              <td>{measurement.value}°</td>
              <td className="text-xs text-gray-600">{measurement.normalRange}</td>
              <td className="text-xs text-gray-600">{measurement.percentage}%</td>
              <td><TrendSparkline values={getTrendValues(measurement.key)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note:</strong> Range of motion values represent the maximum degree of movement achievable at each joint. 
        Measurements are scored based on percentage of normal range achieved (90%+ = Optimal, 75-89% = Mild limitation, 60-74% = Moderate limitation, &lt;60% = Severe limitation).</p>
      </div>
    </section>
  );
};

export default ROMResultSection;
