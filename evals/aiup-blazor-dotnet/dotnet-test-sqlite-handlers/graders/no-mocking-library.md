---
criterion: "Handler exercised through its real API"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*ShopCatalog\.Tests/[\w./-]*\.cs).*(using Moq;|using NSubstitute;|new Mock<|Substitute\.For<)'
match: not_contains
---
