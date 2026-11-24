---
criterion: "A2 unavailable mapped for both causes"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?client/paymentprovider/\w+\.java.*catch\s*\([^)]*(ResourceAccessException|IOException|SocketTimeoutException|HttpTimeoutException)[^)]*\).{0,400}?throw\s+new\s+\w*Unavailable\w*Exception'
---
