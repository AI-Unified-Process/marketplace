---
criterion: "Documents untouched"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"Bash",\s*"input":\s*\{(?:[^\n](?!"name":))*?(?<!\\n)(>>?|\btee( -a)?|\brm( -\w+)?|\bsed -i\S*( \S+)?)\s*(\\"|\x27)?[\w./$-]*docs/'
match: not_contains
---
