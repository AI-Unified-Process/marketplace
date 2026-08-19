# Test the Manage Tasks Use Case (Hilla)

## Background

The project tracker application is built with Hilla: a React/TypeScript view at
`src/main/frontend/views/tasks.tsx` calls a `@BrowserCallable` Java service
(`src/main/java/com/example/tasks/TaskService.java`) through the generated TypeScript client.
The use case is specified in `docs/use-cases/UC-060-manage-tasks.md`. The project already
contains the `@UseCase` annotation type at `src/main/java/com/example/app/usecase/UseCase.java`
and has Vitest configured for the frontend.

## What to Produce

Write tests for UC-060 on both layers:

1. **Frontend** — a Vitest + React Testing Library suite for the tasks view. Mock the generated
   `TaskService` client so no server is needed. Cover the main success scenario (tasks are
   listed on load, a new task can be created) and alternative flow A1 (duplicate title —
   the endpoint rejects and the error is shown to the user).
2. **Backend** — a Spring Boot integration test class that calls the `TaskService` bean
   directly against the test database. Cover the main success scenario and alternative flow A1,
   and keep the database consistent between tests.

Place the frontend suite in the frontend tests directory and the backend class in
`src/test/java/com/example/tasks/`. Deliver only the test sources; no build files or
configuration changes are needed.
