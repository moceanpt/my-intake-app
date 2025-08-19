import React, { useState } from 'react';
import { scoreOrganSystemStory } from '@/lib/objective/inbody';

// @refresh reset
const InBodyResultSection = ({ data, history, sex, age }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Debug: Log what data we're receiving
  console.log('🔍 DEBUG: InBodyResultSection received data:', data);
  console.log('🔍 DEBUG: InBodyResultSection sex:', sex, 'age:', age);
  
  // Use the new story-based scoring
  const storyResult = scoreOrganSystemStory(data, sex, age);
  const overallScore = storyResult.overallScore;
  const stories = storyResult.stories;
  
  // Debug: Log what the scoring function returned
  console.log('🔍 DEBUG: InBodyResultSection storyResult:', storyResult);
  console.log('🔍 DEBUG: InBodyResultSection stories:', stories);
  
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
    // Hydration %
    if (metricName === 'Hydration %') {
      if (sex === 'M') {
        if (value >= 58) return '#10b981';
        if (value >= 52) return '#f59e0b';
        if (value >= 50) return '#f97316';
        return '#ef4444';
      } else {
        if (value >= 48) return '#10b981';
        if (value >= 41) return '#f59e0b';
        if (value >= 40) return '#f97316';
        return '#ef4444';
      }
    }
    // ECW/TBW Ratio
    if (metricName === 'ECW/TBW Ratio') {
      if (value < 0.381) return '#10b981';
      if (value < 0.391) return '#f59e0b';
      if (value < 0.401) return '#f97316';
      return '#ef4444';
    }
    // Phase Angle
    if (metricName === 'Phase Angle') {
      if (sex === 'M') {
        if (age <= 29 && value >= 6.8) return '#10b981';
        if (age <= 29 && value >= 6.2) return '#f59e0b';
        if (age <= 29 && value >= 5.4) return '#f97316';
        if (age <= 29) return '#ef4444';
        if (age <= 39 && value >= 6.6) return '#10b981';
        if (age <= 39 && value >= 6.0) return '#f59e0b';
        if (age <= 39 && value >= 5.2) return '#f97316';
        if (age <= 39) return '#ef4444';
        if (age <= 49 && value >= 6.4) return '#10b981';
        if (age <= 49 && value >= 5.8) return '#f59e0b';
        if (age <= 49 && value >= 5.0) return '#f97316';
        if (age <= 49) return '#ef4444';
        if (age <= 59 && value >= 6.0) return '#10b981';
        if (age <= 59 && value >= 5.4) return '#f59e0b';
        if (age <= 59 && value >= 4.7) return '#f97316';
        if (age <= 59) return '#ef4444';
        if (age <= 69 && value >= 5.6) return '#10b981';
        if (age <= 69 && value >= 5.0) return '#f59e0b';
        if (age <= 69 && value >= 4.3) return '#f97316';
        if (age <= 69) return '#ef4444';
        if (age <= 79 && value >= 5.2) return '#10b981';
        if (age <= 79 && value >= 4.6) return '#f59e0b';
        if (age <= 79 && value >= 3.9) return '#f97316';
        if (age <= 79) return '#ef4444';
        if (value >= 4.8) return '#10b981';
        if (value >= 4.2) return '#f59e0b';
        if (value >= 3.5) return '#f97316';
        return '#ef4444';
      } else {
        if (age <= 29 && value >= 6.2) return '#10b981';
        if (age <= 29 && value >= 5.6) return '#f59e0b';
        if (age <= 29 && value >= 4.8) return '#f97316';
        if (age <= 29) return '#ef4444';
        if (age <= 39 && value >= 6.0) return '#10b981';
        if (age <= 39 && value >= 5.4) return '#f59e0b';
        if (age <= 39 && value >= 4.6) return '#f97316';
        if (age <= 39) return '#ef4444';
        if (age <= 49 && value >= 5.8) return '#10b981';
        if (age <= 49 && value >= 5.2) return '#f59e0b';
        if (age <= 49 && value >= 4.4) return '#f97316';
        if (age <= 49) return '#ef4444';
        if (age <= 59 && value >= 5.4) return '#10b981';
        if (age <= 59 && value >= 4.8) return '#f59e0b';
        if (age <= 59 && value >= 4.0) return '#f97316';
        if (age <= 59) return '#ef4444';
        if (age <= 69 && value >= 5.0) return '#10b981';
        if (age <= 69 && value >= 4.4) return '#f59e0b';
        if (age <= 69 && value >= 3.6) return '#f97316';
        if (age <= 69) return '#ef4444';
        if (age <= 79 && value >= 4.6) return '#10b981';
        if (age <= 79 && value >= 4.0) return '#f59e0b';
        if (age <= 79 && value >= 3.2) return '#f97316';
        if (age <= 79) return '#ef4444';
        if (value >= 4.2) return '#10b981';
        if (value >= 3.6) return '#f59e0b';
        if (value >= 2.9) return '#f97316';
        return '#ef4444';
      }
    }
    // SMM %
    if (metricName === 'SMM %') {
      if (sex === 'M') {
        if (age <= 35 && value >= 40) return '#10b981';
        if (age <= 35 && value >= 37) return '#f59e0b';
        if (age <= 35 && value >= 34) return '#f97316';
        if (age <= 35) return '#ef4444';
        if (age <= 55 && value >= 36) return '#10b981';
        if (age <= 55 && value >= 33) return '#f59e0b';
        if (age <= 55 && value >= 30) return '#f97316';
        if (age <= 55) return '#ef4444';
        if (age <= 75 && value >= 32) return '#10b981';
        if (age <= 75 && value >= 29) return '#f59e0b';
        if (age <= 75 && value >= 26) return '#f97316';
        if (age <= 75) return '#ef4444';
        if (value >= 31) return '#10b981';
        if (value >= 27) return '#f59e0b';
        if (value >= 24) return '#f97316';
        return '#ef4444';
      } else {
        if (age <= 35 && value >= 31) return '#10b981';
        if (age <= 35 && value >= 28) return '#f59e0b';
        if (age <= 35 && value >= 26) return '#f97316';
        if (age <= 35) return '#ef4444';
        if (age <= 55 && value >= 29) return '#10b981';
        if (age <= 55 && value >= 26) return '#f59e0b';
        if (age <= 55 && value >= 24) return '#f97316';
        if (age <= 55) return '#ef4444';
        if (age <= 75 && value >= 27) return '#10b981';
        if (age <= 75 && value >= 24) return '#f59e0b';
        if (age <= 75 && value >= 22) return '#f97316';
        if (age <= 75) return '#ef4444';
        if (value >= 26) return '#10b981';
        if (value >= 23) return '#f59e0b';
        if (value >= 20) return '#f97316';
        return '#ef4444';
      }
    }
    // Body-Fat %
    if (metricName === 'Body-Fat %') {
      if (sex === 'M') {
        if (age <= 29 && value >= 8 && value <= 18.6) {
          if (value <= 14.8) return '#10b981';
          if (value <= 18.6) return '#f59e0b';
        }
        if (age <= 39 && value >= 8 && value <= 21.3) {
          if (value <= 18.2) return '#10b981';
          if (value <= 21.3) return '#f59e0b';
        }
        if (age <= 49 && value >= 8 && value <= 23.4) {
          if (value <= 20.6) return '#10b981';
          if (value <= 23.4) return '#f59e0b';
        }
        if (age <= 59 && value >= 8 && value <= 24.6) {
          if (value <= 22.1) return '#10b981';
          if (value <= 24.6) return '#f59e0b';
        }
        if (age <= 69 && value >= 8 && value <= 25.2) {
          if (value <= 22.6) return '#10b981';
          if (value <= 25.2) return '#f59e0b';
        }
        if (value > 25.2) return '#f97316';
        return '#ef4444';
      } else {
        if (age <= 29 && value >= 14 && value <= 22.7) {
          if (value <= 19.4) return '#10b981';
          if (value <= 22.7) return '#f59e0b';
        }
        if (age <= 39 && value >= 14 && value <= 24.6) {
          if (value <= 20.8) return '#10b981';
          if (value <= 24.6) return '#f59e0b';
        }
        if (age <= 49 && value >= 14 && value <= 27.6) {
          if (value <= 23.8) return '#10b981';
          if (value <= 27.6) return '#f59e0b';
        }
        if (age <= 59 && value >= 14 && value <= 30.4) {
          if (value <= 27.0) return '#10b981';
          if (value <= 30.4) return '#f59e0b';
        }
        if (age <= 69 && value >= 14 && value <= 31.3) {
          if (value <= 27.9) return '#10b981';
          if (value <= 31.3) return '#f59e0b';
        }
        if (value > 31.3) return '#f97316';
        return '#ef4444';
      }
    }
    // Visceral Fat Area
    if (metricName === 'Visceral Fat Area') {
      if (value < 100) return '#10b981';
      if (value < 130) return '#f59e0b';
      if (value < 150) return '#f97316';
      return '#ef4444';
    }
    // SMM Mass (derived from SMM %)
    if (metricName === 'SMM Mass') {
      const smmPercent = (value / 150) * 100; // Assuming 150lb weight
      if (sex === 'M') {
        if (age <= 35 && smmPercent >= 40) return '#10b981';
        if (age <= 35 && smmPercent >= 37) return '#f59e0b';
        if (age <= 35 && smmPercent >= 34) return '#f97316';
        if (age <= 35) return '#ef4444';
        if (age <= 55 && smmPercent >= 36) return '#10b981';
        if (age <= 55 && smmPercent >= 33) return '#f59e0b';
        if (age <= 55 && smmPercent >= 30) return '#f97316';
        if (age <= 55) return '#ef4444';
        if (age <= 75 && smmPercent >= 32) return '#10b981';
        if (age <= 75 && smmPercent >= 29) return '#f59e0b';
        if (age <= 75 && smmPercent >= 26) return '#f97316';
        if (age <= 75) return '#ef4444';
        if (smmPercent >= 31) return '#10b981';
        if (smmPercent >= 27) return '#f59e0b';
        if (smmPercent >= 24) return '#f97316';
        return '#ef4444';
      } else {
        if (age <= 35 && smmPercent >= 31) return '#10b981';
        if (age <= 35 && smmPercent >= 28) return '#f59e0b';
        if (age <= 35 && smmPercent >= 26) return '#f97316';
        if (age <= 35) return '#ef4444';
        if (age <= 55 && smmPercent >= 29) return '#10b981';
        if (age <= 55 && smmPercent >= 26) return '#f59e0b';
        if (age <= 55 && smmPercent >= 24) return '#f97316';
        if (age <= 55) return '#ef4444';
        if (age <= 75 && smmPercent >= 27) return '#10b981';
        if (age <= 75 && smmPercent >= 24) return '#f59e0b';
        if (age <= 75 && smmPercent >= 22) return '#f97316';
        if (age <= 75) return '#ef4444';
        if (smmPercent >= 26) return '#10b981';
        if (smmPercent >= 23) return '#f59e0b';
        if (smmPercent >= 20) return '#f97316';
        return '#ef4444';
      }
    }
    // Body-Fat Mass (derived from Body-Fat %)
    if (metricName === 'Body-Fat Mass') {
      const bfPercent = (value / 150) * 100; // Assuming 150lb weight
      if (sex === 'M') {
        if (age <= 29 && bfPercent >= 8 && bfPercent <= 18.6) {
          if (bfPercent <= 14.8) return '#10b981';
          if (bfPercent <= 18.6) return '#f59e0b';
        }
        if (age <= 39 && bfPercent >= 8 && bfPercent <= 21.3) {
          if (bfPercent <= 18.2) return '#10b981';
          if (bfPercent <= 21.3) return '#f59e0b';
        }
        if (age <= 49 && bfPercent >= 8 && bfPercent <= 23.4) {
          if (bfPercent <= 20.6) return '#10b981';
          if (bfPercent <= 23.4) return '#f59e0b';
        }
        if (age <= 59 && bfPercent >= 8 && bfPercent <= 24.6) {
          if (bfPercent <= 22.1) return '#10b981';
          if (bfPercent <= 24.6) return '#f59e0b';
        }
        if (age <= 69 && bfPercent >= 8 && bfPercent <= 25.2) {
          if (bfPercent <= 22.6) return '#10b981';
          if (bfPercent <= 25.2) return '#f59e0b';
        }
        if (bfPercent > 25.2) return '#f97316';
        return '#ef4444';
      } else {
        if (age <= 29 && bfPercent >= 14 && bfPercent <= 22.7) {
          if (bfPercent <= 19.4) return '#10b981';
          if (bfPercent <= 22.7) return '#f59e0b';
        }
        if (age <= 39 && bfPercent >= 14 && bfPercent <= 24.6) {
          if (bfPercent <= 20.8) return '#10b981';
          if (bfPercent <= 24.6) return '#f59e0b';
        }
        if (age <= 49 && bfPercent >= 14 && bfPercent <= 27.6) {
          if (bfPercent <= 23.8) return '#10b981';
          if (bfPercent <= 27.6) return '#f59e0b';
        }
        if (age <= 59 && bfPercent >= 14 && bfPercent <= 30.4) {
          if (bfPercent <= 27.0) return '#10b981';
          if (bfPercent <= 30.4) return '#f59e0b';
        }
        if (age <= 69 && bfPercent >= 14 && bfPercent <= 31.3) {
          if (bfPercent <= 27.9) return '#10b981';
          if (bfPercent <= 31.3) return '#f59e0b';
        }
        if (bfPercent > 31.3) return '#f97316';
        return '#ef4444';
      }
    }
    // Weight (neutral metric - always gray)
    if (metricName === 'Weight') {
      return '#6b7280';
    }
    // Total Body Water (derived from Hydration %)
    if (metricName === 'Total Body Water') {
      const hydPercent = (value / 150) * 100; // Assuming 150lb weight
      if (sex === 'M') {
        if (hydPercent >= 58) return '#10b981';
        if (hydPercent >= 52) return '#f59e0b';
        if (hydPercent >= 50) return '#f97316';
        return '#ef4444';
      } else {
        if (hydPercent >= 48) return '#10b981';
        if (hydPercent >= 41) return '#f59e0b';
        if (hydPercent >= 40) return '#f97316';
        return '#ef4444';
      }
    }
    // Fallback
    return '#6b7280';
  };

  return (
    <section style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '120px' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Organ System</h3>
          <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0.5rem 0 0 0', fontWeight: '500' }}>Cellular Health & Body Composition</p>
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
        {isExpanded ? 'Hide Details' : 'Show Details'}
        <span style={{ fontSize: '0.75rem' }}>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {stories.map((story, index) => {
              const [description, statusText] = story.whyItMatters.split('\n\n');
              
              return (
                <div key={index} style={{ 
                  background: '#f9fafb', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px', 
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {story.title}
                    </h4>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: story.statusColor 
                    }}>
                      {Math.round(story.score)}%
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    lineHeight: '1.5',
                    marginBottom: '1.5rem',
                    whiteSpace: 'pre-line'
                  }} 
                  dangerouslySetInnerHTML={{ __html: story.whyItMatters }}
                  />
                  
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                      Metrics
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      {story.metrics.map((metric, metricIndex) => (
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
                            {metric.value}{metric.unit}
                          </div>
                        </div>
                      ))}
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

export { InBodyResultSection }; 