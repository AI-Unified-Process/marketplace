---
criterion: "Customer and Order entity classes created"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*class Customer\b)(?=.*namespace ShopCatalog\.Domain;)(?=.*required string Name)(?=.*(List|ICollection|IList)<Order>\s+\w+\s*\{\s*get;\s*(set|init);\s*\}\s*=\s*(\[\]|new\b)).*Domain/[\w./-]*\.cs'
---
