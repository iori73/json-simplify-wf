export const APP_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_URL_LENGTH: 2048,
  TREE_ITEM_HEIGHT: 28,
  VIRTUALIZATION_THRESHOLD: 1000,
  SEARCH_DEBOUNCE_MS: 300,
  RENDER_TIMEOUT_MS: 1500,
  SUPPORTED_FILE_TYPES: ['.json', '.geojson'],
  SUPPORTED_MIME_TYPES: ['application/json', 'text/plain']
} as const

export const SAMPLE_JSON_DATA = {
  users: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      address: {
        street: "123 Main St",
        city: "Boston",
        state: "MA",
        zipCode: "02101"
      },
      preferences: {
        theme: "dark",
        notifications: true,
        languages: ["en", "es"]
      }
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com", 
      address: {
        street: "456 Oak Ave",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      },
      preferences: {
        theme: "light",
        notifications: false,
        languages: ["en", "fr"]
      }
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      address: {
        street: "789 Pine Rd",
        city: "San Francisco",
        state: "CA", 
        zipCode: "94101"
      },
      preferences: {
        theme: "auto",
        notifications: true,
        languages: ["en", "jp", "zh"]
      }
    }
  ],
  meta: {
    total: 3,
    generated: "2025-01-15T10:30:00Z",
    version: "1.0",
    source: "sample-data-generator"
  },
  config: {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    features: {
      darkMode: true,
      analytics: false,
      beta: {
        newTreeView: true,
        tableView: false
      }
    }
  }
} as const

export const ERROR_MESSAGES = {
  en: {
    FILE_TOO_LARGE: 'File too large. Maximum size is 50MB.',
    INVALID_JSON: 'Invalid JSON format.',
    PARSE_ERROR: 'Failed to parse JSON.',
    NETWORK_ERROR: 'Network error occurred.',
    VALIDATION_FAILED: 'Schema validation failed.',
    CONVERSION_FAILED: 'Format conversion failed.',
    SHARE_URL_TOO_LARGE: 'Data too large to share via URL.',
    CLIPBOARD_ERROR: 'Failed to copy to clipboard.',
    UNSUPPORTED_FORMAT: 'Unsupported file format.'
  },
  jp: {
    FILE_TOO_LARGE: 'ファイルが大きすぎます。最大サイズは50MBです。',
    INVALID_JSON: '無効なJSON形式です。',
    PARSE_ERROR: 'JSONの解析に失敗しました。',
    NETWORK_ERROR: 'ネットワークエラーが発生しました。',
    VALIDATION_FAILED: 'スキーマ検証に失敗しました。',
    CONVERSION_FAILED: '形式変換に失敗しました。',
    SHARE_URL_TOO_LARGE: 'データが大きすぎてURL共有できません。',
    CLIPBOARD_ERROR: 'クリップボードへのコピーに失敗しました。',
    UNSUPPORTED_FORMAT: 'サポートされていないファイル形式です。'
  }
} as const

export const JSON_SCHEMA_TEMPLATES = {
  basic: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "number", minimum: 0 }
    },
    required: ["name"]
  },
  array: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" }
      },
      required: ["id", "name"]
    }
  },
  nested: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      user: {
        type: "object",
        properties: {
          profile: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string", format: "email" }
            }
          }
        }
      }
    }
  }
} as const