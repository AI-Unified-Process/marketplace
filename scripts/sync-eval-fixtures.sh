#!/usr/bin/env bash
# Keep the layer-skill and sub-agent fixtures of the eval scenarios identical to the real files.
#
# A scenario that runs an orchestrator (/use-case-implement, /use-case-test, /use-case-coverage, ...) ships the layer
# skills under evals/<plugin>/<scenario>/layer-skills/<skill>/ and the coverage agent under
# evals/<plugin>/<scenario>/agents/, because
# Tessl installs only the plugin under test. Those fixtures must be copies of what users install: a stale copy makes
# the scenario grade an old contract (markers, Handover, integration layer) and hides the regressions the evals are
# there to catch (#47). A layer-skill folder is replaced by aiup-*/skills/<skill>/ as a whole; an agent file by the
# file of the same name in the scenario's own plugin's agents/, else in aiup-core/agents/.
#
# The seeded docs/architecture/stack.md of a scenario is project content, but its header, explanations, E2E scope
# line, and marker rows follow the stack template and the layer skills; scripts/sync_eval_stack_files.py keeps those
# parts current (#58). Every rubric (criteria.json) must total 100 points; that is checked, not fixed.
#
# Usage: scripts/sync-eval-fixtures.sh [--check]
#   --check  report every fixture that differs and exit 1, change nothing (CI)
#   (none)   rewrite the fixtures from the real files
set -euo pipefail

cd "$(dirname "$0")/.."

mode=fix
case "${1:-}" in
  --check) mode=check ;;
  "") ;;
  *) echo "usage: $0 [--check]" >&2; exit 2 ;;
esac

drift=0
missing=0

sync_dir() { # fixture source
  if [[ $mode == check ]]; then
    if ! diff -rq "$2" "$1" > /dev/null; then
      echo "DRIFT: $1 differs from $2"
      drift=1
    fi
  elif ! diff -rq "$2" "$1" > /dev/null; then
    rm -rf "$1"
    cp -R "$2" "$1"
    echo "synced $1"
  fi
}

sync_file() { # fixture source
  if ! cmp -s "$2" "$1"; then
    if [[ $mode == check ]]; then
      echo "DRIFT: $1 differs from $2"
      drift=1
    else
      cp "$2" "$1"
      echo "synced $1"
    fi
  fi
}

shopt -s nullglob

for fixture in evals/aiup-*/*/layer-skills/*/; do
  fixture=${fixture%/}
  name=$(basename "$fixture")
  sources=(aiup-*/skills/"$name")
  if (( ${#sources[@]} != 1 )); then
    echo "ERROR: $fixture: expected exactly one aiup-*/skills/$name, found ${#sources[@]}" >&2
    missing=1
    continue
  fi
  sync_dir "$fixture" "${sources[0]}"
done

for fixture in evals/aiup-*/*/agents/*.md; do
  plugin=${fixture#evals/}
  plugin=${plugin%%/*}
  name=$(basename "$fixture")
  if [[ -f $plugin/agents/$name ]]; then
    source=$plugin/agents/$name
  elif [[ -f aiup-core/agents/$name ]]; then
    source=aiup-core/agents/$name
  else
    echo "ERROR: $fixture: no $plugin/agents/$name or aiup-core/agents/$name" >&2
    missing=1
    continue
  fi
  sync_file "$fixture" "$source"
done

if [[ $mode == check ]]; then
  python3 scripts/sync_eval_stack_files.py --check || drift=1
else
  python3 scripts/sync_eval_stack_files.py || drift=1
fi

python3 - <<'EOF' || missing=1
import glob, json, sys
totals = [(f, sum(c["max_score"] for c in json.load(open(f))["checklist"]))
          for f in sorted(glob.glob("evals/aiup-*/*/criteria.json"))]
bad = [(f, total) for f, total in totals if total != 100]
for f, total in bad:
    print(f"ERROR: {f}: the rubric totals {total} points, not 100", file=sys.stderr)
sys.exit(1 if bad else 0)
EOF

# Hand graders for `claude plugin eval` (evals/<plugin>/<scenario>/graders/) name a checklist item and weigh its points.
python3 scripts/tessl_to_plugin_evals.py --check || missing=1

# The plugin choice of .github/workflows/run-evals.yml lists exactly the folders under evals/.
listed=$(sed -n '/# >>> eval plugins/,/# <<< eval plugins/s/^ *- \(aiup-[a-z0-9-]*\)$/\1/p' .github/workflows/run-evals.yml)
on_disk=$(cd evals && ls -d aiup-*/ | tr -d / | sort)
if [[ $listed != "$on_disk" ]]; then
  echo "ERROR: the plugin choice of .github/workflows/run-evals.yml differs from the folders under evals/:" >&2
  diff <(echo "$listed") <(echo "$on_disk") >&2 || true
  missing=1
fi

if (( missing )); then
  exit 1
fi
if (( drift )); then
  echo "ERROR: eval fixtures drifted from the real skills or agents; run scripts/sync-eval-fixtures.sh" >&2
  exit 1
fi
if [[ $mode == check ]]; then
  echo "Eval fixtures match the real skills and agents."
fi
