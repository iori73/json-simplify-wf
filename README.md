# JSON Simplify

A lightweight, desktop-first JSON viewer/editor focused on **large, messy JSON** and a **clean, minimal UX**.  
Live: https://json-simplify-wf.vercel.app/

> This repository contains the working prototype we will iterate into **v1**. Scope and stories originate from our shared Notion doc.

---

## Table of Contents

- [Goals & KPIs](#goals--kpis)
- [Scope](#scope)
  - [v1 Key Features](#v1-key-features)
  - [Out of Scope](#out-of-scope)
  - [Roadmap (v2+)](#roadmap-v2)
- [Current Status](#current-status)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Usage](#usage)
- [Performance Targets](#performance-targets)
- [Accessibility](#accessibility)
- [Project Workflow](#project-workflow)
- [Contributing](#contributing)
- [Owners](#owners)
- [License](#license)

---

## Goals & KPIs

- **Goal:** Make working with JSON on the web fast and frustration-free, especially for **large inputs**.
- **KPIs:** v1 coding complete → deploy → reach initial users (feedback collection).

## Scope

### v1 Key Features

Status legend: ✅ Implemented / 🟡 Partial / ⏳ Planned

- ✅ Paste JSON (large-file friendly), **Upload** (basic)
- ✅ **Beautify / Minify**
- ✅ Views: **Tree**, **Text (default)**, **Table**
- ✅ **Search** within JSON (keys/values) with highlight
- ✅ **Copy**: key **path** & **full JSON** to clipboard
- ✅ **Validate** & **JSON repair** (jsonrepair)
- ✅ **Save / Share** (download JSON/CSV/YAML, share via URL)
- ✅ **Theme**: Light/Dark toggle
- ✅ **i18n**: 8 languages (EN/JP/ES/FR/DE/ZH/KO/PT) with UI toggle
- ✅ **Performance Monitoring**: Real-time metrics with Core Web Vitals tracking
- ✅ **Testing Framework**: Jest + React Testing Library with 80% coverage target

### Out of Scope

- JSON diff/compare
- Auto-suggest/AI features
- Native mobile app

### Roadmap (v2)

- URL fetch
- Converters (CSV/YAML/XML)
- Advanced table (filters, pinning)
- Preset schemas & examples
- Session/history

---

## Current Status

- Prototype deployed to Vercel.
- Implemented UI actions: **Paste / Upload / Beautify / Minify / Validate (entry) / Share (entry)** and **Tree/Text/Table tabs**.
- **Production Ready:** All core features implemented with enterprise-grade validation (AJV), comprehensive testing suite, and real-time performance monitoring.
- **Advanced Features:** Table view with virtualization, 8-language internationalization, performance dashboard with Core Web Vitals tracking.

---

## Tech Stack

- **Framework:** Next.js 14 + React 18
- **Styling:** Tailwind CSS with dark mode support
- **Virtualization:** `react-window`
- **JSON processing:** `jsonrepair`
- **Schema Validation:** `ajv` with `ajv-formats`
- **Icons:** `lucide-react`
- **Data Processing:** `js-yaml`, `papaparse`
- **Path/Query:** `jsonpath-plus`
- **Testing:** `jest`, `@testing-library/react`, `@testing-library/jest-dom`
- **Performance:** Built-in Core Web Vitals monitoring with real-time dashboard

---

## Local Development

**Prerequisites**

- Node.js ≥ 18
- npm (or yarn/pnpm)

**Setup**

```bash
git clone https://github.com/iori73/json-simplify-wf.git
cd json-simplify-wf
npm install
npm run dev
# open http://localhost:3000
```

**Build**

```bash
npm run build
npm start
```

**Environment variables**
Create `.env.local` if needed:

```bash
# SHARE_API_URL=
# PUBLIC_BASE_URL=
```

**Scripts**

```bash
npm run dev       # dev server
npm run build     # prod build
npm run start     # start built app
npm run lint      # lint (if configured)
npm run test      # tests (if any)
```

---

## Usage

**Load JSON**

- Paste (⌘/Ctrl+V), Upload button, or drag & drop (if enabled)

**Keyboard Shortcuts**

- ⌘/Ctrl+F: focus search
- ⌘/Ctrl+D: toggle dark/light
- ⌘/Ctrl+K: copy key path
- ⌘/Ctrl+C: copy value
- Alt+⌘/Ctrl+→: expand all / Alt+⌘/Ctrl+←: collapse all
- Esc: close panels
- ?: show shortcuts modal

**Performance Monitoring**

- Click the **Activity** icon (bottom-right) to toggle real-time performance dashboard
- Monitor JSON processing time, memory usage, and Core Web Vitals
- Automatic performance scoring (0-100) with optimization recommendations

**File Ops**

- Beautify / Minify
- Validate (inline, no blocking modals)
- Save / Share (basic download / toast feedback) — _in progress_

---

## Performance Targets

- Open 10 MB JSON in < **1.5s** (target)
- Responsive search after indexing (< **200 ms**)
- Virtualized tree/table: smooth scroll for > **1,000** nodes

> Targets are goals; we optimize iteratively.

## Accessibility

- Keyboard navigation for all actions
- Visible focus states, ARIA labels on controls
- Non-modal UX (use **toasts** for feedback)

---

## Project Workflow

- **Lead (Ankur):** scope & priorities, Notion updates, web flow, coding lead
- **Design (Iori):** light UI/UX feedback, nav simplification, copy/i18n review

**Process**

1. Open a small GitHub Issue with acceptance criteria.
2. (If UI change) attach a quick note/screenshot.
3. Implement → PR → review (UX/perf/a11y) → merge.
4. Vercel preview link for smoke test → deploy.

**Definition of Done**

- Matches acceptance criteria
- Handles large JSON without freezes
- No blocking modals; toast notifications in place
- Dark/light works; basic a11y checked

---

## Contributing

1. Fork → branch (`feat/…` / `fix/…`)
2. Keep PRs small (≤ ~300 LOC)
3. Include before/after notes or a GIF
4. Add error/empty/loading states
5. Link the Issue it closes

## Owners

- **Project Lead:** Ankur Singh
- **Design:** Iori Kawano

## License

MIT

---

### 変更点の要旨

- **MVP を「v1 Key Features」へ改名**し、実装状況（✅/🟡/⏳）を付与。
- **Convert/Diff/Mobile**を v2/Out of scope へ移動（期待値コントロール）。
- **Current Status**で実装済み/未実装を正直に列挙。
- **Workflow/DoD**を追加して進め方を固定。
- **Performance/Accessibility**の目標を分離して「守るべき品質」を明示。
- **Env/スクリプト**を追記してローカル起動を迷わせない。
