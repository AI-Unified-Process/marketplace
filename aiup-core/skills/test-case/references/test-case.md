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
