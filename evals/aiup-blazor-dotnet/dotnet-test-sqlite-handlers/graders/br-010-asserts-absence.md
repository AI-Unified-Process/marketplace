---
criterion: "BR-010 test present"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*InStock\s*=\s*false)(?=.*(Assert\.DoesNotContain\(|Assert\.All\(|Assert\.Equal\(\s*(\[|new\s*\[\]|new\s*\[|new\s+List)|Assert\.Collection\(|Should\(\)\.NotContain|Assert\.False\([^;]*\.Any\()).*ShopCatalog\.Tests/[\w./-]*\.cs'
---
