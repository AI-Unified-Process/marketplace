---
criterion: "Backend tests only"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*\bShopCatalog/|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(>|sed -i[^\n]*?)\s*[\w./-]*\bShopCatalog/[\w./-]*\.(cs|razor)'
match: not_contains
---
