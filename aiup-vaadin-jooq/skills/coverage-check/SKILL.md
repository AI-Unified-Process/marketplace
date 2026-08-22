---
name: coverage-check
description: >
  Audits an already-written use case (UC-XXX) or test case (TC-XXX) against its
  specification and reports a coverage matrix: which main success scenario
  steps, alternative flows, business rules, preconditions, and postconditions
  have code and tests behind them, which are still open, and which code or
  tests have drifted away from the specification. Use when the user asks to
  "check coverage", "run a coverage check", "is UC-001 fully implemented", "is
  UC-001 completely tested", "audit the use case", "show me the coverage
  matrix", "do a traceability check", "what is still missing for UC-001", or
  "can I set the status to Tested". This is specification coverage, not line
  coverage from a coverage report. It reports only — it writes no code, no
  tests, and no files. When the user wants the gaps closed rather than listed,
  use /implement, /implement-hilla, /browserless-test, /hilla-test,
  /karibu-test, or /playwright-test instead.
---

<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Coverage Check

## Instructions

Audit the artifact $ARGUMENTS — a use case (`UC-XXX`) or a test case (`TC-XXX`) — against the code
and tests that are supposed to realize it, and report the result.

This skill is the front door to the read-only `uc-coverage` sub-agent of this plugin. The audit
checklist — how coverage units are derived, which markers to search for, how each unit is judged —
lives in [`agents/uc-coverage.md`](../../agents/uc-coverage.md) and is **deliberately not repeated
here**, so the two cannot drift apart. Your job is argument parsing, delegation, faithful
presentation of the report, and offering the next step.

The report is the deliverable. **You do not fix what it finds.**

## Arguments

Everything is parsed out of `$ARGUMENTS`; the tokens may appear in any order.

| Token                                                     | Meaning                                                             |
|-----------------------------------------------------------|----------------------------------------------------------------------|
| `UC-001`, `UC001`, `uc 1`, or a path to a specification    | the artifact to audit — normalize to `UC-001`, zero-padded to three digits |
| `TC-001`, `TC001`                                          | audit a test case journey instead                                   |
| `implementation`, `impl`, `code`                           | mode `implementation`                                               |
| `tests`, `test`                                            | mode `tests`                                                        |
| `both`, or no mode token at all                            | mode `both` (the default)                                           |
| `wip`, `--wip`, `work in progress`, `in progress`, `draft` | pass the work-in-progress qualifier through                         |
| two or more ids                                            | a bounded sweep of exactly those ids                                |
| nothing                                                    | see [Sweeps](#sweeps)                                               |

Three parsing rules carry weight:

- **A mode is only narrowed by a standalone qualifier token.** In a sentence — "is UC-001 fully
  implemented?" — the word *implemented* is prose, not a mode: run `both`. Silently narrowing to
  `implementation` recreates the very gap this skill exists to close.
- **State the resolved arguments in one line before delegating** (`Auditing UC-001, mode both.`),
  so a wrong parse costs one rerun instead of producing a wrong verdict.
- If the id resolves to no file under `docs/use_cases/` or `docs/use-cases/` (both spellings are in
  use), list the near matches and ask. Never audit against a specification you inferred from code.

## Workflow

1. Parse `$ARGUMENTS` into the id or ids, the mode, and the work-in-progress flag. With no id, go
   to [Sweeps](#sweeps).
2. Confirm the specification exists — `docs/use_cases/UC-XXX-*.md` (also check `docs/use-cases/`)
   or `docs/test_cases/TC-XXX-*.md`. Stop and ask if it does not.
3. State the resolved arguments in one line.
4. Delegate the audit — see [Delegation](#delegation).
5. Present the returned report unchanged.
6. Offer the gap-closing commands — see [After the Report](#after-the-report). Then stop.

## Delegation

Hand the audit to the read-only `uc-coverage` sub-agent of this plugin (it may appear as
`aiup-vaadin-jooq:uc-coverage`). Pass exactly the id, the mode, and — when it applies —
`work in progress`, and nothing else:

```text
UC-001 both
UC-001 tests
UC-001 implementation work in progress
TC-001 tests
```

Do not add a summary of the specification, a list of the files you believe implement it, or what
you expect the answer to be. The agent must find its own evidence; a caller-supplied file list is
the fastest way to turn an audit into a rubber stamp.

Present the report as it came back — the heading, the score line, the full matrix, `### Gaps`,
`### Drift`, and `### Suggested status`. Do not summarize it into prose, do not drop the covered
rows to save space, and do not change a verdict. The matrix is the deliverable; if you disagree
with a verdict, say so underneath it and leave the row alone.

## After the Report

- Turn each gap into the command that closes it, matching the stack already in the project:
  `/implement` or `/implement-hilla` for implementation gaps; `/browserless-test`, `/hilla-test`,
  or `/karibu-test` for unit test gaps; `/playwright-test` for browser or journey gaps. Offer
  them; run one only if the user says yes.
- Do not close gaps yourself, and do not close one "quickly because it is only one line". A
  one-line fix from the auditor is still an unreviewed change to a verdict you have just issued.
- The agent cannot run builds or tests. Before repeating any `Tested` suggestion, ask whether the
  suite passes.
- Pass the `### Suggested status` on as a suggestion, and name the line that would change. Do not
  edit the specification's `**Status:**` line as part of this report.

## Hosts without sub-agents

Sub-agents are Claude Code-specific and are not part of the Agent Plugins standard. Where the host
has none, read [`agents/uc-coverage.md`](../../agents/uc-coverage.md) and follow it yourself, start
to finish, as an instruction document — its checklist does not depend on Claude Code. If that path
does not resolve in this host's plugin layout, glob for `**/agents/uc-coverage.md` before giving
up; if it genuinely is not there, say so rather than improvising an audit from memory. The
checklist *is* the skill.

Running it inline costs you the agent's tool restriction and its clean context, so two rules apply
on top of it: re-read the specification and the code from disk instead of relying on what you
remember writing earlier in the conversation, and treat the agent's `## DO NOT` as binding on
yourself — above all "no `file:line`, no `Covered`".

## Sweeps

With no id: if the conversation has just been working on a specific `UC-*` or `TC-*`, propose that
one and ask. Otherwise list what is there — a glob over both specification directories plus a grep
for the `**Status:**` line — and ask which to audit. Do not audit everything by default.

When the user does ask for a sweep ("all", "every use case", "sweep"), it is **a triage pass, not
thirty audits**:

1. **Pre-pass, no sub-agents at all.** For every specification collect id, title, and `**Status:**`,
   plus one tree-wide grep for the literal id to see whether *any* implementation marker and *any*
   test marker exist. Two or three tool calls for the whole project.
2. **Publish that table first.** It already answers the common question — which use cases have
   nothing behind them — at zero audit cost.
3. **Then rank and cap.** Full audits go only to the suspicious rows: the status claims
   `Implemented` or `Tested` but a marker is missing, or the status is `Approved` while markers
   exist (a status lagging behind the code). Default cap: **five full audits per invocation**, run
   one at a time.
4. **Ask before exceeding the cap, naming the number** — "30 use cases, 7 look suspicious. Audit
   those 7 now, or name the ones you want?" Never silently run 30.
5. The deliverable is the summary table plus the full matrices only for the ones actually audited,
   and a line naming the ids that were skipped so nobody mistakes a triage row for an audit. Never
   audit the same id twice in one invocation.

## DO NOT

- Do not write or edit code, tests, or specifications — including the `**Status:**` line.
- Do not restate or paraphrase the agent's audit checklist in this file; `agents/uc-coverage.md`
  owns it.
- Do not soften, upgrade, or drop a verdict, and do not present a summary in place of the matrix.
- Do not tell the agent what you expect it to find.
- Do not claim that a build or a test suite was run.
- Do not audit every use case without being asked, and do not exceed the sweep cap without
  confirmation.
