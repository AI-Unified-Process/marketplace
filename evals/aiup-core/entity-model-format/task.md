# Hotel Booking System — Entity Model

## Problem Description

A boutique hotel chain is building a new reservation management platform. The engineering team has captured the domain and data requirements in a requirements document at `docs/requirements.md`. Before any database design or code generation begins, the team needs a formal entity model document that will serve as the single source of truth for the data layer.

The entity model will be consumed by downstream tools that generate database schemas and API contracts. Those tools expect a precise, standardized format — any deviation in structure, data types, or validation labels causes the tooling pipeline to reject the document. A reference guide describing the accepted vocabulary for data types and validation rules is available at `references/REFERENCE.md`.

## Output Specification

Produce the entity model document at `docs/entity_model.md`. The document should cover every entity described in the requirements, capture all attributes needed to implement the data layer, and conform to the format expected by the downstream tooling.
