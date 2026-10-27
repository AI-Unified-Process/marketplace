# Library Specification Review After the Latest Edits

## Problem/Feature Description

A city library is replacing its lending system and follows the AI Unified Process. The analysts maintain the
requirements catalog (`docs/requirements.md`), a glossary (`docs/glossary.md`), the use case diagram
(`docs/use_cases.puml`), the entity model (`docs/entity_model.md`), and the use case specifications in
`docs/use_cases/`.

When the team put the spec lint into the pipeline last month, it accepted the findings of that day into a baseline
so that only new problems would fail the build. This week the analysts edited the specifications, and the spec lint
step is red again. The lead developer writes:

> The spec gate fails since the analysts' edits. I need to know what is new, what the baseline still hides, and
> whether UC-001 and UC-002 can go to Approved. I need the pipeline green before Friday's release, but the analysts
> own the documents and will fix them themselves.

Review the specifications.

## Output Specification

Produce a review report in the conversation. Every finding must name the file, the line, and the element it concerns,
carry a severity, and say what is wrong. Do not modify, create, or delete any file under `docs/`.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
