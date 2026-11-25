---
criterion: "Reservation entity in the feature package"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*package com\.example\.hotel(\.\w+)*\.reservation(\.\w+)*;)(?=.*@Entity\b)(?=.*(protected|public) Reservation\(\s*\))(?=.*public \w+ get\w+\(\)).*/reservation/Reservation\.java'
---
