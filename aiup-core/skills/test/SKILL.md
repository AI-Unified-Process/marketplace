---
name: test
description: >
  Generates server-side unit / integration tests for a use case by detecting
  the project's in-JVM test frameworks and delegating to the matching
  stack-specific test skill (Vaadin Browserless, Karibu, etc.). Use when the
  user asks to "write tests", "write unit tests", "write integration tests",
  "unit test this view", "test this use case server-side", or references a use
  case ID (UC-*) and asks for unit / server-side tests. Stack-agnostic entry
  point — picks the right skill automatically. For browser-based end-to-end
  tests, use `/e2e` instead.
---

# Test (Dispatcher — Server-side)

## Instructions

Create **server-side unit / integration tests** for the use case $ARGUMENTS by detecting which in-JVM test frameworks
are configured in the project and invoking the matching stack-specific test-creation skill via the **Skill** tool.

This dispatcher is **scoped to server-side tests only** — tests that run inside the JUnit JVM with no browser, no
WebDriver, no servlet container. For browser-based end-to-end tests (Playwright, etc.), use **`/e2e`**.

This skill is a thin dispatcher. It does not write tests itself — it routes the request to the correct downstream
skill.

## Workflow

1. **Detect available server-side test frameworks.** Read whichever of these files exist:
    - `pom.xml`
    - `build.gradle`, `build.gradle.kts`, `settings.gradle`, `settings.gradle.kts`
2. **Match against the framework table** below. Record every framework you find.
3. **If both Vaadin Browserless and Karibu are present** (a project mid-migration), prefer Browserless. Mention to
   the user that Karibu was detected but skipped because Browserless supersedes it; offer to run `/karibu-test`
   explicitly if they're extending the legacy suite.
4. **Delegate.** Invoke the corresponding skill via the Skill tool with `$ARGUMENTS` passed through unchanged.
5. **If no framework matches**, list the build files found and the frameworks recognised, and ask the user to
   install one of the supported testing plugins or invoke a stack-specific skill directly. If you detect
   browser-test markers (Playwright, Drama Finder), point the user at `/e2e`.

## Framework → Skill Routing Table

| Test framework markers (in build file)                                | Downstream skill   | Plugin              |
|-----------------------------------------------------------------------|--------------------|---------------------|
| `com.vaadin:browserless-test-junit6`                                  | `browserless-test` | `aiup-vaadin-jooq`  |
| `com.github.mvysny.kaributesting:*` (any artifact)                    | `karibu-test`      | `aiup-vaadin-jooq`  |

> The table will grow as new stack plugins ship server-side test skills. Each new `aiup-<stack>` plugin should add
> its supported frameworks here.

## Detection Notes

- For Maven, look at `<dependencies>` and `<dependencyManagement>`. Test scope (`<scope>test</scope>`) is the typical
  location but not required — a dep declared at any scope counts.
- For Gradle, look at `testImplementation`, `testRuntimeOnly`, `integrationTestImplementation`, etc., across all
  build files. Both Kotlin DSL and Groovy DSL are valid.
- A BOM that pulls in `browserless-test-junit6` transitively (e.g. via `vaadin-bom`) counts as a hit.

## DO NOT

- Write tests in this skill. Always delegate.
- Run both Browserless and Karibu in the same call. They overlap — pick one (Browserless wins by default).
- Invoke `playwright-test` from this dispatcher. Browser-based tests live under `/e2e`.
- Drop frameworks silently. If you skip something the user might expect, say so.
- Re-prompt for the use case ID. Pass `$ARGUMENTS` through verbatim.
