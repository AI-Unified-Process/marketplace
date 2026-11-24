---
criterion: "Adapter in the mapped location follows the contract"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?client/paymentprovider/\w+\.java.*(\.post\(\)(\\n|\s)*\.uri\(\s*\\"/charges\\"|@PostExchange\(\s*((url|value)\s*=\s*)?\\"/charges\\")'
---
