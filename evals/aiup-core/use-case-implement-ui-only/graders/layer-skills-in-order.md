---
criterion: "Layer skills run bottom-up"
type: regex
weight: 15
target: trace
pattern: '"name":\s*"(Skill|Read|Bash)",\s*"input":\s*\{\s*"(skill|file_path|command)":\s*"[^"]*?flyway-schema[\s\S]*?"name":\s*"(Skill|Read|Bash)",\s*"input":\s*\{\s*"(skill|file_path|command)":\s*"[^"]*?jooq-persistence(?!-test)[\s\S]*?"name":\s*"(Skill|Read|Bash)",\s*"input":\s*\{\s*"(skill|file_path|command)":\s*"[^"]*?spring-service(?!-test)[\s\S]*?"name":\s*"(Skill|Read|Bash)",\s*"input":\s*\{\s*"(skill|file_path|command)":\s*"[^"]*?vaadin-flow-ui(?!-test)'
---
