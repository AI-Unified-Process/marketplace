---
criterion: "Port with domain records only"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?booking/PaymentProviderClient\.java.*(import\s+[\w.]*\.(ResponseEntity|HttpStatusCode|HttpStatus|RestClient)\s*;|import\s+com\.example\.hotel\.client\.|\b(ResponseEntity|HttpStatusCode)<)'
match: not_contains
---
