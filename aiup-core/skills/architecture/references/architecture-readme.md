# Architecture

The architecture of this project, written as the four views Philippe Kruchten described in 1995 plus the one
that ties them together: the use cases. A use case is the unit of work; the other four views say how a use case
turns into code. These documents are context for an AI coding agent: text and text-based diagrams (Mermaid,
PlantUML), versioned with the code, short.

## The five views

| View              | Question it answers                      | Where it lives                                                                      |
|-------------------|------------------------------------------|-------------------------------------------------------------------------------------|
| **Use Case (+1)** | What should the system do, and for whom? | [`../use_cases.puml`](../use_cases.puml), [`../use_cases/`](../use_cases), [`../test_cases/`](../test_cases) |
| **Logical**       | Which business building blocks exist?    | `logical.md` (+ [`../entity_model.md`](../entity_model.md))                         |
| **Process**       | How does the system behave at runtime?   | `process.md`                                                                        |
| **Development**   | How is the code organized and built?     | [`development.md`](development.md)                                                  |
| **Physical**      | Where does the system run?               | `physical.md`                                                                       |

The Use Case View sits outside this folder on purpose: it is the base the architecture is built on, not a part of
it. Of the views, the skills write only the Development View: `/architecture` records the layers and writes this
index when it is missing, and the layer skills keep the markers. The Logical, Process, and Physical Views are written by the team, by hand, when the project needs them. A
view whose file does not exist yet has not been written; nothing is assumed about it.

If you know arc42 rather than Kruchten: the Logical View is its building block view at the domain level, the
Development View its building block view at the code level plus the solution strategy, the Process View its runtime
view, the Physical View its deployment view, and `adr/` its architecture decisions.

## What an agent reads, and when

| Task                                         | Read first                                       |
|----------------------------------------------|--------------------------------------------------|
| Implement or test a use case                 | its `UC-NNN-*.md`, then `development.md`         |
| Add an entity, attribute, or domain rule     | `logical.md`, `../entity_model.md`               |
| Touch a transaction, a job, or a lookup      | `process.md`                                     |
| Change the build, the stack, or a convention | `development.md`                                 |
| Change how or where the application runs     | `physical.md`                                    |
| Make a decision that contradicts a view      | `adr/` — the same question may be answered once  |

Every rule is stated once, in the view it belongs to. No business rule lives in this folder: a rule about the
domain belongs to the use case that needs it. Decisions that could have gone the other way get an architecture
decision record in `adr/`.
