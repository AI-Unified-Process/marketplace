---
criterion: "Glossary terms"
type: regex
weight: 3
target: { source: file, path: "docs/user_guide/participant.md" }
pattern: '\b([Bb]ookings?|[Ss]ign-ups?|[Cc]ourses?|Events?|[Aa]ttendees?|Admins?|[Ff]ree seats)\b'
match: not_contains
---
