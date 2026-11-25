---
criterion: "Assertions that compile"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*TC003\w*IT\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*TC003\w*IT\.java)(?=.*import static org\.assertj\.core\.api\.Assertions\.(assertThat|\*);)(?=.*import static com\.microsoft\.playwright\.assertions\.PlaywrightAssertions\.(assertThat|\*);)'
match: not_contains
---
