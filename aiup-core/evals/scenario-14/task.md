# Book Loan Business Process

## Problem/Feature Description

A city library's lending system follows the AI Unified Process. The requirements catalog is in `docs/requirements.md`,
the use case diagram in `docs/use_cases.puml`, and the specified use cases in `docs/use_cases/`: a member reserves a
book title; when a copy is available, a librarian lends it, otherwise the member joins the waiting list. There are no
process models in the project yet.

The business analysts want the book loan business process as a BPMN 2.0 model that they can open and refine in their
modeling tool (bpmn.io), and that the QA team can later derive end-to-end test cases from. The team refers to every
business process by an id in meetings and tickets.

Model the "Book Loan" business process.

## Output Specification

Produce the BPMN 2.0 process model under `docs/processes/`. The model must open in a BPMN modeler with every element
visible, and every activity must be traceable to the use case it stands for.
