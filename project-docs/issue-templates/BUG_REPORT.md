# Bug Report Template

Use this template when creating a GitHub Issue for a bug.

---

## Title

`[Bug] Brief description of the issue`

---

## Template

```markdown
## Description

A clear description of what the bug is.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Paste this JSON: '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Screenshots

If applicable, add screenshots to help explain the problem.

## Environment

- Browser: [e.g., Chrome 120, Firefox 121]
- OS: [e.g., macOS 14, Windows 11]
- Screen size: [e.g., 1920x1080]

## Sample JSON (if relevant)

```json
{
  "paste": "your JSON here"
}
```

## Additional Context

Any other information that might be helpful.
```

---

## Labels to Add

- `bug`
- `priority-high` / `priority-medium` / `priority-low`

---

## Example

**Title:** `[Bug] Tree view crashes with deeply nested JSON`

**Description:** When pasting JSON with more than 50 levels of nesting, the browser tab becomes unresponsive.

**Steps to Reproduce:**
1. Open https://json-simplify.vercel.app
2. Paste the attached JSON (deeply-nested.json)
3. Browser freezes

**Expected:** Tree should render (possibly with performance warning)

**Actual:** Browser tab crashes

