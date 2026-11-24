---
criterion: "Grid columns in the mockup's order"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/ui/\w+\.java.*(addColumn\([^)]*lastName.*addColumn\([^)]*firstName.*addColumn\([^)]*email|setColumns\(\s*\\"lastName\\"\s*,\s*\\"firstName\\"\s*,\s*\\"email\\"\s*\)|setHeader\(\s*\\"Last [Nn]ame\\".*setHeader\(\s*\\"First [Nn]ame\\".*setHeader\(\s*\\"Email\\")'
---
