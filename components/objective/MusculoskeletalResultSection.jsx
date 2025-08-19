import React, { useState } from 'react';
import { scoreExBody } from '@/lib/objective/exbody';

// @refresh reset
const MusculoskeletalResultSection = ({ data, history }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate MSK health score using the new story-based scoring logic
  const calculateMSKScore = () => {
    try {
      const scoreResult = scoreExBody({ data });
      const mskScore = scoreResult.bands.msk_health_score.score;
      return {
        score: mskScore,
        label: scoreResult.bands.msk_health_score.label,
        color: scoreResult.bands.msk_health_score.color,
        scoreResult: scoreResult,
        storyBlocks: scoreResult.storyBlocks
      };
    } catch (error) {
      console.error('Error calculating MSK score:', error);
      return { score: null, label: 'Error calculating score', scoreResult: null, storyBlocks: null };
    }
  };
  
  // Memoize expensive calculations
  const mskScoreResult = React.useMemo(() => calculateMSKScore(), [data]);

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

  // Get color for individual metric scores (based on the scoring logic in exbody.ts)
  const getMetricColor = (metricKey, value) => {
    if (value === undefined || value === null) return '#6b7280'; // Gray for no data
    
    const numValue = Math.abs(Number(value));
    
    // Color coding based on REFERENCE_CHARTS.md clinical reference ranges
    switch (metricKey) {
      case 'fhp_deg': // Forward Head Posture (degrees)
        if (numValue <= 15) return '#10b981'; // Green
        if (numValue <= 20) return '#f59e0b'; // Yellow
        if (numValue <= 30) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'fhp_mm': // Forward Head Posture (mm)
        if (numValue <= 5) return '#10b981'; // Green
        if (numValue <= 10) return '#f59e0b'; // Yellow
        if (numValue <= 20) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'pcmt_lb': // Postural Correction Muscle Tension (lb)
        if (numValue <= 2) return '#10b981'; // Green
        if (numValue <= 4) return '#f59e0b'; // Yellow
        if (numValue <= 6) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'shoulder_deg': // Shoulder Inclination (degrees)
        if (numValue <= 1) return '#10b981'; // Green
        if (numValue <= 3) return '#f59e0b'; // Yellow
        if (numValue <= 5) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'shoulder_mm': // Shoulder Inclination (mm)
        if (numValue <= 5) return '#10b981'; // Green
        if (numValue <= 10) return '#f59e0b'; // Yellow
        if (numValue <= 20) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'pelvic_deg': // Pelvic Tilt (degrees)
        if (numValue >= -4 && numValue <= 10) return '#10b981'; // Green
        if (numValue <= 15) return '#f59e0b'; // Yellow
        if (numValue <= 20) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'pelvic_mm': // Pelvic Tilt (mm)
        if (numValue <= 5) return '#10b981'; // Green
        if (numValue <= 10) return '#f59e0b'; // Yellow
        if (numValue <= 20) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'loss_of_height': // Loss of Height (in)
        if (numValue <= 0.5) return '#10b981'; // Green
        if (numValue <= 1.0) return '#f59e0b'; // Yellow
        if (numValue <= 2.0) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'knee_deg': // Knee Flexion/Extension (degrees)
        if (numValue >= -5 && numValue <= 5) return '#10b981'; // Green
        if (numValue <= 10) return '#f59e0b'; // Yellow
        if (numValue <= 15) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'knee_mm': // Knee Flexion/Extension (mm)
        if (numValue <= 5) return '#10b981'; // Green
        if (numValue <= 10) return '#f59e0b'; // Yellow
        if (numValue <= 20) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'misalignment_deviation': // Misalignment Deviation
        if (numValue <= 10) return '#10b981'; // Green
        if (numValue <= 20) return '#f59e0b'; // Yellow
        if (numValue <= 40) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'imbalance_deviation': // Imbalance Deviation
        if (numValue <= 10) return '#10b981'; // Green
        if (numValue <= 20) return '#f59e0b'; // Yellow
        if (numValue <= 40) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      case 'musculoskeletal_index': // Musculoskeletal Index
        if (numValue <= 20) return '#10b981'; // Green
        if (numValue <= 40) return '#f59e0b'; // Yellow
        if (numValue <= 60) return '#f97316'; // Orange
        return '#ef4444'; // Red
        
      default:
        return '#6b7280'; // Gray for unknown metrics
    }
  };

  // Story block definitions
  const storyBlocks = [
    {
      key: 'headShoulderBalance',
      title: 'Head & Shoulder Balance',
      metrics: [
        { key: 'fhp_deg', label: 'Forward Head Posture (degrees)' },
        { key: 'fhp_mm', label: 'Forward Head Posture (mm)' },
        { key: 'pcmt_lb', label: 'Postural-Correction Muscle Tension (lb)' },
        { key: 'shoulder_deg', label: 'Shoulder Inclination (degrees)' },
        { key: 'shoulder_mm', label: 'Shoulder Inclination (mm)' }
      ]
    },
    {
      key: 'coreAlignment',
      title: 'Core Alignment',
      metrics: [
        { key: 'pelvic_deg', label: 'Pelvic Tilt (degrees)' },
        { key: 'pelvic_mm', label: 'Pelvic Tilt (mm)' },
        { key: 'loss_of_height', label: 'Loss of Height (in)' }
      ]
    },
    {
      key: 'lowerLimbMechanics',
      title: 'Lower-Limb Mechanics',
      metrics: [
        { key: 'knee_deg', label: 'Knee Flexion/Extension (degrees)' },
        { key: 'knee_mm', label: 'Knee Flexion/Extension (mm)' }
      ]
    },
    {
      key: 'globalSymmetryLoad',
      title: 'Global Symmetry & Load',
      metrics: [
        { key: 'misalignment_deviation', label: 'Misalignment Deviation' },
        { key: 'imbalance_deviation', label: 'Imbalance Deviation' },
        { key: 'musculoskeletal_index', label: 'Musculoskeletal Index' }
      ]
    }
  ];

  return (
    <section style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '120px' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Musculoskeletal System</h3>
          <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Postural Alignment & Movement Health</p>
        </div>
        <div style={{ textAlign: 'center', flex: '0 0 auto', marginLeft: '3rem', minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: '800', color: getScoreColor(mskScoreResult.score || 0), lineHeight: '1', marginBottom: '0.25rem' }}>
            {Math.round(mskScoreResult.score || 0)}%
          </div>
          <div style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: '500' }}>
            {getStatusText(mskScoreResult.score || 0)}
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

      {isExpanded && mskScoreResult.storyBlocks && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {storyBlocks.map((block) => {
              const story = mskScoreResult.storyBlocks[block.key];
              if (!story) return null;
              
              const score = story.score || 0;
              const storyText = story.story || '';
              
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
                        const metricData = story.metrics[metric.key];
                        const value = metricData?.value;
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

export { MusculoskeletalResultSection }; 