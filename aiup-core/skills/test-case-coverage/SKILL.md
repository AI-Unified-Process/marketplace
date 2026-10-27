---
name: test-case-coverage
description: >
  Audits an already-automated test case (TC-XXX) — one end-to-end journey across several use cases — against its
  document and reports a coverage matrix: which Flow rows, Validation items, and postconditions have a test step and
  code behind them, which are still open, and which test steps have drifted away from the test case. Use when the
  user asks to "check coverage of TC-001", "is TC-001 completely automated", "audit the journey", "show me the
  coverage matrix for the test case", "what is still missing for TC-001", or "can I set TC-001 to Automated". This is
  specification coverage, not line coverage. It reports only — it writes no code, no tests, and no files. For
  projects that combine layer plugins and record them in docs/architecture/stack.md; aiup-vaadin-jooq and
  aiup-angular-jpa bring their own /coverage-check TC-XXX. A use case (UC-XXX) is /use-case-coverage. When the
  user wants the gaps closed rather than listed, use /test-case-implement or /use-case-implement instead.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Coverage Check (test case)

## Instructions

Audit the test case $ARGUMENTS against the journey test and the code that are supposed to realize it, and report the
result.

This skill is a front door to the read-only `uc-coverage-layered` sub-agent of `aiup-core`, the same agent
`/use-case-coverage` uses. The audit checklist lives in `agents/uc-coverage-layered.md` at the plugin root (locate
it with a glob for `**/agents/uc-coverage-layered.md`) and is **deliberately not repeated here**. How a report is
presented, compared with an earlier run, and run on a host without sub-agents is owned by `/use-case-coverage`:
locate it with a glob for `**/*use-case-coverage/SKILL.md` (the folder may carry a host prefix such as
`tessl__use-case-coverage`) and apply its sections "Delegation", "Repeated Runs", and "Hosts without sub-agents" as
written. Your job is argument parsing, delegation, faithful presentation, and offering the next step.

The report is the deliverable. **You do not fix what it finds.**

## Arguments

Everything is parsed out of `$ARGUMENTS`; the tokens may appear in any order.

| Token                                                      | Meaning                                                 |
|------------------------------------------------------------|---------------------------------------------------------|
| `TC-001`, `TC001`, `tc 1`, or a path to a test case        | the journey to audit — normalize to `TC-001`            |
| `implementation`, `impl`, `code`                           | mode `implementation`                                   |
| `tests`, `test`                                            | mode `tests`                                            |
| `both`, or no mode token at all                            | mode `both` (the default)                               |
| `wip`, `--wip`, `work in progress`, `in progress`, `draft` | pass the work-in-progress qualifier through             |
| a `UC-*` id                                                | not a journey — hand off to `/use-case-coverage UC-XXX` |
| nothing                                                    | list the test cases and ask — see below                 |

A mode is only narrowed by a standalone qualifier token, never by a word in a sentence. State the resolved arguments
in one line before delegating (`Auditing TC-001, mode both.`).

## Workflow

1. Parse `$ARGUMENTS` into the id, the mode, and the work-in-progress flag.
2. Confirm the test case exists — `docs/test_cases/TC-XXX-*.md`. Stop, list the near matches, and ask if it does
   not. Never audit against a journey you inferred from the tests.
3. State the resolved arguments in one line.
4. Delegate the audit to `uc-coverage-layered` (it may appear as `aiup-core:uc-coverage-layered`), passing exactly
   the id, the mode, and — when it applies — `work in progress`, nothing else:

   ```text
   TC-001 both
   TC-001 tests work in progress
   ```

5. Present the returned report unchanged, and on a rerun add the comparison — the sections of `/use-case-coverage`
   named in [Instructions](#instructions).
6. Offer the gap-closing commands — see [After the Report](#after-the-report). Then stop.

With no id: if the conversation has just been working on a specific `TC-*`, propose that one and ask. Otherwise list
`docs/test_cases/` with each test case's `**Status:**` line and ask which to audit. Audit one journey per run.

## After the Report

- A test gap — a Flow row or Validation item without a test step — closes with `/test-case-implement TC-XXX`.
- An implementation gap sits in a use case the journey chains: name the use case of that Flow row and offer
  `/use-case-implement UC-YYY`, narrowed to a layer when the report names one.
- Missing Markers rows of the E2E layer close with a rerun of the E2E test skill named in the Layers table;
  `docs/architecture/stack.md` itself missing closes with `/stack`.
- Drift is not a gap with a known fix. For each drift item, ask the user which side is right — the test case
  (`/test-case TC-XXX` updates the journey) or the application (`/use-case-implement UC-YYY`) — and offer only the
  command that matches the answer. Never pick a side yourself.
- Offer the commands; run one only if the user says yes. Pass an `Automated` suggestion on as a suggestion: it says
  the journey is automated, not that it passes, and the agent cannot run it — never claim it was run. Do not edit
  the test case's `**Status:**` line.

## DO NOT

- Do not write or edit code, tests, or specifications — including the `**Status:**` line.
- Do not restate or paraphrase the agent's audit checklist in this file; `agents/uc-coverage-layered.md` owns it.
- Do not soften, upgrade, or drop a verdict, and do not present a summary in place of the matrix.
- Do not tell the agent what you expect it to find.
- Do not claim that a build or a test suite was run.
