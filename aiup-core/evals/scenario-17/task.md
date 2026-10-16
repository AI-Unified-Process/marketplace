# Clinic Scheduling Architecture

## Problem/Feature Description

A clinic runs a scheduling application. The front desk works in a Vaadin Flow web application; the clinic's mobile
app and an insurance partner call the same system over a JSON REST API. Some use cases are offered through both
channels, others only in the front-desk screens. The project follows the AI Unified Process; the requirements
catalog is in `docs/requirements.md`, and the Maven build in `pom.xml` already declares the libraries the team chose.

An architect once wrote `docs/architecture.md` by hand. The team has agreed to move it into the architecture folder
as the Development View, keeping what it says.

Before the first use case is implemented, the team wants the technical layers recorded, so that the construction
skills know which layer skills to run.

## Output Specification

Write the Development View to `docs/architecture/development.md`, with the index `docs/architecture/README.md` of the
architecture views. Do not write any Java code and do not change `pom.xml`.
