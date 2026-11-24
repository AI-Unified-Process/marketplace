---
criterion: "Reservation entity in the feature package"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*\.java.*(import lombok|@(Data|Getter|Setter|Builder|NoArgsConstructor|AllArgsConstructor|RequiredArgsConstructor)\b)'
match: not_contains
---
