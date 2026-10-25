# Clinic Scheduling Architecture

## Problem/Feature Description

A clinic runs a scheduling application. The front desk works in a Vaadin Flow web application; the clinic's mobile
app and an insurance partner call the same system over a JSON REST API. Some use cases are offered through both
channels, others only in the front-desk screens. The project follows the AI Unified Process; the requirements
catalog is in `docs/requirements.md`, and the Maven build in `pom.xml` already declares the libraries the team chose.

An architect once wrote `docs/architecture.md` by hand. It stays the team's architecture document, where it is.

Before the first use case is implemented, the team wants the technical layers recorded, so that the construction
skills know which layer skills to run. Browser tests are slow on the clinic's build server, so the team wants them
only for the end-to-end test cases, not for every use case.

## Output Specification

Write the stack file to `docs/architecture/stack.md`. Do not write any Java code and do not change `pom.xml`.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
