---
criterion: "A2 asserts no request is sent"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bit\(\s*(\\"|''|`)A2\b)(?=.*(field-error|(\\"|''|`)Required(\\"|''|`)|ng-invalid|aria-invalid|hasError\(\s*(\\"|''|`)required)).*register-guest/[\w.-]*\.spec\.ts'
---
