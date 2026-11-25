---
criterion: "Form above the grid"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/ui/\w+\.java.*((?<![.\w])add\([^;]*?\b\w*[Ff]orm\w*\b[^;]*?\b\w*[Gg]rid\w*(\(\))?\s*\)|(?<![.\w])add\(\s*(this\.)?\w*[Ff]orm\w*(\(\))?\s*\).*(?<![.\w])add\(\s*(this\.)?\w*[Gg]rid\w*(\(\))?\s*\))'
---
