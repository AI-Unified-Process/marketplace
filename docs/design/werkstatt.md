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
rejected pull request leaves the specification as it was.

## Separate sessions, guarded lanes

The tester and the auditor run in sessions of their own, so the specification stays the oracle: a test written by
the agent that wrote the code tends to confirm the code. The same holds the other way: the implementer may not
change tests, and the tester may not change production code. The guard reverts what crosses the lane instead of
failing the run, and lists it in the pull request, so a drifting skill shows up in review. Build files are not
production code: the test skills add test dependencies and runner configuration, and reverting them would only
turn the tests red. The tester's changes to them are kept and listed in the pull request all the same.

## The andon cord is read from the file

A skill that meets a gap records a blocking open question (`/open-questions`). The Werkstatt does not ask the agent
whether it got stuck; it reads `docs/open_questions.md` after each station. The file is the contract every skill
already writes, the check is deterministic, and a question that names the use case stops it whatever the agent
says. A blocked use case contributes only its questions: half-built code is no proposal, and the next run builds
again from the answered specification.

## Gates before review

Only `spec_lint.py` decides G1, for the same reason only it may fail a build in `/spec-review`: the same input
gives the same result. The build gate runs the commands the stack file records rather than guessing a build tool.
The coverage audit (G5) is read-only and reports gaps in code and tests separately, so a gap in the tests goes back
to the tester, not to the implementer. A use case that does not get green within its rounds or its budget is
dropped and reported instead of being handed to review half done: the reviewer's time is the scarcest resource.
The run's own time limit is handled the same way: the stations stop before the job's timeout and the use case still
running is dropped, because a job killed by GitHub opens no pull request and would lose the use cases already
green.

## Plugins from the layer catalog

The run installs aiup-core and the layer plugins whose skills the stack file names. The skill-to-plugin mapping is
read from the Plugins table of the layer catalog, which `scripts/check-layer-catalog.sh` already keeps in step with
the plugins. A third hand-written copy of the list, next to the two in the generate implementations, would drift.

## Engine checked out by ref

A called workflow cannot see the ref it was called at. The scripts under `pipelines/werkstatt/` are therefore
checked out at `engine_ref`, which the stub sets to the same tag or branch as its `uses:` line. That keeps the
workflow small and lets the stations be shell and Python that run, and are tested, outside GitHub Actions:
`werkstatt.py self-test` checks the helpers against fixtures and the real layer catalog, and `self-test.sh` runs the
stations against a fixture repository with a fake `claude` on the PATH. Both run in CI. The scripts keep to the
bash 3.2 of macOS.
