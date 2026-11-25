---
criterion: "Persistence"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*REGISTRATION\.(PARTICIPANT_)?EMAIL)[^\n]*?Repository\.java.*(fetchExists\(|\bexists\(|selectOne\(\)|fetchOptional\()'
---
