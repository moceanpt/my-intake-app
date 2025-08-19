import React from 'react';
import { InBodyResultSection } from '@/components/objective/InBodyResultSection';
import { MusculoskeletalResultSection } from '@/components/objective/MusculoskeletalResultSection';
import { AuraComResultSection } from '@/components/objective/AuraComResultSection';
import CirculationResultSection from '@/components/objective/CirculationResultSection';
import NervousSystemResultSection from '@/components/objective/NervousSystemResultSection';
import ArticularJointResultSection from '@/components/objective/ArticularJointResultSection';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import SuspenseWrapper from '@/components/ui/SuspenseWrapper';
import Link from 'next/link';

// Import demo data from separate file
import {
  exbodyData,
  exbodyHistory,
  inbodyData,
  inbodyHistory,
  auracomData,
  auracomHistory,
  circulationData,
  circulationHistory,
  nervousData,
  nervousHistory,
  romData,
  romHistory
} from '@/data/demoData';

export default function ResultDemo() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      {/* Navigation */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
          Health Assessment Results
        </h1>
        <Link 
          href="/history-tracking"
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
          onClick={() => console.log('History tracking link clicked')}
        >
          📊 View History & Trends
        </Link>
      </div>

      <ErrorBoundary>
        <SuspenseWrapper loadingText="Loading musculoskeletal data...">
          <MusculoskeletalResultSection data={exbodyData} history={exbodyHistory} />
        </SuspenseWrapper>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <SuspenseWrapper loadingText="Loading organ system data...">
          <InBodyResultSection data={inbodyData} history={inbodyHistory} sex="M" age={35} />
        </SuspenseWrapper>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <SuspenseWrapper loadingText="Loading circulation data...">
          <CirculationResultSection data={circulationData} history={circulationHistory} />
        </SuspenseWrapper>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <SuspenseWrapper loadingText="Loading energy system data...">
          <AuraComResultSection data={auracomData} history={auracomHistory} />
        </SuspenseWrapper>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <SuspenseWrapper loadingText="Loading joint system data...">
          <ArticularJointResultSection data={romData} history={romHistory} />
        </SuspenseWrapper>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <SuspenseWrapper loadingText="Loading nervous system data...">
          <NervousSystemResultSection data={nervousData} history={nervousHistory} />
        </SuspenseWrapper>
      </ErrorBoundary>
    </div>
  );
}