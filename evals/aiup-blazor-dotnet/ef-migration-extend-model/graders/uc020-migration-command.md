---
criterion: "UC-prefixed migration command"
type: regex
weight: 10
target: trace
pattern: 'dotnet ef migrations add UC0?20_[A-Za-z]'
---
