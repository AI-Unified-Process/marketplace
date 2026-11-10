<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Werkstatt

`aiup-generate` runs one skill and returns its result as a pull request. Building a use case takes several skills in
a row (implement, test, audit), a build in between, and a loop when something is red. Doing that by hand, one
generate run at a time, leaves the checking to the reviewer. The Werkstatt chains the steps, checks the result
against gates, and stops when the specification has a gap. The name is the picture: the specification is the
wish list, the orchestrator is the workshop master, the agents are the workers. It is a workshop, not a factory:
the domain expert and the software engineer stay in it.

## One change, one branch, one pull request against it

Specification and code that reach the default branch separately drift apart: an approved specification without its
code, or a changed use case whose old code is still live, until a second pull request follows. So a change lives
on one branch, and the Werkstatt runs on it. Its result is a pull request **against the change branch**, not a
commit on it, for the same reason as every generate run (Studio C-004): a proposal is reviewed before it is taken
over. The change branch's own pull request then brings everything to the default branch at once.

## The status is the memory

The Werkstatt keeps no state of its own between runs. It selects the use cases that changed on the branch and are
`Approved`, and moves a finished one to `Tested` in the same pull request as its code, like the status advance of
`aiup-generate` (forward only, in the language of the specification). After the merge the use case is not selected
again; a blocked, stuck or pending one is still `Approved` and is. Nobody has to watch the pull request, and a
rejected pull request leaves the specification as it was. The status is also the gate for ids given by hand in
`use_cases`: one that is not `Approved` is skipped with its status as the reason, because an approval that a typed id
could bypass would be no gate.

The requirements catalog moves with the status. A requirement's progress follows the use cases that link it (#32),
so a use case at `Tested` with its requirements still `Open` is a contradiction `/spec-review` reports as
`REQ_STATUS_DRIFT`. The Werkstatt writes the derived status of the linked requirements into the same commit. It does
not derive it a second time: `werkstatt.py requirements` imports `derived_status()` from `spec_lint.py`, the one
copy. The writer lives in the Werkstatt and not in `spec_lint.py`, because `/spec-review` is read-only.

## Separate sessions, guarded lanes

The tester and the auditor run in sessions of their own, so the specification stays the oracle: a test written by
the agent that wrote the code tends to confirm the code. The same holds the other way: the implementer may not
change tests, and the tester may not change production code. The guard reverts what crosses the lane instead of
failing the run, and lists it in the pull request, so a drifting skill shows up in review. Build files are not
production code: the test skills add test dependencies and runner configuration, and reverting them would only
turn the tests red. The tester's changes to them are kept and listed in the pull request all the same. The stack
file is the tester's too: the test skills keep their rows of its Markers table, and an audit that finds a layer
without rows reports a gap, so reverting them would cost a round for a legitimate edit. It is kept as a whole file
and listed, like a build file; the guard does not try to tell a Markers row from another line. Git paths are read
without rename detection, so a moved file is the deletion of one path and the addition of another and is undone as
both; with rename detection the guard saw only the new path, removed it, and the commit lost the file.

A session that fails is not a station that found nothing to do. The exit code of the `claude` call and a missing
result decide it, not the build: unchanged code builds green, and on a stack without a coverage audit nothing else
would stand between a rejected key and a use case reported `ready`. The station is started once more, because a
rate limit or a dropped connection passes; a second failure ends the use case `stuck`. Both are recorded in the
metrics and the report. `stuck` and `blocked` drop the untracked files too: a report or a new source file left in the
tree would reach the pull request with the next commit. The same holds for a process that outlives its use case: a
build or a session that is stopped at the deadline can still flush a file after the tree was cleaned, and the pull
request step would commit it for a use case reported `stuck`. `timeout` returns as soon as the script it started is
gone, so the stations run in a session of their own (`setsid`) and what is left of it is killed before the drop.
An id named twice in `use_cases` is built once: the second pass would find the use case `Tested` and overwrite its
result with `skipped`. The stations get the specification's diff against the merge
base, not against the tip of the default branch, where a later change there would read as a removed line to delete
the code for. All three writing stations get it, not only the implementer: a tester that sees only the current text
keeps the tests of a removed step, and they fail against the reduced code. And `artifact_locations` stays a hint in the prompts, because the Werkstatt itself reads the default
paths under `docs/`.

## The andon cord is read from the file

A skill that meets a gap records a blocking open question (`/open-questions`). The Werkstatt does not ask the agent
whether it got stuck; it reads `docs/open_questions.md` after each station. The file is the contract every skill
already writes, the check is deterministic, and a question that names the use case stops it whatever the agent
says. A blocked use case contributes only its questions: half-built code is no proposal, and the next run builds
again from the answered specification. The Werkstatt reads the file the way `spec_lint.py` does (heading with or
without a colon, a backticked element, fenced examples skipped), and a question on a requirement stops every use case
that links it, as `/spec-review` assigns it. The parser is a small copy of those rules rather than an import of
`spec_lint.py`'s internals: a refactoring there must not cut the andon cord silently, and the self-test pins the
rules. The copy can only read a question that is well formed. One written as `**Blocking:** Yes (decides the
result)` is blocking for neither parser, and the use case would reach the pull request as `ready` with a question
the lint then fails on. So `spec_lint.py --questions` runs after every station, and its errors block.

## Gates before review

Only `spec_lint.py` decides G1, for the same reason only it may fail a build in `/spec-review`: the same input
gives the same result. Its exit code 1 means findings, and the domain expert fixes the specification; a higher one
means the lint did not run (a wrong path, a traceback), which ends the use case `stuck`, not `blocked`, so nobody is
sent to correct a specification that is fine. The build gate runs the commands the stack file records rather than guessing a build tool.
The coverage audit (G5) is read-only and reports gaps in code and tests separately, so a gap in the tests goes back
to the tester, not to the implementer. A red build has no such label: the log does not say whether the code or a
test is wrong, and the audit only runs on a green build. So the implementer goes first, and when the build is still
red, the tester gets the new log in the same round. Without that second step a test that does not compile could
never be repaired, because the lane guard reverts every test change of the implementer. Each gap costs a round, so the audit is asked for all of them at once, and a
later audit gets the previous matrix to re-check row by row: in the first runs, audits that each found one new gap
used up the rounds of a use case whose code was right. The cost budget is the real limit of a station; `max_turns` only stops a
session that loops, so its default is high (150). A session it cuts off is recorded, not failed: what it wrote may
still pass the gates, and when it does not, the fix round that follows shows why. A use case that does not get green within its rounds or its budget is
dropped and reported instead of being handed to review half done: the reviewer's time is the scarcest resource.
The run's own time limit is handled the same way: the stations stop before the job's timeout and the use case still
running is dropped, because a job killed by GitHub opens no pull request and would lose the use cases already
green. The deadline is taken in the job's first step, so it counts from where GitHub's timeout counts, and a
`timeout_minutes` of 10 or less fails right there: it would leave the stations no time at all. Stations that stop
without a result (a crash) end stuck as well, with a row in the report, so no use case of a run goes unreported.

## Plugins from the layer catalog

The run installs aiup-core and the layer plugins whose skills the stack file names. The skill-to-plugin mapping is
read from the Plugins table of the layer catalog, which `scripts/check-layer-catalog.sh` already keeps in step with
the plugins. A third hand-written copy of the list, next to the two in the generate implementations, would drift.

## A token of its own for the pull request

GitHub starts no workflow for a pull request opened with `GITHUB_TOKEN`, to prevent workflows from triggering each
other without end. The Werkstatt's gates are no replacement for the project's CI: a reviewer expects the same checks
on every pull request. The project checkout keeps no token: the stations run with `bypassPermissions`, and a
blocked `git` tool does not stop a build script from pushing with a token in `.git/config`, which would break "never
a commit on the change branch". For the same reason the AI secrets are the environment of the stations step only,
and the build commands run without them. So the stub may pass `AIUP_PR_TOKEN`, a fine-grained token with Contents and Pull requests
write, and the pull request is opened with it. The secret is optional: without it the result arrives all the same,
only without checks, because a missing token must not cost a finished run.

## Engine checked out by ref

A called workflow cannot see the ref it was called at. The scripts under `pipelines/werkstatt/` are therefore
checked out at `engine_ref`, which the stub sets to the same tag or branch as its `uses:` line. That keeps the
workflow small and lets the stations be shell and Python that run, and are tested, outside GitHub Actions:
`werkstatt.py self-test` checks the helpers against fixtures and the real layer catalog, and `self-test.sh` runs the
stations against a fixture repository with a fake `claude` on the PATH. Both run in CI. The scripts keep to the
bash 3.2 of macOS.
