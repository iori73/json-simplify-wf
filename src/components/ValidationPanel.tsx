'use client'

import React, { useState, useEffect } from 'react'
import { X, AlertTriangle, CheckCircle, Upload } from 'lucide-react'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { ValidationError } from '@/types'

interface ValidationPanelProps {
  isOpen: boolean
  onClose: () => void
  jsonData: any
  language: 'en' | 'jp' | 'es' | 'fr' | 'de' | 'zh' | 'ko' | 'pt'
}

// AJV-based JSON Schema validator (enterprise-grade implementation)
function validateJson(data: any, schema: any): ValidationError[] {
  const errors: ValidationError[] = []
  
  try {
    // Initialize AJV with formats support
    const ajv = new Ajv({ 
      allErrors: true, 
      verbose: true,
      strict: false 
    })
    addFormats(ajv)
    
    // Compile and validate schema
    const validate = ajv.compile(schema)
    const valid = validate(data)
    
    if (!valid && validate.errors) {
      // Convert AJV errors to our ValidationError format
      validate.errors.forEach(error => {
        const path = error.instancePath || '$'
        let message = error.message || 'Validation error'
        
        // Enhance error messages with property information
        if (error.keyword === 'required') {
          message = `Missing required property: ${error.params?.missingProperty || 'unknown'}`
        } else if (error.keyword === 'type') {
          message = `Expected type ${error.params?.type}, got ${typeof error.data}`
        } else if (error.keyword === 'format') {
          message = `Invalid format: ${error.message}`
        } else if (error.keyword === 'enum') {
          message = `Value must be one of: ${error.params?.allowedValues?.join(', ')}`
        }
        
        errors.push({
          path: path || '$',
          message: message
        })
      })
    }
  } catch (err) {
    errors.push({
      path: '$',
      message: 'Schema validation failed: ' + (err instanceof Error ? err.message : String(err))
    })
  }
  
  return errors
}

export default function ValidationPanel({ isOpen, onClose, jsonData, language }: ValidationPanelProps) {
  const [schema, setSchema] = useState('')
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isValidating, setIsValidating] = useState(false)

  const labels = {
    en: {
      title: 'JSON Validation',
      schemaPlaceholder: 'Paste your JSON Schema here...',
      validate: 'Validate',
      clear: 'Clear',
      uploadSchema: 'Upload Schema',
      noErrors: 'JSON is valid according to the schema',
      validationErrors: 'Validation Errors',
      schemaError: 'Invalid JSON Schema',
      noData: 'No JSON data to validate',
      error: 'Error',
      path: 'Path'
    },
    jp: {
      title: 'JSON検証',
      schemaPlaceholder: 'JSONスキーマをここに貼り付けてください...',
      validate: '検証',
      clear: 'クリア',
      uploadSchema: 'スキーマアップロード',
      noErrors: 'JSONはスキーマに従って有効です',
      validationErrors: '検証エラー',
      schemaError: '無効なJSONスキーマ',
      noData: '検証するJSONデータがありません',
      error: 'エラー',
      path: 'パス'
    },
    es: {
      title: 'Validación JSON',
      schemaPlaceholder: 'Pega tu esquema JSON aquí...',
      validate: 'Validar',
      clear: 'Limpiar',
      uploadSchema: 'Subir Esquema',
      noErrors: 'JSON es válido según el esquema',
      validationErrors: 'Errores de Validación',
      schemaError: 'Esquema JSON inválido',
      noData: 'No hay datos JSON para validar',
      error: 'Error',
      path: 'Ruta'
    },
    fr: {
      title: 'Validation JSON',
      schemaPlaceholder: 'Collez votre schéma JSON ici...',
      validate: 'Valider',
      clear: 'Effacer',
      uploadSchema: 'Télécharger Schéma',
      noErrors: 'JSON est valide selon le schéma',
      validationErrors: 'Erreurs de Validation',
      schemaError: 'Schéma JSON invalide',
      noData: 'Aucune donnée JSON à valider',
      error: 'Erreur',
      path: 'Chemin'
    },
    de: {
      title: 'JSON Validierung',
      schemaPlaceholder: 'Fügen Sie hier Ihr JSON Schema ein...',
      validate: 'Validieren',
      clear: 'Löschen',
      uploadSchema: 'Schema Hochladen',
      noErrors: 'JSON ist gemäß Schema gültig',
      validationErrors: 'Validierungsfehler',
      schemaError: 'Ungültiges JSON Schema',
      noData: 'Keine JSON Daten zum Validieren',
      error: 'Fehler',
      path: 'Pfad'
    },
    zh: {
      title: 'JSON验证',
      schemaPlaceholder: '在此粘贴您的JSON架构...',
      validate: '验证',
      clear: '清除',
      uploadSchema: '上传架构',
      noErrors: 'JSON根据架构有效',
      validationErrors: '验证错误',
      schemaError: '无效的JSON架构',
      noData: '没有要验证的JSON数据',
      error: '错误',
      path: '路径'
    },
    ko: {
      title: 'JSON 검증',
      schemaPlaceholder: '여기에 JSON 스키마를 붙여넣으세요...',
      validate: '검증',
      clear: '지우기',
      uploadSchema: '스키마 업로드',
      noErrors: 'JSON이 스키마에 따라 유효합니다',
      validationErrors: '검증 오류',
      schemaError: '유효하지 않은 JSON 스키마',
      noData: '검증할 JSON 데이터가 없습니다',
      error: '오류',
      path: '경로'
    },
    pt: {
      title: 'Validação JSON',
      schemaPlaceholder: 'Cole seu schema JSON aqui...',
      validate: 'Validar',
      clear: 'Limpar',
      uploadSchema: 'Upload Schema',
      noErrors: 'JSON é válido de acordo com o schema',
      validationErrors: 'Erros de Validação',
      schemaError: 'Schema JSON inválido',
      noData: 'Nenhum dado JSON para validar',
      error: 'Erro',
      path: 'Caminho'
    }
  }

  const t = labels[language]

  const handleValidate = () => {
    if (!jsonData) {
      setValidationErrors([{
        path: '$',
        message: t.noData
      }])
      return
    }

    if (!schema.trim()) {
      setValidationErrors([])
      return
    }

    setIsValidating(true)
    
    try {
      const parsedSchema = JSON.parse(schema)
      const errors = validateJson(jsonData, parsedSchema)
      setValidationErrors(errors)
    } catch (err) {
      setValidationErrors([{
        path: '$',
        message: `${t.schemaError}: ${err instanceof Error ? err.message : String(err)}`
      }])
    } finally {
      setIsValidating(false)
    }
  }

  const handleSchemaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setSchema(content)
      }
      reader.readAsText(file)
    }
  }

  const handleClear = () => {
    setSchema('')
    setValidationErrors([])
  }

  useEffect(() => {
    if (schema.trim()) {
      const timeout = setTimeout(handleValidate, 500)
      return () => clearTimeout(timeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema, jsonData])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl h-5/6 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-1/2 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">JSON Schema</h3>
                <div className="flex items-center space-x-2">
                  <label className="inline-flex items-center space-x-1 text-sm cursor-pointer hover:bg-accent rounded px-2 py-1">
                    <Upload className="h-3 w-3" />
                    <span>{t.uploadSchema}</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleSchemaUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleClear}
                    className="text-sm px-2 py-1 hover:bg-accent rounded"
                  >
                    {t.clear}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                placeholder={t.schemaPlaceholder}
                className="w-full h-full p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium">{t.validationErrors}</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {isValidating ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : validationErrors.length === 0 ? (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 py-4">
                  <CheckCircle className="h-5 w-5" />
                  <span>{t.noErrors}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {validationErrors.map((error, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-destructive/5 border-destructive/20"
                    >
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-destructive">
                            {t.error}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 font-mono">
                            {t.path}: {error.path}
                          </p>
                          <p className="text-sm mt-1">
                            {error.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}