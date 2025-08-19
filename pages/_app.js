// pages/_app.js
// ------------------------------
// 1. Imports your global CSS (Tailwind or plain CSS)
// 2. Provides the standard Next.js <Component … /> wrapper
// 3. Optional <Head> block gives all pages a shared meta title
// ------------------------------

import '@/styles/globals.css';
import '@/styles/design-system.css';
import { useEffect } from 'react';
import GlobalErrorBoundary from '@/components/ui/GlobalErrorBoundary';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Only initialize performance monitoring on client side
    if (typeof window !== 'undefined') {
      const { globalPerformanceMonitor } = require('@/lib/performance/monitor');
      
      // Initialize performance monitoring
      console.log('🚀 Performance monitoring initialized');
      
      // Track page load time
      const pageLoadTime = performance.now();
      globalPerformanceMonitor.trackCustomMetric('page_load_time', pageLoadTime);
      
      // Track initial render
      globalPerformanceMonitor.trackComponentRender('App', pageLoadTime);
    }
  }, []);

  return (
    <GlobalErrorBoundary>
      <Component {...pageProps} />
    </GlobalErrorBoundary>
  );
}