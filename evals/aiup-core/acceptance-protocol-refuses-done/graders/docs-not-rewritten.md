---
criterion: "Nothing else changed"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"Bash",\s*"input":\s*\{(?:[^\n](?!"name":))*?(?<!\\n)(>>?|\btee( -a)?|\brm( -\w+)?|\bsed -i\S*( \S+)?)\s*(\\"|\x27)?[\w./$-]*docs/'
match: not_contains
---
