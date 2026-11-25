---
criterion: "Outbound port as a plain sibling interface"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-business/src/main/java/com/example/hotel/business/guest/GuestRepository\.java.*package com\.example\.hotel\.business\.guest;.*interface GuestRepository\b'
---
