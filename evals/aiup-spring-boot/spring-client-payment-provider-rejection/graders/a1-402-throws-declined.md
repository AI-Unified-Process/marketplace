---
criterion: "A1 declined mapped"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?client/paymentprovider/\w+\.java.*(\b402\b|PAYMENT_REQUIRED|PaymentRequired).{0,400}?throw\s+new\s+\w*(Declin|Reject)\w*Exception'
---
