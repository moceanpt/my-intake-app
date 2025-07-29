import React, { useState } from 'react';
import { scoreExBodyROM, scoreArticularJointSystemStory } from '@/lib/objective/exbody';

const ArticularJointResultSection = ({ data, history }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate articular joint system story scores
  const articularJointResult = React.useMemo(() => {
    try {
      const requiredMetrics = ['neck_flexion', 'neck_lateral_flexion', 'shoulder_abduction', 'shoulder_flexion', 'shoulder_extension', 'trunk_lateral_flexion', 'hip_abduction', 'hip_flexion', 'hip_extension'];
      const hasRequiredMetrics = requiredMetrics.every(metric => data[metric] !== undefined && data[metric] !== null);
      
      if (!hasRequiredMetrics) {
        return null;
      }

      return scoreArticularJointSystemStory(data);
    } catch (error) {
      console.error('Error calculating articular joint system scores:', error);
      return null;
    }
  }, [data]);

  if (!articularJointResult) {
    return (
      <section style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Articular Joint System</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Range of Motion & Joint Health</p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>No ROM data available</p>
      </section>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getStatusText = (score) => {
    if (score >= 80) return 'Optimal';
    if (score >= 60) return 'Moderate';
    if (score >= 40) return 'High Risk';
    return 'Critical';
  };

  // Function to determine metric color based on ROM scoring logic
  const getMetricColor = (metricKey, value, hasPain = false) => {
    if (hasPain) return '#dc2626'; // Red for pain
    
    if (!value || value === 0) return '#6b7280'; // Gray for no data
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // ROM reference ranges
    const ROM_REFERENCE_RANGES = {
      neck_flexion: { min: 45, max: null },
      neck_lateral_flexion: { min: 25, max: 45 },
      shoulder_abduction: { min: 170, max: 180 },
      shoulder_flexion: { min: 170, max: 180 },
      shoulder_extension: { min: 45, max: 60 },
      trunk_lateral_flexion: { min: 35, max: null },
      hip_abduction: { min: 40, max: null },
      hip_flexion: { min: 70, max: 80 },
      hip_extension: { min: 20, max: 30 }
    };
    
    // Extract the base metric key from the display name
    const getBaseMetricKey = (displayName) => {
      if (displayName.includes('Neck Flexion')) return 'neck_flexion';
      if (displayName.includes('Neck Lateral Flexion')) return 'neck_lateral_flexion';
      if (displayName.includes('Shoulder Abduction')) return 'shoulder_abduction';
      if (displayName.includes('Shoulder Flexion')) return 'shoulder_flexion';
      if (displayName.includes('Shoulder Extension')) return 'shoulder_extension';
      if (displayName.includes('Trunk Lateral Flexion')) return 'trunk_lateral_flexion';
      if (displayName.includes('Hip Abduction')) return 'hip_abduction';
      if (displayName.includes('Hip Flexion')) return 'hip_flexion';
      if (displayName.includes('Hip Extension')) return 'hip_extension';
      return metricKey;
    };
    
    const baseKey = getBaseMetricKey(metricKey);
    const reference = ROM_REFERENCE_RANGES[baseKey];
    if (!reference) return '#6b7280'; // Gray for unknown metric
    
    if (reference.max) {
      // Range-based reference (e.g., 25-45°)
      const range = reference.max - reference.min;
      const percentage = Math.min(100, Math.max(0, ((numValue - reference.min) / range) * 100));
      
      if (percentage >= 90) return '#059669'; // Green
      if (percentage >= 70) return '#d97706'; // Yellow
      return '#ea580c'; // Orange
    } else {
      // Minimum-based reference (e.g., >45°)
      const percentage = Math.min(100, Math.max(0, (numValue / reference.min) * 100));
      
      if (percentage >= 90) return '#059669'; // Green
      if (percentage >= 70) return '#d97706'; // Yellow
      return '#ea580c'; // Orange
    }
  };

  return (
    <section style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '120px' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Articular Joint System</h3>
          <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Range of Motion & Joint Health</p>
        </div>
        <div style={{ textAlign: 'center', flex: '0 0 auto', marginLeft: '3rem', minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', color: getScoreColor(articularJointResult.overallScore), lineHeight: '1', marginBottom: '0.25rem' }}>
            {articularJointResult.overallScore}%
          </div>
          <div style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: '500' }}>
            {getStatusText(articularJointResult.overallScore)}
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
            {articularJointResult.groups.map((group, index) => (
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
                    {group.score}%
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
                    {group.metrics.map((metric, metricIndex) => {
                      // Create a mapping from display names to data keys
                      const getMetricKey = (displayName) => {
                        const nameMap = {
                          'Neck Flexion': 'neck_flexion',
                          'Neck Lateral Flexion Left': 'neck_lateral_flexion',
                          'Neck Lateral Flexion Right': 'neck_lateral_flexion',
                          'Shoulder Abduction L': 'shoulder_abduction',
                          'Shoulder Abduction R': 'shoulder_abduction',
                          'Shoulder Flexion L': 'shoulder_flexion',
                          'Shoulder Flexion R': 'shoulder_flexion',
                          'Shoulder Extension L': 'shoulder_extension',
                          'Shoulder Extension R': 'shoulder_extension',
                          'Trunk Lateral Flexion L': 'trunk_lateral_flexion',
                          'Trunk Lateral Flexion R': 'trunk_lateral_flexion',
                          'Hip Abduction L': 'hip_abduction',
                          'Hip Abduction R': 'hip_abduction',
                          'Hip Flexion L': 'hip_flexion',
                          'Hip Flexion R': 'hip_flexion',
                          'Hip Extension L': 'hip_extension',
                          'Hip Extension R': 'hip_extension'
                        };
                        return nameMap[displayName] || displayName.toLowerCase().replace(/\s+/g, '_');
                      };

                      const metricKey = getMetricKey(metric.name);
                      const isLeft = metric.name.includes('L') || metric.name.includes('Left');
                      const isRight = metric.name.includes('R') || metric.name.includes('Right');
                      
                      let hasPain = false;
                      if (isLeft && data[metricKey]?.leftPain) hasPain = true;
                      else if (isRight && data[metricKey]?.rightPain) hasPain = true;
                      else if (!isLeft && !isRight && data[metricKey]?.leftPain) hasPain = true;
                      
                      const metricColor = getMetricColor(metricKey, metric.value, hasPain);
                      
                      return (
                        <div key={metricIndex} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          fontSize: '0.875rem'
                        }}>
                          <span style={{ color: '#6b7280' }}>{metric.name}</span>
                          <span style={{ 
                            fontWeight: '600', 
                            color: '#1f2937',
                            background: metricColor,
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}>
                            {metric.value}{metric.unit}
                          </span>
                        </div>
                      );
                    })}
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

export default ArticularJointResultSection; 