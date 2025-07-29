// Performance Monitoring System
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor() {
    this.initializeCoreWebVitals();
  }

  private initializeCoreWebVitals() {
    if (typeof window !== 'undefined') {
      // Track LCP
      this.observeLCP();
      
      // Track FID
      this.observeFID();
      
      // Track CLS
      this.observeCLS();
      
      // Track TTFB
      this.observeTTFB();
    }
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        
        this.recordMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          unit: 'ms',
          timestamp: new Date(),
          metadata: { element: lastEntry.name }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const firstInputEntry = entry as PerformanceEventTiming;
          this.recordMetric({
            name: 'FID',
            value: firstInputEntry.processingStart - firstInputEntry.startTime,
            unit: 'ms',
            timestamp: new Date(),
            metadata: { element: firstInputEntry.name }
          });
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', observer);
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.recordMetric({
          name: 'CLS',
          value: clsValue,
          unit: 'score',
          timestamp: new Date()
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', observer);
    }
  }

  private observeTTFB() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'TTFB',
            value: entry.responseStart - entry.requestStart,
            unit: 'ms',
            timestamp: new Date(),
            metadata: { url: entry.name }
          });
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observers.set('ttfb', observer);
    }
  }

  // Custom metric tracking
  public trackHealthSystemLoad(system: string, loadTime: number) {
    this.recordMetric({
      name: `HealthSystem_${system}_LoadTime`,
      value: loadTime,
      unit: 'ms',
      timestamp: new Date(),
      metadata: { system }
    });
  }

  public trackComponentRender(component: string, renderTime: number) {
    this.recordMetric({
      name: `Component_${component}_RenderTime`,
      value: renderTime,
      unit: 'ms',
      timestamp: new Date(),
      metadata: { component }
    });
  }

  public trackUserInteraction(action: string, duration: number) {
    this.recordMetric({
      name: `UserInteraction_${action}`,
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
      metadata: { action }
    });
  }

  public trackApiCall(endpoint: string, duration: number, status: number) {
    this.recordMetric({
      name: `API_${endpoint}`,
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
      metadata: { endpoint, status }
    });
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metric:', metric);
    }

    // In production, you would send this to your analytics service
    // this.sendToAnalytics(metric);
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getCoreWebVitals(): CoreWebVitals | null {
    const lcp = this.metrics.find(m => m.name === 'LCP')?.value || 0;
    const fid = this.metrics.find(m => m.name === 'FID')?.value || 0;
    const cls = this.metrics.find(m => m.name === 'CLS')?.value || 0;
    const ttfb = this.metrics.find(m => m.name === 'TTFB')?.value || 0;

    return { lcp, fid, cls, ttfb };
  }

  public clearMetrics() {
    this.metrics = [];
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React Hook for performance tracking
export const usePerformanceTracking = () => {
  const trackHealthSystemLoad = (system: string, loadTime: number) => {
    performanceMonitor.trackHealthSystemLoad(system, loadTime);
  };

  const trackComponentRender = (component: string, renderTime: number) => {
    performanceMonitor.trackComponentRender(component, renderTime);
  };

  const trackUserInteraction = (action: string, duration: number) => {
    performanceMonitor.trackUserInteraction(action, duration);
  };

  return {
    trackHealthSystemLoad,
    trackComponentRender,
    trackUserInteraction,
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getCoreWebVitals: performanceMonitor.getCoreWebVitals.bind(performanceMonitor)
  };
}; 