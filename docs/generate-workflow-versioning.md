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

Both stubs reference the shared implementation **by tag**:

```yaml
uses: ai-unified-process/marketplace/.github/workflows/aiup-generate.yml@v1
```

```yaml
- git clone --quiet --depth 1 --branch v1 https://github.com/AI-Unified-Process/marketplace.git /tmp/aiup-marketplace
- bash /tmp/aiup-marketplace/pipelines/aiup-generate.sh
```

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
