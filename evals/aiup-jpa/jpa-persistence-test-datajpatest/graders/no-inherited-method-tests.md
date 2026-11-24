---
criterion: "No tests of inherited Spring Data methods"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC031SearchReservationsRepositoryTest\.java.*(\.(save|saveAll|saveAndFlush|findById|findAll|deleteById|delete|existsById)\(|void \w*([Ss]ave|[Ff]ind_?[Bb]y_?[Ii]d|[Ff]ind_?[Aa]ll|[Dd]elete)\w*\()'
match: not_contains
---
