---
criterion: "Controller with an error mapping per flow"
type: llm
weight: 1
focus: { source: file, path: "session-log.md" }
---

PASS if the agent's messages do not report a Location header that points to an endpoint which does not exist (a Location header is fine only when a read endpoint of the order exists). PASS also when no Location header is mentioned. FAIL if the messages describe returning a Location header for an order that cannot be read back.
