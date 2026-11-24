---
criterion: "No retry or fallback invented"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?\.(java|yml|yaml|properties).*(@Retryable|RetryTemplate|@Recover\b|[Cc]ircuit[Bb]reaker|resilience4j|@Backoff|set(Connect|Read|Connection)Timeout\(\s*(Duration\.of\w+\(\s*)?\d|Duration\.of(Seconds|Millis|Minutes)\(\s*\d|timeout\s*[:=]\s*\d|for\s*\(\s*int\s+(attempt|retr|try)\w*|while\s*\([^)]*(attempt|retr))'
match: not_contains
---
