---
criterion: "Layer boundaries respected"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*package\.json"|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?\b(npm (install|i|add) (-{1,2}(?!prefix\b)\w[\w-]*(=\S+)? )*[@a-zA-Z]|pnpm add |yarn add |bun add )'
match: not_contains
---
