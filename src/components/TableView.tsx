'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'
import { ChevronUp, ChevronDown, Download, Search, Filter } from 'lucide-react'

interface TableViewProps {
  data: any
  searchQuery: string
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
  onExport?: (format: 'csv' | 'json') => void
}

interface TableRow {
  [key: string]: any
}

interface ColumnConfig {
  key: string
  label: string
  width: number
  sortable: boolean
}

// Flatten nested JSON into table rows
function flattenData(data: any, maxDepth: number = 3): TableRow[] {
  if (!data) return []

  // If data is already an array of objects, use it directly
  if (Array.isArray(data) && data.every(item => typeof item === 'object' && !Array.isArray(item))) {
    return data.map((item, index) => ({
      _index: index,
      ...flattenObject(item, '', maxDepth)
    }))
  }

  // If data is an object, convert to array
  if (typeof data === 'object' && !Array.isArray(data)) {
    return Object.entries(data).map(([key, value], index) => ({
      _index: index,
      _key: key,
      ...flattenObject(value, '', maxDepth)
    }))
  }

  // If data is an array of primitives
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      _index: index,
      value: item
    }))
  }

  // Single value
  return [{ _index: 0, value: data }]
}

function flattenObject(obj: any, prefix: string = '', maxDepth: number = 3, currentDepth: number = 0): any {
  if (currentDepth >= maxDepth || obj === null || typeof obj !== 'object') {
    return { [prefix || 'value']: obj }
  }

  const flattened: any = {}

  if (Array.isArray(obj)) {
    // For arrays, create indexed entries
    obj.forEach((item, index) => {
      const key = prefix ? `${prefix}[${index}]` : `[${index}]`
      if (typeof item === 'object' && item !== null) {
        Object.assign(flattened, flattenObject(item, key, maxDepth, currentDepth + 1))
      } else {
        flattened[key] = item
      }
    })
  } else {
    // For objects, create dot-notation keys
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'object' && value !== null) {
        Object.assign(flattened, flattenObject(value, newKey, maxDepth, currentDepth + 1))
      } else {
        flattened[newKey] = value
      }
    })
  }

  return flattened
}

// Generate columns from data
function generateColumns(rows: TableRow[]): ColumnConfig[] {
  if (rows.length === 0) return []

  const allKeys = new Set<string>()
  rows.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key))
  })

  return Array.from(allKeys).map(key => ({
    key,
    label: key.replace(/^_/, '').replace(/\./g, ' › '),
    width: Math.max(120, Math.min(200, key.length * 8 + 60)),
    sortable: true
  }))
}

export default function TableView({ data, searchQuery, language, onExport }: TableViewProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [localSearch, setLocalSearch] = useState('')
  const [maxDepth, setMaxDepth] = useState(3)

  const labels = {
    en: {
      noData: 'No data to display in table format',
      search: 'Search table...',
      export: 'Export',
      rows: 'rows',
      columns: 'columns',
      depth: 'Depth',
      flatten: 'Flatten to depth'
    },
    jp: {
      noData: 'テーブル形式で表示するデータがありません',
      search: 'テーブル内を検索...',
      export: 'エクスポート',
      rows: '行',
      columns: '列',
      depth: '深度',
      flatten: '深度まで展開'
    },
    es: {
      noData: 'No hay datos para mostrar en formato de tabla',
      search: 'Buscar en tabla...',
      export: 'Exportar',
      rows: 'filas',
      columns: 'columnas',
      depth: 'Profundidad',
      flatten: 'Aplanar hasta profundidad'
    },
    fr: {
      noData: 'Aucune donnée à afficher en format tableau',
      search: 'Rechercher dans le tableau...',
      export: 'Exporter',
      rows: 'lignes',
      columns: 'colonnes',
      depth: 'Profondeur',
      flatten: 'Aplatir jusqu\'à la profondeur'
    },
    de: {
      noData: 'Keine Daten im Tabellenformat anzuzeigen',
      search: 'Tabelle durchsuchen...',
      export: 'Exportieren',
      rows: 'Zeilen',
      columns: 'Spalten',
      depth: 'Tiefe',
      flatten: 'Bis zur Tiefe abflachen'
    },
    zh: {
      noData: '没有数据以表格格式显示',
      search: '搜索表格...',
      export: '导出',
      rows: '行',
      columns: '列',
      depth: '深度',
      flatten: '展开到深度'
    },
    ko: {
      noData: '테이블 형식으로 표시할 데이터가 없습니다',
      search: '테이블 검색...',
      export: '내보내기',
      rows: '행',
      columns: '열',
      depth: '깊이',
      flatten: '깊이까지 평면화'
    },
    pt: {
      noData: 'Nenhum dado para exibir em formato de tabela',
      search: 'Pesquisar tabela...',
      export: 'Exportar',
      rows: 'linhas',
      columns: 'colunas',
      depth: 'Profundidade',
      flatten: 'Achatar até a profundidade'
    }
  }

  const t = labels[language]

  // Process data into table format
  const { rows, columns } = useMemo(() => {
    const flatRows = flattenData(data, maxDepth)
    const cols = generateColumns(flatRows)
    return { rows: flatRows, columns: cols }
  }, [data, maxDepth])

  // Filter and sort data
  const processedRows = useMemo(() => {
    let filtered = rows

    // Apply search filter
    const query = (searchQuery || localSearch).toLowerCase()
    if (query) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(query)
        )
      )
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        
        if (aVal === bVal) return 0
        if (aVal == null) return 1
        if (bVal == null) return -1
        
        const result = aVal < bVal ? -1 : 1
        return sortDirection === 'asc' ? result : -result
      })
    }

    return filtered
  }, [rows, searchQuery, localSearch, sortColumn, sortDirection])

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      // Export the actual table data that's currently displayed
      try {
        const csvContent = convertTableToCSV(processedRows, columns)
        downloadFile(csvContent, 'table-data.csv', 'text/csv')
      } catch (err) {
        console.error('CSV export failed:', err)
      }
    } else if (onExport) {
      onExport(format)
    }
  }

  // Convert table rows to CSV format
  const convertTableToCSV = (rows: TableRow[], columns: ColumnConfig[]): string => {
    if (rows.length === 0) return ''
    
    // Create header row
    const headers = columns.map(col => col.label)
    
    // Create data rows
    const dataRows = rows.map(row => 
      columns.map(col => {
        const value = row[col.key]
        if (value == null) return ''
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return String(value)
      })
    )
    
    // Combine headers and data
    const allRows = [headers, ...dataRows]
    return allRows.map(row => row.join(',')).join('\n')
  }

  // Download file helper
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Row renderer for virtualization
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = processedRows[index]
    const isEven = index % 2 === 0

    return (
      <div
        style={style}
        className={`flex border-b ${isEven ? 'bg-background' : 'bg-muted/30'} hover:bg-accent/50`}
      >
        {columns.map((col, colIndex) => (
          <div
            key={col.key}
            className="px-3 py-2 text-sm border-r flex-shrink-0 overflow-hidden"
            style={{ width: col.width }}
            title={String(row[col.key] || '')}
          >
            <span className="truncate block">
              {row[col.key] != null ? String(row[col.key]) : ''}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">{t.noData}</h3>
        </div>
      </div>
    )
  }

  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0)

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex flex-col min-h-0 pb-20">
        {/* Table Controls */}
        <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {processedRows.length} {t.rows} • {columns.length} {t.columns}
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground">{t.flatten}:</label>
            <select
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.search}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm border rounded-md w-48"
            />
          </div>
          
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-1 px-3 py-2 text-sm border rounded-md hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            <span>{t.export}</span>
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="flex-1 min-h-0 overflow-x-auto p-4">
        <div style={{ minWidth: totalWidth }}>
          {/* Table Header */}
          <div className="border-b bg-muted/50 sticky top-0 z-10">
            <div className="flex">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="px-3 py-3 text-sm font-medium border-r flex-shrink-0 cursor-pointer hover:bg-accent/50"
                  style={{ width: col.width }}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{col.label}</span>
                    {sortColumn === col.key && (
                      <div className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Body - Virtualized */}
          <div className="min-h-0">
            {processedRows.length > 0 ? (
              <List
                height={500}
                itemCount={processedRows.length}
                itemSize={40}
                width={totalWidth}
              >
                {Row}
              </List>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                {searchQuery || localSearch ? 'No matching rows found' : t.noData}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}