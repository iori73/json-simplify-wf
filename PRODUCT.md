# JSON Simplify - Product Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Core Concepts](#core-concepts)
5. [Component Guide](#component-guide)
6. [Utilities Guide](#utilities-guide)
7. [State Management](#state-management)
8. [Development Guide](#development-guide)
9. [Feature Implementation Details](#feature-implementation-details)
10. [Future Enhancements](#future-enhancements)

---

## 📖 Overview

**JSON Simplify** is a frontend-only web application built with Next.js 15, React, TypeScript, and Tailwind CSS. It helps users visualize, navigate, and explore JSON data structures through an intuitive tree interface.

### Key Features
- ✅ JSON input via paste or file upload
- ✅ Interactive tree visualization
- ✅ Path navigation with bracket notation
- ✅ Search functionality with auto-expand
- ✅ Copy paths and values to clipboard
- ✅ Shareable URLs with compressed JSON
- ✅ Dark mode UI

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Compression**: pako (for URL sharing)

---

## 🏗️ Architecture

### Design Principles

1. **Modular Components**: Each component has a single, clear responsibility
2. **DRY (Don't Repeat Yourself)**: Common logic is extracted into utility functions
3. **Type Safety**: Comprehensive TypeScript types for all data structures
4. **Junior-Friendly**: Well-commented code with clear naming conventions
5. **Frontend-Only**: No backend, no database, fully client-side

### Application Flow

```
User Input (JSON) 
    ↓
Validation & Parsing
    ↓
Tree Structure Generation
    ↓
State Management (React Hooks)
    ↓
Component Rendering
    ↓
User Interactions (Click, Search, Copy)
```

---

## 📁 File Structure

```
json-simplify/
├── app/
│   ├── page.tsx              # Main application page (orchestrates all components)
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles
│
├── components/
│   ├── JsonInput.tsx         # Left panel: JSON input and validation
│   ├── TreeViewer.tsx        # Right panel: Tree structure display
│   ├── TreeNodeComponent.tsx # Individual tree node (recursive)
│   ├── PathPreview.tsx       # Bottom panel: Path and value preview
│   ├── SearchBar.tsx         # Search input with match counter
│   └── ShareButton.tsx       # Share URL generator
│
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── jsonUtils.ts          # JSON parsing, validation, tree building
│   ├── urlUtils.ts           # URL encoding/decoding for sharing
│   └── clipboardUtils.ts     # Clipboard operations
│
└── PRODUCT.md                # This file!
```

### Why This Structure?

- **`app/`**: Next.js App Router pages and layouts
- **`components/`**: Reusable UI components (one per file)
- **`lib/`**: Pure utility functions (no UI, easily testable)

---

## 💡 Core Concepts

### 1. Tree Node Structure

The application converts JSON into a tree structure where each node contains:

```typescript
interface TreeNode {
  key: string;           // Property name or array index
  value: unknown;        // The actual value
  type: JsonValueType;   // string, number, boolean, null, object, array
  path: string;          // Full path in bracket notation
  children?: TreeNode[]; // Child nodes (for objects/arrays)
  depth: number;         // Nesting level
  isExpanded?: boolean;  // UI state
}
```

**Example**: For JSON `{ "user": { "name": "John" } }`:
- Root node: `key: "root"`, `type: "object"`, `path: "root"`
- Child: `key: "user"`, `type: "object"`, `path: "root.user"`
- Grandchild: `key: "name"`, `type: "string"`, `path: "root.user.name"`

### 2. Path Notation

Paths use JavaScript bracket notation:
- Object properties: `user.name`
- Array indices: `items[0]`
- Nested: `user.orders[0].items[1].price`

### 3. State Management

All state lives in **`app/page.tsx`** (the main page):
- `jsonInput`: Raw JSON string from user
- `rootNode`: Parsed tree structure
- `selectedNode`: Currently selected node
- `expandedPaths`: Set of expanded node paths
- `searchTerm`: Current search query

This centralized approach makes it easy to understand data flow.

---

## 🧩 Component Guide

### 1. JsonInput.tsx (Left Panel)

**Purpose**: Handle JSON input and validation

**Features**:
- Textarea for paste/typing
- File upload button
- Drag & drop support
- Prettify button (formats JSON)
- Clear button
- Error display

**Props**:
```typescript
{
  value: string;           // Current JSON input
  onChange: (json: string) => void;  // Callback when input changes
  error: string | null;    // Error message to display
}
```

**Key Functions**:
- `handleTextChange`: Updates state on typing
- `handleFileUpload`: Reads .json files
- `handlePrettify`: Formats JSON with 2-space indentation

---

### 2. TreeViewer.tsx (Right Panel)

**Purpose**: Display the JSON tree structure

**Features**:
- Recursive tree rendering
- Empty state message
- Sticky header

**Props**:
```typescript
{
  rootNode: TreeNode | null;           // Root of tree
  onNodeClick: (node: TreeNode) => void;  // Click handler
  selectedPath: string | null;         // Currently selected path
  searchTerm: string;                  // Search query
  expandedPaths: Set<string>;          // Expanded node paths
  onToggleExpand: (path: string) => void; // Expand/collapse handler
}
```

---

### 3. TreeNodeComponent.tsx (Recursive Node)

**Purpose**: Render individual tree nodes (and their children)

**Features**:
- Click to expand/collapse (objects/arrays)
- Click to copy path (leaf values)
- Color-coded by type
- Search highlighting
- Drag-to-select value copying

**Props**:
```typescript
{
  node: TreeNode;                      // The node to render
  onToggleExpand: (path: string) => void;
  onNodeClick: (node: TreeNode) => void;
  isExpanded: boolean;                 // Is this node expanded?
  isSelected: boolean;                 // Is this node selected?
  searchTerm: string;                  // For highlighting
  expandedPaths: Set<string>;          // Pass to children
}
```

**Key Behavior**:
- Leaf nodes (strings, numbers, etc.): Click copies path
- Objects/arrays: Click toggles expand/collapse
- Recursively renders children when expanded

---

### 4. PathPreview.tsx (Bottom Panel)

**Purpose**: Show path and value of selected node

**Features**:
- Path display with copy button
- Value preview (formatted for objects/arrays)
- Copy value button (JSON-safe)
- Type indicator

**Props**:
```typescript
{
  selectedNode: TreeNode | null;  // Node to preview
}
```

---

### 5. SearchBar.tsx

**Purpose**: Search for keys in the JSON tree

**Features**:
- Text input with clear button
- Match counter
- Real-time search

**Props**:
```typescript
{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  matchCount?: number;
}
```

---

### 6. ShareButton.tsx

**Purpose**: Generate shareable URLs

**Features**:
- Compresses JSON using pako
- Encodes to URL-safe base64
- Copies to clipboard
- Handles size limits (warns if too large)

**Props**:
```typescript
{
  jsonString: string;   // JSON to share
  disabled?: boolean;   // Disable if no valid JSON
}
```

---

## 🔧 Utilities Guide

### 1. jsonUtils.ts - JSON Operations

#### `validateJson(jsonString: string)`
Checks if a string is valid JSON.
```typescript
const result = validateJson('{"key": "value"}');
// { isValid: true, error: null }
```

#### `prettifyJson(jsonString: string)`
Formats JSON with 2-space indentation.

#### `jsonToTree(json: unknown, key: string, parentPath: string, depth: number)`
**Core function**: Converts JSON object to TreeNode structure.
- Recursively processes objects and arrays
- Builds paths in bracket notation
- Auto-expands root level

#### `searchTree(node: TreeNode, searchTerm: string)`
Returns array of paths that match search term (case-insensitive).

#### `getParentPaths(path: string)`
Returns all parent paths for a given path.
```typescript
getParentPaths('user.orders[0].items[1]')
// ['user', 'user.orders', 'user.orders[0]', 'user.orders[0].items']
```

#### `formatValueDisplay(value: unknown, type: JsonValueType)`
Formats values for display:
- Arrays: `Array(5)`
- Objects: `Object(3)`
- Strings: `"text"`
- Others: raw value

---

### 2. urlUtils.ts - URL Sharing

#### `encodeJsonToUrl(json: string)`
Compresses and encodes JSON for URL.
1. Compress with pako (deflate)
2. Convert to base64
3. Make URL-safe (replace +, /, =)

#### `decodeJsonFromUrl(encoded: string)`
Reverses the encoding process.

#### `createShareableUrl(json: string, baseUrl?: string)`
Generates full shareable URL: `https://example.com?json=encoded_data`

#### `getJsonFromUrl()`
Extracts and decodes JSON from current URL (for loading shared links).

---

### 3. clipboardUtils.ts - Clipboard Operations

#### `copyToClipboard(text: string)`
Copies text to clipboard using modern API with fallback.

#### `showNotification(message: string, duration?: number)`
Simple notification (currently console.log, can be enhanced with toast library).

---

### 4. types.ts - Type Definitions

All TypeScript types are defined here:
- `JsonValueType`: Type enum
- `TreeNode`: Core data structure
- `SearchMatch`: Search result
- Component props interfaces

**Why separate types file?**
- Easy to find and modify
- Can be imported anywhere
- Prevents circular dependencies

---

## 🎛️ State Management

All state is managed in **`app/page.tsx`** using React hooks:

### State Variables

1. **`jsonInput`**: Raw JSON string from user
2. **`jsonError`**: Validation error message
3. **`rootNode`**: Parsed tree structure
4. **`selectedNode`**: Currently selected node
5. **`searchTerm`**: Search query
6. **`expandedPaths`**: Set of expanded node paths

### Effects (useEffect)

1. **Load from URL** (on mount):
   ```typescript
   useEffect(() => {
     const urlJson = getJsonFromUrl();
     if (urlJson) setJsonInput(urlJson);
   }, []);
   ```

2. **Parse JSON** (when input changes):
   ```typescript
   useEffect(() => {
     // Validate → Parse → Build tree → Auto-expand first level
   }, [jsonInput]);
   ```

3. **Handle Search** (when search term changes):
   ```typescript
   useEffect(() => {
     // Find matches → Expand parent paths
   }, [searchTerm, rootNode]);
   ```

### Why This Approach?

- **Simple**: All state in one place
- **Predictable**: Clear data flow
- **Debuggable**: Easy to see what state changes when
- **Junior-friendly**: No complex state libraries needed

---

## 👨‍💻 Development Guide

### Prerequisites

- Node.js 18+ or npm
- npm, yarn, or pnpm

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Adding a New Feature

**Example: Add "Copy Subtree" button**

1. **Add utility function** (`lib/jsonUtils.ts`):
   ```typescript
   export function copySubtree(node: TreeNode): string {
     return JSON.stringify(node.value, null, 2);
   }
   ```

2. **Use in component** (`components/PathPreview.tsx`):
   ```typescript
   const handleCopySubtree = async () => {
     const json = copySubtree(selectedNode);
     await copyToClipboard(json);
   };
   ```

3. **Add button to UI**:
   ```tsx
   <button onClick={handleCopySubtree}>Copy Subtree</button>
   ```

### Debugging Tips

- **Check state**: Add `console.log(state)` in components
- **Validate JSON**: Use `validateJson()` to check input
- **Inspect tree**: Log `rootNode` to see structure
- **Check paths**: Verify path building with `buildPath()`

---

## 🎯 Feature Implementation Details

### 1. Path Copying

**When**: User clicks a leaf value (string, number, etc.)

**Flow**:
1. `TreeNodeComponent` detects click on leaf
2. Calls `copyToClipboard(node.path)`
3. Shows "✓ Path copied" hint
4. Updates `selectedNode` in parent

**Code** (`TreeNodeComponent.tsx`):
```typescript
const handleClick = () => {
  if (isLeaf) {
    copyToClipboard(node.path);
    onNodeClick(node);
    setShowCopyHint(true);
    setTimeout(() => setShowCopyHint(false), 1500);
  }
};
```

---

### 2. Value Copying (Drag to Select)

**When**: User drags to select text in a value

**Flow**:
1. User drags to select value text
2. On `mouseUp`, check if selection exists
3. Copy JSON-safe value using `toJsonString()`

**Code** (`TreeNodeComponent.tsx`):
```typescript
const handleValueMouseUp = async (e: React.MouseEvent) => {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    e.stopPropagation();
    await copyToClipboard(toJsonString(node.value));
  }
};
```

---

### 3. Search with Auto-Expand

**When**: User types in search bar

**Flow**:
1. `searchTree()` finds matching paths
2. `getParentPaths()` gets all ancestor paths
3. Update `expandedPaths` to include matches + ancestors
4. Tree re-renders with nodes expanded

**Code** (`app/page.tsx`):
```typescript
useEffect(() => {
  if (searchTerm && rootNode) {
    const matches = searchTree(rootNode, searchTerm);
    const pathsToExpand = new Set<string>();
    
    matches.forEach(matchPath => {
      const parents = getParentPaths(matchPath);
      parents.forEach(path => pathsToExpand.add(path));
      pathsToExpand.add(matchPath);
    });
    
    setExpandedPaths(pathsToExpand);
  }
}, [searchTerm, rootNode]);
```

---

### 4. Shareable URLs

**When**: User clicks "Share" button

**Flow**:
1. Compress JSON with pako (deflate algorithm)
2. Convert to base64
3. Make URL-safe (replace special chars)
4. Create URL: `?json=encoded_data`
5. Copy to clipboard
6. On page load, check for `?json=` parameter and decode

**Size Limit**: URLs over 2000 chars show error (browser limitation)

**Code** (`lib/urlUtils.ts`):
```typescript
export function encodeJsonToUrl(json: string): string {
  const compressed = pako.deflate(json, { level: 9 });
  const base64 = btoa(String.fromCharCode(...compressed));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
```

---

### 5. Tree Expansion

**State**: `expandedPaths` is a `Set<string>` of paths that are expanded

**Toggle Logic**:
```typescript
const handleToggleExpand = (path: string) => {
  setExpandedPaths(prev => {
    const next = new Set(prev);
    if (next.has(path)) {
      next.delete(path);  // Collapse
    } else {
      next.add(path);     // Expand
    }
    return next;
  });
};
```

**Auto-Expand First Level**:
```typescript
if (tree.children) {
  const firstLevelPaths = tree.children.map(child => child.path);
  setExpandedPaths(new Set(firstLevelPaths));
}
```

---

## 🚀 Future Enhancements

### Easy (Junior Dev)
- [ ] Add keyboard shortcuts (↑/↓ to navigate, Enter to expand)
- [ ] Add "Collapse All" / "Expand All" buttons
- [ ] Add JSON syntax highlighting in input
- [ ] Add toast notifications instead of console logs
- [ ] Add light/dark mode toggle

### Medium (Mid-Level Dev)
- [ ] Bookmark frequently used paths (LocalStorage)
- [ ] Export tree to CSV
- [ ] Compare two JSON objects (diff view)
- [ ] JSON schema validation
- [ ] Path history (recent paths)

### Advanced (Senior Dev)
- [ ] Large JSON performance optimization (virtual scrolling)
- [ ] JSON editing capabilities
- [ ] Custom path notation (dot vs bracket)
- [ ] Plugin system for custom formatters
- [ ] Backend storage (optional accounts)

---

## 📝 Code Style Guidelines

### Naming Conventions
- **Components**: PascalCase (`JsonInput`, `TreeViewer`)
- **Functions**: camelCase (`validateJson`, `handleClick`)
- **Constants**: UPPER_SNAKE_CASE (if any)
- **Types**: PascalCase (`TreeNode`, `JsonValueType`)

### File Organization
- One component per file
- Related utilities grouped together
- All types in `types.ts`

### Comments
- **File header**: Purpose and features
- **Function header**: What it does, parameters, return value
- **Inline**: Complex logic only (code should be self-explanatory)

### TypeScript
- No `any` types (use `unknown` if truly unknown)
- Always define prop interfaces
- Use type inference where possible

---

## 🧪 Testing Strategy (For Future)

### Unit Tests
- Utility functions (`jsonUtils`, `urlUtils`, `clipboardUtils`)
- Pure functions are easy to test

### Component Tests
- Render tests (does it show expected UI?)
- Interaction tests (clicks, inputs)
- Use React Testing Library

### E2E Tests
- Full user flows (paste JSON → navigate → copy path)
- Use Playwright or Cypress

### Example Test (jsonUtils)
```typescript
describe('validateJson', () => {
  it('returns valid for correct JSON', () => {
    const result = validateJson('{"key": "value"}');
    expect(result.isValid).toBe(true);
  });
  
  it('returns error for invalid JSON', () => {
    const result = validateJson('{invalid}');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
```

---

## 🎓 Learning Resources for Junior Developers

### React Concepts Used
- **Hooks**: `useState`, `useEffect`, `useMemo`, `useRef`
- **Props**: Passing data between components
- **State lifting**: Parent manages state, children receive props
- **Conditional rendering**: `{condition && <Component />}`
- **Lists**: `array.map()` with keys

### TypeScript Concepts
- **Interfaces**: Define object shapes
- **Type aliases**: `type JsonValueType = 'string' | 'number' | ...`
- **Generics**: (not used heavily here, but good to know)
- **Union types**: `string | null`

### Next.js Concepts
- **App Router**: `app/` directory structure
- **Client components**: `'use client'` directive
- **Metadata**: SEO-friendly meta tags

### Useful Links
- [React Docs](https://react.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contributing

### For Junior Developers Taking Over

1. **Read this document** thoroughly
2. **Run the app** and explore features
3. **Read `app/page.tsx`** to understand state flow
4. **Pick a component** and trace its code
5. **Make a small change** (e.g., add a button)
6. **Test your change** in the browser
7. **Ask questions** if anything is unclear

### Code Review Checklist
- [ ] Code follows naming conventions
- [ ] Functions are well-commented
- [ ] No console errors or warnings
- [ ] TypeScript types are correct
- [ ] UI looks good in dark mode
- [ ] Feature works on Chrome, Firefox, Safari

---

## 📞 Support & Maintenance

### Common Issues

**Issue**: JSON not parsing
- **Fix**: Check for syntax errors, trailing commas, unquoted keys

**Issue**: Tree not expanding
- **Fix**: Check `expandedPaths` state, verify path matching logic

**Issue**: Copy not working
- **Fix**: Check clipboard permissions (HTTPS required for modern API)

**Issue**: Share URL too long
- **Fix**: Expected behavior for large JSON (browser limitation)

### Performance Notes

- Tree rendering is **recursive** - may be slow for deeply nested JSON
- No virtualization - large arrays (1000+ items) may lag
- Compression reduces URL size but adds processing time

---

## 📊 Metrics & Analytics (Future)

If you want to add analytics later:
- **Events to track**: JSON size, tree depth, copy actions, share clicks
- **Tools**: Google Analytics, Mixpanel, PostHog
- **Privacy**: No PII, JSON content never sent to servers

---

## 🔒 Security Considerations

- **No server**: No injection attacks, no data leaks
- **URL encoding**: JSON is compressed, not human-readable in URL
- **Clipboard**: Uses secure APIs (requires HTTPS)
- **File upload**: Client-side only, no upload to server

**Note**: Users should not paste sensitive data (passwords, tokens) into a public web app.

---

## 📄 License & Credits

- **License**: (Add your license here - MIT, Apache, etc.)
- **Author**: (Your name/team)
- **Inspiration**: Postman JSON viewer, JSON Editor Online

---

## 🎉 Conclusion

**JSON Simplify** is designed to be:
- ✅ **Simple**: Easy to understand and modify
- ✅ **Maintainable**: Well-organized, well-documented code
- ✅ **Junior-friendly**: Clear patterns, no magic
- ✅ **Production-ready**: Full feature set, error handling

**Next Steps**:
1. Deploy to Vercel/Netlify
2. Add tests
3. Gather user feedback
4. Iterate on features

**Questions?** Check the code comments or reach out to the team!

---

*Last Updated: December 2025*
*Version: 1.0.0*
