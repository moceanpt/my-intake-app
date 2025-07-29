import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function DesignDemo() {
  const [activeConcept, setActiveConcept] = useState('modern-medical');

  const concepts = [
    {
      id: 'modern-medical',
      name: 'Modern Medical',
      description: 'Clean, professional, trust-building design with blue color palette',
      features: ['Clinical precision', 'Professional credibility', 'Easy to scan', 'Mobile-first']
    },
    {
      id: 'wellness',
      name: 'Wellness',
      description: 'Earthy, organic design with green tones and rounded elements',
      features: ['Holistic approach', 'Warm & inviting', 'Nature-inspired', 'Comfortable UX']
    },
    {
      id: 'luxury-wellness',
      name: 'Luxury Wellness',
      description: 'Sophisticated, premium design with purple accents and refined typography',
      features: ['Premium feel', 'Exclusive experience', 'Sophisticated UI', 'High-end positioning']
    }
  ];

  return (
    <>
      <Head>
        <title>MOCEAN Design Concepts</title>
        <meta name="description" content="Choose your preferred design concept for MOCEAN" />
        <link rel="stylesheet" href="/design-concepts.css" />
      </Head>

      <div className={`design-concept design-${activeConcept}`}>
        <div className="container py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1>MOCEAN Design Concepts</h1>
            <p className="text-lg">Choose the design direction that best represents your vision</p>
          </div>

          {/* Concept Selector */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {concepts.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setActiveConcept(concept.id)}
                className={`card cursor-pointer transition-all ${
                  activeConcept === concept.id 
                    ? 'ring-2 ring-primary-500 transform scale-105' 
                    : 'hover:shadow-lg'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{concept.name}</h3>
                <p className="text-sm mb-4">{concept.description}</p>
                <div className="space-y-1">
                  {concept.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Demo Content */}
          <div className="space-y-8">
            {/* Intake Form Demo */}
            <div className="card">
              <h2>Health Intake Form</h2>
              <p>Multi-step assessment with progress tracking</p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="progress">
                  <div className="progress-bar" style={{ width: '33%' }}></div>
                </div>
                <p className="text-sm mt-2">Step 1 of 3: Goals & Reasons</p>
              </div>

              {/* Form Elements */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">What brings you to MOCEAN?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="chip">Pain relief</button>
                    <button className="chip selected">Better posture</button>
                    <button className="chip">Build strength</button>
                    <button className="chip">Stress relief</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Energy Level</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    defaultValue="7" 
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>Low Energy</span>
                    <span>High Energy</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button className="btn btn-secondary">Back</button>
                  <button className="btn btn-primary">Next →</button>
                </div>
              </div>
            </div>

            {/* Dashboard Demo */}
            <div className="card">
              <h2>Staff Dashboard</h2>
              <p>Client management and health metrics overview</p>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="metric-card">
                  <div className="metric-value">49</div>
                  <div className="metric-label">Total Submissions</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">12</div>
                  <div className="metric-label">Pending Review</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">37</div>
                  <div className="metric-label">Plans Sent</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">28</div>
                  <div className="metric-label">Final Plans</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Risk Level</th>
                      <th className="text-right py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-secondary-100">
                      <td className="py-3 px-4">Sarah Johnson</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-warning-50 text-warning-600">
                          Intake Submitted
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-error-50 text-error-600">
                          High Risk
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="btn btn-primary btn-sm">Review →</button>
                      </td>
                    </tr>
                    <tr className="border-b border-secondary-100">
                      <td className="py-3 px-4">Mike Chen</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success-50 text-success-600">
                          Plan Sent
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-600">
                          Medium Risk
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="btn btn-secondary btn-sm">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Future App Integration Demo */}
            <div className="card">
              <h2>Future Client App Integration</h2>
              <p>Scalable design ready for lifestyle tracking features</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="dashboard-card">
                  <h3 className="text-lg font-semibold mb-3">Exercise Tracking</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Weekly Goal</span>
                      <span>4/5 days</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-card">
                  <h3 className="text-lg font-semibold mb-3">Nutrition</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Water Intake</span>
                      <span>6/8 glasses</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-card">
                  <h3 className="text-lg font-semibold mb-3">Sleep Quality</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Last Night</span>
                      <span>7.5 hrs</span>
                    </div>
                    <div className="text-sm text-secondary-600">
                      Good quality sleep
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12 space-y-4">
            <div className="space-x-4">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  // Apply the selected design concept
                  localStorage.setItem('selectedDesign', activeConcept);
                  alert(`Design concept "${concepts.find(c => c.id === activeConcept)?.name}" selected!`);
                }}
              >
                Choose This Design
              </button>
              <Link href="/intake" className="btn btn-secondary">
                View Live Demo
              </Link>
            </div>
            <p className="text-sm text-secondary-600">
              This design system is optimized for scalability and future client app integration
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 