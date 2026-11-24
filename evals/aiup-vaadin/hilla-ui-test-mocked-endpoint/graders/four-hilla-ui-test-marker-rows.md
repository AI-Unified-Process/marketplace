---
criterion: "Production untouched, failure reported, hand-off"
type: regex
weight: 2
target: { source: file, path: "docs/architecture/stack.md" }
pattern: '(\|\s*`?hilla-ui-test`?\s*\|\s*(Test|Name)\s*\|[\s\S]*?){4}'
---
