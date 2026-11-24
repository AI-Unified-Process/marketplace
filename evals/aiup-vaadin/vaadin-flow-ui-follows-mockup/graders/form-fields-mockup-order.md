---
criterion: "Form fields in the mockup's order"
type: regex
weight: 13
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/ui/\w+\.java.*((FormLayout\(|\.add\()\s*(this\.)?\w*[Ee]mail\w*\s*,\s*(this\.)?\w*[Ll]ast[Nn]ame\w*\s*,\s*(this\.)?\w*[Ff]irst[Nn]ame\w*\s*,\s*(this\.)?\w*[Bb]irth\w*|\\"Email\\".*\\"Last name\\".*\\"First name\\".*\\"Date of birth\\")'
---
