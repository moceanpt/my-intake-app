import React from 'react';
import { calculateWeightedSymptomScore, getSymptomByCode } from '@/lib/symptomScoring';
import { mapChipCodes } from '@/lib/chipMapping';

export default function DebugSymptoms() {
  // Test with some sample symptom chips like what's in the database
  const testSymptomChips = {
    musculoskeletal: ['muscle_symptoms_0', 'muscle_symptoms_1', 'muscle_symptoms_2'],
    organ_digest_hormone_detox: ['organ_symptoms_0', 'organ_symptoms_1', 'organ_symptoms_2', 'organ_symptoms_3'],
    circulation: [],
    energy: [],
    articular_joint: [],
    nervous_system: []
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Symptoms & Color Coding</h1>
      
      {Object.entries(testSymptomChips).map(([key, rawChips]) => {
        if (rawChips.length === 0) return null;
        
        const mappedChips = mapChipCodes(rawChips);
        const symptomAnalysis = calculateWeightedSymptomScore(0, mappedChips, key);
        
        return (
          <div key={key} className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4 capitalize">{key.replace(/_/g, ' ')}</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Raw Chips from Database:</h3>
                <pre className="text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(rawChips, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Mapped Chips:</h3>
                <pre className="text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(mappedChips, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Symptom Analysis:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {JSON.stringify(symptomAnalysis, null, 2)}
              </pre>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Rendered Symptoms with Colors:</h3>
              <div className="space-y-2">
                {mappedChips.map(symptomCode => {
                  const symptom = symptomAnalysis.breakdown.weightedSymptoms.find(s => s.code === symptomCode);
                  const weight = symptom?.weight || 1.0;
                  const impactConfig = weight >= 2.0 
                    ? { label: 'High Impact', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' }
                    : weight >= 1.5 
                    ? { label: 'Medium Impact', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' }
                    : { label: 'Low Impact', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500' };
                  
                  const foundSymptom = getSymptomByCode(symptomCode);
                  
                  return (
                    <div key={symptomCode} className={`${impactConfig.bg} ${impactConfig.border} border rounded-lg p-3`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-secondary-900 mb-1">
                            {symptom?.label || foundSymptom?.description || symptomCode}
                          </div>
                          <div className="text-xs text-gray-500">
                            Code: {symptomCode} | Weight: {weight} | Found in analysis: {symptom ? 'Yes' : 'No'}
                          </div>
                        </div>
                        <div className="flex items-center shrink-0 ml-3">
                          <span className={`w-4 h-4 rounded-full ${impactConfig.dot} shadow-sm`}></span>
                        </div>
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
  );
}
