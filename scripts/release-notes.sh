#!/usr/bin/env bash
# Prints the Markdown release notes of a plugin's current version: every commit that touched the
# plugin directory after the commit that set the previous version, up to and including the commit
# that set the current one (the version in .tessl-plugin/plugin.json). Commits are grouped by their
# Conventional Commits type; issues named on a Refs/Closes/Fixes line of the body are appended.
#
# A commit that changes several plugins can give each its own notes: every body line
# "<plugin-dir>: <text>" becomes one entry of that plugin instead of the subject, e.g.
# "aiup-flyway: feat: add /flyway-schema". A "feat:" or "fix:" prefix on the text picks its group;
# without one the entry joins the group of the commit's type.
#
# Usage: scripts/release-notes.sh <plugin-dir>
# Prints "<tag> <commit>" instead of the notes with --tag, e.g. "aiup-core-v2.16.0 b3d53ce…".
set -euo pipefail

cd "$(dirname "$0")/.."

plugin="${1:?usage: scripts/release-notes.sh <plugin-dir> [--tag]}"
plugin="${plugin%/}"
manifest="$plugin/.tessl-plugin/plugin.json"
[ -f "$manifest" ] || { echo "ERROR: $manifest is missing" >&2; exit 1; }

version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$manifest" | head -1)
tag="$plugin-v$version"

# The commits that changed the version line, newest first: the first set the current version,
# the second the previous one. A plugin with a single version starts at its first commit.
bumps=$(git log --format=%H -G'"version"' -- "$manifest")
current=$(echo "$bumps" | sed -n 1p)
previous=$(echo "$bumps" | sed -n 2p)

if [ "${2:-}" = "--tag" ]; then
  echo "$tag $current"
  exit 0
fi

range="$current"
[ -n "$previous" ] && range="$previous..$current"

features="" fixes="" other=""
while IFS= read -r sha; do
  [ -n "$sha" ] || continue
  subject=$(git log -1 --format=%s "$sha")
  refs=$(git log -1 --format=%b "$sha" | grep -iE '^(refs|closes|fixes)\b' | grep -oE '#[0-9]+' | sort -u | paste -sd ' ' - || true)
  entries=$(git log -1 --format=%b "$sha" | sed -n "s/^$plugin: //p")
  if [ -z "$entries" ]; then
    entries="$subject"
  fi
  while IFS= read -r entry; do
    type="$subject"
    case "$entry" in
      feat:*|feat\(*|feat!:*|fix:*|fix\(*)
        type="$entry"
        entry="${entry#*: }"
        ;;
    esac
    line="- $entry (${sha:0:7}${refs:+, $refs})"
    case "$type" in
      feat*) features+="$line"$'\n' ;;
      fix*) fixes+="$line"$'\n' ;;
      *) other+="$line"$'\n' ;;
    esac
  done <<< "$entries"
done < <(git log --no-merges --format=%H "$range" -- "$plugin")

sections=""
[ -n "$features" ] && sections+=$'### Features\n\n'"$features"$'\n'
[ -n "$fixes" ] && sections+=$'### Fixes\n\n'"$fixes"$'\n'
[ -n "$other" ] && sections+=$'### Other changes\n\n'"$other"$'\n'
[ -n "$sections" ] || sections=$'No changes recorded in this plugin since the previous version.\n'
printf '%s' "$sections"
exit 0
