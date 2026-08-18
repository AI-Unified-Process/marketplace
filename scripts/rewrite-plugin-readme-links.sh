#!/usr/bin/env bash
# Rewrite links that leave a plugin directory before publishing that directory as a standalone package.
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <plugin-dir> <repository-url> <git-ref>" >&2
  exit 2
fi

plugin_dir=$1
repository_url=${2%/}
git_ref=$3
readme="$plugin_dir/README.md"
registry_base="https://tessl.io/registry/ai-unified-process"

if [ ! -f "$readme" ]; then
  echo "ERROR: README not found: $readme" >&2
  exit 1
fi

# Keep sibling-package links inside the Tessl registry. This must run before the
# generic parent-relative rewrite below.
REGISTRY_BASE="$registry_base" perl -pi -e 's{\]\(\.\./(aiup-[a-z0-9-]+)/?\)}{"](" . $ENV{REGISTRY_BASE} . "/$1)"}ge' "$readme"

BASE="$repository_url" REF="$git_ref" perl -pi -e 's{\]\(\.\./([^)]+)\)}{
  my $path = $1;
  my $kind = ($path =~ m{\.md(?:#|$)}) ? "blob" : "tree";
  "]($ENV{BASE}/$kind/$ENV{REF}/$path)"
}ge' "$readme"

if grep -q '](\.\./' "$readme"; then
  echo "ERROR: unrewritten parent-relative link in $readme" >&2
  exit 1
fi
