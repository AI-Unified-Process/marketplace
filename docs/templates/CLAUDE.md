# Project context

This project follows the AI Unified Process. Before making product, domain, or architecture decisions, read:

- `docs/vision.md`
- `docs/requirements.md`
- `docs/glossary.md`, and use its terms
- `docs/entity_model.md`
- the relevant documents under `docs/use_cases/` and `docs/test_cases/`
- `docs/open_questions.md`, for the questions still open on what you are about to change
- `docs/architecture/stack.md`, which names the skill that builds and tests each technical layer
- the accepted architecture decision records under `docs/architecture/decisions/`

## Workflow rules

1. Derive requirements from the product vision.
2. Reconcile the entity model and use case diagram when requirements change.
3. Do not implement a use case before its `UC-*.md` specification exists and has been reviewed.
4. Keep requirement, use case, and test case identifiers stable and traceable in code and tests.
5. Build and test a use case with `/use-case-implement UC-XXX` and `/use-case-test UC-XXX`, which run the layer
   skills recorded in `docs/architecture/stack.md`; run `/stack` first when that file is missing. A project on a
   combined stack plugin uses that plugin's `/implement` and test skills instead.
6. Review and preserve the conventions already established in the codebase.
7. Record a gap or contradiction in a specification with `/open-questions` instead of assuming an answer.
8. Follow the accepted architecture decision records; record a new architecture decision with
   `/architecture-decision`, linked to the non-functional requirement or constraint it serves.

## Verification

Run the project's documented build, static analysis, and test commands after implementation. Report any verification
that could not be completed.
