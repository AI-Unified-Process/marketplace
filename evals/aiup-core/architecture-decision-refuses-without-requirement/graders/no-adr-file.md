---
criterion: "No ADR written"
type: regex
weight: 25
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*docs/architecture/decisions/|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^"]*(>|tee |cp |mv )\s*[^"\s]*docs/architecture/decisions/'
match: not_contains
---
