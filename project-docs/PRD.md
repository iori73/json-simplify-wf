# JSON Simplify - Product Requirements Document

> Last Updated: December 2024  
> Status: v1 Deployed, Polishing Phase

---

## 1. Overview

| Item | Description |
|------|-------------|
| **Product Name** | JSON Simplify |
| **Type** | Web-based JSON viewer/explorer |
| **Live URL** | https://json-simplify.vercel.app |
| **Repository** | https://github.com/JSON-Simplify/json-simplify |
| **Status** | v1 deployed, polishing phase |

---

## 2. Problem Statement

### Core Pain Point

Engineers frequently deal with large, deeply nested API responses that are difficult to read, navigate, and debug in raw text form.

### Current Workarounds

- Copy-paste into VS Code and manually format
- Use browser dev tools (limited functionality)
- Existing tools like jsonformatter.org (cluttered UI, ads, privacy concerns)

### Our Solution

A clean, fast, privacy-respecting JSON viewer that helps engineers quickly understand API structure and extract the paths they need for their code.

---

## 3. Target Users

| Priority | User Type | Needs |
|----------|-----------|-------|
| Primary | Backend/Frontend Engineers | Debug API responses, copy paths for code |
| Secondary | Students | Learn JSON structure, practice parsing |

---

## 4. Core User Journey

```
1. Engineer hits a bug with an API response
2. Opens JSON Simplify in browser
3. Pastes the JSON
4. Navigates the tree to find the problematic field
5. Copies the path (e.g., `data.users[0].address.city`)
6. Uses the path in their code
7. (Optional) Shares the JSON via URL with teammate
```

---

## 5. Features

### v1 (Implemented)

| Feature | Status | Notes |
|---------|--------|-------|
| Paste JSON | Done | Left panel textarea |
| Upload .json file | Done | Drag & drop supported |
| Tree view | Done | Collapse/expand |
| Copy path | Done | Click value to copy bracket notation |
| Search by key | Done | Auto-expand to matches |
| Shareable URL | Done | pako compression |
| Dark theme | Done | BTTF / Matrix themes |
| Validation | Done | Error display |
| Prettify | Done | Format JSON |

### v2 (Candidates - Not Prioritized)

| Feature | Rationale |
|---------|-----------|
| Performance optimization | Handle JSON > 1MB smoothly |
| Better search (value search, regex) | Deeper debugging |
| Save/compare multiple JSONs | API version comparison |
| Professional dark theme | Less playful, more IDE-like |
| Table view for arrays | Easier data inspection |
| i18n (EN/JA) | Broader audience |

### Out of Scope

- Diff/compare tool (separate product)
- Auto-suggestions / AI features (complexity)
- Mobile app (desktop-first)
- Backend / user accounts (privacy-first, no data storage)

---

## 6. Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| Compression | pako |
| Hosting | Vercel |

---

## 7. Team & Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| Ankur Singh | Project Lead / Engineer | Technical decisions, implementation, roadmap |
| Iori | UI/UX Advisor | Design feedback, testing, UX review |

See [TEAM_AGREEMENT.md](./TEAM_AGREEMENT.md) for detailed role definitions.

---

## 8. Open Questions

| Question | Owner | Status |
|----------|-------|--------|
| Domain name? (`jsonsimplify.com` is taken) | Ankur | Pending |
| v2 feature priority? | Ankur | Pending |
| Rename product to avoid collision? | Ankur | Pending |

---

## 9. Success Metrics (Future)

| Metric | Target | Notes |
|--------|--------|-------|
| Monthly active users | TBD | Vercel Analytics |
| GitHub stars | TBD | Community interest |
| Return visitors | TBD | Indicates usefulness |

---

## 10. References

- [TEAM_AGREEMENT.md](./TEAM_AGREEMENT.md) - Role definitions and communication guidelines
- [ROADMAP.md](./ROADMAP.md) - Version milestones and priorities
- [GitHub Repository](https://github.com/JSON-Simplify/json-simplify)

