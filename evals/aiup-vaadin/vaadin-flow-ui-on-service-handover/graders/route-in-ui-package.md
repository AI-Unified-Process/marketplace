---
criterion: "Route view in the ui package"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*package com\.example\.hotel\.guest\.ui;)(?=.*@Route\().*com/example/hotel/guest/ui/\w+\.java'
---
