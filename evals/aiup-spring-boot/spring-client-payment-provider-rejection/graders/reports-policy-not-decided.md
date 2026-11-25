---
criterion: "No retry or fallback invented"
type: regex
weight: 3
target: { source: file, path: "session-log.md" }
pattern: '([Rr]etr(y|ies)|[Tt]imeouts?|[Ff]allback)[\s\S]{0,300}([Nn]ot decided|[Uu]ndecided|[Nn]o [\w /,-]{0,40}decided|[Ll]ibrary default|[Oo]pen [Qq]uestion|[Ll]eft open|[Nn]ot (set|configured|added|implemented))|([Nn]ot decided|[Uu]ndecided|[Nn]o [\w /,-]{0,40}decided)[\s\S]{0,200}([Rr]etr|[Tt]imeout|[Ff]allback)'
---
