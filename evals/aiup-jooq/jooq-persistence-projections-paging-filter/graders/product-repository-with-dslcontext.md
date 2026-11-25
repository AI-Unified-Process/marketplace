---
criterion: "Repository per aggregate"
type: regex
weight: 11
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*package com\.example\.shop\.persistence;)(?=.*@Repository)(?=.*public ProductRepository\(\s*(final )?DSLContext \w+\s*\)).*com/example/shop/persistence/ProductRepository\.java'
---
