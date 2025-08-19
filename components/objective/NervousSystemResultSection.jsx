import React, { useState } from 'react';
import { scoreNervous } from '@/lib/objective/nervous';
import { scoreNervousSystemStory } from '@/lib/objective/omnifit';

const NervousSystemResultSection = ({ data, history }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Debug: Log what data we're receiving
  console.log('🔍 DEBUG: NervousSystemResultSection received data:', data);
  
  // Use the new story-based scoring
  const storyResult = scoreNervousSystemStory(data);
  const overallScore = storyResult.overallScore;
  const stories = storyResult.stories;
  
  // Debug: Log what the scoring function returned
  console.log('🔍 DEBUG: NervousSystemResultSection storyResult:', storyResult);
  console.log('🔍 DEBUG: NervousSystemResultSection stories:', stories);
  
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

  // Function to determine metric color based on nervous system scoring logic
  const getMetricColor = (metricKey, value) => {
    if (!value || value === 0) return '#6b7280'; // Gray for no data
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Nervous system reference ranges
    const NERVOUS_REFERENCE_RANGES = {
      // Cognitive Performance
      brain_score: { min: 80, max: null }, // ≥80 = green
      intrinsic_eeg_pf: { min: 9.0, max: null }, // ≥9.0 = green
      brain_workload: { min: 15, max: 19.5 }, // 15-19.5 = green
      normalized_coherence: { min: 60, max: null }, // ≥60 = green
      
      // Autonomic Flexibility
      hf_power: { min: 300, max: 975 }, // 300-975 = green
      rmssd_ms: { min: 40, max: null }, // ≥40 = green
      lf_hf_ratio: { min: 0.8, max: 1.25 }, // 0.8-1.25 = green
      ans_health: { min: 7.0, max: 8.9 }, // 7.0-8.9 = yellow
      ans_age: { min: -9, max: -5 }, // -9 to -5 = yellow
      
      // Stress Load
      mental_stress: { min: 0, max: 3 }, // <3 = green
      stress: { min: 0, max: 20 } // 0-20 = green
    };
    
    const reference = NERVOUS_REFERENCE_RANGES[metricKey];
    if (!reference) return '#6b7280'; // Gray for unknown metric
    
    if (reference.max) {
      // Range-based reference
      if (numValue >= reference.min && numValue <= reference.max) {
        return '#059669'; // Green
      } else if (numValue >= reference.min * 0.8 && numValue <= reference.max * 1.2) {
        return '#d97706'; // Yellow
      } else {
        return '#ea580c'; // Orange
      }
    } else {
      // Minimum-based reference
      if (numValue >= reference.min) {
        return '#059669'; // Green
      } else if (numValue >= reference.min * 0.8) {
        return '#d97706'; // Yellow
      } else {
        return '#ea580c'; // Orange
      }
    }
  };

  // Story block definitions
  const storyBlocks = [
    {
      key: 'cognitive_performance',
      title: 'Cognitive Performance',
      metrics: [
        { key: 'brain_score', label: 'Overall Brain Function Score (0-100)' },
        { key: 'intrinsic_eeg_pf', label: 'Intrinsic EEG Performance Factor (Hz)' },
        { key: 'brain_workload', label: 'Brain Workload Index (Hz)' },
        { key: 'normalized_coherence', label: 'Normalized Coherence (%)' }
      ]
    },
    {
      key: 'autonomic_flexibility',
      title: 'Autonomic Flexibility',
      metrics: [
        { key: 'hf_power', label: 'HF Power (ms²)' },
        { key: 'rmssd_ms', label: 'RMSSD (ms)' },
        { key: 'lf_hf_ratio', label: 'LF/HF Ratio' },
        { key: 'ans_health', label: 'ANS Health Score (0-10)' },
        { key: 'ans_age', label: 'ANS Age (years)' }
      ]
    },
    {
      key: 'stress_load',
      title: 'Stress Load',
      metrics: [
        { key: 'mental_stress', label: 'Mental Stress Level (0-10)' },
        { key: 'stress', label: 'Stress Level (0-100)' }
      ]
    }
  ];
  
  return (
    <section style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '120px' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Nervous System</h3>
          <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Brain Function & Autonomic Regulation</p>
        </div>
        <div style={{ textAlign: 'center', flex: '0 0 auto', marginLeft: '3rem', minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', color: getScoreColor(overallScore), lineHeight: '1', marginBottom: '0.25rem' }}>
            {Math.round(overallScore)}%
          </div>
          <div style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: '500' }}>
            {getStatusText(overallScore)}
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
              const story = stories.find(s => s.title === block.title);
              const score = story?.score || 0;
              const storyText = `${story?.whyItMatters}\n\nYour ${story?.title} is in <span style="font-weight: bold; color: ${getScoreColor(score)}">${story?.status}</span> range.`;
              
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

export default NervousSystemResultSection;
