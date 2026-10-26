# Acceptance Protocol: [Round]

**Round:** [release-1.4]  
**Created:** [2026-10-26]  
**Status:** Open  
**Environment:** [The system under test: URL, version, test data set]  

Results: `Pass`, `Fail`, or `Blocked`; empty means not run yet. A `Fail` or `Blocked` needs a remark.

## TC-XXX: [Journey Name]

**Test case:** [TC-XXX](../test_cases/TC-XXX-name.md)  
**Use cases:** [UC-XXX](../use_cases/UC-XXX-name.md), [UC-YYY](../use_cases/UC-YYY-name.md)  
**Preconditions:** [From the test case]

| #  | Check                       | Expected                                   | Test data        | Use case | Result | Tester | Date | Remark |
|----|-----------------------------|--------------------------------------------|------------------|----------|--------|--------|------|--------|
| 1  | Step 1: [Action name]       | [What the system shows]                    | [Literal values] | UC-XXX   |        |        |      |        |
| 2  | Step 2: [Verify …]          | [Observable result]                        | -                | -        |        |        |      |        |
| V1 | Validation 1: [Check name]  | [End-state expectation]                    | -                | -        |        |        |      |        |

## UC-XXX: [Use Case Name]

**Use case:** [UC-XXX](../use_cases/UC-XXX-name.md)  
**Preconditions:** [From the use case]

| #   | Check                          | Expected                                   | Result | Tester | Date | Remark |
|-----|--------------------------------|--------------------------------------------|--------|--------|------|--------|
| M   | Main success scenario          | [The success postconditions]               |        |        |      |        |
| A1  | [Alternative flow name]        | [Where it ends and what the actor sees]    |        |        |      |        |
| BR1 | BR-001: [Rule name]            | [The rule, as a tester observes it]        |        |        |      |        |
