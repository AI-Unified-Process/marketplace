#!/usr/bin/env bash
# AIUP Studio - AI-assisted generation, the shared implementation for Bitbucket Pipelines.
#
# This is the Bitbucket counterpart of the reusable workflow in
# .github/workflows/aiup-generate.yml. The stub the AIUP Studio writes into every
# repository (bitbucket-pipelines.yml, UC-042) clones this marketplace at the v1 tag
# and runs this script; everything the run does - the specification diff, the skill
# and the status advance - happens here. Evolving this script and moving the tag
# updates every repository at once; the stubs stay as they are. How the v1 tag works
# and how to move it: docs/generate-workflow-versioning.md.
#
# Bitbucket has no reusable workflows across repositories and no equivalent of the
# Claude Code action, so the script installs Claude Code itself and drives it directly.
# Unlike the GitHub workflow it does not open the pull request: a pipeline has no API
# token of its own, and the Studio - which knows the run - opens the pull request for
# the pushed branch instead (UC-033 BR-003). It runs the chosen skill of the chosen
# plugin and pushes the result to its own branch; nothing is ever written to the
# dispatched branch directly.
#
# Expected from the stub (declared as variables of the custom pipeline):
#   PLUGIN, SKILL, SUBJECT, CORRELATION_ID, MODEL, MAX_TURNS, TIMEOUT_MINUTES
# Expected from the repository (secured repository variables, one of the two):
#   ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN
set -euo pipefail

# --- Check the plugin and the skill against the catalogue -------------------------
# The stub accepts plugin and skill as free text so that a new skill does not force
# an update of every repository. The guarantee moves here: only a combination of this
# catalogue reaches a prompt. The catalogue mirrors the plugins of this marketplace -
# the name alone would not do, because flyway-migration, implement and playwright-test
# exist in both stack plugins and mean different work in each - and a new skill
# changes it in the same pull request that adds the skill. It is the same list as in
# the reusable workflow; a change touches both.
case "$PLUGIN/$SKILL" in
  aiup-core/requirements) ;;
  aiup-core/entity-model) ;;
  aiup-core/use-case-diagram) ;;
  aiup-core/use-case-spec) ;;
  aiup-core/test-case) ;;
  aiup-core/reverse-engineer) ;;
  aiup-vaadin-jooq/flyway-migration) ;;
  aiup-vaadin-jooq/implement) ;;
  aiup-vaadin-jooq/browserless-test) ;;
  aiup-vaadin-jooq/playwright-test) ;;
  aiup-angular-jpa/flyway-migration) ;;
  aiup-angular-jpa/implement) ;;
  aiup-angular-jpa/spring-boot-test) ;;
  aiup-angular-jpa/vitest-test) ;;
  aiup-angular-jpa/playwright-test) ;;
  *)
    echo "ERROR: '$SKILL' of '$PLUGIN' is not in the catalogue of this marketplace" >&2
    exit 1 ;;
esac

# --- Determine the change of the specification ------------------------------------
# A specification edit that only removes a requirement is invisible to the skill:
# the remaining text is already satisfied by the existing code, so the run finds
# nothing to do and the dropped behaviour survives. The diff against the default
# branch makes every change explicit - removals included - and travels with the
# prompt so the skill reconciles the code with the change instead of re-checking a
# specification it already fulfils.
hint=""
case "$SKILL" in
  implement | browserless-test | spring-boot-test | vitest-test | playwright-test)
    # Only the skills that turn a specification into code or tests care how the
    # specification moved; the document skills rewrite their artifact as a whole.
    # The subject of these skills is the path of the specification. A subject that
    # is an id names no file and has no history to diff.
    if [ -n "${SUBJECT:-}" ] && [ -f "$SUBJECT" ]; then
      # HEAD alone identifies the default branch without a remote round trip.
      default_branch=$(git ls-remote --symref origin HEAD | sed -n 's|^ref: refs/heads/\(.*\)\tHEAD$|\1|p')
      # The clone of the pipeline is shallow; the tip of the default branch is
      # enough for a two-point diff of a single file.
      git fetch --quiet --depth=1 origin "refs/heads/$default_branch"
      diff=$(git diff FETCH_HEAD HEAD -- "$SUBJECT")
      if [ -z "$diff" ]; then
        echo "The specification matches '$default_branch'; the run works from the specification alone."
      elif [ "${#diff}" -gt 20000 ]; then
        # A diff of a single specification is small. Anything larger is not a
        # specification edit and would drown the prompt - better no hint than a
        # truncated one that misleads.
        echo "The diff of '$SUBJECT' is too large for the prompt; the run works from the specification alone."
      else
        # Tildes fence the diff because a Markdown specification may itself contain
        # backtick fences.
        hint=$(printf '\nThe specification named above was changed on this branch. Its diff against `%s`:\n\n~~~diff\n%s\n~~~\n\nReconcile the result with every change in this diff, not only with the current text of the specification. A removed line means the behaviour it described was dropped deliberately: delete the code or tests that exist only for that behaviour.' "$default_branch" "$diff")
      fi
    fi ;;
esac

# --- Run the skill ----------------------------------------------------------------
npm install --global --no-fund --no-audit @anthropic-ai/claude-code

# All plugins are installed, only the chosen one runs: telling them apart would cost
# an extra step to save a few seconds of installation time. The marketplace is added
# by URL, not from the clone of the stub: the plugins run at their published version,
# the v1 tag only pins this script (docs/generate-workflow-versioning.md).
claude plugin marketplace add https://github.com/AI-Unified-Process/marketplace.git
claude plugin install aiup-core@ai-unified-process-marketplace
claude plugin install aiup-vaadin-jooq@ai-unified-process-marketplace
claude plugin install aiup-angular-jpa@ai-unified-process-marketplace

# The diff of the specification follows the slash command; an empty hint leaves the
# prompt as the bare command. Everything after the command name reaches the skill as
# its arguments, and the skills expect the diff there. Plugin and skill were checked
# against the catalogue above; nothing else ever stands before the colon or the space.
prompt="/$PLUGIN:$SKILL ${SUBJECT:-}
$hint"

# Bypassing rather than accepting the edits because the code and test skills verify
# their result with Maven, and that is a Bash call. The pipeline container runs the
# script as root, and Claude Code refuses to bypass permissions as root outside a
# sandbox; the container of a pipeline is one, so the marker is set explicitly.
#
# git stays blocked: the changes are meant to stay in the working directory so that
# they can be turned into a branch below. The deny rule outranks the permission mode,
# so the block holds.
IS_SANDBOX=1 claude -p "$prompt" \
  --model "$MODEL" \
  --max-turns "$MAX_TURNS" \
  --permission-mode bypassPermissions \
  --disallowedTools "Bash(git:*)"

# --- Advance the status of the specification --------------------------------------
# The status of the specification follows the merge: the new status travels on the
# same branch as the code it describes, so the artifact says Implemented or Tested at
# the very moment the proposal is taken over - and says nothing new while the pull
# request is only open or is rejected. Nobody has to watch the pull request afterwards
# and no second commit follows the merge.
advance_status() {
  # Only the two steps that move the status of a use case. The end-to-end test
  # follows a test case, not a use case, and moves nothing.
  local target english german
  case "$SKILL" in
    implement)
      target=3; english=Implemented; german=Implementiert ;;
    browserless-test | spring-boot-test | vitest-test)
      target=4; english=Tested; german=Getestet ;;
    *)
      return 0 ;;
  esac
  # The subject of these steps is the path of the specification. A subject that is
  # an id names no file and is left alone.
  if [ -z "${SUBJECT:-}" ] || [ ! -f "$SUBJECT" ]; then
    echo "No specification at '${SUBJECT:-}'; the status was left alone."
    return 0
  fi
  # A run that produced nothing has no result to take over; without this check the
  # branch would carry the new status and nothing else.
  if [ -z "$(git status --porcelain)" ]; then
    echo "The skill changed nothing; the status was left alone."
    return 0
  fi
  local current rank value
  current=$(sed -n -e 's/^\*\*Status:\*\*[[:space:]]*\([^[:space:]]*\).*/\1/p' \
    -e '/^\*\*Status:\*\*/q' "$SUBJECT")
  # The AIUP status values in their order, English and German.
  # LC_ALL=C keeps the lowercasing to ASCII, so the umlaut of "Geprüft" survives.
  case "$(printf '%s' "$current" | LC_ALL=C tr '[:upper:]' '[:lower:]')" in
    draft | entwurf) rank=0 ;;
    reviewed | geprüft) rank=1 ;;
    approved | genehmigt) rank=2 ;;
    implemented | implementiert) rank=3 ;;
    tested | getestet) rank=4 ;;
    done | abgeschlossen) rank=5 ;;
    # Obsolete, a value the format does not know, or no status line at all: none of
    # them is a state this run may advance out of.
    *) rank=-1 ;;
  esac
  # Forward only, and only out of a status the step is allowed at: below Approved
  # neither the implementation nor the tests are a step of the AIUP process, and a
  # status already at or beyond the one this run stands for never moves backwards.
  if [ "$rank" -lt 2 ] || [ "$rank" -ge "$target" ]; then
    echo "Status '$current' of '$SUBJECT' was left alone."
    return 0
  fi
  # A specification is written back in the language it is written in.
  if grep -qE '^\*\*Use-Case-ID:\*\*|^## Übersicht' "$SUBJECT"; then
    value=$german
  else
    value=$english
  fi
  # Only the first status line, and the trailing spaces of a Markdown hard break are
  # kept - dropping them would join the line with the one below it.
  sed -i "0,/^\*\*Status:\*\*/s/^\(\*\*Status:\*\*\)[[:space:]]*[^[:space:]]*\([[:space:]]*\)\$/\1 $value\2/" "$SUBJECT"
  echo "Status of '$SUBJECT': $current -> $value"
}
advance_status

# --- Provide the result on its own branch -----------------------------------------
# The branch keeps its shape `aiup/<skill>-<correlation id>`: the Studio rebuilds
# that name to find the result of a run again and opens the pull request for it. The
# subject must not enter the name. The commit message names the artifact the run was
# set on - without it the commit reads as "AIUP: implement" next to every other one.
if [ -z "$(git status --porcelain)" ]; then
  echo "The skill produced no changes; no branch was pushed."
  exit 0
fi
git config user.name "AIUP Studio"
git config user.email "studio@unifiedprocess.ai"
branch="aiup/$SKILL-$CORRELATION_ID"
if [ -n "${SUBJECT:-}" ]; then
  message="AIUP: $SKILL $SUBJECT"
else
  message="AIUP: $SKILL"
fi
git checkout -b "$branch"
git add --all
git commit --message "$message"
# The clone of the pipeline authenticates the origin remote; pushing the new branch
# needs no credentials of its own.
git push origin "$branch"
echo "Result pushed to '$branch'; the Studio opens the pull request."
