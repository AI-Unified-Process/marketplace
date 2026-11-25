---
criterion: "Customer and Order entity classes created"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*class Order\b)(?=.*namespace ShopCatalog\.Domain;)(?=.*(public Customer Customer\s*\{\s*get;\s*(set|init);\s*\}\s*=\s*null!|required Customer Customer)).*Domain/[\w./-]*\.cs'
---
