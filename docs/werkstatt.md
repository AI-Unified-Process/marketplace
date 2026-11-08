<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# The AI Unified Process Werkstatt

> **Status: incubating** on the branch `change/werkstatt`. Not yet behind the `v1` tag, not yet offered by the
> AI Unified Process Studio. Try it in a test repository with the stub below.

The Werkstatt turns the approved use cases of a change into one tested pull request. Domain experts write the
specification, the software engineer owns the architecture and the harness, and the agents build in between, each
step in its own session. Where `aiup-generate` runs one skill, the Werkstatt runs the whole construction of a use
case and checks the result before anyone reviews it.

## Branch model

One change, one branch. Specification, code and tests of a change live on the same branch and reach the default
branch in one pull request, so the default branch never holds a specification without its code.

1. The domain expert opens a change branch (for example `change/online-booking`) and edits requirements, glossary
   and use cases there.
2. The domain expert sets the use cases of the change to `Approved` (`Genehmigt`). This is the gate: the agents
   build nothing that is not approved.
3. The Werkstatt runs on the change branch. It opens **one pull request against the change branch** with the code,
   the tests and the new status of every use case that passed all gates.
4. The software engineer reviews that pull request and merges it into the change branch.
5. The change branch's own pull request brings specification, code and tests to the default branch together.

The Werkstatt never commits to a branch directly; its result is always a pull request, as with `aiup-generate`.

## Stations and gates

Every use case goes through the same stations. Agent stations run as separate `claude -p` sessions, so the tester
and the auditor read the specification, not the implementer's reasoning.

| Station / gate | What runs | On failure |
| --- | --- | --- |
| G1 spec lint | `spec_lint.py --only UC-XXX` of `/spec-review`, plus the blocking open questions of the use case | blocked |
| Implement | `/aiup-core:use-case-implement` (or `/<plugin>:implement`), with the spec diff against the default branch | – |
| Test | `/aiup-core:use-case-test` (or the plugin's test skills) in a fresh session | – |
| G2–G4 build and tests | The Build, Unit tests and Integration tests commands of `docs/architecture/stack.md` | fix round |
| G5 spec coverage | The `uc-coverage-layered` agent (or the plugin's `uc-coverage`), read-only | fix round or test round |
| Budget | `max_rounds` fix rounds and `max_cost_usd` per use case | stuck |

A harness guard keeps each station in its lane: test code the implementer writes and production code the tester
writes are reverted and listed in the pull request. Build files (`pom.xml`, `package.json`, a test runner's
configuration, and the like) are the exception for the tester: a test may need a dependency, so they are kept and
listed.

**The andon cord.** When a station meets a gap in the specification, it records a blocking open question in
`docs/open_questions.md` (`**Blocking:** Yes`) instead of guessing. The Werkstatt detects the question from the file,
stops the use case and keeps only the question. The domain expert answers it in the change branch; the next run
builds the use case again.

## Outcomes

| Outcome | Meaning | What the pull request carries |
| --- | --- | --- |
| `ready` | All gates green | Code, tests, status `Tested` (`Implemented` when the stack has no coverage audit) |
| `blocked` | Spec lint errors or a blocking open question | Only the new open questions; the code is dropped |
| `stuck` | Still red after the fix rounds, or over budget | Nothing of this use case; the code is kept as `dropped.diff` in the run records |
| `pending` | Not built: an earlier use case of the run stopped | Nothing; it is built in the next run |

Use cases run in id order and the run stops at the first one that is not `ready`, because later use cases of the
same change may build on it. The status is the memory between runs: a built use case is `Tested` after the merge
into the change branch and is no longer selected; a blocked, stuck or pending one stays `Approved`.

## Setting it up in a test repository

Prerequisites: a project with the AI Unified Process artifacts, a filled `docs/architecture/stack.md` (Layers and
Commands, written by `/stack`), and the secret `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` in the repository.
Allow GitHub Actions to create pull requests (Settings → Actions → General → Workflow permissions).

Stub `.github/workflows/aiup-werkstatt.yml`:

```yaml
name: AI Unified Process Werkstatt
on:
  workflow_dispatch:
    inputs:
      use_cases:
        description: Use case ids (empty = every Approved use case of the change)
        required: false
      correlation_id:
        description: Run id
        required: false
permissions:
  contents: write
  pull-requests: write
jobs:
  werkstatt:
    uses: AI-Unified-Process/marketplace/.github/workflows/aiup-werkstatt.yml@change/werkstatt
    with:
      use_cases: ${{ inputs.use_cases }}
      correlation_id: ${{ inputs.correlation_id || github.run_id }}
      engine_ref: change/werkstatt
    secrets:
      ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

GitHub only dispatches a workflow whose file is on the default branch, so commit the stub there; the run itself
goes on the change branch: `gh workflow run aiup-werkstatt.yml --ref change/online-booking`.

## Inputs

| Input | Default | Meaning |
| --- | --- | --- |
| `use_cases` | empty | Ids to build; empty = every `Approved` use case whose specification changed on the branch |
| `correlation_id` | – | Run id; names the result branch `aiup/werkstatt-<id>` and the records artifact |
| `engine_ref` | `v1` | Ref of this marketplace whose `pipelines/werkstatt/` runs; the same ref as in `uses:` |
| `stack_plugin` | empty | A combined stack plugin (`aiup-blazor-dotnet`); empty for layer plugins |
| `artifact_locations` | empty | Prompt hint when the artifacts are not at the default paths |
| `model` | `claude-sonnet-5` | Model of every station |
| `max_turns` | `80` | Turns per station |
| `max_rounds` | `3` | Fix rounds per use case |
| `max_cost_usd` | `15` | Cost budget per use case |
| `timeout_minutes` | `180` | Upper limit of the whole run |

Outputs: `outcome` (`ready`, `blocked`, `stuck`, `none`) and `pull_request`. The artifact `werkstatt-<id>` holds the
records of every station: `summary.json` per use case, `metrics.jsonl` (station, round, exit code, cost, seconds),
the build logs, the lint output and the coverage matrix.

## Not yet

- Bitbucket Pipelines (the GitHub reusable workflow only).
- The Studio: starting a run, showing the stations, the change branch as a concept.
- Blocking questions on a requirement (`FR-`) count only when their element names the use case.
- End-to-end tests are not part of the build gate; the coverage audit still reports a missing browser test.

Why the Werkstatt works this way: [design/werkstatt.md](design/werkstatt.md).
