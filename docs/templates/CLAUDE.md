# Project context

This project follows the AI Unified Process. Before making product, domain, or architecture decisions, read:

- the use case or test case you work on, under `docs/use_cases/` and `docs/test_cases/`
- only the `FR-*`, `NFR-*`, and `C-*` rows of `docs/requirements.md` that the use case links on its
  `**Requirements:**` line, never the whole catalog
- `docs/entity_model.md`, and `docs/glossary.md` when it exists
- the accepted architecture decision records under `docs/architecture/decisions/`
- `docs/architecture/stack.md` when the project combines layer plugins
- `docs/open_questions.md` when it exists
- `docs/vision.md` and the whole `docs/requirements.md` only when you work on the requirements themselves

## Workflow rules

1. Derive requirements from the product vision.
2. Reconcile the entity model and use case diagram when requirements change.
3. Do not implement a use case before its `UC-*.md` specification exists and its `**Status:**` is `Approved`.
4. Keep requirement, use case, and test case identifiers stable and traceable in code and tests.
5. Build and test with the installed plugins: with layer plugins, run `/use-case-implement` and `/use-case-test`,
   which follow the layers in `docs/architecture/stack.md` (set it up with `/stack`); with a combined stack plugin,
   run its `/implement` and test skills.
6. Review and preserve the conventions already established in the codebase.
7. Follow the accepted architecture decision records; record a new architecture decision with
   `/architecture-decision`, linked to the non-functional requirement or constraint it serves.

## Verification

Run the project's documented build, static analysis, and test commands after implementation. Report any verification
that could not be completed.
