<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Versioning of the AI Unified Process generate workflow

The AI-assisted generation runs on a thin stub per project repository and a shared implementation in this repository —
per Git provider one of each:

- **The dispatch stubs** — written by the AI Unified Process Studio during setup (UC-042); they never change when a skill or plugin
  is added. On GitHub it is `.github/workflows/aiup-generate.yml`, which only receives the `workflow_dispatch` and
  passes the inputs on. On Bitbucket it is the custom pipeline `aiup-generate` in `bitbucket-pipelines.yml`, which
  only clones this marketplace at the tag and runs its script.
- **The shared implementation** — everything the run does (the specification diff, the skill, the status advance and
  the result) lives here: for GitHub in the reusable workflow
  [`.github/workflows/aiup-generate.yml`](../.github/workflows/aiup-generate.yml), for Bitbucket in the script
  [`pipelines/aiup-generate.sh`](../pipelines/aiup-generate.sh). The two mirror each other — the catalogue of allowed
  plugin/skill pairs is the same list in both, and a new skill changes both in the same pull request.
  `scripts/check-generate-catalogue.sh` fails CI when the catalogues, the skill lists of the diff and status steps,
  or the plugin selection block differ, or when a skill on disk is in neither catalogue. The logic both run word for
  word sits between `# >>> name` and `# <<< name` markers (specification diff, blocking questions, status rank,
  status write, review report), and the check fails when a marked block differs: a fix inside one is made in both
  files.
- **The specification diff** — taken against the merge base of the branch and the default branch, not against the tip
  of the default branch: a change the default branch made to the same specification after the branch was cut would
  otherwise read as lines the branch removed, and the prompt tells the skill to delete the code of a removed line.
  Both hosts clone shallow, so both histories are deepened (50, 500, 5000 commits) until they meet; without a common
  commit the run works from the specification alone and says so.
- **The status advance** — the run leaves the status alone while a blocking open question holds the use case. Both
  implementations ask `spec_lint.py` of the published `aiup-core` (`OQ_BLOCKING`) instead of reading
  `docs/open_questions.md` themselves, so a question on a requirement the use case links counts as it does in the
  lint. When the lint cannot be fetched or run, the status stays as it is.
- **The deadline** — `timeout_minutes` is the limit of the job on GitHub. On Bitbucket the script gives the session
  what is left of `TIMEOUT_MINUTES` since its start (with the `timeout` command of the image; without one it warns and
  the pipeline's own limit applies).
- **Credentials** — the GitHub workflow checks the project out with `persist-credentials: false`: the session runs
  with bypassed permissions, and the token of the job must not lie in `.git/config`. The step that fetches the default
  branch passes the token for its own calls, and the pull request step has its `token` input.
- **The plugin selection** — a run installs only `aiup-core` and the plugins it needs, never the layer plugins next
  to a combined stack plugin: a combined stack plugin alone; for a layer run, the layer plugins whose skills the
  project's `docs/architecture/stack.md` names (every layer plugin when the project has no stack file,
  and always for `/stack`); for the document skills of `aiup-core`, core alone. The selection is derived from
  the inputs and the repository, so the stubs and their inputs stay as they are.

Both stubs reference the shared implementation **by tag**:

```yaml
uses: ai-unified-process/marketplace/.github/workflows/aiup-generate.yml@v1
```

```yaml
- git clone --quiet --depth 1 --branch v1 https://github.com/AI-Unified-Process/marketplace.git /tmp/aiup-marketplace
- bash /tmp/aiup-marketplace/pipelines/aiup-generate.sh
```

## CI on the pull request

GitHub starts no workflow for a pull request opened with the job's `GITHUB_TOKEN`, so the result of a generate run
shows no checks unless the stub passes the optional secret `AIUP_PR_TOKEN`:

```yaml
    secrets:
      ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
      AIUP_PR_TOKEN: ${{ secrets.AIUP_PR_TOKEN }}
```

The secret is the same one the Werkstatt uses, and it is created the same way: see
[werkstatt.md, "CI on the pull request"](werkstatt.md#ci-on-the-pull-request). A stub without the line keeps
working; its pull requests only arrive without checks. Adding an optional secret does not break the contract
between stub and implementation, so it needs no new major tag. Bitbucket is not affected: there the Studio opens the
pull request.

## The `v1` tag

`v1` is a **moving tag**, not a release: it always points at the commit of this repository whose shared
implementation the project repositories should run — the reusable workflow and the pipelines script move together.
Evolving them and moving the tag updates every repository at once; the stubs stay as they are. A breaking change to
the contract between stub and implementation (inputs, secrets, permissions) would get a new major tag (`v2`) and new
stub templates in the Studio instead.

The tag must exist — GitHub resolves the `uses:` reference at dispatch time, and the Bitbucket stub clones the tag at
the start of the run; if it doesn't, **every** generate run fails before the skill starts (see
[Troubleshooting](#troubleshooting) below).

### Moving the tag after a change

After changing the reusable workflow or the pipelines script on `main`:

```bash
git tag -f v1 <commit>
git push -f origin v1
```

The Werkstatt (`.github/workflows/aiup-werkstatt.yml` and `pipelines/werkstatt/`) moves with the same tag: its stubs
pass the tag again as `engine_ref`. To try an unreleased change of it, a test stub references `@main` with
`engine_ref: main` instead.

The workflows pin what they run themselves: third-party actions by commit SHA, and the claude-code CLI by version
(2.1.322 at the time of writing) where they install it themselves — `.github/workflows/aiup-werkstatt.yml` and
`pipelines/aiup-generate.sh`. The reusable workflow `aiup-generate.yml` installs no CLI: it runs
`anthropics/claude-code-action` at a pinned commit, and the CLI comes with that commit. A newer action or CLI reaches
the project repositories only through a commit here and a moved `v1`, so update them deliberately — when the action's
SHA moves, check which CLI it brings and move the two pins to the same version — and move the tag after a run on a
test repository.

Commits that do not touch the shared implementation (skills, docs) do not require moving the tag — the project
repositories check out the marketplace at the tag's commit only for the workflow and script themselves; the plugins
and skills are installed at their published version inside the run.

## Troubleshooting

**The Studio's dispatch fails with `422 Unprocessable Content` — "failed to parse workflow: … reference to workflow
should be either a valid branch, tag, or commit".**

GitHub could not resolve the `@v1` reference in the stub, which almost always means the tag is missing or was deleted.
Verify and restore it:

```bash
gh api repos/ai-unified-process/marketplace/tags --jq '.[].name'   # should list v1
git tag v1 origin/main && git push origin v1                        # restore if missing
```

The dispatch succeeds again immediately; nothing in the project repository or the Studio needs to change.

**The run starts but "Run the skill" fails with "Environment variable validation failed — Either ANTHROPIC_API_KEY,
CLAUDE_CODE_OAUTH_TOKEN, … is required", although the secret exists in the project repository.**

The secret did not reach the reusable workflow. GitHub only inherits secrets (`secrets: inherit`) when the calling and
the called workflow live in the **same organization**, and the project repositories live anywhere — which is why the
stub passes the two secrets explicitly and the reusable workflow declares them under `on.workflow_call.secrets`. A
stub still using `secrets: inherit` predates that fix; the Studio offers the updated stub on the project page.
Whether the secrets arrived is visible in the run log: the `with:` block of the `Run the skill` step lists
`claude_code_oauth_token: ***` when the value came through and omits the line entirely when it stayed empty.
