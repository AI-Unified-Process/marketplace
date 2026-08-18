#!/usr/bin/env bash
# Checks that each plugin's Agent Plugins manifests (plugin.json, mcp.json — agent-plugins.org)
# stay consistent with the Claude Code manifests (.claude-plugin/plugin.json, .mcp.json)
# and the Tessl manifest (.tessl-plugin/plugin.json).
set -euo pipefail

cd "$(dirname "$0")/.."

PLUGIN_SCHEMA="https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
MCP_SCHEMA="https://agent-plugins.org/schemas/1.0.0/mcp.schema.json"

fail=0
error() { echo "ERROR: $1" >&2; fail=$((fail + 1)); }

for dir in aiup-*/; do
  plugin="${dir%/}"
  root="$plugin/plugin.json"
  claude="$plugin/.claude-plugin/plugin.json"
  tessl="$plugin/.tessl-plugin/plugin.json"
  marketplace=".claude-plugin/marketplace.json"
  root_mcp="$plugin/mcp.json"
  claude_mcp="$plugin/.mcp.json"

  fail_before=$fail
  missing=0
  for f in "$root" "$claude" "$tessl" "$marketplace" "$root_mcp" "$claude_mcp"; do
    if [ ! -f "$f" ]; then
      error "$f is missing"
      missing=1
    fi
  done
  [ "$missing" -eq 0 ] || continue

  [ "$(jq -r '."$schema"' "$root")" = "$PLUGIN_SCHEMA" ] || error "$root: \$schema must be $PLUGIN_SCHEMA"
  [ "$(jq -r '."$schema"' "$root_mcp")" = "$MCP_SCHEMA" ] || error "$root_mcp: \$schema must be $MCP_SCHEMA"

  name=$(jq -r .name "$claude")
  [ "$(jq -r .name "$root")" = "$name" ] || error "$root: name must be $name (from $claude)"
  [ "$(jq -r .name "$tessl")" = "ai-unified-process/$name" ] || error "$tessl: name must be ai-unified-process/$name"

  version=$(jq -r .version "$claude")
  [ "$(jq -r .version "$root")" = "$version" ] || error "version mismatch: $root has $(jq -r .version "$root"), $claude has $version"
  [ "$(jq -r .version "$tessl")" = "$version" ] || error "version mismatch: $tessl has $(jq -r .version "$tessl"), $claude has $version"

  description=$(jq -r .description "$claude")
  [ "$(jq -r .description "$root")" = "$description" ] || error "$root: description must match $claude"
  [ "$(jq -r .description "$tessl")" = "$description" ] || error "$tessl: description must match $claude"

  marketplace_count=$(jq --arg name "$name" '[.plugins[] | select(.name == $name)] | length' "$marketplace")
  [ "$marketplace_count" -eq 1 ] || error "$marketplace: expected exactly one entry for $name"
  marketplace_description=$(jq -r --arg name "$name" '.plugins[] | select(.name == $name) | .description' "$marketplace")
  [ "$marketplace_description" = "$description" ] || error "$marketplace: description for $name must match $claude"

  # mcp.json must mirror .mcp.json, with Claude Code's "http" transport
  # expressed as the standard's "streamable-http".
  expected=$(jq -S '.mcpServers | map_values(if .type == "http" then .type = "streamable-http" else . end)' "$claude_mcp")
  actual=$(jq -S '.mcpServers' "$root_mcp")
  [ "$expected" = "$actual" ] || error "$root_mcp: mcpServers differ from $claude_mcp (after http -> streamable-http mapping)"

  [ "$fail" -ne "$fail_before" ] || echo "OK: $plugin ($version)"
done

[ "$fail" -eq 0 ]
