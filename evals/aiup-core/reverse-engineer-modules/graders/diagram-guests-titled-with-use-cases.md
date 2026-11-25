---
criterion: "One diagram file per domain module"
type: regex
weight: 1.25
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/guest[a-z-]*/use_cases\.puml.*@startuml[ \t]+[A-Za-z\\"].*rectangle.*\busecase\b'
---
