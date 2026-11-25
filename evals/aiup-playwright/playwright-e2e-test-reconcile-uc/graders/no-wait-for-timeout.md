---
criterion: "No waitForTimeout"
type: regex
weight: 6
target: { source: file, path: "frontend/e2e/UC-020-register-guest.spec.ts" }
pattern: 'waitForTimeout'
match: not_contains
---
