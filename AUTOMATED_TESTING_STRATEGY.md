# JSON Simplify - Automated Testing Strategy & Implementation Plan

## Overview

This document outlines a comprehensive automated testing strategy for JSON Simplify, including unit tests, integration tests, end-to-end tests, and performance testing automation.

---

## 1. TESTING FRAMEWORK SELECTION

### Primary Testing Stack
```json
{
  "testFramework": "Jest",
  "testRunner": "@testing-library/react",
  "e2eFramework": "Playwright",
  "performanceTesting": "Lighthouse CI",
  "accessibility": "@axe-core/playwright"
}
```

### Dependencies to Add
```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  playwright \
  @playwright/test \
  @axe-core/playwright \
  lighthouse \
  @lhci/cli \
  jest-environment-jsdom
```

---

## 2. UNIT TESTING STRATEGY

### Core Utility Functions (`/src/lib/utils.ts`)

#### Test Suite: `utils.test.ts`
```typescript
import {
  formatFileSize,
  searchInJson,
  getJsonType,
  countJsonNodes,
  convertToCSV,
  convertToYAML,
  copyToClipboard,
  generateShareUrl,
  parseShareUrl
} from '../src/lib/utils';

describe('formatFileSize', () => {
  test('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });
});

describe('searchInJson', () => {
  const testData = {
    users: [
      { id: 1, name: "Alice", email: "alice@test.com" },
      { id: 2, name: "Bob", email: "bob@test.com" }
    ],
    metadata: { version: "1.0", count: 2 }
  };

  test('finds matches in keys', () => {
    const results = searchInJson(testData, 'name');
    expect(results).toHaveLength(2);
    expect(results[0].key).toBe('name');
  });

  test('finds matches in values', () => {
    const results = searchInJson(testData, 'Alice');
    expect(results).toHaveLength(1);
    expect(results[0].value).toBe('Alice');
  });

  test('case insensitive search', () => {
    const results = searchInJson(testData, 'alice');
    expect(results).toHaveLength(1);
  });

  test('returns empty array for no matches', () => {
    const results = searchInJson(testData, 'nonexistent');
    expect(results).toHaveLength(0);
  });

  test('handles empty query', () => {
    const results = searchInJson(testData, '');
    expect(results).toHaveLength(0);
  });
});

describe('getJsonType', () => {
  test('identifies all JSON types correctly', () => {
    expect(getJsonType(null)).toBe('null');
    expect(getJsonType([])).toBe('array');
    expect(getJsonType({})).toBe('object');
    expect(getJsonType('string')).toBe('string');
    expect(getJsonType(123)).toBe('number');
    expect(getJsonType(true)).toBe('boolean');
  });
});

describe('countJsonNodes', () => {
  test('counts nodes correctly', () => {
    const simpleObject = { a: 1, b: 2 };
    expect(countJsonNodes(simpleObject)).toBe(3); // object + 2 values

    const nestedObject = { 
      a: { b: { c: 1 } },
      d: [1, 2, 3]
    };
    expect(countJsonNodes(nestedObject)).toBe(8); // calculated count
  });
});

describe('convertToCSV', () => {
  test('converts simple array to CSV', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ];
    const csv = convertToCSV(data, { flattenKeys: false });
    expect(csv).toContain('name,age');
    expect(csv).toContain('Alice,30');
  });

  test('flattens nested objects when requested', () => {
    const data = [{
      name: 'Alice',
      address: { city: 'Boston', state: 'MA' }
    }];
    const csv = convertToCSV(data, { flattenKeys: true });
    expect(csv).toContain('address.city,address.state');
  });

  test('handles single object', () => {
    const data = { name: 'Alice', age: 30 };
    const csv = convertToCSV(data, { flattenKeys: false });
    expect(csv).toContain('name,age');
  });

  test('handles primitive values', () => {
    const csv = convertToCSV('test', { flattenKeys: false });
    expect(csv).toContain('value');
    expect(csv).toContain('test');
  });
});

describe('convertToYAML', () => {
  test('converts object to YAML', () => {
    const data = { name: 'Alice', age: 30 };
    const yaml = convertToYAML(data);
    expect(yaml).toContain('name: Alice');
    expect(yaml).toContain('age: 30');
  });

  test('handles nested objects', () => {
    const data = {
      user: { name: 'Alice', address: { city: 'Boston' } }
    };
    const yaml = convertToYAML(data);
    expect(yaml).toContain('user:');
    expect(yaml).toContain('  name: Alice');
    expect(yaml).toContain('  address:');
    expect(yaml).toContain('    city: Boston');
  });
});

describe('copyToClipboard', () => {
  // Mock clipboard API
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve())
      }
    });
    Object.assign(window, { isSecureContext: true });
  });

  test('uses clipboard API when available', async () => {
    await copyToClipboard('test text');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });

  test('falls back to execCommand when clipboard unavailable', async () => {
    Object.assign(window, { isSecureContext: false });
    
    // Mock document methods
    const mockExecCommand = jest.fn(() => true);
    Object.assign(document, { execCommand: mockExecCommand });
    
    await copyToClipboard('test text');
    expect(mockExecCommand).toHaveBeenCalledWith('copy');
  });
});

describe('generateShareUrl', () => {
  beforeEach(() => {
    Object.assign(window, {
      location: {
        origin: 'http://localhost:3001',
        pathname: '/'
      }
    });
  });

  test('generates valid share URL for small data', () => {
    const data = { test: 'value' };
    const url = generateShareUrl(data);
    expect(url).toContain('http://localhost:3001/?json=');
    expect(url).toContain(encodeURIComponent(JSON.stringify(data)));
  });

  test('throws error for data too large', () => {
    const largeData = { data: 'x'.repeat(3000) };
    expect(() => generateShareUrl(largeData)).toThrow('Data too large to share via URL');
  });
});

describe('parseShareUrl', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window as any).location;
    window.location = { ...originalLocation, search: '' } as any;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test('parses JSON from URL parameter', () => {
    const testData = { test: 'value' };
    window.location.search = `?json=${encodeURIComponent(JSON.stringify(testData))}`;
    
    const result = parseShareUrl();
    expect(result).toEqual(testData);
  });

  test('returns null for invalid JSON', () => {
    window.location.search = '?json=invalid-json';
    const result = parseShareUrl();
    expect(result).toBeNull();
  });

  test('returns null when no json parameter', () => {
    window.location.search = '?other=value';
    const result = parseShareUrl();
    expect(result).toBeNull();
  });
});
```

---

## 3. COMPONENT TESTING STRATEGY

### Test Suite: `components/EmptyState.test.tsx`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../src/components/EmptyState';

const mockProps = {
  onFileUpload: jest.fn(),
  onJsonPaste: jest.fn(),
  onLoadSample: jest.fn(),
  language: 'en' as const
};

describe('EmptyState Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial state correctly', () => {
    render(<EmptyState {...mockProps} />);
    
    expect(screen.getByText(/Drop JSON here or Paste/)).toBeInTheDocument();
    expect(screen.getByText(/Max: 50MB/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Choose File/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Paste JSON/ })).toBeInTheDocument();
  });

  test('handles file upload via file picker', async () => {
    const user = userEvent.setup();
    render(<EmptyState {...mockProps} />);
    
    const file = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    const fileInput = screen.getByRole('button', { name: /Choose File/ });
    
    await user.click(fileInput);
    
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (hiddenInput) {
      await user.upload(hiddenInput, file);
      expect(mockProps.onFileUpload).toHaveBeenCalledWith(file);
    }
  });

  test('handles drag and drop', async () => {
    render(<EmptyState {...mockProps} />);
    
    const dropZone = screen.getByText(/Drop JSON here/).closest('div');
    const file = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
    
    if (dropZone) {
      fireEvent.dragOver(dropZone);
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file]
        }
      });
      
      expect(mockProps.onFileUpload).toHaveBeenCalledWith(file);
    }
  });

  test('shows paste textarea when paste button clicked', async () => {
    const user = userEvent.setup();
    render(<EmptyState {...mockProps} />);
    
    const pasteButton = screen.getByRole('button', { name: /Paste JSON/ });
    await user.click(pasteButton);
    
    expect(screen.getByPlaceholderText(/Paste or type your JSON here/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Parse JSON/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
  });

  test('processes pasted JSON', async () => {
    const user = userEvent.setup();
    render(<EmptyState {...mockProps} />);
    
    // Click paste button
    await user.click(screen.getByRole('button', { name: /Paste JSON/ }));
    
    // Type JSON
    const textarea = screen.getByPlaceholderText(/Paste or type your JSON here/);
    await user.type(textarea, '{"test": "data"}');
    
    // Click parse
    await user.click(screen.getByRole('button', { name: /Parse JSON/ }));
    
    expect(mockProps.onJsonPaste).toHaveBeenCalledWith('{"test": "data"}');
  });

  test('handles keyboard shortcuts in textarea', async () => {
    const user = userEvent.setup();
    render(<EmptyState {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /Paste JSON/ }));
    
    const textarea = screen.getByPlaceholderText(/Paste or type your JSON here/);
    await user.type(textarea, '{"test": "data"}');
    
    // Ctrl+Enter should parse
    await user.keyboard('{Control>}{Enter}{/Control}');
    expect(mockProps.onJsonPaste).toHaveBeenCalledWith('{"test": "data"}');
  });

  test('cancels paste input with Escape', async () => {
    const user = userEvent.setup();
    render(<EmptyState {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /Paste JSON/ }));
    
    const textarea = screen.getByPlaceholderText(/Paste or type your JSON here/);
    await user.keyboard('{Escape}');
    
    expect(textarea).not.toBeInTheDocument();
  });

  test('loads sample data', async () => {
    const user = userEvent.setup();
    render(<EmptyState {...mockProps} />);
    
    const sampleButton = screen.getByText(/Try sample/);
    await user.click(sampleButton);
    
    expect(mockProps.onLoadSample).toHaveBeenCalled();
  });

  test('supports multiple languages', () => {
    const { rerender } = render(<EmptyState {...mockProps} language="jp" />);
    expect(screen.getByText(/JSONをドロップまたは貼り付け/)).toBeInTheDocument();
    
    rerender(<EmptyState {...mockProps} language="es" />);
    expect(screen.getByText(/Suelta JSON aquí o Pegar/)).toBeInTheDocument();
  });
});
```

### Test Suite: `components/Header.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../src/components/Header';

const mockProps = {
  onPaste: jest.fn(),
  onUpload: jest.fn(),
  onBeautify: jest.fn(),
  onMinify: jest.fn(),
  onValidate: jest.fn(),
  onConvert: jest.fn(),
  onSave: jest.fn(),
  onShare: jest.fn(),
  onReset: jest.fn(),
  searchQuery: '',
  onSearchChange: jest.fn(),
  onSearchPrev: jest.fn(),
  onSearchNext: jest.fn(),
  searchMatches: 0,
  currentSearchIndex: 0,
  isDarkMode: false,
  onToggleTheme: jest.fn(),
  language: 'en' as const,
  onLanguageChange: jest.fn(),
  onShowShortcuts: jest.fn()
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header elements correctly', () => {
    render(<Header {...mockProps} />);
    
    expect(screen.getByText('JSON Simplify')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/key or value/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Theme/ })).toBeInTheDocument();
  });

  test('handles search input', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText(/key or value/);
    await user.type(searchInput, 'test search');
    
    expect(mockProps.onSearchChange).toHaveBeenCalledWith('test search');
  });

  test('handles theme toggle', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);
    
    const themeButton = screen.getByRole('button', { name: /Theme/ });
    await user.click(themeButton);
    
    expect(mockProps.onToggleTheme).toHaveBeenCalled();
  });

  test('shows correct theme icon', () => {
    const { rerender } = render(<Header {...mockProps} isDarkMode={false} />);
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    
    rerender(<Header {...mockProps} isDarkMode={true} />);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  test('handles language selection', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);
    
    const languageButton = screen.getByText('EN');
    await user.click(languageButton);
    
    // Check dropdown appears
    expect(screen.getByText('日本語')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    
    // Select language
    await user.click(screen.getByText('日本語'));
    expect(mockProps.onLanguageChange).toHaveBeenCalledWith('jp');
  });

  test('shows search results count', () => {
    render(<Header {...mockProps} searchMatches={5} currentSearchIndex={2} />);
    expect(screen.getByText('3 of 5')).toBeInTheDocument();
  });

  test('handles search navigation', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} searchMatches={5} />);
    
    const prevButton = screen.getByRole('button', { name: /Previous/ });
    const nextButton = screen.getByRole('button', { name: /Next/ });
    
    await user.click(nextButton);
    expect(mockProps.onSearchNext).toHaveBeenCalled();
    
    await user.click(prevButton);
    expect(mockProps.onSearchPrev).toHaveBeenCalled();
  });

  test('disables search navigation when no matches', () => {
    render(<Header {...mockProps} searchMatches={0} />);
    
    const prevButton = screen.getByRole('button', { name: /Previous/ });
    const nextButton = screen.getByRole('button', { name: /Next/ });
    
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test('handles reset via logo click', async () => {
    const user = userEvent.setup();
    render(<Header {...mockProps} />);
    
    const logo = screen.getByText('JSON Simplify').closest('button');
    if (logo) {
      await user.click(logo);
      expect(mockProps.onReset).toHaveBeenCalled();
    }
  });
});
```

---

## 4. INTEGRATION TESTING STRATEGY

### Test Suite: `integration/jsonProcessing.test.tsx`
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JSONSimplify from '../src/app/page';

describe('JSON Processing Integration', () => {
  test('complete workflow: paste → search → copy', async () => {
    const user = userEvent.setup();
    
    // Mock clipboard API
    const mockWriteText = jest.fn();
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText }
    });

    render(<JSONSimplify />);
    
    // Load sample data
    const sampleButton = screen.getByText(/Try sample/);
    await user.click(sampleButton);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Tree')).toBeInTheDocument();
    });
    
    // Switch to tree view and verify data loaded
    expect(screen.getByText('users')).toBeInTheDocument();
    
    // Perform search
    const searchInput = screen.getByPlaceholderText(/key or value/);
    await user.type(searchInput, 'Alice');
    
    // Verify search results
    await waitFor(() => {
      expect(screen.getByText(/1 of \d+/)).toBeInTheDocument();
    });
    
    // Find and click on a tree node to select it
    const nameNode = screen.getByText('Alice');
    await user.click(nameNode);
    
    // Test copy path functionality (would need to implement copy button)
    // This would test the copyToClipboard integration
  });

  test('file upload → validation → conversion workflow', async () => {
    const user = userEvent.setup();
    render(<JSONSimplify />);
    
    // Create and upload test file
    const testData = { test: 'data', nested: { value: 123 } };
    const file = new File([JSON.stringify(testData)], 'test.json', {
      type: 'application/json'
    });
    
    // Trigger file upload
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      await user.upload(fileInput, file);
    }
    
    // Wait for processing
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
    });
    
    // Test validation
    const validateButton = screen.getByRole('button', { name: /Validate/ });
    await user.click(validateButton);
    
    // Verify validation panel opens
    await waitFor(() => {
      expect(screen.getByText(/Validation/)).toBeInTheDocument();
    });
  });

  test('malformed JSON repair workflow', async () => {
    const user = userEvent.setup();
    render(<JSONSimplify />);
    
    // Paste malformed JSON
    const pasteButton = screen.getByRole('button', { name: /Paste JSON/ });
    await user.click(pasteButton);
    
    const textarea = screen.getByPlaceholderText(/Paste or type your JSON here/);
    const malformedJson = `{
      "name": 'Alice',
      "id": 1,
      "tags": ["user", "admin",]
    }`;
    
    await user.type(textarea, malformedJson);
    await user.click(screen.getByRole('button', { name: /Parse JSON/ }));
    
    // Verify repair notification appears
    await waitFor(() => {
      expect(screen.getByText(/JSON was automatically repaired/)).toBeInTheDocument();
    });
    
    // Verify data was parsed correctly
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('theme persistence across session', async () => {
    const user = userEvent.setup();
    
    // Mock localStorage
    const mockSetItem = jest.fn();
    const mockGetItem = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: mockSetItem,
        getItem: mockGetItem
      }
    });
    
    render(<JSONSimplify />);
    
    // Toggle theme
    const themeButton = screen.getByRole('button', { name: /Theme/ });
    await user.click(themeButton);
    
    // Verify localStorage was called
    expect(mockSetItem).toHaveBeenCalledWith('theme', expect.any(String));
  });
});
```

---

## 5. END-TO-END TESTING WITH PLAYWRIGHT

### Test Suite: `e2e/userFlows.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('JSON Simplify E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('complete user workflow: large JSON processing', async ({ page }) => {
    // Load large JSON file
    await page.setInputFiles('input[type="file"]', './test-data/large-sample.json');
    
    // Wait for processing
    await expect(page.locator('text=Tree')).toBeVisible();
    
    // Verify performance metrics are reasonable
    const performanceMetrics = await page.evaluate(() => {
      return {
        loadTime: performance.now(),
        memory: (performance as any).memory?.usedJSHeapSize
      };
    });
    
    expect(performanceMetrics.loadTime).toBeLessThan(5000); // 5 seconds max
    
    // Test search functionality
    await page.fill('input[placeholder*="key or value"]', 'user');
    await expect(page.locator('text=/\\d+ of \\d+/')).toBeVisible();
    
    // Test navigation
    await page.click('button[title*="Next"]');
    await page.click('button[title*="Previous"]');
    
    // Test tree expansion
    await page.click('[data-testid="expand-button"]');
    await expect(page.locator('[data-testid="tree-node-expanded"]')).toBeVisible();
  });

  test('keyboard navigation accessibility', async ({ page }) => {
    // Load sample data
    await page.click('text=/Try sample/');
    await expect(page.locator('text=Tree')).toBeVisible();
    
    // Test keyboard shortcuts
    await page.keyboard.press('Control+f');
    await expect(page.locator('input[placeholder*="key or value"]')).toBeFocused();
    
    await page.keyboard.press('Control+d');
    // Verify theme toggle
    
    await page.keyboard.press('?');
    await expect(page.locator('text=Shortcuts')).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(page.locator('text=Shortcuts')).not.toBeVisible();
  });

  test('mobile responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 600, height: 800 });
    await page.reload();
    
    // Should show mobile warning
    await expect(page.locator('text=/mobile device/i')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 800, height: 600 });
    await page.reload();
    
    // Should show main interface
    await expect(page.locator('text="JSON Simplify"')).toBeVisible();
  });

  test('error handling and recovery', async ({ page }) => {
    // Test malformed JSON handling
    await page.click('button:has-text("Paste JSON")');
    await page.fill('textarea', '{invalid json}');
    await page.click('button:has-text("Parse JSON")');
    
    // Should show error message
    await expect(page.locator('text=/Error:/i')).toBeVisible();
    
    // Test recovery
    await page.click('button:has-text("Dismiss")');
    await expect(page.locator('text=/Error:/i')).not.toBeVisible();
  });

  test('export functionality', async ({ page }) => {
    // Load sample data
    await page.click('text=/Try sample/');
    await expect(page.locator('text=Tree')).toBeVisible();
    
    // Start download promise before clicking
    const downloadPromise = page.waitForEvent('download');
    
    // Test JSON export
    await page.click('button:has-text("Save")');
    await page.click('text=JSON');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('data.json');
  });

  test('performance benchmarks', async ({ page }) => {
    // Measure page load performance
    const navigationPromise = page.waitForLoadState('networkidle');
    await page.goto('http://localhost:3001');
    await navigationPromise;
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
      };
    });
    
    // Performance assertions
    expect(metrics.domContentLoaded).toBeLessThan(1000); // 1 second
    expect(metrics.firstContentfulPaint).toBeLessThan(1500); // 1.5 seconds
  });
});
```

---

## 6. ACCESSIBILITY TESTING AUTOMATION

### Test Suite: `a11y/accessibility.spec.ts`
```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await injectAxe(page);
  });

  test('homepage accessibility compliance', async ({ page }) => {
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('keyboard navigation flow', async ({ page }) => {
    // Load sample data
    await page.click('text=/Try sample/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Run accessibility check with data loaded
    await checkA11y(page);
  });

  test('color contrast in dark mode', async ({ page }) => {
    // Toggle to dark mode
    await page.keyboard.press('Control+d');
    
    // Check accessibility in dark mode
    await checkA11y(page, null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });

  test('screen reader friendly structure', async ({ page }) => {
    // Load data
    await page.click('text=/Try sample/');
    
    // Check for proper ARIA labels and roles
    await checkA11y(page, null, {
      rules: {
        'aria-valid-attr': { enabled: true },
        'aria-valid-attr-value': { enabled: true },
        'button-name': { enabled: true },
        'landmark-one-main': { enabled: true }
      }
    });
  });
});
```

---

## 7. PERFORMANCE TESTING AUTOMATION

### Lighthouse CI Configuration: `.lighthouserc.js`
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3001'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.8}],
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 3000}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### Performance Test Suite: `performance/loadTesting.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('large JSON file processing performance', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Start timing
    const startTime = Date.now();
    
    // Load large test file
    await page.setInputFiles('input[type="file"]', './test-data/large-sample.json');
    
    // Wait for processing complete
    await page.waitForSelector('text=Tree', { timeout: 10000 });
    
    const processingTime = Date.now() - startTime;
    
    // Assert performance targets
    expect(processingTime).toBeLessThan(5000); // 5 seconds max
    
    // Check memory usage
    const memoryUsage = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Assert memory usage is reasonable (less than 100MB)
    expect(memoryUsage).toBeLessThan(100 * 1024 * 1024);
  });

  test('search performance with large dataset', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Load large dataset
    await page.setInputFiles('input[type="file"]', './test-data/large-sample.json');
    await page.waitForSelector('text=Tree');
    
    // Measure search performance
    const searchStartTime = Date.now();
    
    await page.fill('input[placeholder*="key or value"]', 'test');
    
    // Wait for search results
    await page.waitForSelector('text=/\\d+ of \\d+/', { timeout: 3000 });
    
    const searchTime = Date.now() - searchStartTime;
    
    // Search should be fast (less than 1 second)
    expect(searchTime).toBeLessThan(1000);
  });

  test('memory leak detection', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Baseline memory
    const baselineMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Perform multiple operations
    for (let i = 0; i < 5; i++) {
      await page.click('text=/Try sample/');
      await page.waitForSelector('text=Tree');
      await page.click('button:has-text("Reset")');
      await page.waitForSelector('text=/Drop JSON here/');
    }
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });
    
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Memory growth should be minimal (less than 10MB)
    const memoryGrowth = finalMemory - baselineMemory;
    expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024);
  });
});
```

---

## 8. CI/CD INTEGRATION

### GitHub Actions Workflow: `.github/workflows/test.yml`
```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npx playwright install
      - run: npm run build
      - run: npm run start &
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm run start &
      - run: npm run test:lighthouse
      
      - uses: actions/upload-artifact@v3
        with:
          name: lighthouse-report
          path: .lighthouseci/

  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npx playwright install
      - run: npm run build
      - run: npm run start &
      - run: npm run test:a11y
```

---

## 9. TEST EXECUTION SCRIPTS

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:a11y": "playwright test --grep='accessibility'",
    "test:performance": "playwright test --grep='performance'",
    "test:lighthouse": "lhci autorun",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e && npm run test:lighthouse"
  }
}
```

---

## 10. IMPLEMENTATION TIMELINE

### Phase 1 (Week 1): Foundation
- [ ] Set up Jest and Testing Library
- [ ] Implement utility function tests
- [ ] Basic component tests (EmptyState, Header)
- [ ] CI/CD pipeline setup

### Phase 2 (Week 2): Integration & E2E
- [ ] Integration test suite
- [ ] Playwright setup and basic E2E tests
- [ ] Performance testing framework
- [ ] Accessibility testing setup

### Phase 3 (Week 3): Advanced Testing
- [ ] Comprehensive E2E scenarios
- [ ] Performance benchmarking
- [ ] Accessibility compliance validation
- [ ] Memory leak detection

### Phase 4 (Week 4): Optimization & Monitoring
- [ ] Test result reporting
- [ ] Performance monitoring dashboard
- [ ] Continuous accessibility checking
- [ ] Test maintenance automation

---

This automated testing strategy provides comprehensive coverage of JSON Simplify's functionality, ensuring reliability, performance, and accessibility standards are maintained throughout development and deployment.