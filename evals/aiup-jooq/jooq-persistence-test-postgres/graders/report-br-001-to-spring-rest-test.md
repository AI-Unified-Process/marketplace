---
criterion: "BR-001 left to the integration layer"
type: regex
weight: 4
target: { source: file, path: "session-log.md" }
pattern: 'BR-001[^\n]{0,300}spring-rest-test|spring-rest-test[^\n]{0,300}BR-001'
---
