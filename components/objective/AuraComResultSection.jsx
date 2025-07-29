import React, { useState } from 'react';
import { scoreAuraCom, scoreEnergySystemStory } from '@/lib/objective/auracom';

// @refresh reset
const AuraComResultSection = ({ data, history }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate energy system story scores
  const energySystemResult = React.useMemo(() => {
    try {
      const requiredMetrics = ['ava_score', 'vigor', 'stability', 'activity_percent', 'overall_balance_score', 'wood', 'fire', 'earth', 'metal', 'water'];
      const hasRequiredMetrics = requiredMetrics.every(metric => data[metric] !== undefined && data[metric] !== null);
      
      if (!hasRequiredMetrics) {
        return null;
      }

      return scoreEnergySystemStory(data);
    } catch (error) {
      console.error('Error calculating energy system story:', error);
      return null;
    }
  }, [data]);

  // Get color for score display
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  // Get status text for score display
  const getStatusText = (score) => {
    if (score >= 80) return 'Optimal Zone';
    if (score >= 60) return 'Mild Strain';
    if (score >= 40) return 'Moderate Load';
    return 'High Strain';
  };

  // Get color for individual metric values based on the same logic as group scores
  const getMetricColor = (metricName, value) => {
    if (value === undefined || value === null) return '#6b7280'; // Gray for no data
    // Fuel Tank & Power
    if (metricName === 'Energy Level') {
      if (value >= 500) return '#10b981';
      if (value >= 450) return '#f59e0b';
      if (value >= 400) return '#f97316';
      if (value >= 350) return '#ef4444';
      return '#ef4444';
    }
    if (metricName === 'Vigor Level') {
      if (value >= 60 && value <= 71) return '#10b981';
      if (value >= 50 && value < 60) return '#f59e0b';
      if (value >= 40 && value < 50) return '#f97316';
      if (value >= 30 && value < 40) return '#ef4444';
      return '#ef4444';
    }
    // Energy Flow & Control
    if (metricName === 'Stability Level') {
      if (value >= 30 && value <= 51) return '#10b981';
      if (value >= 20 && value < 30) return '#f59e0b';
      if (value >= 10 && value < 20) return '#f97316';
      if (value >= 5 && value < 10) return '#ef4444';
      return '#ef4444';
    }
    if (metricName === 'Activity Level') {
      if (value >= 40 && value <= 60) return '#10b981';
      if (value >= 30 && value < 40) return '#f59e0b';
      if (value >= 20 && value < 30) return '#f97316';
      if (value >= 10 && value < 20) return '#ef4444';
      return '#ef4444';
    }
    if (metricName === 'Overall Energy Balance') {
      if (value >= 96 && value <= 110) return '#10b981';
      if (value >= 86 && value < 96) return '#f59e0b';
      if (value >= 75 && value < 86) return '#f97316';
      if (value >= 65 && value < 75) return '#ef4444';
      return '#ef4444';
    }
    // Organ Energy Systems (elements)
    if ([
      'Detoxification System',
      'Circulation System',
      'Digestive System',
      'Immune System',
      'Filtration System'
    ].includes(metricName)) {
      if (value >= 96 && value <= 110) return '#10b981';
      if (value >= 86 && value < 96) return '#f59e0b';
      if (value >= 75 && value < 86) return '#f97316';
      if (value >= 65 && value < 75) return '#ef4444';
      return '#ef4444';
    }
    // Fallback
    return '#6b7280';
  };

  if (!energySystemResult) {
    return (
      <section style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Energy System Result</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Vital Energy & Metabolic Balance</p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>Insufficient data for energy system analysis</p>
      </section>
    );
  }

  return (
    <section style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '120px' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Energy System</h3>
          <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Cellular Energy & Metabolic Health</p>
        </div>
        <div style={{ textAlign: 'center', flex: '0 0 auto', marginLeft: '3rem', minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', color: getScoreColor(energySystemResult.overallScore), lineHeight: '1', marginBottom: '0.25rem' }}>
            {Math.round(energySystemResult.overallScore)}%
          </div>
          <div style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: '500' }}>
            {getStatusText(energySystemResult.overallScore)}
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          fontSize: '0.875rem',
          cursor: 'pointer',
          padding: '0.5rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        {isExpanded ? 'Hide Details' : 'Show Details'}
        <span style={{ fontSize: '0.75rem' }}>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {energySystemResult.groups.map((group, index) => (
              <div key={index} style={{ 
                background: '#f9fafb', 
                border: '1px solid #e5e7eb', 
                borderRadius: '12px', 
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {group.name}
                  </h4>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: group.statusColor 
                  }}>
                    {Math.round(group.score)}%
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  lineHeight: '1.5',
                  marginBottom: '1.5rem',
                  whiteSpace: 'pre-line'
                }} 
                dangerouslySetInnerHTML={{ __html: group.whyItMatters }}
                />
                
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                    Metrics
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {group.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        fontSize: '0.875rem'
                      }}>
                        <span style={{ color: '#6b7280' }}>{metric.name}</span>
                        <div style={{
                          background: getMetricColor(metric.name, metric.value),
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: '600',
                          minWidth: '40px',
                          textAlign: 'center'
                        }}>
                          {metric.value !== undefined && metric.value !== null ? `${metric.value}${metric.unit}` : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export { AuraComResultSection }; 