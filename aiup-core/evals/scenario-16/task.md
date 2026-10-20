# Inventory Service Architecture

## Problem/Feature Description

A logistics company builds an inventory service that other systems call over HTTP. There is no user interface: the
warehouse terminals and the web shop are separate applications owned by other teams. The project follows the AI
Unified Process; the requirements catalog is in `docs/requirements.md`, and the Maven build in `pom.xml` already
declares the libraries the team chose.

Before the first use case is implemented, the team wants the technical layers of the service recorded, so that the
construction skills know which layer skills to run.

## Output Specification

Write the stack file to `docs/architecture/stack.md`. Do not write any Java code and do not change `pom.xml`.
