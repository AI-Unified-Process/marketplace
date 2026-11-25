---
criterion: "Assertions that compile"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(PlaywrightAssertions\.assertThat\(|import static com\.microsoft\.playwright\.assertions\.PlaywrightAssertions\.assertThat;))(?=.*(hasText|isVisible)\().*TC003\w*IT\.java'
---
