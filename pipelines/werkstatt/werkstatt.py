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
      The build and test commands of the stack file's Commands table, one per line (no end-to-end tests: a Purpose
      with E2E, end-to-end, or Ende-zu-Ende in it).
  werkstatt.py spec <UC-XXX> [--docs docs]
      The path of the use case specification (docs/use_cases/**/UC-XXX-*.md).
  werkstatt.py status <file>
      The status of a specification as its rank: 0 Draft .. 5 Done, -1 for Obsolete or unknown.
  werkstatt.py advance <file> <Implemented|Tested>
      Moves the status forward to the target, only out of Approved or a status before the target, never backwards,
      in the language of the specification. Prints the old and the new value.
  werkstatt.py blocking <UC-XXX> [--docs docs]
      The ids of the blocking open questions (Open or Answered) whose element names the use case, or a requirement
      its **Requirements:** line links, one per line; read as spec_lint.py reads the file.
  werkstatt.py requirements <UC-XXX> [--docs docs] [--spec-lint spec_lint.py]
      After a status advance: moves the progress status (Open .. Verified) of the requirements the use case links to
      what their use cases make it, with derived_status() of spec_lint.py (default: $SPEC_LINT_MODULE or
      $SPEC_LINT). Deferred and Rejected stay. Prints one line per change; without spec_lint.py it changes nothing.
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
    """The file as it is, line ends included: a CRLF file is written back with CRLF."""
    with open(path, encoding="utf-8", newline="") as handle:
        return handle.read()


def write_back(path, text):
    with open(path, "w", encoding="utf-8", newline="") as handle:
        handle.write(text)


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


# The end-to-end rows of the Commands table stay out of the build gate, in English and German.
END_TO_END = re.compile(r"\bE2E\b|\bend[ -]to[ -]end\b|\bende[ -]zu[ -]ende\b", re.IGNORECASE)


def commands(args):
    if not os.path.isfile(args.stack):
        return
    seen = []
    for cells in table_rows(read(args.stack), "Commands"):
        purpose, cell = (cells + ["", ""])[:2]
        # A cell is the command in backticks, often followed by a note: `./mvnw test` (Browserless tests)
        code = re.search(r"`([^`]+)`", cell)
        command = (code.group(1) if code else cell).strip()
        if not command or command in ("–", "-") or END_TO_END.search(purpose) or command in seen:
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
            # Only the value changes; a decoration after it, the trailing spaces of a Markdown hard break, and the
            # carriage return of a CRLF file stay (the rest of the line is group 2).
            lines[i] = f"**Status:** {value}{match.group(2)}"
            done = True
    write_back(args.file, "\n".join(lines))
    print(f"{current} -> {value}")


def load_spec_lint(path):
    """spec_lint.py of /spec-review as a module: the requirement status is derived there, never a second time here."""
    import importlib.util
    spec = importlib.util.spec_from_file_location("spec_lint", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def requirements(args):
    """Moves the progress status of the requirements the use case links to what its use cases make it.

    Only Open, In Progress, Implemented, and Verified change (#32); Deferred and Rejected are scope decisions, set by
    hand, and a constraint without a Status column has nothing to change. Prints one line per change."""
    if not args.spec_lint or not os.path.isfile(args.spec_lint):
        print(f"spec_lint.py not found ({args.spec_lint or 'unset'}); requirement statuses unchanged", file=sys.stderr)
        return
    try:
        lint = load_spec_lint(args.spec_lint)
        project = lint.Project(args.docs)
        catalog = lint.check_requirements(project)
        specs = lint.load_specs(project)
        linked = lint.linking_use_cases(specs)
    except Exception as error:  # an older or broken spec_lint must not stop a green use case
        print(f"spec_lint.py could not be used ({error}); requirement statuses unchanged", file=sys.stderr)
        return
    if not project.requirements_path:
        return
    progress = {lint.normalize(value) for value in lint.REQUIREMENT_PROGRESS}
    lines = read(project.requirements_path).split("\n")
    changes = []
    for rid in sorted(linked):
        if args.uc not in linked[rid] or rid not in catalog:
            continue
        number, status, _ = catalog[rid]
        if lint.normalize(status) not in progress:
            continue
        derived = lint.derived_status([specs[uid] for uid in linked[rid]])
        if derived is None or lint.normalize(derived) == lint.normalize(status):
            continue
        lines[number - 1] = replace_last_cell(lines[number - 1], derived)
        changes.append(f"{rid}: {status} -> {derived}")
    if changes:
        write_back(project.requirements_path, "\n".join(lines))
        print("\n".join(changes))


def replace_last_cell(line, value):
    """The row with its last cell (the status, as spec_lint.py reads it) set to value.

    The row keeps its style: with or without a trailing pipe, the padding where the new value fits, and the carriage
    return of a CRLF file. Escaped pipes (\\|) inside a cell are no cell borders."""
    eol = "\r" if line.endswith("\r") else ""
    body = line[:-1] if eol else line
    pipes = [m.start() for m in re.finditer(r"(?<!\\)\|", body)]
    trailing = bool(pipes) and not body[pipes[-1] + 1:].strip()
    if trailing:
        if len(pipes) < 2:
            return line
        start, end = pipes[-2], pipes[-1]
        cell = body[start + 1:end]
        return body[:start + 1] + f" {value} ".ljust(len(cell)) + body[end:] + eol
    if not pipes:
        return line
    start = pipes[-1]
    return body[:start + 1] + f" {value}" + eol


# The open questions as spec_lint.py reads them (read_open_questions): a '## OQ-XXX' heading with or without a colon,
# field lines '**Label:** value' with the first one of a label winning, fenced code skipped, any other heading ends
# the section. Kept here on its own, so a change of spec_lint.py's internals cannot cut the andon cord.
OQ_HEADING = re.compile(r"^##\s+(OQ-[A-Za-z0-9-]+)\s*:?\s*(.*)$")
OQ_FIELD = re.compile(r"^\*\*([A-Za-z ]+):\*\*\s*(.*)$")
REQ_ID = re.compile(r"(?<![A-Za-z0-9])((?:FR|NFR|C)-\d+[A-Za-z0-9_-]*)")
REQUIREMENTS_FIELDS = ("**Requirements:**", "**Anforderungen:**")


def read_questions(path):
    """[(id, {label: value})] of open_questions.md, in file order."""
    questions, current, fenced = [], None, False
    for line in read(path).splitlines():
        if line.lstrip().startswith("```"):
            fenced = not fenced
            continue
        if fenced:
            continue
        match = OQ_HEADING.match(line)
        if match:
            current = (match.group(1), {})
            questions.append(current)
            continue
        if line.startswith("#"):
            current = None
            continue
        match = OQ_FIELD.match(line.strip()) if current else None
        if match:
            current[1].setdefault(match.group(1).strip().capitalize(), match.group(2).replace("`", "").strip())
    return questions


def linked_requirements(uc, docs):
    """The requirement ids the use case's **Requirements:** line links."""
    found = sorted(glob.glob(os.path.join(docs, "use_cases", "**", f"{uc}-*.md"), recursive=True))
    if not found:
        return set()
    linked = set()
    for line in read(found[0]).splitlines():
        line = line.strip()
        for label in REQUIREMENTS_FIELDS:
            if line.startswith(label):
                linked.update(REQ_ID.findall(line[len(label):]))
    return linked


def blocking(args):
    """The andon cord: a blocking question (Yes/Ja) that is Open or Answered (Offen/Beantwortet) and whose element is
    the use case (UC-XXX, UC-XXX step N, UC-XXX A1, UC-XXX BR-XXX) or a requirement its Requirements line links;
    spec_lint.py gives such a question to every use case that links the requirement."""
    path = os.path.join(args.docs, "open_questions.md")
    if not os.path.isfile(path):
        return
    requirements = None
    for qid, fields in read_questions(path):
        words = fields.get("Element", "").split()
        if not words:
            continue
        if fields.get("Blocking", "").strip(" .*_").lower() not in ("yes", "ja"):
            continue
        if fields.get("Status", "").strip(" .*_").lower() not in ("open", "answered", "offen", "beantwortet"):
            continue
        element = words[0].rstrip(",;:")
        if element == args.uc:
            print(qid)
        elif REQ_ID.fullmatch(element):
            if requirements is None:
                requirements = linked_requirements(args.uc, args.docs)
            if element in requirements:
                print(qid)


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
| E2E (Playwright)   | `npx playwright test` |
| Browser tests, end to end | `npm run e2e` |
| Ende-zu-Ende-Tests | `./mvnw -Pe2e verify` |
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

## OQ-006 Heading without a colon, element in backticks

**Element:** `UC-001` BR-003
**Blocking:** Yes
**Status:** Open

## OQ-007: On a requirement UC-001 links

**Element:** FR-001
**Blocking:** Yes
**Status:** Answered
**Answer:** Monthly.

## OQ-008: On a requirement UC-001 does not link

**Element:** FR-009
**Blocking:** Yes
**Status:** Open

## OQ-009: A use case id with a hyphen

**Element:** UC-2-1 step 2
**Blocking:** Yes
**Status:** Open

```markdown
## OQ-010: An example in a fenced block

**Element:** UC-001
**Blocking:** Yes
**Status:** Open
```
"""


SELF_TEST_REQUIREMENTS = """# Requirements

## Functional Requirements

| ID     | Title    | User Story                    | Use Cases      | Priority | Status      |
|--------|----------|-------------------------------|----------------|----------|-------------|
| FR-001 | Register | As a manager, I want a room.  | UC-001         | High     | Open        |
| FR-002 | Shared   | As anyone, I want this.       | UC-001, UC-002 | High     | Open        |
| FR-003 | Later    | As a manager, I want that.    | UC-001         | Low      | Deferred    |
| FR-004 | Book     | As an employee, I want a slot.| UC-002         | High     | Open        |

## Non-Functional Requirements

| ID      | Title  | Requirement            | Category  | Use Cases      | Priority | Status |
|---------|--------|------------------------|-----------|----------------|----------|--------|
| NFR-001 | Fields | Errors at the field.   | Usability | UC-001, UC-002 | High     | Open   |

## Constraints

| ID    | Title | Constraint       | Category  | Use Cases | Priority |
|-------|-------|------------------|-----------|-----------|----------|
| C-001 | Stack | Java and Vaadin. | Technical | —         | High     |
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
            with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
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
        write(en, "# UC-001: Book a Room\n\n**Status:** Approved  \n**Primary Actor:** Guest\n"
                  "**Requirements:** [FR-001, NFR-002](../../requirements.md)\n")
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
        crlf = os.path.join(root, "crlf.md")
        with open(crlf, "w", encoding="utf-8", newline="") as handle:
            handle.write("# UC-004: Windows\r\n\r\n**Status:** Approved\r\n**Primary Actor:** Guest\r\n")
        expect("advance crlf", run(advance, file=crlf, target="Tested"), "Approved -> Tested\n")
        with open(crlf, "rb") as handle:
            expect("advance crlf kept", handle.read(),
                   b"# UC-004: Windows\r\n\r\n**Status:** Tested\r\n**Primary Actor:** Guest\r\n")

        # blocking: Open or Answered, Yes or Ja, element names exactly this use case
        expect("blocking without file", run(blocking, uc="UC-001", docs=docs), "")
        write(os.path.join(docs, "open_questions.md"), SELF_TEST_QUESTIONS)
        expect("blocking", run(blocking, uc="UC-001", docs=docs), "OQ-001\nOQ-004\nOQ-006\nOQ-007\n")
        expect("blocking other id", run(blocking, uc="UC-0010", docs=docs), "OQ-005\n")
        expect("blocking hyphen id", run(blocking, uc="UC-2-1", docs=docs), "OQ-009\n")
        expect("blocking hyphen prefix", run(blocking, uc="UC-2", docs=docs), "")

        # replace_last_cell: with and without the trailing pipe, CRLF, escaped pipes
        expect("cell trailing pipe", replace_last_cell("| FR-1 | a | Open        |", "Verified"),
               "| FR-1 | a | Verified    |")
        expect("cell no trailing pipe", replace_last_cell("| FR-1 | a \\| b | Open", "In Progress"),
               "| FR-1 | a \\| b | In Progress")
        expect("cell no pipes at the ends", replace_last_cell("FR-1 | a | Open\r", "Verified"),
               "FR-1 | a | Verified\r")

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

    # requirements: the real spec_lint.py derives the status; only the progress values of linked requirements move
    lint_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..",
                             "aiup-core", "skills", "spec-review", "scripts", "spec_lint.py")
    if os.path.isfile(lint_path):
        with tempfile.TemporaryDirectory() as root:
            docs = os.path.join(root, "docs")
            write(os.path.join(docs, "requirements.md"), SELF_TEST_REQUIREMENTS)
            for uid, name, state, linked in (("UC-001", "register-room", "Tested", "FR-001, FR-002, FR-003, NFR-001"),
                                              ("UC-002", "book-room", "Draft", "FR-002, FR-004, NFR-001")):
                write(os.path.join(docs, "use_cases", f"{uid}-{name}.md"),
                      f"# Use Case: {name}\n\n## Overview\n\n**Use Case ID:** {uid}  \n**Status:** {state}  \n"
                      f"**Requirements:** [{linked}](../requirements.md)\n")
            expect("requirements", run(requirements, uc="UC-001", docs=docs, spec_lint=lint_path),
                   "FR-001: Open -> Verified\nFR-002: Open -> In Progress\nNFR-001: Open -> In Progress\n")
            rows = {line.split("|")[1].strip(): line for line in read(os.path.join(docs, "requirements.md")).split("\n")
                    if line.startswith("| ") and "-0" in line}
            expect("requirements: padding kept", rows["FR-001"].endswith("| Verified    |"), True)
            expect("requirements: Deferred stays", rows["FR-003"].endswith("| Deferred    |"), True)
            expect("requirements: not linked by the use case", rows["FR-004"].endswith("| Open        |"), True)
            expect("requirements: constraint untouched", rows["C-001"].endswith("| High     |"), True)
            expect("requirements again: nothing to change",
                   run(requirements, uc="UC-001", docs=docs, spec_lint=lint_path), "")
            expect("requirements without spec_lint",
                   run(requirements, uc="UC-001", docs=docs, spec_lint=os.path.join(root, "none.py")), "")

        # requirements: a GFM row without a trailing pipe, in a CRLF file; the line ends stay CRLF
        with tempfile.TemporaryDirectory() as root:
            docs = os.path.join(root, "docs")
            catalog = ("# Requirements\n\n## Functional Requirements\n\n"
                       "| ID | Title | User Story | Use Cases | Priority | Status\n"
                       "|---|---|---|---|---|---\n"
                       "| FR-001 | Register | As a manager, I want a room. | UC-001 | High | Open\n")
            os.makedirs(docs)
            with open(os.path.join(docs, "requirements.md"), "w", encoding="utf-8", newline="") as handle:
                handle.write(catalog.replace("\n", "\r\n"))
            write(os.path.join(docs, "use_cases", "UC-001-register-room.md"),
                  "# Use Case: register-room\n\n## Overview\n\n**Use Case ID:** UC-001  \n**Status:** Tested  \n"
                  "**Requirements:** [FR-001](../requirements.md)\n")
            expect("requirements no trailing pipe", run(requirements, uc="UC-001", docs=docs, spec_lint=lint_path),
                   "FR-001: Open -> Verified\n")
            with open(os.path.join(docs, "requirements.md"), "rb") as handle:
                expect("requirements no trailing pipe, CRLF kept", handle.read().decode("utf-8"),
                       catalog.replace("| High | Open", "| High | Verified").replace("\n", "\r\n"))

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
    p = sub.add_parser("requirements")
    p.add_argument("uc")
    p.add_argument("--docs", default="docs")
    p.add_argument("--spec-lint", default=os.environ.get("SPEC_LINT_MODULE") or os.environ.get("SPEC_LINT", ""))
    p.set_defaults(func=requirements)
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
