# Add Server-Side Tests for the Borrow Book Feature

## Problem / Feature Description

The Library Management System has a "Borrow Book" view that was recently built by the backend team. The view lets a library member enter their name, select a book from a drop-down, and click Save — with a notification confirming success or validation errors when fields are empty. The product owner now wants automated tests to lock in this behavior before a larger refactoring of the data layer.

The project is a Maven-based Spring Boot application using Vaadin 25.1. A skeleton `pom.xml`, the `BorrowBookView.java` source, and the use case spec at `docs/use-cases/UC-040-borrow-book.md` are already in place. No server-side test infrastructure exists yet — there are no existing test classes and no test dependencies for the Vaadin UI layer.

Your job is to introduce the correct Vaadin server-side unit testing setup and write tests for use case UC-040 ("Borrow Book"). The tests should cover the main success scenario (happy path) and the two alternative flows described in the use case spec: missing borrower name, and no book selected. Follow whatever official Vaadin server-side testing conventions are appropriate for a Vaadin 25.1+ project. Use the use case spec as the source of truth for what to test.

## Output Specification

Produce the following:

- An updated `pom.xml` with the required Vaadin server-side unit testing dependency added.
- Any shared Java source files needed to support the test infrastructure (place them under `src/main/java/`).
- A test class under `src/test/java/` that covers UC-040 with one test method per scenario (main flow and each alternative flow described in the spec).
- Any Flyway SQL migration(s) under `src/test/resources/db/migration/` required to seed test data.

Do not leave large downloaded files in the workspace.
