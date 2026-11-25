---
criterion: "A2 unavailable mapped for both causes"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?client/paymentprovider/\w+\.java.*(\b503\b|SERVICE_UNAVAILABLE|ServiceUnavailable|is5xxServerError).{0,400}?throw\s+new\s+\w*Unavailable\w*Exception'
---
