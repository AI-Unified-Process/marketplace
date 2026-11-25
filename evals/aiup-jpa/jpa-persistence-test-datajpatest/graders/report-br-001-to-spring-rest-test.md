---
criterion: "BR-001 left to the integration layer"
type: regex
weight: 4
target: { source: file, path: "session-log.md" }
pattern: 'BR-001[^\n]{0,300}(spring-rest-test|API tests?\b|integration layer)|(spring-rest-test|API tests?\b|integration layer)[^\n]{0,300}BR-001'
---
