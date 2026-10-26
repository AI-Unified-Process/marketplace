# Decision Rights

<!--
Agreed in the team retrospective of 2026-10-05. The product owner reviews message texts in the pull request, so the
agent may word them; the partner portal links to our endpoints, so their paths are agreed with the portal team first.
-->

## The agent decides alone

- Internal structure and naming of the code it writes, within the glossary's terms
- DTO shapes, within the API contract of `docs/architecture/stack.md`
- User-visible messages with business meaning — errors, confirmations — the specification does not state; the
  product owner reviews them in the pull request
- Test data and the structure of the tests
- Sets the `**Status:**` line of a use case to `Implemented` once the build compiles

## The agent asks first

- Anything the specification does not cover: gaps, ambiguity, contradictions
- Validation values, limits, and defaults the specification does not state
- Changes to the data model beyond `docs/entity_model.md`
- A deviation from a constraint (`C-*`) or from the Rationale of a requirement
- A deviation from an accepted architecture decision record
- A new library or dependency
- The path of a new endpoint: the partner portal links to our endpoints, so the portal team agrees each new path
  first

## The agent never

- Changes a specification, a requirement, an architecture decision record, or the glossary on its own
- Changes an existing test to make it pass
