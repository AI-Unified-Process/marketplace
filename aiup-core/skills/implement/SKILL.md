---
name: implement
description: >
  Implements a use case end-to-end by detecting the project's tech stack from
  the build files (Maven, Gradle, npm) and delegating to the matching
  stack-specific implementation skill. Use when the user asks to "implement
  a use case", "build the feature", "implement UC-...", "code this up", or
  references a use case ID (UC-*) and asks for an implementation. Stack-agnostic
  entry point — picks the right downstream skill automatically.
---

# Implement (Dispatcher)

## Instructions

Implement the use case $ARGUMENTS by detecting the project's tech stack from the build files in the working directory
and invoking the matching stack-specific implementation skill via the **Skill** tool.

This skill is a thin dispatcher. It does not write any code itself — it routes the request to the correct downstream
skill so the project-wide stack choice stays declarative (in build files) rather than hard-coded into the methodology.

## Workflow

1. **Detect the stack.** Read whichever of these files exist (in order — first match wins is fine, but record every
   stack you find so you can flag mixed projects):
    - `pom.xml`
    - `build.gradle`, `build.gradle.kts`, `settings.gradle`, `settings.gradle.kts`
    - `package.json`
    - `pyproject.toml`, `requirements.txt`
    - `go.mod`
    - `Cargo.toml`
2. **Match against the stack table** below. The match is on the listed coordinates / package names. Treat any of the
   listed groupId/artifactId pairs as a hit for that stack.
3. **Delegate.** Invoke the corresponding skill via the Skill tool, passing the original `$ARGUMENTS` through unchanged.
4. **If no stack matches**, tell the user which build files you found and which stacks are recognised, and ask whether
   they want to pick one explicitly (e.g. `/implement-vaadin-jooq UC-001`) or install the matching plugin.
5. **If multiple stacks match** (e.g. a polyrepo with both Vaadin and a Node frontend), ask the user which path the
   use case targets before delegating. Don't guess.

## Stack → Skill Routing Table

| Stack markers (in build file)                                              | Downstream skill         | Plugin              |
|----------------------------------------------------------------------------|--------------------------|---------------------|
| `com.vaadin:vaadin` / `com.vaadin:flow-server` **and** `org.jooq:jooq`     | `implement-vaadin-jooq`  | `aiup-vaadin-jooq`  |

> The table will grow as new stack plugins are added (e.g. Spring + React, Quarkus + Hibernate). Each new
> `aiup-<stack>` plugin should ship its own `implement-<stack>` skill and add a row here.

## Detection Notes

- For Maven, look at `<dependencies>` and `<dependencyManagement>`; do not require an exact version pin.
- For Gradle, look at `dependencies { ... }` blocks across all build files. Kotlin DSL and Groovy DSL are both valid.
- A dependency listed only under a non-default profile or scope (e.g. `<scope>provided</scope>`) still counts as
  "present in the project" for routing purposes — the user is using that library.
- If the project uses a BOM that pulls in Vaadin / jOOQ transitively (e.g. `vaadin-bom`), treat that as a hit.

## DO NOT

- Implement code in this skill. Always delegate.
- Pick a stack the user has not installed a plugin for. If detection finds e.g. Spring + React but only `aiup-vaadin-jooq`
  is installed, surface that — don't fall back to the wrong stack.
- Re-prompt for the use case ID. Pass `$ARGUMENTS` through verbatim.
