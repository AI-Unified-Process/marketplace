# Library Specification Review

## Problem/Feature Description

A city library is replacing its lending system and follows the AI Unified Process. The analysts have written the
requirements catalog (`docs/requirements.md`), a glossary (`docs/glossary.md`), the use case diagram
(`docs/use_cases.puml`), the entity model (`docs/entity_model.md`), and the first use case specifications in
`docs/use_cases/`. Both specifications are in status Reviewed, and the team wants to move them to Approved and start
implementation next week.

Before that, the lead developer wants to know whether the specifications are consistent with each other and good
enough to implement from. The analysts will fix the documents themselves, so the specifications must stay exactly as
they are.

Review the specifications.

## Output Specification

Produce a review report in the conversation. Every finding must name the file, the line, and the element it concerns
(a use case, a business rule, a requirement, or a step), carry a severity, and say what is wrong. The report must
make clear which findings are certain and would fail an automated quality gate, and which are a reviewer's judgment.
Do not modify, create, or delete any file under `docs/`.
