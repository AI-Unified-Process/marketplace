# Acceptance Protocol: Release 1.0

**Round:** release-1.0  
**Created:** 2026-10-20  
**Status:** Open  
**Environment:** https://test.workshops.example.com, build 1.0.0-rc2  

Results: `Pass`, `Fail`, or `Blocked`; empty means not run yet. A `Fail` or `Blocked` needs a remark.

## TC-001: Run a Workshop

**Test case:** [TC-001](../test_cases/TC-001-run-a-workshop.md)  
**Use cases:** [UC-001](../use_cases/UC-001-manage-workshops.md), [UC-002](../use_cases/UC-002-register-for-workshop.md), [UC-003](../use_cases/UC-003-list-participants.md)  
**Preconditions:** The organizer account `organizer@example.com` with the role ORGANIZER exists

| #  | Check                           | Expected                                                     | Test data                                      | Use case | Result | Tester   | Date       | Remark |
|----|---------------------------------|--------------------------------------------------------------|------------------------------------------------|----------|--------|----------|------------|--------|
| 1  | Step 1: Create workshop         | The organizer creates a workshop                             | "Kanban Basics", 2026-12-01 09:00, capacity 2 | UC-001   | Pass   | M. Keller | 2026-10-22 |        |
| 2  | Step 2: Verify workshop         | "Kanban Basics" is in the workshop list                      | -                                              | -        | Pass   | M. Keller | 2026-10-22 |        |
| 3  | Step 3: Register                | A participant registers for "Kanban Basics"                  | Ana Silva, ana@example.com                     | UC-002   | Pass   | P. Meier | 2026-10-22 |        |
| 4  | Step 4: Verify registration     | The message "You are registered for Kanban Basics." appears  | -                                              | -        | Pass   | P. Meier | 2026-10-22 |        |
| 5  | Step 5: List participants       | The organizer opens the participants of "Kanban Basics"      | -                                              | UC-003   | Pass   | M. Keller | 2026-10-23 |        |
| 6  | Step 6: Verify participants     | Ana Silva is listed; 1 registration, 1 free place            | -                                              | -        | Pass   | M. Keller | 2026-10-23 |        |
| V1 | Validation 1: Free places       | "Kanban Basics" shows 1 free place in the workshop list      | -                                              | -        | Pass   | M. Keller | 2026-10-23 |        |

## UC-003: List Participants

**Use case:** [UC-003](../use_cases/UC-003-list-participants.md)  
**Preconditions:** The organizer is authenticated with the role ORGANIZER

| #   | Check                          | Expected                                                        | Result | Tester    | Date       | Remark |
|-----|--------------------------------|-----------------------------------------------------------------|--------|-----------|------------|--------|
| M   | Main success scenario          | The participants with name, email, and registration time, the number of registrations, and the free places | Pass   | M. Keller | 2026-10-23 |        |
| A1  | A1: No Registrations           | The message "No one has registered yet." appears               | Fail   | M. Keller | 2026-10-23 | An empty table without any message is shown |
| BR1 | BR-001: Organizer Only         | A participant account cannot open the participants of a workshop | Pass   | P. Meier  | 2026-10-23 |        |
