import React from 'react';

export default function TestColors() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Color Test Page</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tailwind Classes:</h2>
        <div className="flex gap-4">
          <span className="w-6 h-6 bg-yellow-500 rounded-full"></span>
          <span className="w-6 h-6 bg-orange-500 rounded-full"></span>
          <span className="w-6 h-6 bg-red-500 rounded-full"></span>
        </div>
        
        <h2 className="text-lg font-semibold">Inline Styles:</h2>
        <div className="flex gap-4">
          <span 
            className="w-6 h-6 rounded-full inline-block" 
            style={{ backgroundColor: '#eab308' }}
          ></span>
          <span 
            className="w-6 h-6 rounded-full inline-block" 
            style={{ backgroundColor: '#f97316' }}
          ></span>
          <span 
            className="w-6 h-6 rounded-full inline-block" 
            style={{ backgroundColor: '#ef4444' }}
          ></span>
        </div>
        
        <h2 className="text-lg font-semibold">CSS Background (Alternative):</h2>
        <div className="flex gap-4">
          <div 
            className="w-6 h-6 rounded-full"
            style={{ background: 'yellow' }}
          ></div>
          <div 
            className="w-6 h-6 rounded-full"
            style={{ background: 'orange' }}
          ></div>
          <div 
            className="w-6 h-6 rounded-full"
            style={{ background: 'red' }}
          ></div>
        </div>
        
        <h2 className="text-lg font-semibold">Border Test (should be visible even without background):</h2>
        <div className="flex gap-4">
          <span className="w-6 h-6 rounded-full border-4 border-yellow-500 inline-block"></span>
          <span className="w-6 h-6 rounded-full border-4 border-orange-500 inline-block"></span>
          <span className="w-6 h-6 rounded-full border-4 border-red-500 inline-block"></span>
        </div>
      </div>
    </div>
  );
}
