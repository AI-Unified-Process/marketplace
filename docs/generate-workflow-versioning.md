# Versioning of the AIUP generate workflow

The AI-assisted generation runs on two files:

- **The dispatch stub** — `.github/workflows/aiup-generate.yml` in every project repository. The AIUP Studio writes it
  during setup (UC-042). It only receives the `workflow_dispatch` from the Studio and passes the inputs on; it never
  changes when a skill or plugin is added.
- **The reusable workflow** — [`.github/workflows/aiup-generate.yml`](../.github/workflows/aiup-generate.yml) in this
  repository. Everything the run does — the specification diff, the skill, the status advance and the pull request —
  lives here.

The stub calls the reusable workflow **by tag**:

```yaml
uses: ai-unified-process/marketplace/.github/workflows/aiup-generate.yml@v1
```

## The `v1` tag

`v1` is a **moving tag**, not a release: it always points at the commit of this repository whose reusable workflow the
project repositories should run. Evolving the workflow and moving the tag updates every repository at once; the stubs
stay as they are. A breaking change to the contract between stub and workflow (inputs, secrets, permissions) would get
a new major tag (`v2`) and a new stub template in the Studio instead.

The tag must exist — GitHub resolves the `uses:` reference at dispatch time, and if it doesn't, **every** generate run
fails before it starts (see [Troubleshooting](#troubleshooting) below).

### Moving the tag after a workflow change

After changing the reusable workflow on `main`:

```bash
git tag -f v1 <commit>
git push -f origin v1
```

Commits that do not touch the reusable workflow (skills, docs) do not require moving the tag — the project
repositories check out the marketplace at the tag's commit only for the workflow definition itself; the plugins and
skills are installed at their published version inside the run.

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
