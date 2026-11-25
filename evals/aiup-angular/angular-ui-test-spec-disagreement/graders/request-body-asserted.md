---
criterion: "Request body and response shape match the contract"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*request\.body\)\s*\.\s*to(Strict)?Equal\()(?=.*firstName)(?=.*lastName)(?=.*email).*register-guest/[\w.-]*\.spec\.ts'
---
