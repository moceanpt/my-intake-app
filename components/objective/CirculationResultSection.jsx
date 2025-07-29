import React, { useState } from 'react';
import { scoreCirculation, scoreCirculationStories } from '@/lib/objective/circulation';

const CirculationResultSection = ({ data, history }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const scoreResult = scoreCirculationStories(data);
  const circScore = scoreResult.bands.circulation_score;
  const stories = scoreResult.stories;
  
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

  // Get color for individual metric scores (based on the scoring logic in circulation.ts)
  const getMetricColor = (metricKey, value) => {
    if (value === undefined || value === null) return '#6b7280'; // Gray for no data
    
    // Determine color based on metric type and value ranges
    switch (metricKey) {
      case 'hrv_index':
        if (value >= 13.0) return '#10b981'; // Green
        if (value >= 10.0) return '#f59e0b'; // Yellow
        if (value >= 6.0) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'sdnn_ms':
        if (value >= 50) return '#10b981'; // Green
        if (value >= 45) return '#f59e0b'; // Yellow
        if (value >= 30) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'total_power':
        if (value >= 1000) return '#10b981'; // Green
        if (value >= 750) return '#f59e0b'; // Yellow
        if (value >= 500) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'rr_intervals':
        if (value >= 60) return '#10b981'; // Green
        if (value >= 50) return '#f59e0b'; // Yellow
        if (value >= 40) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'lf':
        if (value >= 6.0) return '#10b981'; // Green
        if (value >= 3.59) return '#f59e0b'; // Yellow
        if (value >= 2.0) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'lf_power':
        if (value >= 300 && value <= 1170) return '#10b981'; // Green
        if ((value >= 200 && value < 300) || (value > 1170 && value <= 2000)) return '#f59e0b'; // Yellow
        if ((value >= 100 && value < 200) || (value > 2000)) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'vlf_power':
        if (value >= 100 && value <= 500) return '#10b981'; // Green
        if ((value >= 50 && value < 100) || (value > 500 && value <= 1000)) return '#f59e0b'; // Yellow
        if ((value >= 20 && value < 50) || (value > 1000 && value <= 2000)) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'mean_hr_bpm':
        if (value >= 60 && value <= 100) return '#10b981'; // Green
        if ((value >= 50 && value < 60) || (value > 100 && value <= 120)) return '#f59e0b'; // Yellow
        if ((value >= 40 && value < 50) || (value > 120)) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'mean_ibi_ms':
        if (value >= 600 && value <= 1000) return '#10b981'; // Green
        if ((value >= 500 && value < 600) || (value > 1000 && value <= 1500)) return '#f59e0b'; // Yellow
        if ((value >= 400 && value < 500) || (value > 1500)) return '#f97316'; // Orange
        return '#ef4444'; // Red
      case 'normalized_coherence_pct':
        if (value >= 60) return '#10b981'; // Green
        if (value >= 50) return '#f59e0b'; // Yellow
        if (value >= 30) return '#f97316'; // Orange
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray for unknown metrics
    }
  };

  // Story block definitions
  const storyBlocks = [
    {
      key: 'heart_rhythm_strength',
      title: 'Heart-Rhythm Strength',
      metrics: [
        { key: 'hrv_index', label: 'HRV Index (OmniFit)' },
        { key: 'sdnn_ms', label: 'SDNN (ms)' },
        { key: 'total_power', label: 'Total Power (ms²)' },
        { key: 'rr_intervals', label: 'R-R Intervals (count)' }
      ]
    },
    {
      key: 'autonomic_balance',
      title: 'Autonomic Balance',
      metrics: [
        { key: 'lf', label: 'LF Power (log ms²)' },
        { key: 'lf_power', label: 'LF Power (ms²)' },
        { key: 'vlf_power', label: 'VLF Power (ms²)' },
        { key: 'normalized_coherence_pct', label: 'Normalized Coherence (%)' }
      ]
    },
    {
      key: 'heart_rate_load',
      title: 'Heart-Rate Load',
      metrics: [
        { key: 'mean_hr_bpm', label: 'Mean Heart Rate (bpm)' },
        { key: 'mean_ibi_ms', label: 'Mean Inter-Beat Interval (ms)' }
      ]
    }
  ];
  
  return (
    <section style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '120px' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Circulation System</h3>
          <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Cardiovascular & Autonomic Health</p>
        </div>
        <div style={{ textAlign: 'center', flex: '0 0 auto', marginLeft: '3rem', minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', color: getScoreColor(circScore?.score || 0), lineHeight: '1', marginBottom: '0.25rem' }}>
            {Math.round(circScore?.score || 0)}%
          </div>
          <div style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: '500' }}>
            {getStatusText(circScore?.score || 0)}
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
        {isExpanded ? 'Hide Details' : 'View Details'}
        <span style={{ fontSize: '0.75rem' }}>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {storyBlocks.map((block) => {
              const story = stories[block.key];
              const score = story?.score || 0;
              const status = story?.status || '';
              const storyText = story?.story || '';
              
              return (
                <div key={block.key} style={{ 
                  background: '#f9fafb', 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {block.title}
                    </h4>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: getScoreColor(score)
                    }}>
                      {Math.round(score)}%
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                      {storyText.split('\n\n')[0]}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                      <span dangerouslySetInnerHTML={{ __html: storyText.split('\n\n')[1] }} />
                    </div>
                  </div>
                  
                  <div style={{ 
                    background: 'white', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    marginTop: '1rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                      Metrics:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      {block.metrics.map((metric) => {
                        const value = data[metric.key];
                        const metricColor = getMetricColor(metric.key, value);
                        return (
                          <div key={metric.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{metric.label}</span>
                            <div style={{
                              background: metricColor,
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              minWidth: '40px',
                              textAlign: 'center'
                            }}>
                              {value !== undefined && value !== null ? value : 'N/A'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default CirculationResultSection; 