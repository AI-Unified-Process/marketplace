---
criterion: "Boundary rows of the date range"
type: regex
weight: 9
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC031SearchReservationsRepositoryTest\.java.*void \w*([Bb]oundar|[Ii]nclu|[Ee]xclu|[Oo]utside|[Ee]dge|[Oo]n_?(the_?)?(from|to|[Ff]rom|[Tt]o)_?[Dd]ate)\w*\(.{0,3000}?findArrivals\(.{0,1500}?(containsExactly|contains\(|doesNotContain|hasSize|isEmpty|extracting\()'
---
