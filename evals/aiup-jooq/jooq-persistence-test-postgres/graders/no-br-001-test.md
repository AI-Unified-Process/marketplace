---
criterion: "BR-001 left to the integration layer"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC010BrowseProductCatalogRepositoryTest\.java.*(businessRules = \{[^}]*\\"BR-001\\"|void \w*(out_?[Oo]f_?[Ss]tock|[Nn]ot_?[Ii]n_?[Ss]tock|[Ss]tock_?[Rr]ule|BR_?001)\w*\()'
match: not_contains
---
