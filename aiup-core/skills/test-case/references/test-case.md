# Test Case: [Journey Name]

## Overview

**ID:** TC-XXX   
**Goal:** [In one sentence: who does what across the journey and which outcome is verified end-to-end]   
**Priority:** Critical | High | Medium | Low   
**Status:** Draft | Reviewed | Approved | Automated | Obsolete

## Roles

- [Role acting in the journey (what they do)]
- [Second role, if the journey spans several]

## Preconditions

- [Data or state that must exist before the journey starts, with its source (e.g. Flyway test data `V900__test_data.sql`)]

## Flow

| Step | Name          | Description                                        | Test Data          | Use Case                                      |
|------|---------------|----------------------------------------------------|--------------------|-----------------------------------------------|
| 1    | [Action name] | [What the role does and what the system shows]     | [Literal values]   | [UC-XXX](../use_cases/UC-XXX-name.md)         |
| 2    | [Verify …]    | [Observable result that anchors the transition]    | -                  | -                                             |
| 3    | [Next action] | [Continues with state created in earlier steps]    | [Literal values]   | [UC-YYY](../use_cases/UC-YYY-name.md)         |

## Validation

1. **[Check name]**: [Cross-cutting end-state expectation, observable through the UI after the flow completes]
2. **[Check name]**: [Second expectation]

## Postconditions

- [Data record the journey creates or changes and leaves behind]
- [Cleanup-order constraint, if any (e.g. "The enrollment must be deleted before the student it belongs to")]

---

## Reference

### Status Values

| Status    | Description                                          |
|-----------|------------------------------------------------------|
| Draft     | Initial version, still being written.                |
| Reviewed  | Complete, awaiting stakeholder review.               |
| Approved  | Reviewed and approved for automation.                |
| Automated | An end-to-end test implements this test case.        |
| Obsolete  | No longer valid, superseded by another test case.    |

### Priority Values

| Priority | Description                                                        |
|----------|--------------------------------------------------------------------|
| Critical | The system's core journey — run on every change.                   |
| High     | Important journey — run in every full test pass.                   |
| Medium   | Secondary journey — run regularly.                                 |
| Low      | Rare or edge journey — run when the affected area changes.         |

### Flow Writing Guidelines

- **Step** numbers run from 1 without gaps; the automated test derives one step method per row.
- **Name** is short and action-oriented — it becomes the step method name in the test.
- **Description** says what the role does and what the system shows — business language, no implementation detail (no HTTP verbs, SQL, class names, or protocol terms; see the use case template's step-writing guidelines).
- **Test Data** holds the literal values the step enters, comma-separated; `-` when the step needs none.
- **Use Case** links the action to its specification with a relative path; verification rows use `-`.

### Postconditions Guidelines

Postconditions inventory the data the journey leaves behind — the automated test derives its cleanup from this list (delete exactly these records, nothing else). State every record the flow creates or changes, identified by the literal test data values, and any deletion-order constraint imposed by business rules (dependent records before their parents).
