# Component Architecture Diagram

## Application Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         app/layout.tsx                           │
│                     (Root Layout + Metadata)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         app/page.tsx                             │
│                      (Main Orchestrator)                         │
│                                                                  │
│  State:                                                          │
│  • jsonInput          (string)                                   │
│  • jsonError          (string | null)                            │
│  • rootNode           (TreeNode | null)                          │
│  • selectedNode       (TreeNode | null)                          │
│  • searchTerm         (string)                                   │
│  • expandedPaths      (Set<string>)                              │
│                                                                  │
│  Effects:                                                        │
│  • Load JSON from URL on mount                                   │
│  • Parse JSON when input changes                                 │
│  • Auto-expand search results                                    │
└──────┬──────┬──────┬──────┬──────┬──────────────────────────────┘
       │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼
    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌────────┐
    │ 1 │ │ 2 │ │ 3 │ │ 4 │ │   5    │
    └───┘ └───┘ └───┘ └───┘ └────────┘
```

---

## Component Tree

```
app/page.tsx (Main App)
│
├── Header
│   ├── Title + Description
│   └── ShareButton (5)
│
├── SearchBar (2) [conditional: if rootNode exists]
│
├── Main Content Area (flex)
│   │
│   ├── Left Panel
│   │   └── JsonInput (1)
│   │       ├── Textarea
│   │       ├── Upload Button
│   │       ├── Prettify Button
│   │       ├── Clear Button
│   │       └── Error Display
│   │
│   └── Right Panel
│       └── TreeViewer (3)
│           └── TreeNodeComponent (recursive)
│               ├── Node Header
│               │   ├── Expand Icon
│               │   ├── Key
│               │   └── Value
│               └── Children (recursive TreeNodeComponent)
│
├── Bottom Panel [conditional: if selectedNode exists]
│   └── PathPreview (4)
│       ├── Path Display + Copy Button
│       ├── Value Preview
│       ├── Copy Value Button
│       └── Type Indicator
│
└── Footer
    └── Usage Hints
```

---

## Data Flow

### 1. JSON Input Flow
```
User types/pastes JSON
    ↓
JsonInput onChange
    ↓
app/page.tsx setJsonInput
    ↓
useEffect (on jsonInput change)
    ↓
validateJson()
    ↓
JSON.parse()
    ↓
jsonToTree()
    ↓
setRootNode
    ↓
TreeViewer re-renders
```

### 2. Node Click Flow (Leaf Value)
```
User clicks leaf value
    ↓
TreeNodeComponent handleClick
    ↓
copyToClipboard(node.path)
    ↓
onNodeClick(node)
    ↓
app/page.tsx setSelectedNode
    ↓
PathPreview re-renders with new node
```

### 3. Node Click Flow (Object/Array)
```
User clicks object/array
    ↓
TreeNodeComponent handleClick
    ↓
onToggleExpand(node.path)
    ↓
app/page.tsx handleToggleExpand
    ↓
Update expandedPaths Set
    ↓
TreeNodeComponent re-renders
    ↓
Children show/hide
```

### 4. Search Flow
```
User types in SearchBar
    ↓
onSearchChange(term)
    ↓
app/page.tsx setSearchTerm
    ↓
useEffect (on searchTerm change)
    ↓
searchTree(rootNode, term)
    ↓
getParentPaths(each match)
    ↓
Update expandedPaths
    ↓
TreeViewer re-renders
    ↓
Matched nodes visible and highlighted
```

### 5. Share Flow
```
User clicks Share button
    ↓
ShareButton handleShare
    ↓
createShareableUrl(jsonString)
    ↓
encodeJsonToUrl
    ├─ pako.deflate (compress)
    ├─ btoa (base64 encode)
    └─ URL-safe replacements
    ↓
copyToClipboard(url)
    ↓
Show success message
```

---

## Component Responsibilities

### 1. JsonInput (Left Panel)
**Purpose**: Accept and validate JSON input

**Props**:
- `value: string` - Current JSON
- `onChange: (json: string) => void` - Update callback
- `error: string | null` - Error message

**Features**:
- Textarea input
- File upload
- Drag & drop
- Prettify button
- Clear button
- Error display

**No State**: Fully controlled by parent

---

### 2. SearchBar
**Purpose**: Search for keys in JSON

**Props**:
- `searchTerm: string` - Current search
- `onSearchChange: (term: string) => void` - Update callback
- `matchCount?: number` - Number of matches

**Features**:
- Text input
- Clear button
- Match counter

**No State**: Fully controlled by parent

---

### 3. TreeViewer + TreeNodeComponent
**Purpose**: Display JSON tree structure

**TreeViewer Props**:
- `rootNode: TreeNode | null` - Tree root
- `onNodeClick: (node: TreeNode) => void` - Click handler
- `selectedPath: string | null` - Currently selected path
- `searchTerm: string` - For highlighting
- `expandedPaths: Set<string>` - Expanded nodes
- `onToggleExpand: (path: string) => void` - Toggle handler

**TreeNodeComponent Props**:
- `node: TreeNode` - Node to render
- `onToggleExpand: (path: string) => void`
- `onNodeClick: (node: TreeNode) => void`
- `isExpanded: boolean` - Is this node expanded?
- `isSelected: boolean` - Is this node selected?
- `searchTerm: string` - For highlighting
- `expandedPaths: Set<string>` - Pass to children

**Features**:
- Recursive rendering
- Expand/collapse icons
- Color-coded types
- Search highlighting
- Click to copy path (leaf)
- Click to expand (object/array)
- Drag to copy value

**Local State**:
- `showCopyHint: boolean` - Temporary copy feedback

---

### 4. PathPreview (Bottom Panel)
**Purpose**: Show path and value of selected node

**Props**:
- `selectedNode: TreeNode | null` - Node to preview

**Features**:
- Path display with copy button
- Value preview (formatted JSON)
- Copy value button
- Type indicator

**Local State**:
- `copiedItem: 'path' | 'value' | null` - Temporary copy feedback

---

### 5. ShareButton
**Purpose**: Generate shareable URL

**Props**:
- `jsonString: string` - JSON to encode
- `disabled?: boolean` - Disable if invalid

**Features**:
- Compress JSON with pako
- Encode to URL-safe base64
- Copy to clipboard
- Error handling for large JSON

**Local State**:
- `status: 'idle' | 'copied' | 'error'` - Button state

---

## Utility Dependencies

```
Components
    ↓
lib/jsonUtils.ts
    • validateJson
    • prettifyJson
    • jsonToTree
    • searchTree
    • getParentPaths
    • formatValueDisplay
    • buildPath
    • isLeafNode
    • toJsonString
    
lib/urlUtils.ts
    • encodeJsonToUrl
    • decodeJsonFromUrl
    • createShareableUrl
    • getJsonFromUrl
    
lib/clipboardUtils.ts
    • copyToClipboard
    • showNotification
    
lib/types.ts
    • TreeNode
    • JsonValueType
    • Component props interfaces
```

---

## State Management Strategy

### Why Centralized State?
- **Single source of truth**: All state in `app/page.tsx`
- **Predictable**: Easy to understand data flow
- **Debuggable**: One place to check state
- **No prop drilling**: Components receive only what they need

### State Variables Explained

1. **`jsonInput`**: Raw JSON string
   - Updated by: JsonInput onChange
   - Used by: JSON parsing effect

2. **`jsonError`**: Validation error
   - Updated by: JSON parsing effect
   - Used by: JsonInput (display), ShareButton (disable)

3. **`rootNode`**: Parsed tree structure
   - Updated by: JSON parsing effect
   - Used by: TreeViewer, search effect

4. **`selectedNode`**: Current selection
   - Updated by: TreeNodeComponent click
   - Used by: PathPreview

5. **`searchTerm`**: Search query
   - Updated by: SearchBar input
   - Used by: Search effect, TreeNodeComponent (highlight)

6. **`expandedPaths`**: Set of expanded paths
   - Updated by: Toggle handler, search effect, auto-expand
   - Used by: TreeNodeComponent (determine expanded state)

---

## Component Communication

### Parent → Child (Props)
```typescript
// app/page.tsx passes data down
<TreeViewer
  rootNode={rootNode}
  selectedPath={selectedNode?.path}
  // ... other props
/>
```

### Child → Parent (Callbacks)
```typescript
// TreeNodeComponent calls parent function
onNodeClick(node);  // Updates selectedNode in parent
onToggleExpand(path);  // Updates expandedPaths in parent
```

### Sibling Communication
Siblings communicate through shared parent state:
```
JsonInput → app/page.tsx (jsonInput) → TreeViewer
SearchBar → app/page.tsx (searchTerm) → TreeViewer
TreeViewer → app/page.tsx (selectedNode) → PathPreview
```

---

## Rendering Optimization

### Current Approach
- React default reconciliation
- Re-render on state change
- Sufficient for small to medium JSON

### Future Optimizations (if needed)
1. **useMemo** for expensive computations:
   ```typescript
   const treeData = useMemo(() => jsonToTree(parsed), [parsed]);
   ```

2. **useCallback** for event handlers:
   ```typescript
   const handleClick = useCallback((node) => {...}, [deps]);
   ```

3. **React.memo** for components:
   ```typescript
   export default React.memo(TreeNodeComponent);
   ```

4. **Virtual scrolling** for large trees:
   - Use `react-window` or `react-virtualized`

---

## Key Patterns Used

### 1. Controlled Components
All components are controlled (no internal state for data):
```typescript
<JsonInput value={jsonInput} onChange={setJsonInput} />
```

### 2. Render Props / Callbacks
Parent passes handlers to control behavior:
```typescript
<TreeViewer onNodeClick={handleNodeClick} />
```

### 3. Conditional Rendering
Show/hide based on state:
```typescript
{rootNode && <SearchBar />}
{selectedNode && <PathPreview />}
```

### 4. Recursive Components
TreeNodeComponent renders itself for children:
```typescript
{node.children?.map(child => (
  <TreeNodeComponent node={child} />
))}
```

### 5. Effect for Side Effects
Load/parse/search in useEffect:
```typescript
useEffect(() => {
  // Parse JSON when input changes
}, [jsonInput]);
```

---

*Refer to this diagram when understanding component relationships!*
