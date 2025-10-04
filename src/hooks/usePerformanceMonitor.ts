'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface PerformanceMetrics {
  jsonProcessingTime: number
  memoryUsage: number
  renderingTime: number
  responseTime: number
  coreWebVitals: {
    lcp: number | null  // Largest Contentful Paint
    fid: number | null  // First Input Delay
    cls: number | null  // Cumulative Layout Shift
  }
  operationMetrics: {
    lastOperation: string
    operationTime: number
    operationCount: number
  }
}

interface PerformanceEntry extends globalThis.PerformanceEntry {
  processingTime?: number
  value?: number
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    jsonProcessingTime: 0,
    memoryUsage: 0,
    renderingTime: 0,
    responseTime: 0,
    coreWebVitals: {
      lcp: null,
      fid: null,
      cls: null
    },
    operationMetrics: {
      lastOperation: '',
      operationTime: 0,
      operationCount: 0
    }
  })

  const operationCountRef = useRef(0)
  const performanceObserverRef = useRef<PerformanceObserver | null>(null)

  // Memory usage monitoring
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / (1024 * 1024) // Convert to MB
      }))
    }
  }, [])

  // Core Web Vitals monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as PerformanceEntry
          setMetrics(prev => ({
            ...prev,
            coreWebVitals: {
              ...prev.coreWebVitals,
              lcp: lastEntry.startTime
            }
          }))
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: PerformanceEntry) => {
            setMetrics(prev => ({
              ...prev,
              coreWebVitals: {
                ...prev.coreWebVitals,
                fid: entry.processingTime || 0
              }
            }))
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          const entries = list.getEntries()
          entries.forEach((entry: PerformanceEntry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value || 0
            }
          })
          setMetrics(prev => ({
            ...prev,
            coreWebVitals: {
              ...prev.coreWebVitals,
              cls: clsValue
            }
          }))
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        performanceObserverRef.current = lcpObserver
        
        return () => {
          lcpObserver.disconnect()
          fidObserver.disconnect()
          clsObserver.disconnect()
        }
      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }
    }
  }, [])

  // Regular memory monitoring
  useEffect(() => {
    const interval = setInterval(updateMemoryUsage, 1000)
    return () => clearInterval(interval)
  }, [updateMemoryUsage])

  // Measure JSON processing time
  const measureJsonProcessing = useCallback((operation: string, fn: () => void) => {
    const startTime = performance.now()
    
    fn()
    
    const processingTime = performance.now() - startTime
    operationCountRef.current += 1
    
    setMetrics(prev => ({
      ...prev,
      jsonProcessingTime: processingTime,
      operationMetrics: {
        lastOperation: operation,
        operationTime: processingTime,
        operationCount: operationCountRef.current
      }
    }))

    // Log performance warning for slow operations
    if (processingTime > 1000) {
      console.warn(`Slow JSON operation detected: ${operation} took ${processingTime.toFixed(2)}ms`)
    }

    return processingTime
  }, [])

  // Measure async operations
  const measureAsyncOperation = useCallback(async (operation: string, fn: () => Promise<any>) => {
    const startTime = performance.now()
    
    try {
      const result = await fn()
      const processingTime = performance.now() - startTime
      
      operationCountRef.current += 1
      setMetrics(prev => ({
        ...prev,
        jsonProcessingTime: processingTime,
        operationMetrics: {
          lastOperation: operation,
          operationTime: processingTime,
          operationCount: operationCountRef.current
        }
      }))

      if (processingTime > 1000) {
        console.warn(`Slow async operation detected: ${operation} took ${processingTime.toFixed(2)}ms`)
      }

      return result
    } catch (error) {
      console.error(`Operation failed: ${operation}`, error)
      throw error
    }
  }, [])

  // Measure rendering performance
  const measureRenderTime = useCallback((componentName: string) => {
    const startTime = performance.now()
    
    // Use requestAnimationFrame to measure after render
    requestAnimationFrame(() => {
      const renderTime = performance.now() - startTime
      setMetrics(prev => ({
        ...prev,
        renderingTime: renderTime
      }))

      if (renderTime > 16.67) { // More than one frame at 60fps
        console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`)
      }
    })
  }, [])

  // Response time measurement
  const measureResponseTime = useCallback((action: string, fn: () => void) => {
    const startTime = performance.now()
    
    fn()
    
    // Use setTimeout to measure perceived response time
    setTimeout(() => {
      const responseTime = performance.now() - startTime
      setMetrics(prev => ({
        ...prev,
        responseTime: responseTime
      }))

      if (responseTime > 100) { // 100ms is the threshold for perceived instantaneous response
        console.warn(`Slow response detected: ${action} took ${responseTime.toFixed(2)}ms`)
      }
    }, 0)
  }, [])

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    const { jsonProcessingTime, memoryUsage, renderingTime, responseTime, coreWebVitals, operationMetrics } = metrics
    
    return {
      overall: {
        status: getOverallStatus(),
        score: calculatePerformanceScore()
      },
      processing: {
        lastTime: jsonProcessingTime,
        avgTime: operationMetrics.operationTime,
        totalOperations: operationMetrics.operationCount
      },
      memory: {
        current: memoryUsage,
        status: memoryUsage > 100 ? 'warning' : 'good' // 100MB threshold
      },
      rendering: {
        lastTime: renderingTime,
        status: renderingTime > 16.67 ? 'warning' : 'good'
      },
      webVitals: coreWebVitals
    }
  }, [metrics])

  const getOverallStatus = useCallback(() => {
    const { jsonProcessingTime, memoryUsage, renderingTime } = metrics
    
    if (jsonProcessingTime > 2000 || memoryUsage > 200 || renderingTime > 50) {
      return 'poor'
    } else if (jsonProcessingTime > 1000 || memoryUsage > 100 || renderingTime > 16.67) {
      return 'fair'
    }
    return 'good'
  }, [metrics])

  const calculatePerformanceScore = useCallback(() => {
    const { jsonProcessingTime, memoryUsage, renderingTime, coreWebVitals } = metrics
    
    let score = 100
    
    // Processing time penalty (max 30 points)
    if (jsonProcessingTime > 2000) score -= 30
    else if (jsonProcessingTime > 1000) score -= 15
    else if (jsonProcessingTime > 500) score -= 5
    
    // Memory usage penalty (max 25 points)
    if (memoryUsage > 200) score -= 25
    else if (memoryUsage > 100) score -= 10
    else if (memoryUsage > 50) score -= 5
    
    // Render time penalty (max 20 points)
    if (renderingTime > 50) score -= 20
    else if (renderingTime > 16.67) score -= 10
    
    // Core Web Vitals penalty (max 25 points)
    if (coreWebVitals.lcp && coreWebVitals.lcp > 4000) score -= 10
    if (coreWebVitals.fid && coreWebVitals.fid > 300) score -= 10
    if (coreWebVitals.cls && coreWebVitals.cls > 0.25) score -= 5
    
    return Math.max(0, score)
  }, [metrics])

  return {
    metrics,
    measureJsonProcessing,
    measureAsyncOperation,
    measureRenderTime,
    measureResponseTime,
    getPerformanceSummary,
    updateMemoryUsage
  }
}