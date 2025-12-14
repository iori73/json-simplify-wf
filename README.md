# JSON Simplify 🔍

A simple, powerful tool to visualize, navigate, and explore JSON data structures. Built with Next.js, React, and TypeScript.

![JSON Simplify](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-blue?logo=react)

## ✨ Features

- 🌳 **Interactive Tree View** - Navigate JSON like a file explorer
- 📋 **Path Copying** - Click any value to copy its path in bracket notation
- 🔍 **Smart Search** - Search by key with auto-expand to matches
- 🔗 **Shareable Links** - Share JSON via compressed URL
- 🎨 **Dark Mode** - Easy on the eyes with color-coded types
- 📁 **File Upload** - Paste JSON or upload .json files
- 💾 **Copy Values** - Drag to select and copy JSON-safe values

## 🚀 Quick Start

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

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 Usage

1. **Input JSON**: Paste or upload JSON in the left panel
2. **Navigate**: Click to expand/collapse objects and arrays
3. **Copy Paths**: Click any value to copy its path (e.g., `user.orders[0].price`)
4. **Search**: Use the search bar to find keys
5. **Share**: Click the share button to create a shareable URL

## 🏗️ Architecture

```
┌─────────────────┬──────────────────────┐
│ JSON Input      │ Tree Viewer          │
│ (Left Panel)    │ (Right Panel)        │
│                 │                      │
│ • Paste         │ • Expand/Collapse    │
│ • Upload        │ • Click to copy path │
│ • Validate      │ • Search highlight   │
└─────────────────┴──────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Path Preview (Bottom Panel)             │
│ • Shows current path and value          │
│ • Copy path / Copy value buttons        │
└─────────────────────────────────────────┘
```

## 📁 Project Structure

```
json-simplify/
├── app/
│   ├── page.tsx           # Main application
│   └── layout.tsx         # Root layout
├── components/
│   ├── JsonInput.tsx      # JSON input panel
│   ├── TreeViewer.tsx     # Tree display
│   ├── TreeNodeComponent.tsx  # Individual nodes
│   ├── PathPreview.tsx    # Path/value preview
│   ├── SearchBar.tsx      # Search functionality
│   └── ShareButton.tsx    # URL sharing
└── lib/
    ├── types.ts           # TypeScript types
    ├── jsonUtils.ts       # JSON operations
    ├── urlUtils.ts        # URL encoding/decoding
    └── clipboardUtils.ts  # Clipboard operations
```

## 🎯 Key Design Decisions

- **Frontend-only**: No backend, fully client-side
- **Modular components**: Each component has a single responsibility
- **Type-safe**: Comprehensive TypeScript throughout
- **Junior-friendly**: Well-commented code with clear patterns
- **DRY principle**: Reusable utilities in `lib/`

## 📚 Documentation

For detailed documentation including:
- Architecture deep-dive
- Component API reference
- Utility function guide
- Development guidelines
- Feature implementation details

See [PRODUCT.md](./PRODUCT.md)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Compression**: pako (for URL sharing)

## 🎨 Features in Detail

### Path System
Paths use JavaScript bracket notation:
```javascript
user.name           // Object property
items[0]            // Array index
user.orders[0].total // Nested path
```

### Search
- Searches by key name (case-insensitive)
- Auto-expands tree to reveal matches
- Highlights matching nodes

### Shareable URLs
JSON is compressed (pako) and encoded in URL:
```
https://yoursite.com?json=eJyrVkrOz...
```
Large JSON may exceed URL limits - acceptable by design.

## 🤝 Contributing

This project is built to be junior-developer friendly:

1. Read [PRODUCT.md](./PRODUCT.md) for full architecture guide
2. Each component is self-contained and documented
3. Utilities are pure functions (easy to test)
4. State management is centralized in `app/page.tsx`

## 📝 License

MIT License - feel free to use in your own projects!

## 🙏 Acknowledgments

- Inspired by Postman's JSON viewer
- Built with ❤️ for developers who work with JSON

## 📞 Support

For questions or issues:
- Check [PRODUCT.md](./PRODUCT.md) for detailed docs
- Review component comments
- Test utility functions independently

---

**Made with Next.js** | [Report Bug](../../issues) | [Request Feature](../../issues)
