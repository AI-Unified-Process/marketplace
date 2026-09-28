# Book Loan Process Test Cases

## Problem/Feature Description

A city library's lending system follows the AI Unified Process. The business analysts modeled the book loan process
as a BPMN 2.0 diagram in `docs/processes/book-loan.bpmn`: a member reserves a book, and depending on whether a copy is
available, a librarian lends the book or the member joins the waiting list. The activities of the process are
specified as use cases in `docs/use_cases/`.

The QA team wants end-to-end test cases derived from this process model, so that every way through the business
process is later automated as a browser test. The Flyway test migration `V900__test_data_library.sql` seeds the
member "Mia Keller", the librarian "Leo Brandt", the title "Clean Code" by Robert C. Martin with one available copy, and
the title "Refactoring" by Martin Fowler whose only copy is on loan. There are no test cases in the project yet.

Derive the test cases from `docs/processes/book-loan.bpmn`.

## Output Specification

Produce Markdown test case documents under `docs/test_cases/` that together cover the process model. Each document
must describe one end-to-end journey precisely enough that a test automation engineer (or an agent) could implement a
browser test from it without consulting anything else except the linked use case specifications and the process
model.
