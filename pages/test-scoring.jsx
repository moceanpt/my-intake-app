import React, { useState, useEffect } from 'react';
import { 
  calculateWeightedSymptomScore, 
  getSeverityInfo, 
  getSymptomsByArea,
  getAreaConfig,
  SYMPTOM_WEIGHTS 
} from '../lib/symptomScoring';

export default function TestScoring() {
  const [testResults, setTestResults] = useState([]);
  const [systemStats, setSystemStats] = useState(null);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = () => {
    // Calculate system statistics
    let totalSymptoms = 0;
    const weightDistribution = { low: 0, medium: 0, high: 0 };
    
    Object.values(SYMPTOM_WEIGHTS).forEach(config => {
      totalSymptoms += config.symptoms.length;
      config.symptoms.forEach(symptom => {
        if (symptom.weight === 1.0) weightDistribution.low++;
        else if (symptom.weight === 1.5) weightDistribution.medium++;
        else if (symptom.weight >= 2.0) weightDistribution.high++;
      });
    });

    setSystemStats({
      totalAreas: Object.keys(SYMPTOM_WEIGHTS).length,
      totalSymptoms,
      averageSymptomsPerArea: (totalSymptoms / Object.keys(SYMPTOM_WEIGHTS).length).toFixed(1),
      weightDistribution
    });

    // Test cases
    const testCases = [
      {
        name: 'Mild Musculoskeletal Issues',
        area: 'musculoskeletal',
        sliderValue: 3,
        symptoms: ['MSK_NeckTension', 'MSK_JointPopping'],
        description: 'Common neck tension and joint popping'
      },
      {
        name: 'Severe Energy Crisis',
        area: 'energy',
        sliderValue: 7,
        symptoms: ['ENE_Fatigue', 'ENE_CFS', 'ENE_Burnout'],
        description: 'Multiple high-impact energy symptoms'
      },
      {
        name: 'Complex Nervous System Issues',
        area: 'nervous_system',
        sliderValue: 5,
        symptoms: ['NERV_Concussion', 'NERV_NervePain', 'NERV_Trembling'],
        description: 'History of concussion with nerve pain and trembling'
      },
      {
        name: 'Digestive Problems',
        area: 'organ_digest_hormone_detox',
        sliderValue: 4,
        symptoms: ['ORG_Bloat', 'ORG_IBS', 'ORG_AbdominalPain'],
        description: 'Common digestive issues with IBS'
      },
      {
        name: 'Joint Functional Issues',
        area: 'articular_joint',
        sliderValue: 6,
        symptoms: ['ART_LimitsADL', 'ART_ExercisePain', 'ART_StairPain'],
        description: 'Joint pain limiting daily activities'
      },
      {
        name: 'Circulation Concerns',
        area: 'circulation',
        sliderValue: 4,
        symptoms: ['CIRC_HighBP', 'CIRC_ChestTightness', 'CIRC_Swelling'],
        description: 'Cardiovascular symptoms with high blood pressure'
      },
      {
        name: 'Edge Case: No Symptoms',
        area: 'musculoskeletal',
        sliderValue: 8,
        symptoms: [],
        description: 'High slider value with no specific symptoms'
      },
      {
        name: 'Edge Case: Many Low-Impact Symptoms',
        area: 'energy',
        sliderValue: 1,
        symptoms: ['ENE_Anxiety', 'ENE_MoodSwings', 'ENE_StressManage', 'ENE_Disconnect'],
        description: 'Multiple low-impact symptoms with low slider'
      }
    ];

    const results = testCases.map(testCase => {
      const result = calculateWeightedSymptomScore(
        testCase.sliderValue,
        testCase.symptoms,
        testCase.area
      );
      
      const severityInfo = getSeverityInfo(result.totalScore);
      const areaConfig = getAreaConfig(testCase.area);
      
      return {
        ...testCase,
        result,
        severityInfo,
        areaConfig
      };
    });

    setTestResults(results);
  };

  if (!systemStats) {
    return <div className="p-8">Loading test results...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-secondary-900">
        🧪 Weighted Symptom Scoring System Test
      </h1>

      {/* System Overview */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-secondary-900">📊 System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{systemStats.totalAreas}</div>
            <div className="text-sm text-blue-700">Health Areas</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{systemStats.totalSymptoms}</div>
            <div className="text-sm text-green-700">Total Symptoms</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{systemStats.averageSymptomsPerArea}</div>
            <div className="text-sm text-purple-700">Avg per Area</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-orange-700">Weight Levels</div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2 text-secondary-900">Weight Distribution:</h3>
          <div className="flex gap-4 text-sm">
            <span className="bg-green-100 px-3 py-1 rounded">
              Low (1.0): {systemStats.weightDistribution.low} symptoms
            </span>
            <span className="bg-yellow-100 px-3 py-1 rounded">
              Medium (1.5): {systemStats.weightDistribution.medium} symptoms
            </span>
            <span className="bg-red-100 px-3 py-1 rounded">
              High (2.0+): {systemStats.weightDistribution.high} symptoms
            </span>
          </div>
        </div>
      </div>

      {/* Health Area Details */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-secondary-900">🏥 Health Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(SYMPTOM_WEIGHTS).map(([area, config]) => {
            const lowCount = config.symptoms.filter(s => s.category === 'low').length;
            const mediumCount = config.symptoms.filter(s => s.category === 'medium').length;
            const highCount = config.symptoms.filter(s => s.category === 'high').length;
            
            return (
              <div key={area} className="border rounded-lg p-4">
                <h3 className="font-medium text-secondary-900 mb-2">{config.areaLabel}</h3>
                <div className="text-sm text-secondary-600 space-y-1">
                  <div>Total: {config.symptoms.length} symptoms</div>
                  <div>Multiplier: {config.baseMultiplier}x</div>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-green-100 px-2 py-1 rounded">L: {lowCount}</span>
                    <span className="bg-yellow-100 px-2 py-1 rounded">M: {mediumCount}</span>
                    <span className="bg-red-100 px-2 py-1 rounded">H: {highCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-secondary-900">🎯 Test Results</h2>
        
        {testResults.map((test, index) => (
          <div key={index} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-secondary-900">{test.name}</h3>
                <p className="text-sm text-secondary-600">{test.description}</p>
                <p className="text-sm text-secondary-500">
                  Area: {test.areaConfig?.areaLabel} | Slider: {test.sliderValue}/10
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${test.severityInfo.bg} ${test.severityInfo.color}`}>
                {test.severityInfo.tier}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score Breakdown */}
              <div>
                <h4 className="font-medium mb-3 text-secondary-900">Score Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Score (slider):</span>
                    <span className="font-medium">{test.result.baseScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Symptom Penalty:</span>
                    <span className="font-medium">{test.result.symptomPenalty.toFixed(1)}</span>
                  </div>
                  {test.result.combinationPenalty > 0 && (
                    <div className="flex justify-between">
                      <span>Combination Penalty:</span>
                      <span className="font-medium">{test.result.combinationPenalty.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total Score:</span>
                    <span className="font-bold text-lg">{test.result.totalScore}/10</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-secondary-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${test.severityInfo.color.replace('text-', 'bg-')}`}
                      style={{ width: `${(test.result.totalScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="font-medium mb-3 text-secondary-900">Selected Symptoms</h4>
                {test.symptoms.length > 0 ? (
                  <div className="space-y-2">
                    {test.result.breakdown.weightedSymptoms.map((symptom, idx) => {
                      const weightColor = symptom.weight >= 2.0 ? 'text-red-600' : symptom.weight >= 1.5 ? 'text-orange-600' : 'text-green-600';
                      return (
                        <div key={idx} className="flex justify-between items-center bg-secondary-50 rounded px-3 py-2">
                          <span className="text-sm">{symptom.label}</span>
                          <span className={`text-sm font-medium ${weightColor}`}>
                            {symptom.weight.toFixed(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm italic text-secondary-400">No symptoms selected</p>
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-secondary-50 rounded">
              <p className="text-sm text-secondary-700">
                <strong>Clinical Impact:</strong> {test.severityInfo.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => window.location.href = '/intake'}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Test Live Intake Form →
        </button>
      </div>
    </div>
  );
} 