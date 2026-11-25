---
criterion: "One test walks the Flow"
type: regex
weight: 4
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*TC001\w*IT\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*TC001\w*IT\.java).*@Test\b.*@Test\b'
match: not_contains
---
