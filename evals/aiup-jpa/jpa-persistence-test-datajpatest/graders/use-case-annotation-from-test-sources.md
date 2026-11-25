---
criterion: "Reuses the existing UseCase annotation"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@UseCase\(\s*id = \\"UC-031\\")(?=.*(import com\.example\.hotel\.usecase\.UseCase;|package com\.example\.hotel\.usecase;)).*UC031SearchReservationsRepositoryTest\.java'
---
