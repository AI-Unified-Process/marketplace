<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# API contracts

When the primary actor of a use case is another system, the use case is offered through the API layer, and the
integration is usually agreed in an API contract: an OpenAPI operation, or an AsyncAPI channel. The skills never read
it. The decision rights left endpoint paths and DTO shapes to the agent, and `/spring-rest` treated paths and JSON
property names as free choices, so a partner that had built against the agreed contract broke (#51). A use case can
now link its operations on an optional `**API:**` line.

- **A line of its own, after `**Mockup:**`.** The issue proposed one `**Interface:**` line shared with the mockups
  of #48, but `**Mockup:**` had already shipped. A second line keeps the mockup line unchanged and states the entry
  layer in its label. The label is `**API:**` in German too.
- **The operation, not the file.** Each entry is a Markdown link to the contract with the operation as fragment —
  `[createBooking](../api/booking.yaml#createBooking)`, an OpenAPI `operationId`, or an AsyncAPI channel or
  operation. A use case realizes one or a few operations; a file holds the whole API, and the rest of it belongs to
  other use cases.
- **Binding, unlike a mockup.** A mockup is layout input and the specification wins over it. A partner system has
  already built against the contract, so the API layer builds the method, path, parameters, schemas, property names,
  statuses, and error responses as written, even where the project's conventions or the layer skill's defaults
  differ. These drop out of the decision rights for that operation.
- **The specification still decides the behaviour.** The steps describe the messages in business terms, and the
  flows, rules, and messages stay in the use case; field-level detail stays in the contract. Where the two disagree —
  a required field nothing supplies, a rejecting alternative flow without a documented response — the agent decides
  nothing: it records an open question, blocking, and leaves that part out. A documented response without a flow is
  built as the contract says and recorded as non-blocking.
- **Only an agreed contract is input.** `/stack` records under `## API contract` whether the project is
  contract-first or code-first. A document springdoc generates from the code is output; a line pointing to it is
  ignored. When the section is silent, a linked file counts as agreed and the skill asks for `/stack` to record it,
  because a team that writes the line means it.
- **The rule lives once.** Section "API Contract" of `/use-case-implement` holds it; `/spring-rest` and
  `/spring-rest-test` refer to it. The test skill takes the statuses and payloads from the operation and checks that
  every rejecting flow has a documented response. The coverage agent reports an endpoint that differs from its
  operation as drift and names both fixes.
- **AsyncAPI is accepted but not built.** An inbound message needs a listener, and no layer skill builds one yet. The
  line and the lint accept the channel, and the API layer skill reports that nothing builds it, rather than the
  format waiting for that skill.
- **The lint checks what is exact.** `validate_use_case.py` warns `API_NO_LINK` for a line that links nothing or a
  link without an operation; `spec_lint.py` warns `API_UNRESOLVED` for a relative link to a missing file or to an
  operation the file does not name. It searches the text for an `operationId` or a key by that name, because the lint
  uses the Python standard library only and has no YAML parser. URLs are not fetched. A missing line is never
  reported: most use cases have no external client.
- **A system we call is a different case.** An external system as a secondary actor is the Client layer's, with its
  contract in the stack file's `## External systems` table (#52); `**API:**` is only for the API we offer.
