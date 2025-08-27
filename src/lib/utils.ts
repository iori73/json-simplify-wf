import { JsonNode, SearchResult } from '@/types'
import * as yaml from 'js-yaml'
import * as Papa from 'papaparse'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function searchInJson(data: any, query: string, path: string = '$'): SearchResult[] {
  const results: SearchResult[] = []
  
  if (!query.trim()) return results
  
  const searchRecursive = (obj: any, currentPath: string) => {
    if (obj === null || obj === undefined) return
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const itemPath = `${currentPath}[${index}]`
        searchRecursive(item, itemPath)
      })
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        const keyPath = currentPath === '$' ? `$.${key}` : `${currentPath}.${key}`
        
        // Search in key names
        if (key.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            path: keyPath,
            key: key,
            value: obj[key],
            node: {
              key,
              value: obj[key],
              type: getJsonType(obj[key]),
              path: keyPath
            }
          })
        }
        
        // Search in values if they're primitives
        const value = obj[key]
        if (typeof value === 'string' || typeof value === 'number') {
          if (String(value).toLowerCase().includes(query.toLowerCase())) {
            results.push({
              path: keyPath,
              key: key,
              value: value,
              node: {
                key,
                value: value,
                type: getJsonType(value),
                path: keyPath
              }
            })
          }
        }
        
        searchRecursive(obj[key], keyPath)
      })
    }
  }
  
  searchRecursive(data, path)
  return results
}

export function getJsonType(value: any): JsonNode['type'] {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'string'
}

export function countJsonNodes(obj: any): number {
  let count = 0
  
  const countRecursive = (value: any) => {
    count++
    
    if (Array.isArray(value)) {
      value.forEach(item => countRecursive(item))
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(val => countRecursive(val))
    }
  }
  
  countRecursive(obj)
  return count
}

export function convertToCSV(data: any, options: {
  flattenKeys?: boolean
  arraysToRows?: boolean
}): string {
  if (!data) return ''
  
  try {
    let processedData = data
    
    // Handle single object vs array of objects
    if (!Array.isArray(data)) {
      if (typeof data === 'object' && data !== null) {
        processedData = [data]
      } else {
        // Primitive value
        return Papa.unparse([{ value: data }])
      }
    }
    
    // Flatten nested objects if requested
    if (options.flattenKeys) {
      processedData = processedData.map((item: any) => {
        if (typeof item !== 'object' || item === null) {
          return { value: item }
        }
        
        const flattened: any = {}
        
        const flatten = (obj: any, prefix = '') => {
          Object.keys(obj).forEach(key => {
            const value = obj[key]
            const newKey = prefix ? `${prefix}.${key}` : key
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              flatten(value, newKey)
            } else {
              flattened[newKey] = Array.isArray(value) ? JSON.stringify(value) : value
            }
          })
        }
        
        flatten(item)
        return flattened
      })
    }
    
    return Papa.unparse(processedData)
  } catch (error) {
    throw new Error(`CSV conversion failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function convertToYAML(data: any): string {
  try {
    return yaml.dump(data, {
      indent: 2,
      lineWidth: 120,
      noRefs: true
    })
  } catch (error) {
    throw new Error(`YAML conversion failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'absolute'
      textArea.style.opacity = '0'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        document.execCommand('copy')
        textArea.remove()
        resolve()
      } catch (err) {
        textArea.remove()
        reject(err)
      }
    })
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = 'application/json') {
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

export function generateShareUrl(data: any): string {
  try {
    const jsonString = JSON.stringify(data)
    const maxUrlLength = 2048 // Common URL length limit
    
    if (jsonString.length > maxUrlLength - 100) { // Reserve space for base URL
      throw new Error('Data too large to share via URL')
    }
    
    const encoded = encodeURIComponent(jsonString)
    return `${window.location.origin}${window.location.pathname}?json=${encoded}`
  } catch (error) {
    throw new Error(`Share URL generation failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function parseShareUrl(): any | null {
  if (typeof window === 'undefined') return null
  
  const urlParams = new URLSearchParams(window.location.search)
  const jsonParam = urlParams.get('json')
  
  if (!jsonParam) return null
  
  try {
    return JSON.parse(decodeURIComponent(jsonParam))
  } catch (error) {
    console.error('Failed to parse shared JSON:', error)
    return null
  }
}