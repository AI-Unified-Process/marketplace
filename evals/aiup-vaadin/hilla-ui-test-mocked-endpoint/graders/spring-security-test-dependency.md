---
criterion: "Role access tested over HTTP"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?pom\.xml.*spring-security-test(</artifactId>|\\n|\s)[^\n]*?<scope>test</scope>'
---
