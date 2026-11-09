<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# The AI Unified Process Werkstatt

> **Status: released** behind the `v1` tag. The AI Unified Process Studio sets it up and starts it (Studio UC-061);
> without the Studio, commit the stub below and dispatch it by hand.
>
> The concept (roles, stations, gates, branch model, metrics, rollout): [werkstatt-architecture.md](werkstatt-architecture.md).

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
| G5 spec coverage | The `uc-coverage-layered` agent (or the plugin's `uc-coverage`), read-only; it reports every gap in one pass, and a later audit re-checks the previous matrix | fix round or test round |
| Budget | `max_rounds` fix rounds and `max_cost_usd` per use case | stuck |

A harness guard keeps each station in its lane: test code the implementer writes and production code the tester
writes are reverted and listed in the pull request. Test code is told by its path: test folders (`src/test/`,
`test/`, `e2e/`, ...), `*.spec.ts` and `*.test.ts` files, `*Test(s).cs` and `*Test(s).razor` files, and every file in
a .NET test project folder (`MyApp.Tests/`, `MyApp.Tests.E2E/`). A moved file counts with its old and its new path,
so a test moved out of the test folder is restored. Build files (`pom.xml`, `package.json`, a test runner's
configuration, and the like) are the exception for the tester: a test may need a dependency, so they are kept and
listed.

**The andon cord.** When a station meets a gap in the specification, it records a blocking open question in
`docs/open_questions.md` (`**Blocking:** Yes`) instead of guessing. The Werkstatt detects the question from the file,
stops the use case and keeps only the question. A question counts when it is `Open` or `Answered` and its element is
the use case (`UC-003`, `UC-003 step 2`, `UC-003 A1`, `UC-003 BR-001`) or a requirement the use case links on its
`**Requirements:**` line, as `/spec-review` reads the file. The domain expert answers it in the change branch; the next run
builds the use case again.

## Outcomes

| Outcome | Meaning | What the pull request carries |
| --- | --- | --- |
| `ready` | All gates green | Code, tests, status `Tested` (`Implemented` when the stack has no coverage audit), and the new status of the requirements the use case links |
| `blocked` | Spec lint errors or a blocking open question | Only the new open questions; the code is dropped |
| `stuck` | Still red after the fix rounds, over budget, or the stations stopped without a result | Nothing of this use case; the code is kept as `dropped.diff` in the run records |
| `pending` | Not built: an earlier use case of the run stopped | Nothing; it is built in the next run |
| `skipped` | Not built: the use case is not `Approved` (or has no specification), also when `use_cases` names it | Nothing; the reason names its status |

The requirements follow the use case in the same commit: the progress status (`Open`, `In Progress`, `Implemented`,
`Verified`) of every requirement the use case links moves to what its use cases make it, derived by `spec_lint.py`
as `/spec-review` derives it, so the pull request shows no `REQ_STATUS_DRIFT`. `Deferred` and `Rejected` are set by
hand and stay.

Use cases run in id order and the run stops at the first one that is not `ready`, because later use cases of the
same change may build on it. The stations stop 10 minutes before `timeout_minutes`, so the pull request is still
opened: a use case still running then ends `stuck`, the ones before it keep their result, and when the time runs
out between two use cases the run's outcome is `pending`. The status is the memory between runs: a built use case is `Tested` after the merge
into the change branch and is no longer selected; a blocked, stuck or pending one stays `Approved`.

## Setting it up

Prerequisites: a project with the AI Unified Process artifacts, a filled `docs/architecture/stack.md` (Layers and
Commands, written by `/stack`), and the secret `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` in the repository.
Allow GitHub Actions to create pull requests (Settings → Actions → General → Workflow permissions).

The stub `.github/workflows/aiup-werkstatt.yml` of a project has one source:
[`pipelines/werkstatt/aiup-werkstatt-stub.yml`](../pipelines/werkstatt/aiup-werkstatt-stub.yml). The Studio ships a
verbatim copy of it, writes it during its generation setup (Studio UC-042), next to the one of `aiup-generate`, and
before every Werkstatt run compares the stub of the change branch against its copy (Studio UC-061 A4): a stub that
differs in any line counts as outdated, and the Studio refuses the run until the branch carries the current one. So
do not edit the stub in a project: the model, the budget, and the other limits are inputs of the dispatch, not lines
of the file. Without the Studio, copy the file unchanged and pass the inputs by hand.

A change to the stub is made here and copied to the Studio's `src/main/resources/generation/aiup-werkstatt.yml` in
the same release; `scripts/check-werkstatt-stub.sh` fails CI when the stub passes an input the reusable workflow
does not declare, leaves out one it declares, or names another ref in `engine_ref` than in its `uses:` line.

GitHub offers a workflow for dispatch only when its file is on the default branch, but it runs the file **as it is on
the ref the run goes on**. Commit the stub to the default branch and create the change branches from there; the run
goes on the change branch:
`gh workflow run aiup-werkstatt.yml --ref change/online-booking -f correlation_id=manual-1 -f max_cost_usd=40`. When
the stub changes later, merge the default branch into every open change branch before its next run; otherwise that
run still uses the change branch's old stub, and the Studio reports it as outdated. Secrets are the exception: they
belong to the repository and reach every branch at once.

### CI on the pull request

GitHub starts no workflow for a pull request opened with the job's `GITHUB_TOKEN`. Without further setup the
Werkstatt's pull request therefore shows no checks, although its own build gate ran. To have the project's CI run on
it, give the Werkstatt a token of its own:

1. On GitHub, open **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new
   token** (the account settings, not the repository's).
2. Name it (for example `aiup-werkstatt <repository>`), pick an expiration, set **Resource owner** to the owner of the
   repository, and **Repository access** to *Only select repositories* with the project repository.
3. Under **Repository permissions**, set **Contents** and **Pull requests** to *Read and write* (Metadata becomes
   read-only by itself). Generate the token and copy it.
4. Store it as a secret of the project repository:

   ```bash
   gh secret set AIUP_PR_TOKEN -R <owner>/<repository>
   ```

5. The stub passes it with the line `AIUP_PR_TOKEN: ${{ secrets.AIUP_PR_TOKEN }}`; nothing to change there.

The pull request is then opened in the name of the token's account, and the workflows that run on `pull_request`
(or on a push to `aiup/**`) start for it. That account cannot approve its own pull request, so a team uses the token
of a machine user that has write access to the repository, not a person's. When the secret is missing, the Werkstatt
falls back to `GITHUB_TOKEN`: the pull request is opened all the same, only without checks. The same secret serves
`aiup-generate` ([generate-workflow-versioning.md](generate-workflow-versioning.md#ci-on-the-pull-request)), so one
token per repository is enough.

## Inputs

| Input | Default | Meaning |
| --- | --- | --- |
| `use_cases` | empty | Ids to build; empty = every `Approved` use case whose specification changed on the branch. An id that is not `Approved` is skipped |
| `correlation_id` | – | Run id; names the result branch `aiup/werkstatt-<id>` and the records artifact |
| `engine_ref` | `v1` | Ref of this marketplace whose `pipelines/werkstatt/` runs; the same ref as in `uses:` |
| `stack_plugin` | empty | A combined stack plugin (`aiup-blazor-dotnet`); empty for layer plugins |
| `artifact_locations` | empty | Prompt hint when the artifacts are not at the default paths |
| `model` | `claude-sonnet-5` | Model of every station |
| `max_turns` | `150` | Turns per station; it stops loops, the cost budget is the real limit |
| `max_rounds` | `4` | Fix rounds per use case |
| `max_cost_usd` | `15` | Cost budget per use case |
| `timeout_minutes` | `180` | Upper limit of the whole run, counted from the job's start; the stations stop 10 minutes earlier. A value of 10 or less fails the run at its first step |

Outputs: `outcome` (`ready`, `blocked`, `stuck`, `pending`, `none`; `none` also when every use case named was
skipped, and then no pull request is opened) and `pull_request`. The artifact `werkstatt-<id>` holds the
records of every station: `summary.json` per use case, `metrics.jsonl` (station, round, exit code, the session's
result subtype, cost, seconds), the build logs, the lint output and the coverage matrix. A session cut off by
`max_turns` (subtype `error_max_turns`) goes on to the gates with what it wrote, and the pull request lists it under
*Notes*, so a fix round it caused is visible.

## Not yet

- Bitbucket Pipelines (the GitHub reusable workflow only).
- The Studio shows the outcome per use case once the run has ended, not the station a running use case is in, and
  it has no change branch as a concept of its own: the Werkstatt runs on the branch the user works on.
- End-to-end tests are not part of the build gate; the coverage audit still reports a missing browser test.
- A GitHub App as the author of the pull request: the reusable workflow would have to create the App token itself
  (a token cannot be handed from the stub's job to it). Use a machine user's fine-grained token meanwhile.

Why the Werkstatt works this way: [design/werkstatt.md](design/werkstatt.md).
