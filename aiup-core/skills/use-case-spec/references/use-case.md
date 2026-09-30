# Use Case: [Use Case Name]

## Overview

**Use Case ID:** UC-XXX  
**Use Case Name:** [Descriptive Name]  
**Primary Actor:** [Role that pursues the goal — several comma-separated when each starts the use case alone and pursues the same goal]  
**Secondary Actors:** [Supporting roles or external systems, comma-separated — omit this line when there are none]  
**Goal:** [In one sentence: the observable outcome the actor achieves and why — not "use the system"]  
**Trigger:** [The event that starts the use case — an actor's request, a point in time, or a message from an external system; not a state that is already true]  
**Status:** Draft | Reviewed | Approved | Implemented | Tested | Done | Obsolete  
**Requirements:** [FR-XXX, NFR-XXX, C-XXX](../requirements.md)

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

- [Minimum guarantee that holds for every unsuccessful end of the use case, e.g. no partial data is stored]

## Business Rules

### BR-XXX: [Rule Name]

[Description of the business rule that applies to this use case]
