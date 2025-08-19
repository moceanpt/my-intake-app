import React from 'react';
import { buildSubjectiveRadar, calculateSymptomComplexity } from '../lib/score';

export default function TestSeparatedScoring() {
  // Sample data showing the old problem and new solution
  const testCase = {
    name: "Patient with moderate symptoms",
    sliders: {
      musculoskeletal: { main: 5 },        // Patient feels 5/10 severity
      energy: { main: 7 },                 // Patient feels 7/10 severity  
      nervous_system: { main: 3 },         // Patient feels 3/10 severity
      circulation: { main: 6 },            // Patient feels 6/10 severity
      organ_digest_hormone_detox: { main: 4 }, // Patient feels 4/10 severity
      articular_joint: { main: 8 },        // Patient feels 8/10 severity
    },
    symptoms: {
      musculoskeletal: ['muscle_symptoms_1', 'muscle_symptoms_6'], // Low back + weakness
      energy: ['energy_symptoms_2', 'energy_symptoms_17'],         // Sleep trouble + fatigue
      nervous_system: ['nervous_symptoms_2'],                      // Brain fog
      circulation: ['circulation_symptoms_0', 'circulation_symptoms_4'], // Raynaud's + swelling
      organ_digest_hormone_detox: ['organ_symptoms_3'],            // Food sensitivities
      articular_joint: [],                                         // No specific symptoms
    }
  };

  // Calculate new separated scores
  const clinicalSeverity = buildSubjectiveRadar(testCase.symptoms, testCase.sliders);
  const symptomComplexity = calculateSymptomComplexity(testCase.symptoms);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-secondary-900">
        🎯 Separated Scoring System Test
      </h1>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <h2 className="font-semibold text-green-900 mb-2">✅ Problem Solved:</h2>
        <p className="text-green-800 text-sm">
          <strong>Old System:</strong> Combined slider + symptoms = artificially inflated scores<br />
          <strong>New System:</strong> Slider-based clinical severity + separate symptom analysis for treatment planning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clinical Severity (Slider-Based) */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            🏥 Clinical Severity Assessment
          </h2>
          <p className="text-sm text-secondary-600 mb-4">
            Based on patient's self-reported impact on daily life
          </p>
          
          {Object.entries(testCase.sliders).map(([area, slider]) => {
            const healthScore = clinicalSeverity[area];
            const severityLevel = slider.main;
            const color = severityLevel >= 7 ? 'red' : severityLevel >= 4 ? 'yellow' : 'green';
            
            return (
              <div key={area} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">
                    {area.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm">
                    {severityLevel}/10 severity → {healthScore}/10 health
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full bg-${color}-500`}
                    style={{ width: `${(severityLevel / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-secondary-500 mt-1">
                  Patient-reported impact level
                </div>
              </div>
            );
          })}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Clinical Use:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Triage priority</li>
              <li>• Provider assessment</li>
              <li>• Progress monitoring</li>
              <li>• Insurance justification</li>
            </ul>
          </div>
        </div>

        {/* Treatment Planning (Symptom-Based) */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            🎯 Treatment Planning Analysis
          </h2>
          <p className="text-sm text-secondary-600 mb-4">
            Based on specific symptoms and their clinical significance
          </p>
          
          {Object.entries(symptomComplexity).map(([area, analysis]) => {
            const hasSymptoms = analysis.symptoms.length > 0;
            
            return (
              <div key={area} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">
                    {area.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm">
                    Complexity: {analysis.score.toFixed(1)}/10
                  </span>
                </div>
                
                {hasSymptoms ? (
                  <div className="space-y-1">
                    {analysis.symptoms.map((symptom, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-secondary-50 rounded px-2 py-1">
                        <span className="text-xs text-secondary-700">
                          {symptom.label}
                        </span>
                        <span className={`text-xs font-medium ${
                          symptom.priority === 'High Priority' ? 'text-red-600' :
                          symptom.priority === 'Medium Priority' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {symptom.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-secondary-400 italic">
                    No specific treatment targets
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Treatment Use:</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Optimization selection</li>
              <li>• Service recommendations</li>
              <li>• Treatment protocols</li>
              <li>• Progress tracking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mt-8 bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-secondary-900">📊 Before vs After Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium text-red-900 mb-2">❌ Old System Problem</h3>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Combined scores always worse</li>
              <li>• Artificially inflated severity</li>
              <li>• Poor clinical correlation</li>
              <li>• Single metric confusion</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">✅ New Clinical Severity</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Patient-reported impact</li>
              <li>• True severity assessment</li>
              <li>• Triage-appropriate</li>
              <li>• Clean, interpretable</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">🎯 New Treatment Analysis</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Specific symptom targets</li>
              <li>• Treatment complexity</li>
              <li>• Optimization guidance</li>
              <li>• Progress monitoring</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example Clinical Workflow */}
      <div className="mt-8 bg-secondary-50 border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-secondary-900">🏥 Clinical Workflow Example</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h3 className="font-medium text-secondary-900">Triage Assessment</h3>
              <p className="text-sm text-secondary-600">Provider sees slider-based clinical severity for immediate prioritization</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h3 className="font-medium text-secondary-900">Treatment Planning</h3>
              <p className="text-sm text-secondary-600">System analyzes symptom complexity to recommend optimizations and services</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h3 className="font-medium text-secondary-900">Plan Generation</h3>
              <p className="text-sm text-secondary-600">Symptom-specific targets drive personalized care recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-4 justify-center">
        <a 
          href="/staff/review/717fc431-e6ae-4bb5-8eb3-fc6680b9cad9" 
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          View Updated Review Page →
        </a>
        <a 
          href="/test-integration" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Integration →
        </a>
      </div>
    </div>
  );
} 