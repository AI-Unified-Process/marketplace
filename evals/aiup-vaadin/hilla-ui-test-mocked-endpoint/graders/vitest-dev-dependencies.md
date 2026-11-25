---
criterion: "One-time Vitest setup"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\\"vitest\\":)(?=.*\\"@vitest/browser-webdriverio\\":)(?=.*\\"@testing-library/react\\":)(?=.*\\"@testing-library/user-event\\":)(?!.*\\"(@vitest/browser|webdriverio)\\":)[^\n]*?/package\.json'
---
