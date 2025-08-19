/* components/ExpandableResultsView.jsx
   Comprehensive MOCEAN Results with Expandable Sections
   ------------------------------------------------------------------ */
import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const ExpandableResultsView = ({ data, objectiveData }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Mock data for demonstration - in real implementation, this would come from actual scoring
  const systemResults = [
    {
      id: 'musculoskeletal',
      title: 'Musculoskeletal System',
      subtitle: 'Postural Alignment & Movement Health',
      score: 63,
      status: 'Mild Strain',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subsections: [
        {
          id: 'head_shoulder',
          title: 'Head & Shoulder Balance',
          score: 56,
          status: 'Moderate Load',
          description: 'When your head drifts forward—even by a couple of centimetres—it acts like a bowling ball on a long lever. That extra pull makes your neck muscles work overtime and can tip one shoulder lower than the other, setting the stage for tension headaches and shoulder aches.',
          metrics: [
            { label: 'Forward Head Posture (degrees)', value: 18, unit: '°' },
            { label: 'Forward Head Posture (mm)', value: 20, unit: 'mm' },
            { label: 'Postural-Correction Muscle Tension (lb)', value: 3, unit: 'lb' },
            { label: 'Shoulder Inclination (degrees)', value: 2, unit: '°' },
            { label: 'Shoulder Inclination (mm)', value: 8, unit: 'mm' },
          ]
        },
        {
          id: 'core_alignment',
          title: 'Core Alignment',
          score: 52,
          status: 'Moderate Load',
          description: 'Your pelvis is the foundation of your spine. If it tilts too far forward or backward, it changes the curve of your lower back and squeezes the discs between the vertebrae. Any measurable loss of standing height hints that those discs or joints are under pressure.',
          metrics: [
            { label: 'Pelvic Tilt (degrees)', value: 12, unit: '°' },
            { label: 'Pelvic Tilt (mm)', value: 15, unit: 'mm' },
            { label: 'Loss of Height (in)', value: 0.6, unit: 'in' },
          ]
        },
        {
          id: 'lower_limb',
          title: 'Lower-Limb Mechanics',
          score: 72,
          status: 'Mild Strain',
          description: 'The angle of your knees and how far they shift front-to-back decide how forces travel up to the hips and down to the feet. Even small deviations can change the way you walk or squat and may lead to knee, hip, or ankle discomfort over time.',
          metrics: [
            { label: 'Knee Flexion/Extension (degrees)', value: 7, unit: '°' },
            { label: 'Knee Flexion/Extension (mm)', value: 10, unit: 'mm' },
          ]
        },
        {
          id: 'global_symmetry',
          title: 'Global Symmetry & Load',
          score: 72,
          status: 'Mild Strain',
          description: 'This block looks at your whole-body balance score. It tells us whether weight and muscle effort are spreading evenly from head to toe or if one side or region is doing extra work, which can snowball into wear-and-tear elsewhere.',
          metrics: [
            { label: 'Misalignment Deviation', value: 12, unit: '' },
            { label: 'Imbalance Deviation', value: 8, unit: '' },
            { label: 'Musculoskeletal Index', value: 20, unit: '' },
          ]
        }
      ]
    },
    {
      id: 'organ',
      title: 'Organ System Result',
      subtitle: 'Organ System Health',
      score: 97,
      status: 'Optimal Zone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subsections: []
    },
    {
      id: 'circulation',
      title: 'Circulation System',
      subtitle: 'Cardiovascular & Autonomic Health',
      score: 95,
      status: 'Optimal Zone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subsections: []
    },
    {
      id: 'energy',
      title: 'Energy System Result',
      subtitle: 'Energy System Health',
      score: 56,
      status: 'Moderate Load',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subsections: []
    },
    {
      id: 'articular',
      title: 'Articular Joint System',
      subtitle: 'Range of Motion & Joint Health',
      score: 69,
      status: 'Moderate',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subsections: []
    },
    {
      id: 'nervous',
      title: 'Nervous System',
      subtitle: 'Brain Function & Autonomic Regulation',
      score: 87,
      status: 'Optimal Zone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subsections: []
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 55) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    if (status.includes('Optimal')) return 'text-green-700 bg-green-50';
    if (status.includes('Mild')) return 'text-yellow-700 bg-yellow-50';
    if (status.includes('Moderate')) return 'text-orange-700 bg-orange-50';
    return 'text-red-700 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-900">
          Health Assessment Results
        </h1>
        <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
          📊 View History & Trends
        </Button>
      </div>

      {/* MOCEAN Systems */}
      <div className="space-y-4">
        {systemResults.map(system => (
          <Card key={system.id} className="overflow-hidden">
            {/* System Header */}
            <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
                 onClick={() => toggleSection(system.id)}>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-secondary-900 mb-1">
                  {system.title}
                </h2>
                <p className="text-secondary-600 text-sm">
                  {system.subtitle}
                </p>
                {expandedSections[system.id] && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-blue-600 mt-2 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(system.id);
                    }}
                  >
                    Hide Details ▲
                  </Button>
                )}
              </div>
              
              <div className="text-right">
                <div className={`text-4xl font-bold ${getScoreColor(system.score)}`}>
                  {system.score}%
                </div>
                <div className={`text-sm px-2 py-1 rounded-full ${getStatusColor(system.status)}`}>
                  {system.status}
                </div>
                {!expandedSections[system.id] && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(system.id);
                    }}
                  >
                    {system.subsections.length > 0 ? 'View Details' : 'Show Details'}
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedSections[system.id] && system.subsections.length > 0 && (
              <div className="px-6 pb-6 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {system.subsections.map(subsection => (
                    <div key={subsection.id} className="bg-white rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {subsection.title}
                        </h3>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(subsection.score)}`}>
                            {subsection.score}%
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-secondary-600 mb-4 leading-relaxed">
                        {subsection.description}
                      </p>
                      
                      <div className={`text-sm font-medium mb-4 px-3 py-2 rounded ${getStatusColor(subsection.status)}`}>
                        Your {subsection.title} is in the <strong>{subsection.status}</strong> range.
                      </div>

                      {/* Metrics */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-secondary-800 mb-2">Metrics:</h4>
                        <div className="space-y-1">
                          {subsection.metrics.map((metric, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-secondary-600">{metric.label}</span>
                              <span className="font-medium">
                                {metric.value}{metric.unit && ` ${metric.unit}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simple expanded content for systems without subsections */}
            {expandedSections[system.id] && system.subsections.length === 0 && (
              <div className="px-6 pb-6 bg-gray-50">
                <p className="text-secondary-600 text-center py-8">
                  Detailed analysis for {system.title} will be available once objective measurements are completed.
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpandableResultsView;
