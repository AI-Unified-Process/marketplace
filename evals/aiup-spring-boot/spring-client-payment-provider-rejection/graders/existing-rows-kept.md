---
criterion: "Scope and markers"
type: regex
weight: 1
target: { source: file, path: "docs/architecture/stack.md" }
pattern: '^(?=[\s\S]*\|\s*All\s*\|\s*–\s*\|\s*Code\s*\|\s*`// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule\s*\|)(?=[\s\S]*\|\s*Migration\s*\|\s*flyway-schema\s*\|\s*Code\s*\|\s*`-- UC-XXX BR-YYY:` directly above the `CHECK`, `UNIQUE`, index, or trigger that enforces the rule\s*\|)(?=[\s\S]*\|\s*Migration\s*\|\s*flyway-schema\s*\|\s*Name\s*\|\s*`src/main/resources/db/migration/V\*__\*\.sql`, named after the tables they change)'
---
