/**
 * Performance monitoring utilities
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
  }

  // Measure component render time
  measureRender(componentName, renderFn) {
    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();
    
    this.recordMetric(`render_${componentName}`, endTime - startTime);
    return result;
  }

  // Measure API call time
  async measureApiCall(apiName, apiCall) {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const endTime = performance.now();
      this.recordMetric(`api_${apiName}`, endTime - startTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordMetric(`api_${apiName}_error`, endTime - startTime);
      throw error;
    }
  }

  // Record performance metric
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push({
      value,
      timestamp: Date.now()
    });

    // Keep only last 100 measurements
    const measurements = this.metrics.get(name);
    if (measurements.length > 100) {
      measurements.shift();
    }
  }

  // Get performance statistics
  getStats(metricName) {
    const measurements = this.metrics.get(metricName);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const values = measurements.map(m => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      average: avg,
      min,
      max,
      latest: values[values.length - 1]
    };
  }

  // Get all metrics
  getAllStats() {
    const stats = {};
    for (const [name] of this.metrics) {
      stats[name] = this.getStats(name);
    }
    return stats;
  }

  // Monitor Core Web Vitals
  observeWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric('fid', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            this.recordMetric('cls', entry.value);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    }
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  // Log performance summary
  logSummary() {
    console.group('🚀 Performance Summary');
    const stats = this.getAllStats();
    
    Object.entries(stats).forEach(([name, stat]) => {
      if (stat) {
        console.log(`${name}:`, {
          avg: `${stat.average.toFixed(2)}ms`,
          min: `${stat.min.toFixed(2)}ms`,
          max: `${stat.max.toFixed(2)}ms`,
          count: stat.count
        });
      }
    });
    
    console.groupEnd();
  }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();

// Auto-start web vitals monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.observeWebVitals();
}

export default performanceMonitor;
