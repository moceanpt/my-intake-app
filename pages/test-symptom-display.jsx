import React from 'react';
import { mapChipCodes } from '../lib/chipMapping';
import { calculateWeightedSymptomScore, getSymptomByCode } from '../lib/symptomScoring';
import { chipToLabel } from '../lib/chipUtils';

export default function TestSymptomDisplay() {
  // Sample data similar to what comes from the database
  const sampleSymptomChips = {
    musculoskeletal: ['msk_0', 'msk_6', 'msk_12'], // neck tension, weakness, strength loss
    energy: ['ene_2', 'ene_17', 'ene_18'], // sleep trouble, fatigue, CFS
    nervous_system: ['nerv_2', 'nerv_12'], // brain fog, nerve pain
    circulation: ['circ_0', 'circ_4'], // Raynaud's, swelling
    organ_digest_hormone_detox: ['org_0', 'org_12'], // bloating, metabolic syndrome
    articular_joint: ['art_0', 'art_13'], // stiff knees/hips, limits daily activities
  };

  const sampleSliderValues = {
    musculoskeletal: { main: 3 },
    energy: { main: 2 },
    nervous_system: { main: 4 },
    circulation: { main: 6 },
    organ_digest_hormone_detox: { main: 5 },
    articular_joint: { main: 3 },
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-secondary-900">
        🧪 Symptom Display Fix Test
      </h1>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <h2 className="font-semibold text-green-900 mb-2">✅ Problem Fixed:</h2>
        <p className="text-green-800 text-sm">
          Before: Staff review showed generic codes like "organ_symptoms_1" instead of actual symptom descriptions.<br />
          After: Staff review now shows human-readable descriptions like "Bloating/Gas" with proper weights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BEFORE - Raw chip codes */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">❌ BEFORE (Broken)</h2>
          <p className="text-sm text-red-700 mb-4">
            Raw chip codes without proper mapping - what providers used to see:
          </p>
          
          {Object.entries(sampleSymptomChips).map(([area, chips]) => (
            <div key={area} className="mb-4 bg-white rounded p-3">
              <h3 className="font-medium capitalize mb-2 text-secondary-900">
                {area.replace(/_/g, ' ')}
              </h3>
              <div className="space-y-1">
                {chips.map(chip => (
                  <div key={chip} className="flex justify-between items-center bg-red-100 rounded px-2 py-1">
                    <span className="text-xs text-red-800 font-mono">{chip}</span>
                    <span className="text-xs text-red-600">❓ Unknown</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AFTER - Mapped with human-readable labels */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4">✅ AFTER (Fixed)</h2>
          <p className="text-sm text-green-700 mb-4">
            Mapped codes with human-readable labels and weights - what providers see now:
          </p>
          
          {Object.entries(sampleSymptomChips).map(([area, rawChips]) => {
            const mappedChips = mapChipCodes(rawChips);
            const sliderValue = sampleSliderValues[area]?.main || 0;
            const scoringResult = calculateWeightedSymptomScore(sliderValue, mappedChips, area);
            
            return (
              <div key={area} className="mb-4 bg-white rounded p-3">
                <h3 className="font-medium capitalize mb-2 text-secondary-900">
                  {area.replace(/_/g, ' ')}
                </h3>
                <div className="space-y-1">
                  {mappedChips.map(symptomCode => {
                    const symptom = scoringResult.breakdown.weightedSymptoms.find(s => s.code === symptomCode);
                    const weight = symptom?.weight || 1.0;
                    const weightColor = weight >= 2.0 ? 'text-red-600' : weight >= 1.5 ? 'text-orange-600' : 'text-green-600';
                    
                    return (
                      <div key={symptomCode} className="flex justify-between items-center bg-green-100 rounded px-2 py-1">
                        <span className="text-xs text-green-800">
                          {symptom?.label || 'Unknown Symptom'}
                        </span>
                        <span className={`text-xs font-medium ${weightColor}`}>
                          {weight.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-secondary-500">
                  Score: {scoringResult.totalScore.toFixed(1)}/10
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed mapping examples */}
      <div className="mt-8 bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-secondary-900">📋 Mapping Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sampleSymptomChips).flatMap(([area, chips]) => 
            chips.map(oldCode => {
              const mappedCodes = mapChipCodes([oldCode]);
              const newCode = mappedCodes[0];
              const symptom = getSymptomByCode(newCode);
              
              return (
                <div key={oldCode} className="bg-secondary-50 rounded p-3">
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium text-red-600">Old:</span>
                      <code className="ml-1 bg-red-100 px-1 rounded">{oldCode}</code>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">New:</span>
                      <code className="ml-1 bg-green-100 px-1 rounded">{newCode}</code>
                    </div>
                    <div>
                      <span className="font-medium text-blue-600">Label:</span>
                      <span className="ml-1">{symptom?.label || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-purple-600">Weight:</span>
                      <span className="ml-1">{symptom?.weight || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">🎯 Fix Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-blue-900 mb-2">What was changed:</h3>
            <ul className="space-y-1 text-blue-800">
              <li>• Added <code>mapChipCodes()</code> import to review page</li>
              <li>• Map raw chip codes before scoring calculation</li>
              <li>• Use mapped codes for symptom display</li>
              <li>• Preserve weighted scoring breakdown data</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Provider benefits:</h3>
            <ul className="space-y-1 text-blue-800">
              <li>• See actual symptom descriptions, not codes</li>
              <li>• Understand symptom severity weights</li>
              <li>• Make better clinical decisions</li>
              <li>• Faster review process</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-4 justify-center">
        <a 
          href="/test-integration" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← View Integration Tests
        </a>
        <a 
          href="/staff/dashboard" 
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Test on Real Data →
        </a>
      </div>
    </div>
  );
} 