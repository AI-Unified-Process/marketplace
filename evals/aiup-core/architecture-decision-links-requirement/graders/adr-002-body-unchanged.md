---
criterion: "ADR-002 superseded on both sides"
type: regex
weight: 2
target: { source: file, path: "docs/architecture/decisions/ADR-002-session-in-local-storage.md" }
pattern: '\#\# Context\n\nC\-002 makes the front end a single\-page application\. The SPA needs the session token on every API call after the\norganizer signs in\.\n\n\#\# Decision\n\nThe API returns a bearer token after sign\-in\. The SPA keeps it in `localStorage` and sends it in the\n`Authorization` header\.\n\n\#\# Consequences\n\n\- The token survives a reload of the page\.\n\- Any script on the page can read the token\.\n\- \*\*Alternatives considered:\*\* a cookie set by the API \(rejected at the time: the team had no CSRF protection yet\)\.'
---
