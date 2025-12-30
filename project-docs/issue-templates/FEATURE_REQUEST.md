# Feature Request Template

Use this template when creating a GitHub Issue for a new feature.

---

## Title

`[Feature] Brief description of the feature`

---

## Template

```markdown
## Problem

What problem does this feature solve? Why is it needed?

## Proposed Solution

Describe the feature you'd like to see.

## Use Case

Who would use this feature and how?

Example:
- As an engineer debugging an API, I want to [do something] so that [benefit].

## Alternatives Considered

Have you considered any alternative solutions or workarounds?

## Additional Context

Any mockups, screenshots, or references that might help.

## Priority

- [ ] Nice to have
- [ ] Would improve workflow
- [ ] Critical for my use case
```

---

## Labels to Add

- `enhancement`
- `v1.1` / `v2.0` (target version)
- `needs-discussion` (if not fully specified)

---

## Example

**Title:** `[Feature] Search by value, not just key`

**Problem:** Currently, search only matches key names. When I know the value I'm looking for (e.g., a specific user ID), I can't find it quickly.

**Proposed Solution:** Add a toggle or separate input to search by value. Highlight matching values in the tree.

**Use Case:** As an engineer debugging a payment API, I want to search for a specific transaction ID so that I can quickly find its location in a large response.

**Alternatives Considered:** Using Ctrl+F in the raw JSON, but it doesn't show the path.

**Priority:** Would improve workflow

