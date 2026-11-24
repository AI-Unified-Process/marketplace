---
criterion: "Separate entity in the adapter module"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?backend/[^"]*\.java.*(import lombok|@(Data|Getter|Setter|Builder|NoArgsConstructor|AllArgsConstructor|RequiredArgsConstructor)\b)'
match: not_contains
---
