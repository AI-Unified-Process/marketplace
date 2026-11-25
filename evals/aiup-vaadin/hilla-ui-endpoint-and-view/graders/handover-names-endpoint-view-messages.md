---
criterion: "Markers rows and Handover"
type: regex
weight: 2
target: { source: file, path: "session-log.md" }
pattern: 'Handover from hilla-ui \(UC-020\)(?=[\s\S]*Endpoint)(?=[\s\S]*(\.tsx|/guests))(?=[\s\S]*Guest registered)'
---
