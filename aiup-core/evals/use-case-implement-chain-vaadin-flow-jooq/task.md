# Assign Garden Plot, End to End

## Problem/Feature Description

A community garden allocates its plots with a small Spring Boot application. The garden coordinator works in a
Vaadin Flow web application on the computer of the garden office; there is no REST API and no other client. Plots
and gardeners are already in the database (the `plot` and `gardener` tables), loaded from the member register by a
script outside this application. The project follows the AI Unified Process and builds its code with layer plugins;
the specifications are under `docs/` and the stack file is `docs/architecture/stack.md`.

The use case UC-001 Assign Garden Plot (`docs/use_cases/UC-001-assign-garden-plot.md`) has been approved. The
coordinator says: "Please build the plot assignment, write its tests, and then check how well the code and the tests
cover the use case before I look at it."

## Output Specification

Implement UC-001, write its tests, and then check its coverage, one after the other. I am not around during this
run, so do not wait for answers; handle anything the specification leaves open the way the process expects. There
is no database, Docker, or Maven repository in this environment, so neither the build nor a test suite can be run;
say so rather than claiming that anything passed.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
