<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# The AI Unified Process Werkstatt

> **Status: released** behind the `v1` tag. The AI Unified Process Studio sets it up and starts it (Studio UC-061);
> without the Studio, commit the stub below and dispatch it by hand. To run it on your own machine instead, see
> [Running it on your own machine](#running-it-on-your-own-machine).
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
| G1 spec lint | `spec_lint.py --only UC-XXX` of `/spec-review`, plus the blocking open questions of the use case | blocked; stuck when the lint itself fails (exit code above 1) |
| Implement | `/aiup-core:use-case-implement` (or `/<plugin>:implement`), with the spec diff against the merge base with the default branch | – |
| Test | `/aiup-core:use-case-test` (or the plugin's test skills) in a fresh session, with the same spec diff | – |
| Open questions | After every agent station: `spec_lint.py --questions`, then the blocking open questions of the use case | blocked |
| G2–G4 build and tests | The Build, Unit tests and Integration tests commands of `docs/architecture/stack.md` | fix round |
| G5 spec coverage | The `uc-coverage-layered` agent (or the plugin's `uc-coverage`), read-only; it reports every gap in one pass, and a later audit re-checks the previous matrix. A verdict of complete is verified (see below) | fix round or test round; `Implemented` only when the verdict cannot be verified twice |
| Budget | `max_rounds` fix rounds and `max_cost_usd` per use case | stuck |

A fix round for a red build has two steps. The implementer gets the build log and the spec diff and changes
production code only. When the build is still red after that, the tester gets the new log in the same round and
repairs the tests that do not compile or that contradict the specification; a test that follows the specification
stays failing. So a broken test is repaired by the only station that may change it, and both steps count as one of
the `max_rounds` rounds. A gap the audit finds in the code goes to the implementer, a gap in the tests to the tester.

A harness guard keeps each station in its lane: test code the implementer writes and production code the tester
writes are reverted and listed in the pull request. Test code is told by its path: test folders (`src/test/`,
`test/`, `e2e/`, ...), `*.spec.ts` and `*.test.ts` files, `*Test(s).cs` and `*Test(s).razor` files, and every file in
a .NET test project folder (`MyApp.Tests/`, `MyApp.Tests.E2E/`). A moved file counts with its old and its new path,
so a test moved out of the test folder is restored. Build files (`pom.xml`, `package.json`, a test runner's
configuration, and the like) are the exception for the tester: a test may need a dependency, so they are kept and
listed. The same holds for the stack file, `docs/architecture/stack.md`: the test skills keep their rows of its
Markers table, so the tester's change to it is kept as a whole and listed, unless it changes the Commands table. The
open questions are every station's to append to.

Some paths are protected for every station, because they are what the gates judge against or what the next station
reads: the specification (`docs/use_cases/`, `docs/use_cases.puml`, `docs/requirements.md`, `docs/glossary.md`, the
entity model, `docs/processes/`, `docs/test_cases/`, `docs/vision.md`, the ADR folders), `.github/`, `.claude/`,
`.mcp.json`, `CLAUDE.md`, and `AGENTS.md`. A change to one of them is reverted and listed. So is a change to the
Commands table of the stack file, the build gate; the whole stack file goes back then. The implementer's changes to
build files and to the rest of the stack file are kept and listed. A station that changes the Werkstatt engine or the
spec lint, which lie outside the project's Git, ends the use case `stuck`. The status, the requirements, and the
diagram are written by the Werkstatt after the stations, not by them.

**A verified audit.** The audit's `"complete": true` is checked, not trusted. Its session runs with
`--output-format stream-json`, and `werkstatt.py verify-audit` checks three things: the matrix has a row for every
main success scenario step (`Step n`), alternative flow (`A1`), and business rule (`BR-001`) of the specification,
none of them `Missing` or `Partial`; the tool log shows a `Read` of the specification; and every file the matrix cites
(`RoomService.java:33`) was opened with `Read`. When a check fails, the audit runs once more in the same round with
the findings. When that verdict cannot be verified either, the build is green but the coverage unproven: the use case
is `ready` with the status `Implemented`, and the pull request gives the findings.

A station whose session fails (the `claude` call exits with an error or returns no result: a rejected key, an
unknown model, a rate limit) is started once more. A second failure ends the use case `stuck`, whatever the build
says about the unchanged code. Both the failure and the retry are recorded in the metrics and the report.

**The andon cord.** When a station meets a gap in the specification, it records a blocking open question in
`docs/open_questions.md` (`**Blocking:** Yes`) instead of guessing. The Werkstatt detects the question from the file,
stops the use case and keeps only the question. A question counts when it is `Open` or `Answered` and its element is
the use case (`UC-003`, `UC-003 step 2`, `UC-003 A1`, `UC-003 BR-001`) or a requirement the use case links on its
`**Requirements:**` line, as `/spec-review` reads the file. The domain expert answers it in the change branch; the next run
builds the use case again. A question the lint rejects, such as `**Blocking:** Yes (decides the result)` or one
without an element, is read as blocking by no parser. So after every station `spec_lint.py --questions` checks the
file, and an error there blocks the use case too, with the lint's findings in the pull request.

## Outcomes

| Outcome | Meaning | What the pull request carries |
| --- | --- | --- |
| `ready` | All gates green | Code, tests, status `Tested` (`Implemented` when the stack has no coverage audit, or its verdict could not be verified), the new status of the requirements the use case links, and its new colour in the use case diagram |
| `blocked` | Spec lint errors, a blocking open question, or an open questions file the lint rejects | Only the new open questions; the code is dropped, untracked files included |
| `stuck` | Still red after the fix rounds, over budget, a session that failed twice, a spec lint that failed itself, or stations that stopped without a result | Nothing of this use case, untracked files included; the code is kept as `dropped.diff` in the run records |
| `pending` | Not built: an earlier use case of the run stopped | Nothing; it is built in the next run |
| `skipped` | Not built: the use case is not `Approved` (or has no specification), also when `use_cases` names it | Nothing; the reason names its status, and the run goes on with the next use case |

The requirements follow the use case in the same commit: the progress status (`Open`, `In Progress`, `Implemented`,
`Verified`) of every requirement the use case links moves to what its use cases make it, derived by `spec_lint.py`
as `/spec-review` derives it, so the pull request shows no `REQ_STATUS_DRIFT`. `Deferred` and `Rejected` are set by
hand and stay.

The use case diagram follows too: the use case is drawn in the colour of its new status, as `/use-case-diagram`
("Status colours") and the Studio draw it — in the colour the diagram's legend gives that status, so a project's own
palette stays, otherwise in the standard colour with a new legend row. Module diagrams
(`docs/use_cases/*/use_cases.puml`) count as well; every other line of the diagram stays.

Use cases run in id order, also when `use_cases` names them in another order, and an id named twice is built once.
The run stops at the first one that is not `ready`, because later use cases of the same change may build on it. The stations stop 10 minutes before `timeout_minutes`, so the pull request is still
opened: a use case still running then ends `stuck`, the ones before it keep their result, and when the time runs
out between two use cases the run's outcome is `pending`. The stations of a use case run in a session of their own,
and what is left of it (a build, a server a test started) is killed before the working tree is dropped or the next
use case starts, so nothing writes into the tree afterwards. A process that starts its own session, such as a build
daemon, is out of reach: keep daemons off in the Commands of the stack file (`--no-daemon` for Gradle). The status is the memory between runs: a built use case is `Tested` after the merge
into the change branch and is no longer selected; a blocked, stuck or pending one stays `Approved`.

## Setting it up

Prerequisites: a project with the AI Unified Process artifacts, a filled `docs/architecture/stack.md` (Layers and
Commands, written by `/stack`), and the secret `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` in the repository.
Allow GitHub Actions to create pull requests (Settings → Actions → General → Workflow permissions).

**The build commands.** The build gate runs the Build, Unit tests and Integration tests rows of the Commands table.
A project on a combined stack plugin (`stack_plugin`) has no stack file, because the combined plugins do not read
one. The Werkstatt then falls back to the build tool it finds in the repository root: `./mvnw -B -ntp verify`,
`./gradlew build`, `npm ci` and `npm test`, or `dotnet test` for a `.sln` or `.slnx` file. When none of them fits
(a solution in a subfolder, another command), add a `docs/architecture/stack.md` that holds only a `## Commands`
table (Purpose, Command); the Werkstatt reads it for the commands and the combined plugin ignores it. Without a
build command the use case ends `stuck`.

**The toolchain.** The job installs Node 22 for Claude Code and a Temurin JDK (`java_version`, default `25`), which
sets `JAVA_HOME` for the stations and the build commands; an empty `java_version` keeps the default JDK of the
`ubuntu-latest` runner image (older than most projects require). Everything else comes with the image (Maven, Gradle,
a .NET SDK, Docker for Testcontainers). The stub cannot be edited to add a setup step, so the project pins what else
it needs itself: the Maven or Gradle wrapper, `global.json` for .NET, `.nvmrc` or `engines` with a version manager the
build calls. A build that needs a JDK or SDK the job does not have ends every use case `stuck` after the fix rounds,
with the compiler's message in the build log.

**Tokens.** The checkout keeps no token in `.git/config`, and the AI secrets reach only the step that runs the
stations; the build commands run without them. The pull request is opened by a later step with its own token.

The stub `.github/workflows/aiup-werkstatt.yml` of a project has one source:
[`pipelines/werkstatt/aiup-werkstatt-stub.yml`](../pipelines/werkstatt/aiup-werkstatt-stub.yml). The Studio ships a
verbatim copy of it, writes it during its generation setup (Studio UC-042), next to the one of `aiup-generate`, and
before every Werkstatt run compares the stub of the change branch against its copy (Studio UC-061 A4): a stub that
differs in any line counts as outdated, and the Studio refuses the run until the branch carries the current one. So
do not edit the stub in a project: the model, the budget, and the other limits are inputs of the dispatch, not lines
of the file. Without the Studio, copy the file unchanged and pass the inputs by hand.

A change to the stub is made here and copied to the Studio's `src/main/resources/generation/aiup-werkstatt.yml` in
the same release; `scripts/check-werkstatt-stub.sh` fails CI when the stub passes an input the reusable workflow
does not declare, leaves out one it declares, does not forward an input to the reusable workflow, gives an input
another default than the reusable workflow, or names another ref in `engine_ref` than in its `uses:` line.

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

## Running it on your own machine

The stations also run on a Mac or Linux machine, without GitHub Actions:
[`pipelines/werkstatt/run-local.sh`](../pipelines/werkstatt/run-local.sh) is the local entry point. You need
`git`, `python3`, `jq`, Claude Code logged in with the plugins of the `ai-unified-process-marketplace` installed
(`aiup-core` and the layer plugins of the stack file, or the combined stack plugin), the toolchain the project
builds with, and a checkout of this marketplace for the helpers.

```bash
cd ~/projects/online-booking                  # the project, on the change branch, everything committed
~/marketplace/pipelines/werkstatt/run-local.sh            # the Approved use cases of the change
~/marketplace/pipelines/werkstatt/run-local.sh UC-003     # or the ones you name
```

The script refuses a checkout with uncommitted changes and the default branch. It builds the last commit of the
change branch in a new Git worktree next to the checkout, on a new branch `aiup/werkstatt-local-<stamp>`, so the
checkout you work in is never touched: a blocked or stuck use case resets and cleans the tree it runs in. No pull
request is opened. The result is the commits on that branch and the report in `<worktree>/.werkstatt/report.md`;
the script prints the commands to review it, merge it, or push it and open the pull request yourself. The limits are
environment variables with the names of the inputs: `MODEL`, `MAX_TURNS`, `MAX_ROUNDS`, `MAX_COST_USD` (per use
case), `STACK_PLUGIN`, `TIMEOUT_MINUTES`, plus `DEFAULT_BRANCH` and `WORKTREE`.

Before it starts, the script names what is different from the GitHub run and asks you to accept it (`--yes` skips
the question):

- **No sandbox.** The stations run `claude -p --permission-mode bypassPermissions` as you, with your files,
  credentials, and network, not on a runner that is thrown away afterwards. Only `git` is denied to them. Run it on a
  machine and an account you would let an agent work on unattended.
- **No session of their own on macOS.** macOS has no `setsid --wait`, so a build daemon or a dev server a station
  leaves behind is not killed and may write into the worktree after its use case ended. Stop such processes before
  you take over the branch.
- **Your Claude Code, not the pinned one.** The stations use your login, your CLI version, your installed plugin
  versions, and your `~/.claude` settings (a global `CLAUDE.md`, MCP servers, hooks), where the GitHub run installs
  claude-code 2.1.322 and the plugins fresh. The helpers and the gates come from the marketplace checkout you run the
  script from; keep it at the version of your installed `aiup-core`.

## Inputs

| Input | Default | Meaning |
| --- | --- | --- |
| `use_cases` | empty | Ids to build; empty = every `Approved` use case whose specification changed on the branch. An id that is not `Approved` is skipped. A moved specification counts as added at its new path |
| `correlation_id` | – | Run id; names the result branch `aiup/werkstatt-<id>` and the records artifact |
| `engine_ref` | `v1` | Ref of this marketplace whose `pipelines/werkstatt/` runs; the same ref as in `uses:` |
| `stack_plugin` | empty | A combined stack plugin (`aiup-blazor-dotnet`); empty for layer plugins |
| `artifact_locations` | empty | Prompt hint for the stations only; the Werkstatt itself (selection, lint, andon cord, status) reads the default paths under `docs/` |
| `java_version` | `25` | Temurin JDK the stations and the build commands run on; empty keeps the runner image's default |
| `model` | `claude-opus-5-5` | Model of every station |
| `max_turns` | `150` | Turns per station; it stops loops, the cost budget is the real limit |
| `max_rounds` | `4` | Fix rounds per use case; a round is one pass of the implementer and, where needed, the tester |
| `max_cost_usd` | `15` | Cost budget per use case |
| `timeout_minutes` | `180` | Upper limit of the whole run, counted from the job's start; the stations stop 10 minutes earlier. A value of 10 or less fails the run at its first step |

Outputs: `outcome` (`ready`, `blocked`, `stuck`, `pending`, `none`; `none` also when every use case named was
skipped, and then no pull request is opened) and `pull_request`. The artifact `werkstatt-<id>` holds the
records of every station: `summary.json` per use case, `metrics.jsonl` (station, round, exit code, the session's
result subtype, cost, seconds), the build logs, the lint output and the coverage matrix. A session cut off by
`max_turns` (subtype `error_max_turns`) goes on to the gates with what it wrote, and the pull request lists it under
*Notes*, so a fix round it caused is visible. The audit's stream-json tool log (`session-audit-r<round>.jsonl`) and the
findings of its verification (`verify-r<round>.txt`) are kept too.

The pull request names the commit the gates ran on. A commit pushed to it afterwards is covered by none of them: the
status `Tested` claims the commit the Werkstatt built, so run the Werkstatt again after a change.

The self-tests (`werkstatt.py self-test`, `self-test.sh` with a fake `claude`) prove the harness: the lanes, the
gates, the outcomes. They say nothing about the quality of what a model builds; only the review of the pull request
does.

## Not yet

- Bitbucket Pipelines (the GitHub reusable workflow only).
- The Studio shows the outcome per use case once the run has ended, not the station a running use case is in, and
  it has no change branch as a concept of its own: the Werkstatt runs on the branch the user works on.
- End-to-end tests are not part of the build gate; the coverage audit still reports a missing browser test.
- A GitHub App as the author of the pull request: the reusable workflow would have to create the App token itself
  (a token cannot be handed from the stub's job to it). Use a machine user's fine-grained token meanwhile.

Why the Werkstatt works this way: [design/werkstatt.md](design/werkstatt.md).
