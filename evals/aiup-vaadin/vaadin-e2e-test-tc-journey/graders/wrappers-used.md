---
criterion: "Drama Finder wrappers only"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*TextFieldElement\.getByLabel\()(?=.*getByLabel\([^)]*\\"Search by last name\\")(?=.*DatePickerElement\.getByLabel\()(?=.*ButtonElement\.getByText\()(?=.*GridElement\b)(?=.*NotificationElement\b).*TC003\w*IT\.java'
---
