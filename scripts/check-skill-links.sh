#!/usr/bin/env bash
# Verify that every file reference in a SKILL.md or a skill reference document stays inside its own skill folder.
#
# Hosts other than the Claude Code marketplace install skills one folder at a time: Tessl symlinks
# each skill to `.github/skills/tessl__<skill>` (or `.claude/skills/`, `.codex/skills/`, ...), and
# manual installs copy single skill folders. The agent then sees only that folder, so a link such
# as `../implement/references/project-layout.md` or `../../rules/mcp-servers.md` resolves to a path
# that does not exist. Files in other skills or at plugin level (`rules/`, `agents/`) must be named
# by a glob in prose (see CLAUDE.md, "Skill file references"), never linked with `../`.
#
# Inline links (with or without a title), images, and reference-style definitions (`[x]: ../y.md`) are
# checked. Fenced code blocks and inline code spans are ignored: they may hold example links whose base is
# the generated project document rather than the SKILL.md source file. The project templates below
# are skipped as a whole for the same reason: a skill copies them into the user's docs/, where their
# links resolve (the same list as the copyright exclusions in check-copyright-headers.sh).
#
# Tessl publishes only Markdown and Python files from a skill folder and silently drops the rest, so
# a `references/Example.java` or `references/process.bpmn` exists in the repository but not in the
# installed skill. Every file in a skill folder must therefore be `.md` or `.py`; wrap other files in
# Markdown as one fenced code block (`references/Example.java.md`).
set -euo pipefail

cd "$(dirname "$0")/.."

fail=0
error() {
  echo "ERROR: $1" >&2
  fail=$((fail + 1))
}

PROJECT_TEMPLATES='
aiup-core/skills/stack/references/stack.md
aiup-core/skills/requirements/references/glossary.md
aiup-core/skills/use-case-spec/references/example.md
aiup-core/skills/use-case-spec/references/use-case.md
aiup-core/skills/test-case/references/example.md
aiup-core/skills/test-case/references/test-case.md
'

files=()
while IFS= read -r f; do files+=("$f"); done < <(
  {
    find aiup-*/skills -mindepth 2 -maxdepth 2 -name SKILL.md -print
    find aiup-*/skills -path '*/references/*' -name '*.md' -print
  } | sort | grep -vxF "$(echo "$PROJECT_TEMPLATES" | sed '/^$/d')"
)
skills=0

for file in "${files[@]}"; do
  case "$file" in */SKILL.md) skills=$((skills + 1)) ;; esac
  # aiup-x/skills/<skill>/... -> the skill folder, and the file's folder relative to it
  skill_dir=$(echo "$file" | cut -d/ -f1-3)
  rel_dir=$(dirname "${file#"$skill_dir"/}")
  while IFS= read -r -d '' line_number && IFS= read -r -d '' target && IFS= read -r -d '' resolved; do
    case "$target" in
      http://*|https://*|mailto:*|\#*) continue ;;
    esac

    path=${target%%#*}
    [ -n "$path" ] || continue

    case "$path" in
      /*)
        error "$file:$line_number: link leaves the skill folder: $target (name the file and a glob instead)"
        continue
        ;;
    esac
    case "$resolved" in
      ..|../*)
        error "$file:$line_number: link leaves the skill folder: $target (name the file and a glob instead)"
        continue
        ;;
    esac

    if [ ! -e "$skill_dir/$resolved" ]; then
      error "$file:$line_number: broken link inside the skill folder: $target"
    fi
  done < <(REL_DIR="$rel_dir" perl -ne '
    sub resolve {
      my @out;
      for my $part (split m{/}, "$ENV{REL_DIR}/$_[0]") {
        next if $part eq "" || $part eq ".";
        if ($part eq ".." && @out && $out[-1] ne "..") { pop @out } else { push @out, $part }
      }
      return join("/", @out) || ".";
    }
    sub emit {
      my $t = shift; (my $p = $t) =~ s/#.*//;
      print "$.", "\0", $t, "\0", resolve($p), "\0";
    }
    # A fence closes only with the character that opened it, at least as many times, and nothing else on the
    # line, so a ```` fence that shows a ``` line stays open.
    if (defined $fence) {
      $fence = undef if /^\s*(\Q$fence_char\E{$fence_len,})\s*$/;
      next;
    }
    if (/^\s*(`{3,}|~{3,})/) { $fence_char = substr($1, 0, 1); $fence_len = length $1; $fence = $1; next }
    s/(`+).*?\1//g;
    # Inline links and images, with an optional <...> destination and an optional "title".
    while (/\]\(\s*<?([^\s)>]+)>?(?:\s+(?:"[^"]*"|\x27[^\x27]*\x27|\([^)]*\)))?\s*\)/g) { emit($1) }
    # Reference-style link definitions: [label]: target "title"
    emit($1) if /^\s{0,3}\[[^\]]+\]:\s*<?([^\s>]+)>?/;
  ' "$file")
done

while IFS= read -r f; do
  error "$f: Tessl does not publish this file type; wrap it in Markdown as $f.md with one fenced code block"
done < <(find aiup-*/skills -type f ! -name '*.md' ! -name '*.py' ! -path '*/__pycache__/*' ! -name .DS_Store | sort)

if [ "$fail" -ne 0 ]; then
  echo "$fail skill link problem(s) found." >&2
  exit 1
fi

echo "OK: every SKILL.md and reference link stays inside its skill folder and resolves, every skill file is .md or .py ($skills skills, ${#files[@]} files checked)"
