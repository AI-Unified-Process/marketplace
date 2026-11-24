---
criterion: "Delegated to the auditor"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(?:Task|Agent)",\s*"input":\s*\{[^\n]*?"prompt":\s*"(?:[^"\\]|\\.)*?(?:\.java\b|TC001FirstRegistrationIT|RegisterForWorkshopView|ParticipantsView|[Tt]erms|[Cc]heckbox)'
match: not_contains
---
