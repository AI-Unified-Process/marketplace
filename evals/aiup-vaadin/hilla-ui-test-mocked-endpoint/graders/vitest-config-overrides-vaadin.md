---
criterion: "One-time Vitest setup"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*import \{\s*overrideVaadinConfig\s*\} from (\\"|\x27)\./vite\.generated(\.ts)?(\\"|\x27))(?=.*export default overrideVaadinConfig\()[^\n]*?/vitest\.config\.ts'
---
