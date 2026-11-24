---
criterion: "Constraints from the contract schema"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bgivenName\b)(?=.*\bdateOfBirth\b)(?=.*@NotBlank)(?=.*@NotNull)(?=.*@Email)(?=.*@Size\s*\(\s*max\s*=\s*100\s*\))(?=.*@Size\s*\(\s*max\s*=\s*255\s*\))[^\n]*?\brecord\s+\w+\s*\('
---
