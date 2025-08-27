# JSON Simplify

A powerful, desktop-first JSON viewer and editor with tree visualization, built with Next.js and React.

## Features

### Phase 1 (MVP)
- **Tree View**: Interactive, virtualized tree display with expand/collapse functionality
- **Text View**: Raw JSON editing with syntax highlighting and real-time validation
- **Search**: Find keys and values with highlighting and navigation
- **File Operations**: Paste, upload, beautify, minify JSON data
- **Validation**: JSON Schema validation with detailed error reporting
- **Convert & Export**: Convert to CSV/YAML and download in multiple formats
- **Share**: Generate shareable URLs with data encoded
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Theme Support**: Light/dark mode with system preference detection
- **Internationalization**: English and Japanese UI support
- **Privacy-First**: All processing happens locally in your browser

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iori73/json-simplify-wf.git
cd json-simplify-wf
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Loading JSON Data
- **Drag & Drop**: Drop JSON files directly onto the application
- **Upload**: Click the upload button to select JSON files
- **Paste**: Use Ctrl/Cmd+V to paste JSON from clipboard
- **Sample Data**: Click the sample link to load demo data

### Keyboard Shortcuts
- `Ctrl/Cmd + V` - Paste JSON
- `Ctrl/Cmd + F` - Focus search
- `Ctrl/Cmd + D` - Toggle dark/light theme  
- `Ctrl/Cmd + K` - Copy selected path
- `Ctrl/Cmd + C` - Copy selected value
- `Alt + Cmd + →` - Expand all nodes
- `Alt + Cmd + ←` - Collapse all nodes
- `?` - Show shortcuts help
- `Esc` - Close modals/panels

### File Operations
- **Beautify**: Format JSON with proper indentation
- **Minify**: Remove whitespace to compress JSON
- **Validate**: Check against JSON Schema
- **Convert**: Export as CSV or YAML
- **Save**: Download in JSON, CSV, or YAML format
- **Share**: Generate URL with embedded data (up to 2MB)

## Technical Stack

- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with dark mode support
- **Virtualization**: react-window for performance with large datasets
- **JSON Processing**: jsonrepair for auto-repair functionality
- **Schema Validation**: Custom implementation (JSON Schema Draft 7 subset)
- **Format Conversion**: js-yaml, papaparse
- **Path Generation**: jsonpath-plus compatible JSONPath

## Performance

- Handles JSON files up to 50MB
- Tree virtualization for collections > 1,000 items
- Target render time: < 1.5s for 10MB files
- Search response: < 200ms after initial indexing

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

### Future Enhancements
- Table view for tabular data
- Diff/compare functionality  
- Advanced search with regex support
- Plugin system for custom transformers
- Mobile app version
- Collaborative editing features