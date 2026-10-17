#!/usr/bin/env bash
# Checks that each plugin's Agent Plugins manifests (plugin.json, mcp.json — agent-plugins.org)
# stay consistent with the Claude Code manifests (.claude-plugin/plugin.json, .mcp.json),
# the Tessl manifest (.tessl-plugin/plugin.json), and the Tessl project file (tessl.json).
set -euo pipefail

cd "$(dirname "$0")/.."

PLUGIN_SCHEMA="https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
MCP_SCHEMA="https://agent-plugins.org/schemas/1.0.0/mcp.schema.json"

fail=0
error() { echo "ERROR: $1" >&2; fail=$((fail + 1)); }

# A plugin missing from the publish workflow is never released, and one missing from the marketplace is never
# installable in Claude Code; neither fails anywhere else.
publish=".github/workflows/publish-tessl.yml"
publish_matrix=$(sed -n '/plugin: \[/,/\]/p' "$publish" | tr -d '[],' | tr -s ' \n' '\n\n')
# The entries of on.push.paths, uncommented list items only: a commented-out "# - 'aiup-x/**'" publishes nothing.
publish_paths=$(sed -n "/^ *paths:/,/^ *[a-z_-]*:[^']*\$/p" "$publish" | sed -n "s/^ *- *'\([^']*\)' *\(#.*\)\{0,1\}\$/\1/p")

for dir in aiup-*/; do
  plugin="${dir%/}"
  root="$plugin/plugin.json"
  claude="$plugin/.claude-plugin/plugin.json"
  tessl="$plugin/.tessl-plugin/plugin.json"
  tessl_project="$plugin/tessl.json"
  marketplace=".claude-plugin/marketplace.json"
  root_mcp="$plugin/mcp.json"
  claude_mcp="$plugin/.mcp.json"

  fail_before=$fail
  missing=0
  for f in "$root" "$claude" "$tessl" "$tessl_project" "$marketplace" "$root_mcp" "$claude_mcp"; do
    if [ ! -f "$f" ]; then
      error "$f is missing"
      missing=1
    fi
  done
  [ "$missing" -eq 0 ] || continue

  [ "$(jq -r '."$schema"' "$root")" = "$PLUGIN_SCHEMA" ] || error "$root: \$schema must be $PLUGIN_SCHEMA"
  [ "$(jq -r '."$schema"' "$root_mcp")" = "$MCP_SCHEMA" ] || error "$root_mcp: \$schema must be $MCP_SCHEMA"

  name=$(jq -r .name "$claude")
  [ "$name" = "$plugin" ] || error "$claude: name must be the plugin directory name $plugin, not $name"
  [ "$(jq -r .name "$root")" = "$name" ] || error "$root: name must be $name (from $claude)"
  [ "$(jq -r .name "$tessl")" = "ai-unified-process/$name" ] || error "$tessl: name must be ai-unified-process/$name"
  [ "$(jq -r .name "$tessl_project")" = "ai-unified-process/$plugin" ] ||
    error "$tessl_project: name must be ai-unified-process/$plugin, not $(jq -r .name "$tessl_project")"

  version=$(jq -r .version "$claude")
  # A version missing from all three files would compare equal ("null" = "null") and publish nothing.
  printf '%s\n' "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$' || error "$claude: version must be MAJOR.MINOR.PATCH, not $version"
  [ "$(jq -r .version "$root")" = "$version" ] || error "version mismatch: $root has $(jq -r .version "$root"), $claude has $version"
  [ "$(jq -r .version "$tessl")" = "$version" ] || error "version mismatch: $tessl has $(jq -r .version "$tessl"), $claude has $version"

  description=$(jq -r .description "$claude")
  [ "$(jq -r .description "$root")" = "$description" ] || error "$root: description must match $claude"
  [ "$(jq -r .description "$tessl")" = "$description" ] || error "$tessl: description must match $claude"

  marketplace_count=$(jq --arg name "$name" '[.plugins[] | select(.name == $name)] | length' "$marketplace")
  [ "$marketplace_count" -eq 1 ] || error "$marketplace: expected exactly one entry for $name"
  marketplace_description=$(jq -r --arg name "$name" '.plugins[] | select(.name == $name) | .description' "$marketplace")
  [ "$marketplace_description" = "$description" ] || error "$marketplace: description for $name must match $claude"

  jq -e --arg name "$name" --arg source "./$plugin" 'any(.plugins[]; .name == $name and .source == $source)' \
    "$marketplace" > /dev/null || error "$marketplace: no entry for $name with source ./$plugin"
  printf '%s\n' "$publish_matrix" | grep -qx "$plugin" || error "$publish: $plugin is missing from the job matrix"
  printf '%s\n' "$publish_paths" | grep -qxF -- "$plugin/**" || error "$publish: '$plugin/**' is missing from on.push.paths"

  # A "rules" directory declared in a manifest that does not exist ships no rules.
  for manifest in "$root" "$claude" "$tessl"; do
    rules=$(jq -r '.rules // empty | if type == "array" then .[] else . end' "$manifest")
    while IFS= read -r path; do
      [ -n "$path" ] || continue
      [ -e "$plugin/${path#./}" ] || error "$manifest: rules path $path does not exist in $plugin"
    done <<< "$rules"
  done

  # mcp.json must mirror .mcp.json, with Claude Code's "http" transport
  # expressed as the standard's "streamable-http".
  expected=$(jq -S '.mcpServers | map_values(if .type == "http" then .type = "streamable-http" else . end)' "$claude_mcp")
  actual=$(jq -S '.mcpServers' "$root_mcp")
  [ "$expected" = "$actual" ] || error "$root_mcp: mcpServers differ from $claude_mcp (after http -> streamable-http mapping)"

  [ "$fail" -ne "$fail_before" ] || echo "OK: $plugin ($version)"
done

[ "$fail" -eq 0 ]
