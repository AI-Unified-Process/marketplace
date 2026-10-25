# Data Model Design for LearnPath

## Problem Description

The LearnPath team is building an online course enrollment platform and has finished drafting their requirements. The product manager has signed off on the requirements catalog (stored at `docs/requirements.md`), and the engineering lead now needs an entity model document before development can begin. The entity model will serve as the authoritative reference for database design, back-end validation logic, and API contracts across all squads.

The platform needs to track three core entities — students who register with their email addresses, courses offered by instructors with pricing information, and enrollments that link students to courses over a scheduled time window with a lifecycle status. Because courses have a price expressed in dollars and cents, data type precision matters. Because enrollments span a date range, there is a cross-record validation rule that must be captured beyond individual field constraints.

The team follows the AI Unified Process, and the entity model will be consumed by downstream AI Unified Process tooling that expects a precise, standardized document format — any deviation in structure, data types, or validation-rule labels causes the tooling pipeline to reject the document. A reference guide describing the accepted vocabulary for data types and validation rules is available at `references/REFERENCE.md`.

## Output Specification

Produce the entity model document at `docs/entity_model.md`. The document must include:

- An entity relationship (ER) diagram showing all entities and how they relate to one another.
- A detailed attribute section for each entity, covering every attribute derived from the requirements, with its data type, size or precision, and validation rule.
- Any cross-attribute constraints that cannot be expressed on a single column.

Do not modify `docs/requirements.md`.
