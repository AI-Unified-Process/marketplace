---
criterion: "One-time Vitest setup"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*import \{\s*webdriverio\s*\} from (\\"|\x27)@vitest/browser-webdriverio(\\"|\x27))(?=.*provider:\s*webdriverio\(\))(?=.*include:[^\]]*src/main/frontend/tests)[^\n]*?/vitest\.config\.ts'
---
