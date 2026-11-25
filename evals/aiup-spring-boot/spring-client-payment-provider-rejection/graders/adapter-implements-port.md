---
criterion: "Adapter in the mapped location follows the contract"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?client/paymentprovider/\w+\.java.*implements\s+(com\.example\.hotel\.booking\.)?PaymentProviderClient\b'
---
