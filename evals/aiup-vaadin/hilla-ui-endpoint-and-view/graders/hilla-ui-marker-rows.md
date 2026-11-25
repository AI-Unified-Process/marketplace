---
criterion: "Markers rows and Handover"
type: regex
weight: 3
target: { source: file, path: "docs/architecture/stack.md" }
pattern: '(?=[\s\S]*\|\s*UI\s*\|\s*hilla-ui\s*\|\s*Code\s*\|[^\n]*file comment)(?=[\s\S]*\|\s*UI\s*\|\s*hilla-ui\s*\|\s*Code\s*\|[^\n]*BR-YYY)(?=[\s\S]*\|\s*UI\s*\|\s*hilla-ui\s*\|\s*Name\s*\|)'
---
