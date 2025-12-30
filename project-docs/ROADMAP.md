# Roadmap

> Last Updated: December 2024  
> Owner: Ankur Singh

This document outlines the version milestones for JSON Simplify.

---

## v1.0 - Initial Release (Complete)

**Status:** Deployed  
**URL:** https://json-simplify.vercel.app

### Implemented Features

- [x] Paste JSON input
- [x] Upload .json file (drag & drop)
- [x] Interactive tree view (collapse/expand)
- [x] Copy path on click (bracket notation)
- [x] Search by key name
- [x] Shareable URL (pako compression)
- [x] Dark theme (BTTF / Matrix)
- [x] JSON validation with error display
- [x] Prettify JSON

---

## v1.1 - Polish & Stability (In Progress)

**Status:** Planning  
**Target:** TBD

### Goals

- Bug fixes from real-world testing
- Performance improvements
- UI/UX refinements

### TODO (Ankur to fill in)

- [ ] _Add items here based on testing results_
- [ ] _..._
- [ ] _..._

### Known Issues

| Issue | Priority | Notes |
|-------|----------|-------|
| _None documented yet_ | - | - |

---

## v2.0 - Growth (Future)

**Status:** Not started  
**Target:** TBD

### Candidate Features

These are ideas, not commitments. Ankur to prioritize.

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| Performance for large JSON (>1MB) | Medium | High | Virtual scrolling? |
| Search by value (not just key) | Medium | Medium | - |
| Regex search | Low | Low | Power users |
| Professional dark theme | Low | Medium | IDE-like, less playful |
| Table view for arrays | Medium | Medium | - |
| Save multiple JSONs locally | Medium | Medium | LocalStorage |
| Compare two JSONs | High | Medium | Could be separate tool |
| i18n (EN/JA) | Medium | Low | - |

### Out of Scope

- Diff/compare tool (separate product if needed)
- AI/LLM features
- Mobile app
- User accounts / backend

---

## Open Questions

| Question | Status | Notes |
|----------|--------|-------|
| Domain name? | Pending | `jsonsimplify.com` is taken. Consider `.dev` or `.io`, or rename product. |
| v2 priority? | Pending | Ankur to decide based on user feedback |
| Marketing strategy? | Not started | GitHub, Reddit, Hacker News? |

---

## How to Update This Roadmap

1. Create GitHub Issues for specific tasks
2. Link Issues to the appropriate version section
3. Update this document when milestones are completed

---

## References

- [PRD.md](./PRD.md) - Full product requirements
- [TEAM_AGREEMENT.md](./TEAM_AGREEMENT.md) - Role definitions
- [GitHub Issues](https://github.com/JSON-Simplify/json-simplify/issues) - Task tracking

