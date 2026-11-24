---
criterion: "Partial implementation noted"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/[^"\s]*UC-\d{3}-[^\n]*?([Pp]artial|[Nn]ot (yet )?implemented|[Uu]nimplemented|[Uu]nclear|[Pp]laceholder|[Ss]tub|[Ii]ncomplete|returns? (an )?empty|[Ee]mpty (response|body)|[Nn]o (business )?logic)'
---
