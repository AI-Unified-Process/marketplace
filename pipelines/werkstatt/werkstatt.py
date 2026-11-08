#!/usr/bin/env python3
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
"""Helpers of the AI Unified Process Werkstatt that read the project's specification files.

Standard library only. The shell scripts call one subcommand at a time:

  werkstatt.py plugins --catalog <layer-catalog.md> [--stack docs/architecture/stack.md] [--stack-plugin P]
      The plugins a run installs, one per line: aiup-core and the layer plugins whose skills the stack file names.
      The skill -> plugin mapping is the Plugins table of aiup-core's layer catalog, which
      scripts/check-layer-catalog.sh keeps in step with the plugins, so no third copy of the list exists.
  werkstatt.py commands [--stack docs/architecture/stack.md]
      The build and test commands of the stack file's Commands table, one per line (no end-to-end tests).
  werkstatt.py spec <UC-XXX> [--docs docs]
      The path of the use case specification (docs/use_cases/**/UC-XXX-*.md).
  werkstatt.py status <file>
      The status of a specification as its rank: 0 Draft .. 5 Done, -1 for Obsolete or unknown.
  werkstatt.py advance <file> <Implemented|Tested>
      Moves the status forward to the target, only out of Approved or a status before the target, never backwards,
      in the language of the specification. Prints the old and the new value.
  werkstatt.py blocking <UC-XXX> [--docs docs]
      The ids of the blocking open questions (Open or Answered) whose element names the use case, one per line.
  werkstatt.py self-test
      Runs every subcommand against fixtures; CI runs it, together with self-test.sh for the stations.
"""
import argparse
import glob
import os
import re
import sys

STATUS_RANK = {
    "draft": 0, "entwurf": 0,
    "reviewed": 1, "geprüft": 1,
    "approved": 2, "genehmigt": 2,
    "implemented": 3, "implementiert": 3,
    "tested": 4, "getestet": 4,
    "done": 5, "abgeschlossen": 5,
}
TARGETS = {"Implemented": (3, "Implementiert"), "Tested": (4, "Getestet")}
STATUS_LINE = re.compile(r"^\*\*Status:\*\*[ \t]*(\S*)(.*)$")


def read(path):
    with open(path, encoding="utf-8") as handle:
        return handle.read()


def table_rows(text, heading):
    """Rows of the first pipe table under a '## heading', as lists of stripped cells."""
    rows, inside, seen_table = [], False, False
    for line in text.splitlines():
        if line.startswith("## "):
            if inside:
                break
            inside = line[3:].strip().lower() == heading.lower()
            continue
        if not inside:
            continue
        if line.startswith("|"):
            seen_table = True
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if all(re.fullmatch(r":?-+:?", c) for c in cells if c):
                continue
            rows.append(cells)
        elif seen_table and line.strip():
            break
    return rows[1:] if rows else []


def plugins(args):
    selected = ["aiup-core"]
    if args.stack_plugin:
        selected.append(args.stack_plugin)
    else:
        stack = read(args.stack) if os.path.isfile(args.stack) else ""
        if not stack:
            sys.exit(f"{args.stack} is missing: a layered project needs its stack file. Run /stack first.")
        # Every table cell of the stack file, with or without backticks: /stack writes the Skill and Test skill
        # columns of the Layers table bare and the Integration layer table in backticks.
        named = {cell.strip().strip("`").strip()
                 for line in stack.splitlines() if line.startswith("|")
                 for cell in line.strip().strip("|").split("|")} - {"", "–", "-"}
        for cells in table_rows(read(args.catalog), "Plugins"):
            plugin = cells[0].strip("`")
            skills = {c.strip("`") for c in cells[2:4]} - {"", "–", "-"}
            if named & skills and plugin not in selected:
                selected.append(plugin)
        if len(selected) == 1:
            sys.exit(f"{args.stack} names no layer skill of this marketplace. Run /stack first.")
    print("\n".join(selected))


def commands(args):
    if not os.path.isfile(args.stack):
        return
    seen = []
    for cells in table_rows(read(args.stack), "Commands"):
        purpose, cell = (cells + ["", ""])[:2]
        # A cell is the command in backticks, often followed by a note: `./mvnw test` (Browserless tests)
        code = re.search(r"`([^`]+)`", cell)
        command = (code.group(1) if code else cell).strip()
        if not command or command in ("–", "-") or "end-to-end" in purpose.lower() or command in seen:
            continue
        # Maven's verify and install phases already run the test phase.
        if re.fullmatch(r"(\./mvnw|mvn)( -\S+)* test", command) and any(
                re.search(r"(\./mvnw|mvn)\b.*\b(verify|install)\b", s) for s in seen):
            continue
        seen.append(command)
        print(command)


def spec(args):
    found = sorted(glob.glob(os.path.join(args.docs, "use_cases", "**", f"{args.uc}-*.md"), recursive=True))
    if not found:
        sys.exit(f"no specification for {args.uc} under {args.docs}/use_cases")
    print(found[0])


def current_status(text):
    for line in text.splitlines():
        match = STATUS_LINE.match(line)
        if match:
            return match.group(1)
    return ""


def status(args):
    print(STATUS_RANK.get(current_status(read(args.file)).lower(), -1))


def advance(args):
    text = read(args.file)
    current = current_status(text)
    rank = STATUS_RANK.get(current.lower(), -1)
    target, german = TARGETS[args.target]
    if rank < 2 or rank >= target:
        print(f"{current} (unchanged)")
        return
    value = german if re.search(r"^\*\*Use-Case-ID:\*\*|^## Übersicht", text, re.M) else args.target
    lines, done = text.split("\n"), False
    for i, line in enumerate(lines):
        match = STATUS_LINE.match(line)
        if match and not done:
            # Only the value changes; a decoration after it and the trailing spaces of a Markdown hard break stay.
            lines[i] = f"**Status:** {value}{match.group(2)}"
            done = True
    with open(args.file, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines))
    print(f"{current} -> {value}")


def blocking(args):
    path = os.path.join(args.docs, "open_questions.md")
    if not os.path.isfile(path):
        return
    for section in re.split(r"(?m)^(?=## OQ-)", read(path)):
        head = re.match(r"## (OQ-[A-Za-z0-9-]+):", section)
        if not head:
            continue
        field = lambda name: (re.search(rf"^\*\*{name}:\*\*\s*(.*)$", section, re.M) or [None, ""])[1].strip()
        element = field("Element")
        if (re.match(rf"{re.escape(args.uc)}\b", element)
                and field("Blocking").lower().startswith(("yes", "ja"))
                and field("Status").lower().startswith(("open", "answered", "offen", "beantwortet"))):
            print(head.group(1))


SELF_TEST_CATALOG = """# Layer catalog

## Plugins

| Plugin             | Layer       | Skill              | Test skill              | Tests run |
|--------------------|-------------|--------------------|-------------------------|-----------|
| `aiup-flyway`      | Migration   | `flyway-schema`    | –                       | –         |
| `aiup-jooq`        | Persistence | `jooq-persistence` | `jooq-persistence-test` | in process |
| `aiup-jpa`         | Persistence | `jpa-persistence`  | `jpa-persistence-test`  | in process |
| `aiup-spring-boot` | Service     | `spring-service`   | `spring-service-test`   | in process |
| `aiup-vaadin`      | UI          | `vaadin-flow-ui`   | `vaadin-flow-ui-test`   | in process |
| `aiup-vaadin`      | E2E         | –                  | `vaadin-e2e-test`       | browser   |
| `aiup-playwright`  | E2E         | –                  | `playwright-e2e-test`   | browser   |

## Next section

| Plugin | Skill |
|---|---|
| `aiup-jpa` | `jpa-persistence` |
"""

# /stack writes the Layers table bare and the Integration layer table in backticks.
SELF_TEST_STACK = """# Stack

## Layers

| Layer       | Technology  | Skill            | Test skill          |
|-------------|-------------|------------------|---------------------|
| Migration   | Flyway      | flyway-schema    | –                   |
| Persistence | jOOQ        | jooq-persistence | –                   |
| Service     | Spring Boot | –                | –                   |
| UI          | Vaadin Flow | vaadin-flow-ui   | vaadin-flow-ui-test |

## Integration layer

| Entry layer | Integration layer |
|-------------|-------------------|
| UI          | `spring-service-test` |

## Commands

| Purpose            | Command |
|--------------------|---------|
| Build              | `./mvnw -B verify` |
| Unit tests         | `./mvnw test` (Browserless tests) |
| Integration tests  | – |
| Lint               | `npm run lint` |
| End-to-end tests   | `./mvnw -Pit verify` |
"""

SELF_TEST_QUESTIONS = """# Open Questions

## OQ-001: Which discount applies?

**Element:** UC-001 BR-002
**Blocking:** Yes
**Status:** Open

## OQ-002: Rounding

**Element:** UC-001 step 3
**Blocking:** No
**Status:** Open

## OQ-003: Already resolved

**Element:** UC-001
**Blocking:** Yes
**Status:** Resolved

## OQ-004: Beantwortet, aber nicht übernommen

**Element:** UC-001 A1
**Blocking:** Ja
**Status:** Beantwortet

## OQ-005: Another use case

**Element:** UC-0010
**Blocking:** Yes
**Status:** Open
"""


def self_test():
    """Runs every subcommand against fixtures in a temporary folder; exits non-zero on a failure."""
    import contextlib
    import io
    import tempfile

    failures = []

    def run(func, **kwargs):
        out = io.StringIO()
        try:
            with contextlib.redirect_stdout(out):
                func(argparse.Namespace(**kwargs))
        except SystemExit as stop:
            return "EXIT: " + str(stop.code)
        return out.getvalue()

    def expect(name, got, want):
        if got != want:
            failures.append(f"{name}: expected {want!r}, got {got!r}")

    def write(path, text):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(text)

    with tempfile.TemporaryDirectory() as root:
        catalog = os.path.join(root, "layer-catalog.md")
        stack = os.path.join(root, "docs", "architecture", "stack.md")
        docs = os.path.join(root, "docs")
        write(catalog, SELF_TEST_CATALOG)
        write(stack, SELF_TEST_STACK)

        # plugins: bare and backticked cells count, – and other sections do not, no plugin twice
        expect("plugins layered", run(plugins, catalog=catalog, stack=stack, stack_plugin=""),
               "aiup-core\naiup-flyway\naiup-jooq\naiup-spring-boot\naiup-vaadin\n")
        expect("plugins combined", run(plugins, catalog=catalog, stack=stack, stack_plugin="aiup-blazor-dotnet"),
               "aiup-core\naiup-blazor-dotnet\n")
        missing = run(plugins, catalog=catalog, stack=os.path.join(root, "none.md"), stack_plugin="")
        expect("plugins without stack file", missing.startswith("EXIT: ") and "Run /stack" in missing, True)
        empty = os.path.join(root, "empty-stack.md")
        write(empty, "# Stack\n\n## Layers\n\n| Layer | Skill |\n|---|---|\n| UI | my-own-ui |\n")
        expect("plugins without a known skill", "names no layer skill" in run(
            plugins, catalog=catalog, stack=empty, stack_plugin=""), True)

        # commands: the code span of a cell, no –, no end-to-end, test dropped next to verify
        expect("commands", run(commands, stack=stack), "./mvnw -B verify\nnpm run lint\n")
        expect("commands without stack file", run(commands, stack=os.path.join(root, "none.md")), "")
        gradle = os.path.join(root, "gradle-stack.md")
        write(gradle, "## Commands\n\n| Purpose | Command |\n|---|---|\n| Unit tests | `./mvnw test` |\n"
                      "| Build | ./gradlew build |\n")
        expect("commands: test before verify, bare cell", run(commands, stack=gradle),
               "./mvnw test\n./gradlew build\n")

        # spec: found in a module folder, missing one exits
        en = os.path.join(docs, "use_cases", "booking", "UC-001-book-a-room.md")
        write(en, "# UC-001: Book a Room\n\n**Status:** Approved  \n**Primary Actor:** Guest\n")
        de = os.path.join(docs, "use_cases", "UC-002-zimmer-stornieren.md")
        write(de, "# UC-002: Zimmer stornieren\n\n## Übersicht\n\n**Use-Case-ID:** UC-002\n"
                  "**Status:** Genehmigt <!-- by the PO -->\n")
        expect("spec in a module folder", run(spec, uc="UC-001", docs=docs), en + "\n")
        expect("spec missing", run(spec, uc="UC-009", docs=docs).startswith("EXIT: "), True)

        # status: rank in both languages, -1 for Obsolete
        expect("status approved", run(status, file=en), "2\n")
        expect("status genehmigt", run(status, file=de), "2\n")
        obsolete = os.path.join(root, "obsolete.md")
        write(obsolete, "# UC-003: Old\n\n**Status:** Obsolete\n")
        expect("status obsolete", run(status, file=obsolete), "-1\n")

        # advance: forward only, in the language of the specification, decorations and hard breaks kept
        expect("advance en", run(advance, file=en, target="Tested"), "Approved -> Tested\n")
        expect("advance en text", read(en).splitlines()[2], "**Status:** Tested  ")
        expect("advance never backwards", run(advance, file=en, target="Implemented"), "Tested (unchanged)\n")
        expect("advance de", run(advance, file=de, target="Implemented"), "Genehmigt -> Implementiert\n")
        expect("advance de text", read(de).splitlines()[5], "**Status:** Implementiert <!-- by the PO -->")
        expect("advance obsolete", run(advance, file=obsolete, target="Tested"), "Obsolete (unchanged)\n")

        # blocking: Open or Answered, Yes or Ja, element names exactly this use case
        expect("blocking without file", run(blocking, uc="UC-001", docs=docs), "")
        write(os.path.join(docs, "open_questions.md"), SELF_TEST_QUESTIONS)
        expect("blocking", run(blocking, uc="UC-001", docs=docs), "OQ-001\nOQ-004\n")
        expect("blocking other id", run(blocking, uc="UC-0010", docs=docs), "OQ-005\n")

    # The real layer catalog, when the script runs from a marketplace checkout: its format is the contract.
    real = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..",
                        "aiup-core", "skills", "stack", "references", "layer-catalog.md")
    if os.path.isfile(real):
        with tempfile.TemporaryDirectory() as root:
            stack = os.path.join(root, "stack.md")
            with open(stack, "w", encoding="utf-8") as handle:
                handle.write(SELF_TEST_STACK)
            expect("plugins from the real layer catalog", run(plugins, catalog=real, stack=stack, stack_plugin=""),
                   "aiup-core\naiup-flyway\naiup-jooq\naiup-spring-boot\naiup-vaadin\n")

    for failure in failures:
        print("FAIL " + failure)
    if failures:
        sys.exit(1)
    print("self-test passed")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("self-test")
    p.set_defaults(func=lambda _args: self_test())
    p = sub.add_parser("plugins")
    p.add_argument("--catalog", required=True)
    p.add_argument("--stack", default="docs/architecture/stack.md")
    p.add_argument("--stack-plugin", default="")
    p.set_defaults(func=plugins)
    p = sub.add_parser("commands")
    p.add_argument("--stack", default="docs/architecture/stack.md")
    p.set_defaults(func=commands)
    p = sub.add_parser("spec")
    p.add_argument("uc")
    p.add_argument("--docs", default="docs")
    p.set_defaults(func=spec)
    p = sub.add_parser("status")
    p.add_argument("file")
    p.set_defaults(func=status)
    p = sub.add_parser("advance")
    p.add_argument("file")
    p.add_argument("target", choices=sorted(TARGETS))
    p.set_defaults(func=advance)
    p = sub.add_parser("blocking")
    p.add_argument("uc")
    p.add_argument("--docs", default="docs")
    p.set_defaults(func=blocking)
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
