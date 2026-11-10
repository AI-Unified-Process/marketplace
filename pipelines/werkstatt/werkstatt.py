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
  werkstatt.py diagram <UC-XXX> [--docs docs]
      After a status advance: draws the use case in the use case diagram (docs/use_cases.puml, or the module diagrams
      docs/use_cases/*/use_cases.puml) in the colour of its new status, as /use-case-diagram and the Studio do: the
      colour the diagram's legend gives the status, otherwise the standard colour, and a legend row for a new colour.
      Every other line stays. Prints the diagram it changed.
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


# The status colours of /use-case-diagram ("Status colours") and of the Studio (UseCaseDiagramStatus, UC-010 BR-014).
STATUS_COLOURS = {0: None, 1: "LightBlue", 2: "PaleTurquoise", 3: "Thistle", 4: "Khaki", 5: "LightGreen"}
USECASE_ENTRY = re.compile(r'usecase\s+"([^"]+)"(?:\s+as\s+(\w+))?')
DIAGRAM_UC_ID = re.compile(r"([SB]?UC-[A-Za-z0-9_-]+)")
LEGEND_ROW = re.compile(r"^\s*\|\s*<#(\w+)>\s*\|\s*Status:\s*([^|]*?)\s*\|")
# The background of an entry's style (#Khaki, #back:Khaki, #Pink-White); line:red and the like are no background.
BACKGROUND = re.compile(r"(?i)(?:back:)?[a-z0-9]+(?:[|/\\-][a-z0-9]+)?")


def legend_bounds(lines):
    """(start, end) of the legend block, or None."""
    start = next((i for i, line in enumerate(lines)
                  if line.strip().lower() == "legend" or line.strip().lower().startswith("legend ")), None)
    if start is None:
        return None
    end = next((i for i in range(start + 1, len(lines)) if lines[i].strip().lower() == "endlegend"), None)
    return None if end is None else (start, end)


def legend_colour(lines, rank):
    """The colour the legend gives the status (either language), so a project's own palette wins."""
    bounds = legend_bounds(lines)
    if bounds:
        for line in lines[bounds[0]:bounds[1]]:
            match = LEGEND_ROW.match(line)
            if match and STATUS_RANK.get(match.group(2).strip().lower()) == rank:
                return match.group(1)
    return None


def recolour(line, tail_start, colour):
    """The entry with its background set to the colour (None removes it); the rest of its style stays."""
    tail = line[tail_start:]
    stereotype = re.match(r"\s*<<.*?>>", tail)
    stereotype = stereotype.group() if stereotype else ""
    style = re.match(r"\s*#(\S+)", tail[len(stereotype):])
    rest = tail[len(stereotype) + (style.end() if style else 0):]
    parts = style.group(1).split(";") if style else []
    background = parts.pop(0) if parts and BACKGROUND.fullmatch(parts[0]) else None
    if (background is None and colour is None) or (background and colour and background.lower() == colour.lower()):
        return line
    if colour:
        parts.insert(0, colour)
    return line[:tail_start] + stereotype + (" #" + ";".join(parts) if parts else "") + rest


def recolour_diagram(text, uc, rank, label):
    """The diagram with the use case in the colour of the status, or the text itself when nothing changes."""
    lines = text.split("\n")
    cr = "\r" if "\r\n" in text else ""
    colour = legend_colour([line.rstrip("\r") for line in lines], rank) or STATUS_COLOURS.get(rank)
    changed = False
    for i, line in enumerate(lines):
        body = line[:-1] if line.endswith("\r") else line
        if body.lstrip().startswith("'"):
            continue
        match = USECASE_ENTRY.search(body)
        if not match:
            continue
        found = DIAGRAM_UC_ID.search(match.group(1))
        if (found.group(1) if found else match.group(2) or match.group(1).strip()) != uc:
            continue
        new = recolour(body, match.end(), colour)
        if new != body:
            lines[i] = new + line[len(body):]
            changed = True
    if not changed:
        return text
    if colour:
        bounds = legend_bounds([line.rstrip("\r") for line in lines])
        row = f"  |<#{colour}>| Status: {label} |{cr}"
        if bounds:
            marker = f"<#{colour.lower()}>"
            if not any(marker in line.lower() for line in lines[bounds[0]:bounds[1]]):
                lines.insert(bounds[1], row)
        else:
            end = next((i for i in range(len(lines) - 1, -1, -1) if lines[i].strip().lower() == "@enduml"), None)
            if end is not None:
                lines[end:end] = [f"legend right{cr}", row, f"endlegend{cr}", cr]
    return "\n".join(lines)


def diagram(args):
    found = sorted(glob.glob(os.path.join(args.docs, "use_cases", "**", f"{args.uc}-*.md"), recursive=True))
    if not found:
        return
    label = current_status(read(found[0]))
    rank = STATUS_RANK.get(label.lower(), -1)
    if rank < 0:
        return
    paths = [os.path.join(args.docs, "use_cases.puml")] + sorted(
        glob.glob(os.path.join(args.docs, "use_cases", "*", "use_cases.puml")))
    for path in paths:
        if not os.path.isfile(path):
            continue
        text = read(path)
        new = recolour_diagram(text, args.uc, rank, label)
        if new != text:
            write_back(path, new)
            print(path)


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
    # Where the status stands in a row: under the Status column of its table's header, as spec_lint.py reads it
    # (requirement_rows and REQ_STATUS_COLUMNS are its own), so a column after it - Notes - is left alone. A table
    # without a header row, or a spec_lint.py without the helper, has the status in the last cell.
    columns = {}
    if hasattr(lint, "requirement_rows") and hasattr(lint, "REQ_STATUS_COLUMNS"):
        for row_number, _, _, header in lint.requirement_rows(lines):
            columns[row_number] = next((position for position, name in enumerate(header or ())
                                        if name in lint.REQ_STATUS_COLUMNS), None)
    changes = []
    for rid in sorted(linked):
        if args.uc not in linked[rid] or rid not in catalog:
            continue
        number, status, _ = catalog[rid]
        # A German catalog (Offen, Verifiziert) is read and written in its language; an older spec_lint.py without
        # the helpers knows the English values only.
        german = hasattr(lint, "requirement_progress") and hasattr(lint, "progress_like")
        current = lint.requirement_progress(status) if german else (
            status if lint.normalize(status) in progress else None)
        if current is None:
            continue
        derived = lint.derived_status([specs[uid] for uid in linked[rid]])
        if derived is None or lint.normalize(derived) == lint.normalize(current):
            continue
        if german:
            derived = lint.progress_like(derived, status)
        lines[number - 1] = replace_cell(lines[number - 1], columns.get(number), derived)
        changes.append(f"{rid}: {status} -> {derived}")
    if changes:
        write_back(project.requirements_path, "\n".join(lines))
        print("\n".join(changes))


def replace_cell(line, position, value):
    """The row with the cell at the position (0 = first cell) set to value, in the style replace_last_cell keeps.

    Without a position, or when the row has no closed cell there, the last cell is the status."""
    if position is None:
        return replace_last_cell(line, value)
    eol = "\r" if line.endswith("\r") else ""
    body = line[:-1] if eol else line
    pipes = [m.start() for m in re.finditer(r"(?<!\\)\|", body)]
    if not body.lstrip().startswith("|"):
        pipes.insert(0, -1)
    if position + 1 >= len(pipes):
        return replace_last_cell(line, value)
    start, end = pipes[position], pipes[position + 1]
    return body[:start + 1] + f" {value} ".ljust(end - start - 1) + body[end:] + eol


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
# field lines '**Label:** value' with the first one of a label winning, fenced code skipped, the next '# ' or '## '
# heading ends the section (a '###' sub-heading inside a question does not). Kept here on its own, so a change of spec_lint.py's internals cannot cut the andon cord.
OQ_HEADING = re.compile(r"^##\s+(OQ-[A-Za-z0-9-]+)\s*:?\s*(.*)$")
OQ_FIELD = re.compile(r"^\*\*([A-Za-z ]+):\*\*\s*(.*)$")
# The ids spec_lint.py accepts (its REQ_ID): FR-001, FR-GUEST-001, FR-A01, NFR-PERF-1, C-2a
REQ_ID = re.compile(r"(?<![A-Za-z0-9])((?:FR|NFR|C)-[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*)")
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
        if line.startswith(("# ", "## ")):
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

## OQ-011: On a requirement whose id starts with a letter

**Element:** FR-A01
**Blocking:** Yes
**Status:** Open

## OQ-012: On a requirement with a category in its id

**Element:** NFR-PERF-1
**Blocking:** Yes
**Status:** Open

## OQ-013: Fields after a sub-heading

### Readings

Two readings are possible.

**Element:** UC-001 step 4
**Blocking:** Yes
**Status:** Open

## OQ-014: A blocking value the lint rejects blocks in no parser

**Element:** UC-001
**Blocking:** Yes (decides the result)
**Status:** Open
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
                  "**Requirements:** [FR-001, NFR-002, FR-A01, NFR-PERF-1](../../requirements.md)\n")
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

        # diagram: the legend's colour for the status wins, the standard colour otherwise, a legend row for it,
        # other style parts and other entries stay
        with tempfile.TemporaryDirectory() as droot:
            ddocs = os.path.join(droot, "docs")
            write(os.path.join(ddocs, "use_cases", "UC-016-x.md"), "# UC-016: X\n\n**Status:** Getestet\n")
            write(os.path.join(ddocs, "use_cases", "UC-017-y.md"), "# UC-017: Y\n\n**Status:** Tested\n")
            write(os.path.join(ddocs, "use_cases", "UC-018-z.md"), "# UC-018: Z\n\n**Status:** Draft\n")
            puml = os.path.join(ddocs, "use_cases.puml")
            write(puml, '@startuml\nrectangle S {\n  usecase "UC-016\\nX" as UC016 #White\n'
                        '  usecase "UC-017\\nY" as UC017 <<main>> #Pink;line:red\n'
                        '  usecase "UC-018\\nZ" as UC018 #Thistle\n'
                        "' usecase \"UC-016\\nX\" as OLD #White\n}\n"
                        "legend right\n  |<#PaleGreen>| Status: Getestet |\nendlegend\n@enduml\n")
            expect("diagram legend colour", run(diagram, uc="UC-016", docs=ddocs), puml + "\n")
            text = read(puml)
            expect("diagram legend colour text", 'as UC016 #PaleGreen\n' in text, True)
            expect("diagram comment untouched", "as OLD #White" in text, True)
            expect("diagram again: nothing", run(diagram, uc="UC-016", docs=ddocs), "")
            run(diagram, uc="UC-017", docs=ddocs)
            text = read(puml)
            expect("diagram tested: same legend colour, style kept",
                   'as UC017 <<main>> #PaleGreen;line:red\n' in text, True)
            run(diagram, uc="UC-018", docs=ddocs)
            expect("diagram draft: no colour", 'as UC018\n' in read(puml), True)
            expect("diagram: no new legend row", read(puml).count("Status:"), 1)
            # without a legend: the standard colour and a new legend before @enduml, CRLF kept
            mod = os.path.join(ddocs, "use_cases", "billing", "use_cases.puml")
            os.makedirs(os.path.dirname(mod))
            with open(mod, "w", encoding="utf-8", newline="") as handle:
                handle.write('@startuml\r\nusecase "UC-017\\nY" as UC017\r\n@enduml\r\n')
            expect("diagram module", run(diagram, uc="UC-017", docs=ddocs), mod + "\n")
            with open(mod, "rb") as handle:
                expect("diagram module text", handle.read().decode("utf-8"),
                       '@startuml\r\nusecase "UC-017\\nY" as UC017 #Khaki\r\nlegend right\r\n'
                       '  |<#Khaki>| Status: Tested |\r\nendlegend\r\n\r\n@enduml\r\n')

        # blocking: Open or Answered, Yes or Ja, element names exactly this use case or a requirement it links
        expect("blocking without file", run(blocking, uc="UC-001", docs=docs), "")
        write(os.path.join(docs, "open_questions.md"), SELF_TEST_QUESTIONS)
        expect("blocking", run(blocking, uc="UC-001", docs=docs), "OQ-001\nOQ-004\nOQ-006\nOQ-007\nOQ-011\nOQ-012\nOQ-013\n")
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
        # replace_cell: the cell under the Status column, a column after it untouched; the last cell without one
        expect("cell by position", replace_cell("| FR-1 | a \\| b | Open   | note |\r", 2, "Verified"),
               "| FR-1 | a \\| b | Verified | note |\r")
        expect("cell by position, no leading pipe", replace_cell("FR-1 | Open | note", 1, "Verified"),
               "FR-1 | Verified | note")
        expect("cell by position, last cell open", replace_cell("| FR-1 | a | Open", 2, "Verified"),
               "| FR-1 | a | Verified")
        expect("cell without a position", replace_cell("| FR-1 | a | Open |", None, "Verified"),
               "| FR-1 | a | Verified |")

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
            # a column after Status: the status cell is found by the header, the note stays
            notes = os.path.join(root, "notes", "docs")
            write(os.path.join(notes, "requirements.md"),
                  "# Requirements\n\n## Functional Requirements\n\n"
                  "| ID     | Title    | User Story         | Use Cases | Priority | Status | Notes        |\n"
                  "|--------|----------|--------------------|-----------|----------|--------|--------------|\n"
                  "| FR-001 | Register | As a manager, I x. | UC-001    | High     | Open   | Open \\| ask |\n\n"
                  "No header:\n\n| FR-002 | Bare | As a manager, I y. | UC-001 | High | Open |\n")
            write(os.path.join(notes, "use_cases", "UC-001-register-room.md"),
                  "# Use Case: register-room\n\n## Overview\n\n**Use Case ID:** UC-001  \n**Status:** Tested  \n"
                  "**Requirements:** [FR-001, FR-002](../requirements.md)\n")
            expect("requirements with a column after Status",
                   run(requirements, uc="UC-001", docs=notes, spec_lint=lint_path),
                   "FR-001: Open -> Verified\nFR-002: Open -> Verified\n")
            text = read(os.path.join(notes, "requirements.md"))
            expect("requirements: the Status cell changed, the note stays",
                   "| High     | Verified | Open \\| ask |" in text, True)
            expect("requirements: headerless row, last cell", "| High | Verified |" in text, True)
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

        # requirements: a German catalog keeps its language (Offen -> Verifiziert)
        with tempfile.TemporaryDirectory() as root:
            docs = os.path.join(root, "docs")
            write(os.path.join(docs, "requirements.md"),
                  "# Requirements\n\n## Functional Requirements\n\n"
                  "| ID | Title | User Story | Use Cases | Priority | Status |\n"
                  "|---|---|---|---|---|---|\n"
                  "| FR-001 | Zimmer | Als Manager will ich ein Zimmer. | UC-001 | High | Offen |\n")
            write(os.path.join(docs, "use_cases", "UC-001-zimmer-erfassen.md"),
                  "# Use Case: zimmer-erfassen\n\n## Overview\n\n**Use Case ID:** UC-001  \n"
                  "**Status:** Getestet  \n**Requirements:** [FR-001](../requirements.md)\n")
            expect("requirements German", run(requirements, uc="UC-001", docs=docs, spec_lint=lint_path),
                   "FR-001: Offen -> Verifiziert\n")

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
    p = sub.add_parser("diagram")
    p.add_argument("uc")
    p.add_argument("--docs", default="docs")
    p.set_defaults(func=diagram)
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
