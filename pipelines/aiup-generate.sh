#!/usr/bin/env bash
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
# AI Unified Process Studio - AI-assisted generation, the shared implementation for Bitbucket Pipelines.
#
# This is the Bitbucket counterpart of the reusable workflow in
# .github/workflows/aiup-generate.yml. The stub the AI Unified Process Studio writes into every
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
# dispatched branch directly. The one exception is spec-review, which changes nothing:
# its report goes to the Studio through the log of the step and no branch is pushed.
#
# Expected from the stub (declared as variables of the custom pipeline):
#   PLUGIN, SKILL, SUBJECT, ARTIFACT_LOCATIONS, CORRELATION_ID, MODEL, MAX_TURNS,
#   TIMEOUT_MINUTES
# Expected from the repository (secured repository variables, one of the two):
#   ANTHROPIC_API_KEY or CLAUDE_CODE_OAUTH_TOKEN
set -euo pipefail

# --- Check the plugin and the skill against the catalogue -------------------------
# The stub accepts plugin and skill as free text so that a new skill does not force
# an update of every repository. The guarantee moves here: only a combination of this
# catalogue reaches a prompt. The catalogue mirrors the plugins of this marketplace -
# the name alone would not do, because implement and playwright-test exist in several
# stack plugins and mean different work in each - and a new skill changes it in the
# same pull request that adds the skill. Read-only skills (the coverage audits) are
# left out; spec-review is the exception, because the Studio reads its report from the
# log of the step. It is the same list as in the reusable workflow; a change
# touches both, and scripts/check-generate-catalogue.sh fails CI when the two differ
# or a skill on disk is in neither.
case "$PLUGIN/$SKILL" in
  aiup-core/requirements) ;;
  aiup-core/entity-model) ;;
  aiup-core/use-case-diagram) ;;
  aiup-core/business-process) ;;
  aiup-core/use-case-spec) ;;
  aiup-core/test-case) ;;
  aiup-core/reverse-engineer) ;;
  aiup-core/stack) ;;
  aiup-core/spec-review) ;;
  aiup-vaadin-jooq/flyway-migration) ;;
  aiup-vaadin-jooq/implement) ;;
  aiup-vaadin-jooq/implement-hilla) ;;
  aiup-vaadin-jooq/browserless-test) ;;
  aiup-vaadin-jooq/hilla-test) ;;
  aiup-vaadin-jooq/playwright-test) ;;
  aiup-angular-jpa/flyway-migration) ;;
  aiup-angular-jpa/implement) ;;
  aiup-angular-jpa/spring-boot-test) ;;
  aiup-angular-jpa/vitest-test) ;;
  aiup-angular-jpa/playwright-test) ;;
  aiup-blazor-dotnet/ef-migration) ;;
  aiup-blazor-dotnet/implement) ;;
  aiup-blazor-dotnet/dotnet-test) ;;
  aiup-blazor-dotnet/bunit-test) ;;
  aiup-blazor-dotnet/playwright-test) ;;
  aiup-nestjs-nextjs/drizzle-migration) ;;
  aiup-nestjs-nextjs/implement) ;;
  aiup-nestjs-nextjs/nest-test) ;;
  aiup-nestjs-nextjs/react-test) ;;
  aiup-nestjs-nextjs/playwright-test) ;;
  aiup-core/use-case-implement) ;;
  aiup-core/use-case-test) ;;
  aiup-core/test-case-implement) ;;
  aiup-flyway/flyway-schema) ;;
  aiup-jooq/jooq-persistence) ;;
  aiup-jooq/jooq-persistence-test) ;;
  aiup-jpa/jpa-persistence) ;;
  aiup-jpa/jpa-persistence-test) ;;
  aiup-spring-boot/spring-service) ;;
  aiup-spring-boot/spring-rest) ;;
  aiup-spring-boot/spring-service-test) ;;
  aiup-spring-boot/spring-rest-test) ;;
  aiup-spring-boot/spring-client) ;;
  aiup-spring-boot/spring-client-test) ;;
  aiup-vaadin/vaadin-flow-ui) ;;
  aiup-vaadin/hilla-ui) ;;
  aiup-vaadin/vaadin-flow-ui-test) ;;
  aiup-vaadin/hilla-ui-test) ;;
  aiup-vaadin/vaadin-e2e-test) ;;
  aiup-angular/angular-ui) ;;
  aiup-angular/angular-ui-test) ;;
  aiup-playwright/playwright-e2e-test) ;;
  aiup-drizzle/drizzle-schema) ;;
  aiup-drizzle/drizzle-persistence) ;;
  aiup-drizzle/drizzle-persistence-test) ;;
  aiup-nestjs/nest-service) ;;
  aiup-nestjs/nest-service-test) ;;
  aiup-nestjs/nest-rest) ;;
  aiup-nestjs/nest-rest-test) ;;
  aiup-nextjs/nextjs-ui) ;;
  aiup-nextjs/nextjs-ui-test) ;;
  *)
    echo "ERROR: '$SKILL' of '$PLUGIN' is not in the catalogue of this marketplace" >&2
    exit 1 ;;
esac

# --- Determine the kind of the run -----------------------------------------------
# spec-review (UC-062 of the Studio) changes nothing, so it pushes no branch and hands
# its report over through the log. A subject that starts with `lint` asks for the
# deterministic part alone, which needs no AI access at all; the rest of the subject is
# the scope - one use case or test case id, or empty for the whole project.
review=false
lint_only=false
SCOPE=""
arguments=""
case "$SKILL" in
  spec-review)
    review=true
    SCOPE=${SUBJECT:-}
    if [ "$SCOPE" = lint ] || [ "${SCOPE#lint }" != "$SCOPE" ]; then
      lint_only=true
      SCOPE=${SCOPE#lint}
      SCOPE=${SCOPE# }
    fi
    # The scope reaches the prompt and the lint; nothing but an id may stand there.
    if [ -n "$SCOPE" ] && ! printf '%s' "$SCOPE" | grep -Eq '^([SB]?UC|TC)-[A-Za-z0-9_-]+$'; then
      echo "ERROR: '$SCOPE' is no use case or test case id" >&2
      exit 1
    fi
    arguments="--output .aiup-report/review.json" ;;
esac
LINT_ONLY=$lint_only

# --- Determine the change of the specification ------------------------------------
# A specification edit that only removes a requirement is invisible to the skill:
# the remaining text is already satisfied by the existing code, so the run finds
# nothing to do and the dropped behaviour survives. The diff since the branch left
# the default branch makes every change explicit - removals included - and travels with the
# prompt so the skill reconciles the code with the change instead of re-checking a
# specification it already fulfils.
hint=""
case "$SKILL" in
  implement | implement-hilla | browserless-test | hilla-test | spring-boot-test | vitest-test | dotnet-test | bunit-test | nest-test | react-test | playwright-test \
    | use-case-implement | use-case-test | test-case-implement \
    | flyway-schema | jooq-persistence | jooq-persistence-test | jpa-persistence | jpa-persistence-test | spring-service | spring-service-test | spring-rest | spring-rest-test | spring-client | spring-client-test | vaadin-flow-ui | vaadin-flow-ui-test | hilla-ui | hilla-ui-test | angular-ui | angular-ui-test | drizzle-schema | drizzle-persistence | drizzle-persistence-test | nest-service | nest-service-test | nest-rest | nest-rest-test | nextjs-ui | nextjs-ui-test | vaadin-e2e-test | playwright-e2e-test)
    # Only the skills that turn a specification into code or tests care how the
    # specification moved; the document skills rewrite their artifact as a whole.
    # The subject of these skills is the path of the specification. A subject that
    # is an id names no file and has no history to diff.
    if [ -n "${SUBJECT:-}" ] && [ -f "$SUBJECT" ]; then
      # HEAD alone identifies the default branch without a remote round trip.
      default_branch=$(git ls-remote --symref origin HEAD | sed -n 's|^ref: refs/heads/\(.*\)\tHEAD$|\1|p')
      head_ref=""
      if [ -n "${BITBUCKET_BRANCH:-}" ]; then
        head_ref="refs/heads/$BITBUCKET_BRANCH"
      fi
      # >>> specification diff - identical in pipelines/aiup-generate.sh and .github/workflows/aiup-generate.yml
      # Against the merge base, not the tip of the default branch: a change the default branch made to the
      # same specification after this branch was cut would read as lines this branch removed, and the
      # prompt tells the skill to delete the code of a removed line. The clone is shallow on both hosts, so
      # both histories are deepened until they meet; without a common commit there is no diff and no hint.
      diff=""
      base=""
      for depth in 50 500 5000; do
        # a fetch that fails costs the hint, not the run: git says why in the log. No maintenance in the
        # background: it would hold the lock on the shallow file while the next fetch deepens.
        if git -c gc.auto=0 -c maintenance.auto=false fetch --quiet --depth="$depth" origin "refs/heads/$default_branch"; then
          default_tip=$(git rev-parse FETCH_HEAD)
          if [ -n "$head_ref" ]; then
            git -c gc.auto=0 -c maintenance.auto=false fetch --quiet --depth="$depth" origin "$head_ref" || true
          fi
          base=$(git merge-base "$default_tip" HEAD 2>/dev/null || true)
        fi
        if [ -n "$base" ]; then
          break
        fi
      done
      if [ -n "$base" ]; then
        diff=$(git diff "$base" HEAD -- "$SUBJECT")
      fi
      # <<< specification diff
      if [ -z "$base" ]; then
        echo "This branch and '$default_branch' share no commit within reach; the run works from the specification alone."
      elif [ -z "$diff" ]; then
        echo "The specification is unchanged since this branch left '$default_branch'; the run works from the specification alone."
      elif [ "${#diff}" -gt 20000 ]; then
        # A diff of a single specification is small. Anything larger is not a
        # specification edit and would drown the prompt - better no hint than a
        # truncated one that misleads.
        echo "The diff of '$SUBJECT' is too large for the prompt; the run works from the specification alone."
      else
        # Tildes fence the diff because a Markdown specification may itself contain
        # backtick fences.
        hint=$(printf '\nThe specification named above was changed on this branch. Its diff since the branch left `%s`:\n\n~~~diff\n%s\n~~~\n\nReconcile the result with every change in this diff, not only with the current text of the specification. A removed line means the behaviour it described was dropped deliberately: delete the code or tests that exist only for that behaviour.' "$default_branch" "$diff")
      fi
    fi ;;
esac

# --- Run the skill ----------------------------------------------------------------
# the lint alone needs no session (section "Determine the kind of the run")
if [ "$lint_only" != true ]; then
# A fixed version: the session holds the AI secrets, and a new release is taken over on purpose.
npm install --global --no-fund --no-audit @anthropic-ai/claude-code@2.1.322

# >>> plugin selection - identical in pipelines/aiup-generate.sh and .github/workflows/aiup-generate.yml
# A project uses either layer plugins or one combined stack plugin, never both: commands
# such as /implement exist in several stack plugins, and a layer project whose session also
# holds a combined plugin runs the wrong skill. So only aiup-core and the plugins the run
# needs are installed. A combined stack plugin brings everything itself. A layer run takes
# the layer plugins that the project's stack file names in its Layers table, plus the
# chosen plugin; without a stack file (and always for /stack, which discovers
# the installed layer skills to choose from) it takes every layer plugin, still without the
# combined ones. The document skills of aiup-core need nothing but core. The skills of each
# layer plugin are listed here because the Layers table names skills, not plugins;
# scripts/check-generate-catalogue.sh keeps this list in step with the skills on disk.
layer_skills="aiup-flyway:flyway-schema
aiup-jooq:jooq-persistence aiup-jooq:jooq-persistence-test
aiup-jpa:jpa-persistence aiup-jpa:jpa-persistence-test
aiup-spring-boot:spring-service aiup-spring-boot:spring-service-test aiup-spring-boot:spring-rest aiup-spring-boot:spring-rest-test aiup-spring-boot:spring-client aiup-spring-boot:spring-client-test
aiup-vaadin:vaadin-flow-ui aiup-vaadin:vaadin-flow-ui-test aiup-vaadin:hilla-ui aiup-vaadin:hilla-ui-test aiup-vaadin:vaadin-e2e-test
aiup-angular:angular-ui aiup-angular:angular-ui-test
aiup-drizzle:drizzle-schema aiup-drizzle:drizzle-persistence aiup-drizzle:drizzle-persistence-test
aiup-nestjs:nest-service aiup-nestjs:nest-service-test aiup-nestjs:nest-rest aiup-nestjs:nest-rest-test
aiup-nextjs:nextjs-ui aiup-nextjs:nextjs-ui-test
aiup-playwright:playwright-e2e-test"
view=docs/architecture/stack.md
all_layers=""
from_view=""
for pair in $layer_skills; do
  layer_plugin=${pair%%:*}
  layer_skill=${pair#*:}
  case " $all_layers " in *" $layer_plugin "*) ;; *) all_layers="$all_layers $layer_plugin" ;; esac
  # A table row that names the skill: in backticks anywhere in the row, or bare as a whole cell -
  # /stack writes the Layers table bare and the Integration layer table in backticks.
  if [ -f "$view" ] && grep -Eq "^\|.*(\`$layer_skill\`|\|[[:space:]]*$layer_skill[[:space:]]*\|)" "$view"; then
    case " $from_view " in *" $layer_plugin "*) ;; *) from_view="$from_view $layer_plugin" ;; esac
  fi
done
case "$PLUGIN/$SKILL" in
  aiup-vaadin-jooq/* | aiup-angular-jpa/* | aiup-blazor-dotnet/* | aiup-nestjs-nextjs/*)
    plugins="aiup-core $PLUGIN" ;;
  aiup-core/stack)
    plugins="aiup-core$all_layers" ;;
  aiup-core/use-case-implement | aiup-core/use-case-test | aiup-core/test-case-implement)
    if [ -n "$from_view" ]; then plugins="aiup-core$from_view"; else plugins="aiup-core$all_layers"; fi ;;
  aiup-core/*)
    plugins="aiup-core" ;;
  *)
    if [ -n "$from_view" ]; then
      plugins="aiup-core$from_view"
      case " $plugins " in *" $PLUGIN "*) ;; *) plugins="$plugins $PLUGIN" ;; esac
    else
      plugins="aiup-core$all_layers"
    fi ;;
esac
echo "Plugins for $PLUGIN/$SKILL: $plugins"
# <<< plugin selection

# The marketplace is added by URL, not from the clone of the stub: the plugins run at
# their published version, the v1 tag only pins this script
# (docs/generate-workflow-versioning.md).
claude plugin marketplace add https://github.com/AI-Unified-Process/marketplace.git
for plugin in $plugins; do
  claude plugin install "$plugin@ai-unified-process-marketplace"
done

# The artifact locations (UC-033 BR-008) and the diff of the specification follow the
# slash command; empty values leave the prompt as the bare command. Everything after
# the command name reaches the skill as its arguments, and the skills expect the hints
# there. Plugin and skill were checked against the catalogue above; nothing else ever
# stands before the colon or the space.
prompt="/$PLUGIN:$SKILL ${SUBJECT:-} $arguments
${ARTIFACT_LOCATIONS:-}
$hint"

# Bypassing rather than accepting the edits because the code and test skills verify
# their result with Maven, and that is a Bash call. The pipeline container runs the
# script as root, and Claude Code refuses to bypass permissions as root outside a
# sandbox; the container of a pipeline is one, so the marker is set explicitly.
#
# git stays blocked: the changes are meant to stay in the working directory so that
# they can be turned into a branch below. The deny rule outranks the permission mode,
# so the block holds.
#
# TIMEOUT_MINUTES is the deadline of the whole run, as timeout-minutes is for the job of the GitHub
# workflow: the Studio gives up on the run at that moment, so a session still running then only
# costs. The session gets what is left of it; the time is counted from the start of this script
# (SECONDS). A run that reaches the deadline fails without a result, like the GitHub job.
case "${TIMEOUT_MINUTES:-}" in
  '' | *[!0-9]*) TIMEOUT_MINUTES=30 ;;
esac
left=$((TIMEOUT_MINUTES * 60 - SECONDS))
if [ "$left" -le 0 ]; then
  echo "ERROR: the run's time (TIMEOUT_MINUTES=$TIMEOUT_MINUTES) was up before the session started" >&2
  exit 1
fi
limit=()
if command -v timeout > /dev/null 2>&1; then
  # seconds without a unit and the short option: GNU coreutils and BusyBox both take them
  limit=(timeout -k 60 "$left")
else
  echo "WARNING: this image has no 'timeout' command; TIMEOUT_MINUTES is not enforced" >&2
fi
session_status=0
IS_SANDBOX=1 ${limit[@]+"${limit[@]}"} claude -p "$prompt" \
  --model "$MODEL" \
  --max-turns "$MAX_TURNS" \
  --permission-mode bypassPermissions \
  --disallowedTools "Bash(git:*)" || session_status=$?
if [ "$session_status" -eq 124 ] || [ "$session_status" -eq 137 ]; then
  echo "ERROR: the session was stopped after $TIMEOUT_MINUTES minutes (TIMEOUT_MINUTES); the run has no result" >&2
fi
if [ "$session_status" -ne 0 ]; then
  exit "$session_status"
fi
fi

# --- Hand the review over to the Studio -------------------------------------------
# The report of spec-review: the lint runs here and not in the session, so its findings
# never pass through a model, and the semantic part is the JSON the skill wrote (its
# section "Machine-Readable Result"). The Studio reads the block between the markers
# from the log of the step - the one channel GitHub and Bitbucket both offer without a
# token of the run's own - and takes the last block that carries its correlation id.
# Base64 keeps the payload on lines that nothing the session printed can be mistaken
# for. Nothing is pushed: the review proposes no change.
if [ "$review" = true ]; then
# >>> review report - identical in pipelines/aiup-generate.sh and .github/workflows/aiup-generate.yml
# The lint comes from the published aiup-core, the version the session installs too.
marketplace=$(mktemp -d)
git clone --quiet --depth 1 --filter=blob:none --sparse https://github.com/AI-Unified-Process/marketplace.git "$marketplace"
git -C "$marketplace" sparse-checkout set aiup-core/skills
lint="$marketplace/aiup-core/skills/spec-review/scripts/spec_lint.py"
mkdir -p .aiup-report
set +e
if [ -n "$SCOPE" ]; then
  python3 "$lint" --docs docs --format json --only "$SCOPE" > .aiup-report/lint.json
else
  python3 "$lint" --docs docs --format json > .aiup-report/lint.json
fi
lint_status=$?
set -e
# 1 only says that the lint found errors - a result of the review, not a failure of the run
if [ "$lint_status" -gt 1 ]; then
  echo "spec_lint.py failed with exit code $lint_status" >&2
  exit 1
fi
mode=full
if [ "$LINT_ONLY" = true ]; then
  mode=lint
fi
python3 - "$mode" "$SCOPE" > .aiup-report/report.json <<'PY'
import json, os, sys
mode, scope = sys.argv[1], sys.argv[2]
with open(".aiup-report/lint.json", encoding="utf-8") as f:
    lint = json.load(f)
semantic = None
# a semantic part the session did not write, or wrote broken, is reported as missing
if mode == "full" and os.path.isfile(".aiup-report/review.json"):
    try:
        with open(".aiup-report/review.json", encoding="utf-8") as f:
            semantic = json.load(f)
    except ValueError:
        semantic = None
json.dump({"format": 1, "mode": mode, "scope": scope, "lint": lint, "semantic": semantic}, sys.stdout,
          ensure_ascii=False)
PY
echo "AIUP-REPORT-BEGIN $CORRELATION_ID"
base64 < .aiup-report/report.json | fold -w 76
echo "AIUP-REPORT-END $CORRELATION_ID"
# <<< review report
  exit 0
fi

# --- Advance the status of the specification --------------------------------------
# The status of the specification follows the merge: the new status travels on the
# same branch as the code it describes, so the artifact says Implemented or Tested at
# the very moment the proposal is taken over - and says nothing new while the pull
# request is only open or is rejected. Nobody has to watch the pull request afterwards
# and no second commit follows the merge.
advance_status() {
  # Only the steps that move the status of a use case. The end-to-end test follows
  # a test case, not a use case, and moves nothing; neither does a layer skill run on
  # its own, because one layer does not make a use case Implemented.
  local target english german
  case "$SKILL" in
    implement | implement-hilla | use-case-implement)
      target=3; english=Implemented; german=Implementiert ;;
    browserless-test | hilla-test | spring-boot-test | vitest-test | dotnet-test | bunit-test | nest-test | react-test | use-case-test)
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
  # The question log alone is no result.
  if [ -z "$(git status --porcelain -- . ':(exclude)docs/open_questions.md')" ]; then
    echo "The skill only recorded open questions; the status was left alone."
    return 0
  fi
  local uc blocking questions lint lint_status current rank value advance
  uc=$(sed -n -e 's/^\*\*Use[ -]Case[ -]ID:\*\*[[:space:]]*\([^[:space:]]*\).*/\1/p' "$SUBJECT" | head -n 1)
  # >>> blocking questions - identical in pipelines/aiup-generate.sh and .github/workflows/aiup-generate.yml
  # A skill that stopped on a gap of the specification recorded an open question and built nothing,
  # or not everything: a use case a blocking question holds is not Implemented or Tested. The
  # questions are read by spec_lint.py itself (OQ_BLOCKING), from the published aiup-core the
  # session installs too, so this step and the lint cannot disagree: a question on a requirement the
  # use case links counts, a section inside a fenced example does not. When the lint cannot be run,
  # the status stays as it is - a status set too early fails the lint of the pull request.
  blocking=""
  if [ -n "$uc" ] && [ -f docs/open_questions.md ]; then
    questions=$(mktemp -d)
    lint="$questions/marketplace/aiup-core/skills/spec-review/scripts/spec_lint.py"
    if git clone --quiet --depth 1 --filter=blob:none --sparse https://github.com/AI-Unified-Process/marketplace.git "$questions/marketplace" \
        && git -C "$questions/marketplace" sparse-checkout set aiup-core/skills; then
      lint_status=0
      python3 "$lint" --docs docs --no-baseline --format json --only "$uc" > "$questions/lint.json" || lint_status=$?
      # 1 only says that the lint found errors
      if [ "$lint_status" -gt 1 ]; then
        blocking="not known: spec_lint.py failed with exit code $lint_status"
      else
        # one line: the block is indented differently in the two files, and Python minds
        blocking=$(python3 -c 'import json, re, sys; print(" ".join(dict.fromkeys(q for f in json.load(open(sys.argv[1], encoding="utf-8"))["findings"] if f["code"] == "OQ_BLOCKING" for q in re.findall(r"blocking question (OQ-[A-Za-z0-9_-]+)", f["message"]))))' "$questions/lint.json") \
          || blocking="not known: the result of spec_lint.py could not be read"
      fi
    else
      blocking="not known: the marketplace with spec_lint.py could not be cloned"
    fi
  fi
  # <<< blocking questions
  if [ -n "$blocking" ]; then
    echo "Blocking open questions on $uc ($blocking); the status was left alone."
    return 0
  fi
  # >>> status rank - identical in pipelines/aiup-generate.sh and .github/workflows/aiup-generate.yml
  current=$(sed -n -e 's/^\*\*Status:\*\*[[:space:]]*\([^[:space:]]*\).*/\1/p' \
    -e '/^\*\*Status:\*\*/q' "$SUBJECT")
  # The AI Unified Process status values in their order, English and German.
  # LC_ALL=C keeps the lowercasing to ASCII, so the umlaut of "Geprüft" survives.
  case "$(printf '%s' "$current" | LC_ALL=C tr '[:upper:]' '[:lower:]')" in
    draft | entwurf) rank=0 ;;
    reviewed | geprüft) rank=1 ;;
    approved | genehmigt) rank=2 ;;
    implemented | implementiert) rank=3 ;;
    tested | getestet) rank=4 ;;
    done | abgeschlossen) rank=5 ;;
    # Obsolete, a value the format does not know, or no status line at all: none of them is a
    # state this run may advance out of.
    *) rank=-1 ;;
  esac
  # Forward only, and only out of a status the step is allowed at: below Approved neither the
  # implementation nor the tests are a step of the AI Unified Process, and a status already at or
  # beyond the one this run stands for never moves backwards.
  advance=true
  if [ "$rank" -lt 2 ] || [ "$rank" -ge "$target" ]; then
    advance=false
  fi
  # <<< status rank
  if [ "$advance" != true ]; then
    echo "Status '$current' of '$SUBJECT' was left alone."
    return 0
  fi
  # >>> status write - identical in pipelines/aiup-generate.sh and .github/workflows/aiup-generate.yml
  # A specification is written back in the language it is written in.
  if grep -qE '^\*\*Use-Case-ID:\*\*|^## Übersicht' "$SUBJECT"; then
    value=$german
  else
    value=$english
  fi
  # Only the first status line and only its value: what follows it - the trailing spaces
  # of a Markdown hard break, a comment, a note - stays as it is.
  sed -i "0,/^\*\*Status:\*\*/s/^\(\*\*Status:\*\*\)[[:space:]]*[^[:space:]]*/\1 $value/" "$SUBJECT"
  # <<< status write
  echo "Status of '$SUBJECT': $current -> $value"
}
advance_status

# --- Provide the result on its own branch -----------------------------------------
# The branch keeps its shape `aiup/<skill>-<correlation id>`: the Studio rebuilds
# that name to find the result of a run again and opens the pull request for it. The
# subject must not enter the name. The commit message names the artifact the run was
# set on - without it the commit reads as "AI Unified Process: implement" next to
# every other one.
if [ -z "$(git status --porcelain)" ]; then
  echo "The skill produced no changes; no branch was pushed."
  exit 0
fi
git config user.name "AI Unified Process Studio"
git config user.email "studio@unifiedprocess.ai"
branch="aiup/$SKILL-$CORRELATION_ID"
if [ -n "${SUBJECT:-}" ]; then
  message="AI Unified Process: $SKILL $SUBJECT"
else
  message="AI Unified Process: $SKILL"
fi
git checkout -b "$branch"
git add --all
git commit --message "$message"
# The clone of the pipeline authenticates the origin remote; pushing the new branch
# needs no credentials of its own.
git push origin "$branch"
echo "Result pushed to '$branch'; the Studio opens the pull request."
