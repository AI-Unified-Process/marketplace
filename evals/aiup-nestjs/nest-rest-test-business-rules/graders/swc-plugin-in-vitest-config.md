---
criterion: "unplugin-swc in the Vitest config"
type: regex
weight: 12
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?vitest[\w.-]*config[\w.-]*\.[cm]?[jt]s.*(swc\.vite\(|unplugin-swc)'
---
