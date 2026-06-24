# Use Case: [Use Case Name]

## Overview

**Use Case ID:** UC-XXX   
**Use Case Name:** [Descriptive Name]   
**Primary Actor:** [Role]   
**Goal:** [In one sentence: the observable outcome the actor achieves and why — not "use the system"]   
**Status:** Draft | Reviewed | Approved | Implemented | Tested | Done | Obsolete

## Preconditions

- [Condition that must be true before the use case starts]

## Main Success Scenario

1. [Actor action or system response]
2. [Next step]
3. [Continue until goal is achieved]

## Alternative Flows

### A1: [Alternative Flow Name]

**Trigger:** [Condition that triggers this flow] (step N)
**Flow:**

1. [Step that diverges from main flow]
2. [Continuation]
3. Use case continues at step N. *(or: Use case ends.)*

## Postconditions

### Success Postconditions

- [State of the system after successful completion]

### Failure Postconditions

- [State of the system if the use case fails]

## Business Rules

### BR-XXX: [Rule Name]

[Description of the business rule that applies to this use case]

---

## Reference

### Status Values

| Status      | Description                                      |
|-------------|--------------------------------------------------|
| Draft       | Initial version, still being written.            |
| Reviewed    | Complete, awaiting stakeholder review.           |
| Approved    | Reviewed and approved for implementation.        |
| Implemented | Implementation complete, pending testing.        |
| Tested      | All tests pass, pending final acceptance.        |
| Done        | Fully implemented, tested, and accepted.         |
| Obsolete    | No longer valid, superseded by another use case. |

### Step Writing Guidelines

| Do                                  | Don't                                         |
|-------------------------------------|-----------------------------------------------|
| "User clicks Save button"           | "User triggers onClick handler"               |
| "System validates the email format" | "System runs regex /^[\w]+@[\w]+$/"           |
| "System displays error message"     | "System throws ValidationException"           |
| "User enters check-in date"         | "User populates dateField component"          |
| "System stores the reservation"     | "System executes INSERT INTO reservations..." |
| "System records the new account"    | "System runs INSERT INTO users / SELECT ..."  |
| "System sends a confirmation email" | "System opens an SMTP connection to sendmail" |
| "System securely stores the password" | "System hashes the password with bcrypt/SHA + salt" |
| "System signs the user in"          | "System issues a JWT / signs a token with expiry" |

Steps describe **what** the actor and system achieve, never **how** it is
implemented. Keep out protocol and infrastructure terms (SMTP, JWT, bcrypt,
hashing, SQL/INSERT/SELECT, HTTP verbs, class and exception names) — those belong
in the implementation, not the specification.
