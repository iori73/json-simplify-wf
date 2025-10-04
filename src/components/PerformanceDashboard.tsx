'use client'

import React, { useState, useEffect } from 'react'
import { Activity, Clock, MemoryStick, Gauge, Eye, X, ChevronDown, ChevronUp } from 'lucide-react'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

interface PerformanceDashboardProps {
  isVisible: boolean
  onToggle: () => void
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
}

export default function PerformanceDashboard({ isVisible, onToggle, language }: PerformanceDashboardProps) {
  const { metrics, getPerformanceSummary } = usePerformanceMonitor()
  const [isExpanded, setIsExpanded] = useState(false)

  const labels = {
    en: {
      title: 'Performance Monitor',
      toggle: 'Toggle Performance Monitor',
      overall: 'Overall Status',
      processing: 'JSON Processing',
      memory: 'Memory Usage',
      rendering: 'Rendering',
      response: 'Response Time',
      webVitals: 'Core Web Vitals',
      lastOperation: 'Last Operation',
      operations: 'operations',
      score: 'Performance Score',
      status: {
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor'
      },
      metrics: {
        lcp: 'Largest Contentful Paint',
        fid: 'First Input Delay',
        cls: 'Cumulative Layout Shift',
        time: 'Time',
        size: 'Size',
        count: 'Count'
      }
    },
    jp: {
      title: 'パフォーマンス監視',
      toggle: 'パフォーマンス監視を切り替え',
      overall: '全体ステータス',
      processing: 'JSON処理',
      memory: 'メモリ使用量',
      rendering: 'レンダリング',
      response: '応答時間',
      webVitals: 'Core Web Vitals',
      lastOperation: '最新操作',
      operations: '回',
      score: 'パフォーマンススコア',
      status: {
        good: '良好',
        fair: '普通',
        poor: '改善要'
      },
      metrics: {
        lcp: '最大コンテンツ描画',
        fid: '初回入力遅延',
        cls: '累積レイアウトシフト',
        time: '時間',
        size: 'サイズ',
        count: '回数'
      }
    },
    es: {
      title: 'Monitor de Rendimiento',
      toggle: 'Alternar Monitor de Rendimiento',
      overall: 'Estado General',
      processing: 'Procesamiento JSON',
      memory: 'Uso de Memoria',
      rendering: 'Renderizado',
      response: 'Tiempo de Respuesta',
      webVitals: 'Core Web Vitals',
      lastOperation: 'Última Operación',
      operations: 'operaciones',
      score: 'Puntuación de Rendimiento',
      status: {
        good: 'Bueno',
        fair: 'Regular',
        poor: 'Pobre'
      },
      metrics: {
        lcp: 'Pintura de Contenido Mayor',
        fid: 'Retraso Primera Entrada',
        cls: 'Cambio Layout Acumulativo',
        time: 'Tiempo',
        size: 'Tamaño',
        count: 'Cantidad'
      }
    },
    fr: {
      title: 'Moniteur de Performance',
      toggle: 'Basculer Moniteur de Performance',
      overall: 'Statut Général',
      processing: 'Traitement JSON',
      memory: 'Utilisation Mémoire',
      rendering: 'Rendu',
      response: 'Temps de Réponse',
      webVitals: 'Core Web Vitals',
      lastOperation: 'Dernière Opération',
      operations: 'opérations',
      score: 'Score de Performance',
      status: {
        good: 'Bon',
        fair: 'Correct',
        poor: 'Mauvais'
      },
      metrics: {
        lcp: 'Plus Grande Peinture Contenu',
        fid: 'Délai Première Entrée',
        cls: 'Décalage Layout Cumulé',
        time: 'Temps',
        size: 'Taille',
        count: 'Nombre'
      }
    },
    de: {
      title: 'Leistungsmonitor',
      toggle: 'Leistungsmonitor umschalten',
      overall: 'Gesamtstatus',
      processing: 'JSON-Verarbeitung',
      memory: 'Speicherverbrauch',
      rendering: 'Rendering',
      response: 'Antwortzeit',
      webVitals: 'Core Web Vitals',
      lastOperation: 'Letzte Operation',
      operations: 'Operationen',
      score: 'Leistungsbewertung',
      status: {
        good: 'Gut',
        fair: 'Mittelmäßig',
        poor: 'Schlecht'
      },
      metrics: {
        lcp: 'Größte Inhaltsdarstellung',
        fid: 'Erste Eingabeverzögerung',
        cls: 'Kumulative Layout-Verschiebung',
        time: 'Zeit',
        size: 'Größe',
        count: 'Anzahl'
      }
    },
    zh: {
      title: '性能监控',
      toggle: '切换性能监控',
      overall: '整体状态',
      processing: 'JSON处理',
      memory: '内存使用',
      rendering: '渲染',
      response: '响应时间',
      webVitals: '核心网页指标',
      lastOperation: '最近操作',
      operations: '次操作',
      score: '性能评分',
      status: {
        good: '良好',
        fair: '一般',
        poor: '较差'
      },
      metrics: {
        lcp: '最大内容绘制',
        fid: '首次输入延迟',
        cls: '累积布局偏移',
        time: '时间',
        size: '大小',
        count: '次数'
      }
    },
    ko: {
      title: '성능 모니터',
      toggle: '성능 모니터 토글',
      overall: '전체 상태',
      processing: 'JSON 처리',
      memory: '메모리 사용량',
      rendering: '렌더링',
      response: '응답 시간',
      webVitals: 'Core Web Vitals',
      lastOperation: '마지막 작업',
      operations: '작업',
      score: '성능 점수',
      status: {
        good: '양호',
        fair: '보통',
        poor: '나쁨'
      },
      metrics: {
        lcp: '최대 콘텐츠 페인트',
        fid: '첫 입력 지연',
        cls: '누적 레이아웃 시프트',
        time: '시간',
        size: '크기',
        count: '개수'
      }
    },
    pt: {
      title: 'Monitor de Performance',
      toggle: 'Alternar Monitor de Performance',
      overall: 'Status Geral',
      processing: 'Processamento JSON',
      memory: 'Uso de Memória',
      rendering: 'Renderização',
      response: 'Tempo de Resposta',
      webVitals: 'Core Web Vitals',
      lastOperation: 'Última Operação',
      operations: 'operações',
      score: 'Pontuação de Performance',
      status: {
        good: 'Bom',
        fair: 'Regular',
        poor: 'Ruim'
      },
      metrics: {
        lcp: 'Maior Pintura de Conteúdo',
        fid: 'Atraso Primeira Entrada',
        cls: 'Mudança Layout Cumulativa',
        time: 'Tempo',
        size: 'Tamanho',
        count: 'Contagem'
      }
    }
  }

  const t = labels[language]
  const summary = getPerformanceSummary()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400'
      case 'fair': return 'text-yellow-600 dark:text-yellow-400'
      case 'poor': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const formatTime = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`
    return `${ms.toFixed(1)}ms`
  }

  const formatMemory = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)}GB`
    return `${mb.toFixed(1)}MB`
  }

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        title={t.toggle}
      >
        <Activity className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg w-80 max-h-96 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4" />
          <span className="font-medium text-sm">{t.title}</span>
          <div className={`text-xs px-2 py-1 rounded ${getScoreColor(summary.overall.score)} bg-current/10`}>
            {summary.overall.score}/100
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-accent rounded"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-accent rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 max-h-80 overflow-y-auto">
        {/* Overall Status */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.overall}</span>
            <span className={`text-sm ${getStatusColor(summary.overall.status)}`}>
              {t.status[summary.overall.status as keyof typeof t.status]}
            </span>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-muted/50 rounded p-2">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{t.processing}</span>
            </div>
            <div className="text-sm font-mono">{formatTime(metrics.jsonProcessingTime)}</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="flex items-center space-x-1">
              <MemoryStick className="h-3 w-3" />
              <span className="text-xs">{t.memory}</span>
            </div>
            <div className="text-sm font-mono">{formatMemory(metrics.memoryUsage)}</div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-3">
            {/* Last Operation */}
            {metrics.operationMetrics.lastOperation && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">{t.lastOperation}</div>
                <div className="text-sm">
                  <span className="font-mono">{metrics.operationMetrics.lastOperation}</span>
                  <span className="text-muted-foreground ml-1">
                    ({formatTime(metrics.operationMetrics.operationTime)})
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {metrics.operationMetrics.operationCount} {t.operations}
                </div>
              </div>
            )}

            {/* Rendering Performance */}
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t.rendering}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">{formatTime(metrics.renderingTime)}</span>
                <span className={`text-xs ${getStatusColor(summary.rendering.status)}`}>
                  {t.status[summary.rendering.status as keyof typeof t.status]}
                </span>
              </div>
            </div>

            {/* Core Web Vitals */}
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t.webVitals}</div>
              <div className="space-y-1">
                {metrics.coreWebVitals.lcp && (
                  <div className="flex justify-between text-xs">
                    <span>{t.metrics.lcp}</span>
                    <span className="font-mono">{formatTime(metrics.coreWebVitals.lcp)}</span>
                  </div>
                )}
                {metrics.coreWebVitals.fid && (
                  <div className="flex justify-between text-xs">
                    <span>{t.metrics.fid}</span>
                    <span className="font-mono">{formatTime(metrics.coreWebVitals.fid)}</span>
                  </div>
                )}
                {metrics.coreWebVitals.cls && (
                  <div className="flex justify-between text-xs">
                    <span>{t.metrics.cls}</span>
                    <span className="font-mono">{metrics.coreWebVitals.cls.toFixed(3)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}