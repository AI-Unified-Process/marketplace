---
criterion: "Markers rows and Handover"
type: regex
weight: 2
target: { source: file, path: "docs/architecture/stack.md" }
pattern: '(?=[\s\S]*\|\s*All\s*\|)(?=[\s\S]*\|\s*Migration\s*\|\s*flyway-schema\s*\|)(?=[\s\S]*\|\s*Persistence\s*\|\s*jooq-persistence\s*\|)(?=[\s\S]*\|\s*Service\s*\|\s*spring-service\s*\|)'
---
