---
name: e2e
description: >
  Generates browser-based end-to-end tests for a use case by detecting the
  project's browser-test frameworks (Playwright + Drama Finder, etc.) and
  delegating to the matching stack-specific skill. Use when the user asks to
  "write e2e tests", "write end-to-end tests", "write browser tests", "test in
  the browser", "write Playwright tests", or references a use case ID (UC-*)
  and asks for e2e / browser tests. Stack-agnostic entry point — picks the
  right skill automatically. For server-side unit / integration tests, use
  `/test` instead.
---

# E2E (Dispatcher — Browser-based)

## Instructions

Create **browser-based end-to-end tests** for the use case $ARGUMENTS by detecting which browser-test frameworks are
configured in the project and invoking the matching stack-specific test-creation skill via the **Skill** tool.

This dispatcher is **scoped to browser-driven tests only** — tests that drive a real browser (Chromium, Firefox,
WebKit) against a running application. For in-JVM tests (Vaadin Browserless, Karibu), use **`/test`**.

This skill is a thin dispatcher. It does not write tests itself — it routes the request to the correct downstream
skill.

## Workflow

1. **Detect available browser-test frameworks.** Read whichever of these files exist:
    - `pom.xml`
    - `build.gradle`, `build.gradle.kts`, `settings.gradle`, `settings.gradle.kts`
    - `package.json`
2. **Match against the framework table** below. Record every framework you find.
3. **Delegate.** Invoke the corresponding skill via the Skill tool with `$ARGUMENTS` passed through unchanged. If
   multiple browser-test skills are configured (rare today, possible in future), invoke them sequentially.
4. **If no framework matches**, list the build files found and the frameworks recognised, and ask the user to
   install one of the supported testing plugins or invoke a stack-specific skill directly. If you detect
   server-side-test markers (Browserless, Karibu), point the user at `/test`.

## Framework → Skill Routing Table

| Test framework markers (in build file)                                              | Downstream skill   | Plugin              |
|-------------------------------------------------------------------------------------|--------------------|---------------------|
| `org.vaadin.addons:dramafinder`                                                     | `playwright-test`  | `aiup-vaadin-jooq`  |
| `com.microsoft.playwright:playwright`                                               | `playwright-test`  | `aiup-vaadin-jooq`  |
| `@playwright/test` or `playwright` in `package.json` (`devDependencies`/`dependencies`) | `playwright-test`  | `aiup-vaadin-jooq`  |

> The table will grow as new stack plugins ship browser-test skills (e.g. Cypress, Selenium). Each new
> `aiup-<stack>` plugin should add its supported frameworks here.

## Detection Notes

- For Maven, look at `<dependencies>` and `<dependencyManagement>`. Test scope (`<scope>test</scope>`) is the typical
  location but not required — a dep declared at any scope counts.
- For Gradle, look at `testImplementation`, `testRuntimeOnly`, `integrationTestImplementation`, etc., across all
  build files. Both Kotlin DSL and Groovy DSL are valid.
- For npm, both `dependencies` and `devDependencies` count.
- A BOM that pulls in Playwright transitively counts as a hit.

## DO NOT

- Write tests in this skill. Always delegate.
- Invoke `browserless-test` or `karibu-test` from this dispatcher. Server-side tests live under `/test`.
- Drop frameworks silently. If you skip something the user might expect, say so.
- Re-prompt for the use case ID. Pass `$ARGUMENTS` through verbatim.
