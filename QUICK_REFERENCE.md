# Quick Reference Guide - JSON Simplify

## 🎯 Common Development Tasks

### Adding a New Component

1. Create file in `components/` directory:
```typescript
// components/NewComponent.tsx
'use client';

interface NewComponentProps {
  // Define props
}

export default function NewComponent({ }: NewComponentProps) {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

2. Import in parent component:
```typescript
import NewComponent from '@/components/NewComponent';
```

---

### Adding a New Utility Function

1. Add to appropriate file in `lib/`:
```typescript
// lib/jsonUtils.ts

/**
 * Brief description
 * @param param - Description
 * @returns Description
 */
export function newUtility(param: string): string {
  // Implementation
  return result;
}
```

2. Use in components:
```typescript
import { newUtility } from '@/lib/jsonUtils';
```

---

### Adding a New Type

1. Add to `lib/types.ts`:
```typescript
export interface NewType {
  property: string;
}
```

2. Import where needed:
```typescript
import { NewType } from '@/lib/types';
```

---

## 🔍 Debugging Checklist

### JSON Not Parsing
- [ ] Check `validateJson()` return value
- [ ] Look for trailing commas
- [ ] Verify quotes around keys and strings
- [ ] Check for comments (not valid JSON)

### Tree Not Rendering
- [ ] Verify `rootNode` is not null
- [ ] Check `jsonToTree()` output
- [ ] Inspect `expandedPaths` state
- [ ] Look for React key warnings

### Search Not Working
- [ ] Verify `searchTree()` returns matches
- [ ] Check `getParentPaths()` output
- [ ] Confirm `expandedPaths` is updated
- [ ] Look for case sensitivity issues

### Copy Not Working
- [ ] Check browser console for errors
- [ ] Verify HTTPS (clipboard API requires secure context)
- [ ] Test fallback mechanism
- [ ] Check clipboard permissions

---

## 📝 Code Snippets

### Add State Variable
```typescript
const [newState, setNewState] = useState<Type>(initialValue);
```

### Add useEffect
```typescript
useEffect(() => {
  // Effect code
  return () => {
    // Cleanup (optional)
  };
}, [dependencies]);
```

### Handle Click Event
```typescript
const handleClick = () => {
  // Handle click
};

<button onClick={handleClick}>Click</button>
```

### Conditional Rendering
```typescript
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
```

### Map Array
```typescript
{items.map((item, index) => (
  <Component key={item.id || index} data={item} />
))}
```

---

## 🎨 Tailwind CSS Classes Used

### Colors
- `bg-gray-900` - Dark background
- `text-gray-100` - Light text
- `border-gray-700` - Borders
- `text-blue-400` - Paths
- `text-green-400` - Strings
- `text-yellow-400` - Arrays

### Layout
- `flex flex-col` - Column layout
- `flex-1` - Grow to fill space
- `gap-2` - Spacing between items
- `p-3` - Padding
- `h-full` - Full height

### Interactive
- `hover:bg-gray-800` - Hover effect
- `cursor-pointer` - Pointer cursor
- `transition-colors` - Smooth transitions

---

## 🧪 Testing Scenarios

### Manual Testing Checklist
- [ ] Paste valid JSON
- [ ] Paste invalid JSON (check error)
- [ ] Upload .json file
- [ ] Click to expand/collapse
- [ ] Click leaf value (copy path)
- [ ] Search for key
- [ ] Clear search
- [ ] Copy path button
- [ ] Copy value button
- [ ] Share button
- [ ] Load shared URL

### Sample Test JSON
```json
{
  "user": {
    "name": "John Doe",
    "age": 30,
    "active": true,
    "metadata": null
  },
  "orders": [
    {
      "id": 1,
      "items": [
        { "product": "Widget", "price": 9.99 },
        { "product": "Gadget", "price": 19.99 }
      ],
      "total": 29.98
    }
  ]
}
```

---

## 🚀 Performance Tips

### For Large JSON
1. Use `useMemo` for expensive computations
2. Consider virtual scrolling for long lists
3. Debounce search input
4. Lazy load tree nodes

### Example: Memoize Search Results
```typescript
const searchResults = useMemo(() => {
  return searchTree(rootNode, searchTerm);
}, [rootNode, searchTerm]);
```

---

## 🎓 Learning Path for New Developers

### Week 1: Understand Structure
1. Read README.md
2. Read PRODUCT.md (Architecture section)
3. Run the app and test features
4. Read `app/page.tsx` (main file)

### Week 2: Explore Components
1. Read each component file
2. Trace a click event from UI to state
3. Modify a button label (small change)
4. Add a console.log to see data flow

### Week 3: Explore Utilities
1. Read `lib/jsonUtils.ts`
2. Test `jsonToTree()` with sample JSON
3. Modify `formatValueDisplay()` (e.g., change "Array(5)" format)
4. Add a new utility function

### Week 4: Make a Feature
1. Pick from "Easy" enhancements (see PRODUCT.md)
2. Plan the changes needed
3. Implement step-by-step
4. Test thoroughly

---

## 📞 Need Help?

1. **Check documentation**: README.md → PRODUCT.md → Code comments
2. **Search codebase**: Use VS Code search for examples
3. **Test in isolation**: Copy utility function to separate file and test
4. **Add console.logs**: Debug state and props
5. **Ask questions**: Better to ask than guess!

---

## 🔖 Useful VS Code Shortcuts

- `Ctrl/Cmd + P` - Quick file open
- `Ctrl/Cmd + Shift + F` - Search in files
- `F12` - Go to definition
- `Alt + Click` - Multi-cursor
- `Ctrl/Cmd + D` - Select next occurrence

---

*Keep this file handy for quick reference during development!*
