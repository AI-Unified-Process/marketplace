# Use Case Specification: Manage Tasks

**Use Case ID:** UC-060
**Use Case Name:** Manage Tasks

## Brief Description

A project member views the list of tasks and creates new tasks. Task titles must be unique
within the project tracker.

## Actors

- Project Member

## Preconditions

- The project member is on the Tasks view.

## Main Success Scenario

1. The system displays all existing tasks in a grid (title, due date, done).
2. The project member enters a title and an optional due date.
3. The project member clicks "Add task".
4. The system validates the input (BR-001, BR-002).
5. The system stores the task and shows it in the grid.

## Alternative Flows

### A1: Duplicate Title

At step 4, a task with the same title already exists. The system rejects the request with the
message "A task with this title already exists" and does not store the task. The view shows
this message to the user; the entered values remain in the form.

## Postconditions

- On success, the new task is persisted and visible in the grid.

## Business Rules

### BR-001

The task title is required and must not be blank.

### BR-002

Task titles are unique. Comparison is case-insensitive.
