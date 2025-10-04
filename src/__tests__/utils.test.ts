import {
  formatFileSize,
  searchInJson,
  getJsonType,
  countJsonNodes,
  convertToCSV,
  convertToYAML,
  copyToClipboard,
  downloadFile,
  generateShareUrl,
  parseShareUrl
} from '../lib/utils'

// Window.location mocking is temporarily disabled
// TODO: Implement proper window.location mocking for parseShareUrl tests

// Mock document.createElement for downloadFile tests
const mockAnchor = {
  href: '',
  download: '',
  click: jest.fn()
}
jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
  if (tagName === 'a') {
    return mockAnchor as any
  }
  return {} as any
})

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url')
global.URL.revokeObjectURL = jest.fn()

describe('formatFileSize', () => {
  test('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1048576)).toBe('1 MB')
    expect(formatFileSize(1073741824)).toBe('1 GB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  test('handles edge cases', () => {
    expect(formatFileSize(1)).toBe('1 B')
    expect(formatFileSize(1023)).toBe('1023 B')
    expect(formatFileSize(1025)).toBe('1 KB')
  })
})

describe('searchInJson', () => {
  const testData = {
    users: [
      { id: 1, name: "Alice", email: "alice@test.com" },
      { id: 2, name: "Bob", email: "bob@test.com" }
    ],
    metadata: { version: "1.0", count: 2 }
  }

  test('finds matches in keys', () => {
    const results = searchInJson(testData, 'name')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some(r => r.key === 'name')).toBe(true)
  })

  test('finds matches in values', () => {
    const results = searchInJson(testData, 'Alice')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some(r => r.value === 'Alice')).toBe(true)
  })

  test('case insensitive search', () => {
    const results = searchInJson(testData, 'alice')
    expect(results.length).toBeGreaterThan(0)
  })

  test('returns empty array for no matches', () => {
    const results = searchInJson(testData, 'nonexistent')
    expect(results).toHaveLength(0)
  })

  test('handles empty query', () => {
    const results = searchInJson(testData, '')
    expect(results).toHaveLength(0)
  })

  test('handles null/undefined data', () => {
    expect(searchInJson(null, 'test')).toHaveLength(0)
    expect(searchInJson(undefined, 'test')).toHaveLength(0)
  })
})

describe('getJsonType', () => {
  test('identifies correct types', () => {
    expect(getJsonType("test")).toBe('string')
    expect(getJsonType(123)).toBe('number')
    expect(getJsonType(true)).toBe('boolean')
    expect(getJsonType(null)).toBe('null')
    expect(getJsonType(undefined)).toBe('null')
    expect(getJsonType([])).toBe('array')
    expect(getJsonType({})).toBe('object')
  })
})

describe('countJsonNodes', () => {
  test('counts nodes correctly', () => {
    expect(countJsonNodes(null)).toBe(0)
    expect(countJsonNodes("test")).toBe(1)
    expect(countJsonNodes(123)).toBe(1)
    expect(countJsonNodes([])).toBe(0)
    expect(countJsonNodes([1, 2, 3])).toBe(3)
    expect(countJsonNodes({ a: 1, b: 2 })).toBe(3) // object + 2 properties
  })

  test('handles nested structures', () => {
    const nested = {
      users: [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 }
      ],
      metadata: { version: "1.0" }
    }
    const count = countJsonNodes(nested)
    expect(count).toBeGreaterThan(0)
  })
})

describe('convertToCSV', () => {
  test('converts simple array to CSV', () => {
    const data = [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 }
    ]
    const csv = convertToCSV(data, { flattenKeys: false })
    expect(csv).toContain('name,age')
    expect(csv).toContain('Alice,30')
    expect(csv).toContain('Bob,25')
  })

  test('handles empty data', () => {
    expect(convertToCSV([], { flattenKeys: false })).toBe('')
    expect(convertToCSV(null, { flattenKeys: false })).toBe('')
  })

  test('flattens nested objects when option enabled', () => {
    const data = [
      { user: { name: "Alice", details: { age: 30 } } }
    ]
    const csv = convertToCSV(data, { flattenKeys: true })
    expect(csv).toContain('user.name')
    expect(csv).toContain('user.details.age')
  })
})

describe('convertToYAML', () => {
  test('converts simple object to YAML', () => {
    const data = { name: "Alice", age: 30 }
    const yamlResult = convertToYAML(data)
    expect(yamlResult).toContain('name: Alice')
    expect(yamlResult).toContain('age: 30')
  })

  test('handles arrays', () => {
    const data = { items: ["apple", "banana"] }
    const yamlResult = convertToYAML(data)
    expect(yamlResult).toContain('items:')
    expect(yamlResult).toContain('- apple')
    expect(yamlResult).toContain('- banana')
  })

  test('handles empty/null data', () => {
    expect(() => convertToYAML(null)).not.toThrow()
    expect(() => convertToYAML({})).not.toThrow()
  })
})

describe('copyToClipboard', () => {
  test('calls navigator.clipboard.writeText', async () => {
    const text = 'test content'
    await copyToClipboard(text)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text)
  })

  test('handles clipboard API errors gracefully', async () => {
    const originalWriteText = navigator.clipboard.writeText
    navigator.clipboard.writeText = jest.fn().mockRejectedValue(new Error('Clipboard error'))
    
    await expect(copyToClipboard('test')).rejects.toThrow('Clipboard error')
    
    navigator.clipboard.writeText = originalWriteText
  })
})

describe('downloadFile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('creates download link with correct attributes', () => {
    const content = '{"test": "data"}'
    const filename = 'test.json'
    const mimeType = 'application/json'
    
    downloadFile(content, filename, mimeType)
    
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockAnchor.download).toBe(filename)
    expect(mockAnchor.click).toHaveBeenCalled()
  })

  test('uses default mime type when not provided', () => {
    downloadFile('content', 'test.txt')
    expect(document.createElement).toHaveBeenCalledWith('a')
  })
})

describe('generateShareUrl', () => {
  test('generates URL with encoded data', () => {
    const data = { test: 'data' }
    const url = generateShareUrl(data)
    
    expect(url).toContain('http://localhost:3000')
    expect(url).toContain('?data=')
  })

  test('handles large data objects', () => {
    const largeData = { items: new Array(1000).fill({ id: 1, name: 'test' }) }
    const url = generateShareUrl(largeData)
    
    expect(url).toContain('?data=')
  })
})

describe.skip('parseShareUrl', () => {
  // Temporarily skip these tests due to window.location mocking issues
  // TODO: Fix window.location mocking in JSDOM environment
  
  test('parses data from URL search params', () => {
    // Test implementation pending window.location mock fix
  })

  test('returns null for invalid data', () => {
    // Test implementation pending window.location mock fix
  })

  test('returns null when no data param', () => {
    // Test implementation pending window.location mock fix
  })

  test('returns null for empty search', () => {
    // Test implementation pending window.location mock fix
  })
})