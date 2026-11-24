---
criterion: "No waitForTimeout"
type: regex
weight: 3
target: { source: file, path: "frontend/e2e/UC-020-register-guest.spec.ts" }
pattern: 'await expect\([^;]*\)\s*\.\s*(not\s*\.\s*)?to(BeVisible|HaveText|ContainText|HaveCount|HaveValue|BeHidden)\('
---
