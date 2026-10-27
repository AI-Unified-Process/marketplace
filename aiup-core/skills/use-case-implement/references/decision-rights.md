# Decision Rights

<!--
Which decisions the AI agent takes alone during construction, which it asks about first, and which it never takes.
/use-case-implement, its layer skills, and /use-case-test read this file; without it, they use the defaults of
/use-case-implement, which this file starts as. Move a rule between "decides alone" and "asks first", reword it, or
add one of your own. The rules under "never" always apply, also when this file leaves them out: you can add a rule
there, not remove one. A decision no rule names is asked first.
-->

## The agent decides alone

- Internal structure and naming of the code it writes, within the glossary's terms
- UI layout, labels, and column order, within the project's conventions
- Endpoint paths and DTO shapes, within the API contract of `docs/architecture/stack.md`, except for an operation
  the use case's `**API:**` line links, which is built as its contract says
- Test data and the structure of the tests

## The agent asks first

- Anything the specification does not cover: gaps, ambiguity, contradictions
- Validation values, limits, and defaults the specification does not state
- User-visible messages with business meaning — errors, confirmations — the specification does not state
- Changes to the data model beyond `docs/entity_model.md`
- A deviation from a constraint (`C-*`) or from the Rationale of a requirement
- A deviation from an accepted architecture decision record
- A new library or dependency
- The retry, timeout, and fallback policy for a call to an external system

## The agent never

- Changes a specification, a requirement, an architecture decision record, or the glossary on its own
- Changes an existing test to make it pass
- Sets or changes a status line
