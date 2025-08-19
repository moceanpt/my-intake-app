// Performance monitoring system for tracking Core Web Vitals and custom metrics

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  customMetrics: Record<string, number>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    customMetrics: {}
  };

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initCoreWebVitals();
    }
  }

  private initCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          this.metrics.lcp = lastEntry.startTime;
          this.logMetric('LCP', this.metrics.lcp);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not supported:', e);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstInputEntry = entries[0] as PerformanceEventTiming;
          this.metrics.fid = firstInputEntry.processingStart - firstInputEntry.startTime;
          this.logMetric('FID', this.metrics.fid);
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID monitoring not supported:', e);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.logMetric('CLS', this.metrics.cls);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS monitoring not supported:', e);
      }
    }

    // Time to First Byte (TTFB)
    if ('navigation' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        this.logMetric('TTFB', this.metrics.ttfb);
      }
    }
  }

  // Track custom metrics
  trackCustomMetric(name: string, value: number) {
    this.metrics.customMetrics[name] = value;
    this.logMetric(name, value);
  }

  // Track component render time
  trackComponentRender(componentName: string, renderTime: number) {
    this.trackCustomMetric(`${componentName}_render_time`, renderTime);
  }

  // Track API response time
  trackApiResponse(endpoint: string, responseTime: number) {
    this.trackCustomMetric(`${endpoint}_response_time`, responseTime);
  }

  // Track health system load time
  trackHealthSystemLoad(systemName: string, loadTime: number) {
    this.trackCustomMetric(`${systemName}_load_time`, loadTime);
  }

  private logMetric(name: string, value: number) {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric - ${name}:`, value);
    }
    
    // In production, you would send this to your analytics service
    // this.sendToAnalytics(name, value);
  }

  // Get all metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get specific metric
  getMetric(name: string): number | undefined {
    if (name in this.metrics) {
      return this.metrics[name as keyof PerformanceMetrics] as number;
    }
    return this.metrics.customMetrics[name];
  }

  // Reset metrics
  reset() {
    this.metrics = {
      customMetrics: {}
    };
  }
}

// React hook for performance tracking
export const usePerformanceTracking = () => {
  const monitor = new PerformanceMonitor();

  const trackComponentRender = (componentName: string) => {
    if (typeof window === 'undefined') return () => {};
    
    const startTime = performance.now();
    return () => {
      const renderTime = performance.now() - startTime;
      monitor.trackComponentRender(componentName, renderTime);
    };
  };

  const trackApiCall = async (endpoint: string, apiCall: () => Promise<any>) => {
    if (typeof window === 'undefined') return apiCall();
    
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const responseTime = performance.now() - startTime;
      monitor.trackApiResponse(endpoint, responseTime);
      return result;
    } catch (error) {
      const responseTime = performance.now() - startTime;
      monitor.trackApiResponse(`${endpoint}_error`, responseTime);
      throw error;
    }
  };

  return {
    monitor,
    trackComponentRender,
    trackApiCall,
    trackCustomMetric: monitor.trackCustomMetric.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor)
  };
};

// Global performance monitor instance
export const globalPerformanceMonitor = new PerformanceMonitor();

export default PerformanceMonitor; 