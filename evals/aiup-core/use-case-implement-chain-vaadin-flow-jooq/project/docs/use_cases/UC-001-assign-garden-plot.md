# Use Case: Assign Garden Plot

## Overview

**Use Case ID:** UC-001  
**Use Case Name:** Assign Garden Plot  
**Primary Actor:** Garden Coordinator  
**Goal:** Allocate a plot to a gardener for the current season so that the gardener may work it  
**Trigger:** A gardener asks the garden office for a plot  
**Status:** Approved  

**Requirements:** [FR-001, NFR-001](../requirements.md)  
**Layers:** UI

## Preconditions

- At least one plot that is not closed and one gardener are registered

## Main Success Scenario

1. The garden coordinator opens the plot assignment.
2. The system shows every plot that is not closed, each with number and area, and the registered gardeners.
3. The garden coordinator selects a plot and a gardener and may enter a note.
4. The garden coordinator confirms the assignment.
5. The system records the assignment for the current season and shows the message "Plot <plot number> is assigned to <first name> <last name> for <season>."

## Alternative Flows

### A1: Plot Already Assigned

**Trigger:** The selected plot is already assigned for the current season (step 4)  
**Flow:**

1. The system shows the message "Plot <plot number> is already assigned for <season>."
2. Use case continues at step 3.

### A2: Gardener Holds Two Plots

**Trigger:** The selected gardener already holds two plots in the current season (step 4)  
**Flow:**

1. The system shows the message "<first name> <last name> already holds two plots in <season>."
2. Use case continues at step 3.

## Postconditions

### Success Postconditions

- An assignment of the plot to the gardener for the current season exists, with the note and the time it was recorded

### Failure Postconditions

- No assignment is recorded

## Business Rules

### BR-001: One Gardener per Plot and Season

A plot is assigned to at most one gardener per season.

### BR-002: Two Plots per Gardener

A gardener holds at most two plots per season.

### BR-003: Closed Plots

A closed plot is not offered for assignment.
