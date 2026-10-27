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

# A link inside a code span or a fenced block is an example, not a link, and stays as written. Sibling-package
# links stay inside the Tessl registry; that rewrite must run before the generic parent-relative one.
REGISTRY_BASE="$registry_base" BASE="$repository_url" REF="$git_ref" perl -pi -e '
  if (/^\s*```/) { $fenced = !$fenced; next }
  next if $fenced;
  my @parts = split /(`[^`]*`)/;
  for (@parts) {
    next if /^`/;
    s{\]\(\.\./(aiup-[a-z0-9-]+)/?\)}{"](" . $ENV{REGISTRY_BASE} . "/$1)"}ge;
    s{\]\(\.\./([^)]+)\)}{
      my $path = $1;
      my $kind = ($path =~ m{\.md(?:#|$)}) ? "blob" : "tree";
      "]($ENV{BASE}/$kind/$ENV{REF}/$path)"
    }ge;
  }
  $_ = join "", @parts;
' "$readme"

if perl -ne '
  if (/^\s*```/) { $fenced = !$fenced; next }
  next if $fenced;
  s/`[^`]*`//g;
  $found = 1 if m{\]\(\.\./};
  END { exit($found ? 0 : 1) }
' "$readme"; then
  echo "ERROR: unrewritten parent-relative link in $readme" >&2
  exit 1
fi
