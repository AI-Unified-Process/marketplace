---
criterion: "Form above the grid"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/ui/\w+\.java.*(\(\s*(this\.)?\w*[Ff]orm\w*\s*,\s*(new\s+\w+\(\s*)?(this\.)?\w*([Bb]utton|[Rr]egister|[Aa]ctions?|[Ss]ubmit)\w*|[Bb]irth\w*\s*,\s*(new\s+\w+\(\s*)?(this\.)?\w*([Bb]utton|[Rr]egister|[Aa]ctions?|[Ss]ubmit)\w*|[Bb]irth\w*\s*\)\s*;.{0,300}?\b\w*[Ff]orm\w*\.add\(\s*(new\s+\w+\(\s*)?(this\.)?\w*([Bb]utton|[Rr]egister|[Aa]ctions?|[Ss]ubmit)\w*|(?<![.\w])add\(\s*(this\.)?\w*[Ff]orm\w*\s*\).*(?<![.\w])add\([^;]*?\b\w*([Bb]utton|[Rr]egister|[Aa]ctions?|[Ss]ubmit)\w*)'
---
