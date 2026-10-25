#!/usr/bin/env python3
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
"""Lint the AI Unified Process specification artifacts across files.

validate_use_case.py checks one use case document at a time. This linter
checks what connects the documents in a project's docs/ folder, where every
check is exact and gives the same result on every run:

- ERROR  = the artifacts are inconsistent: a use case of the diagram has
           no specification (or the other way round), an id is duplicated,
           a reference points to nothing, a BPMN activity is no use case of
           the diagram or of a specification,
           a process model's BP-XXX id does not match its file name,
           or a use case document does not parse (from validate_use_case.py).
- WARN   = the artifacts are connected but weak: an uncovered functional
           requirement, a requirement status its use cases contradict, an
           actor of a use case the diagram does not connect to it (or the
           other way round), the
           same business rule in two use cases, a weak word, a synonym the
           glossary says to avoid, or a rule of the use-case-spec skill that
           validate_use_case.py reports as broken.
- INFO   = worth knowing, never a failure: e.g. an NFR or constraint no
           use case links, which is fine when it applies system-wide.

Artifacts (each check runs only when its artifacts exist):

    requirements.md  use_cases.puml  use_cases/UC-*.md  test_cases/TC-*.md
    processes/*.bpmn  entity_model.md  glossary.md

A project split by module (as /reverse-engineer writes it) keeps the module
overview in use_cases.puml and the module table in entity_model.md; each
module has use_cases/<module>/use_cases.puml next to its use_cases/<module>/
UC-*.md, and entity_model/<module>.md. The linter reads them all, and checks
that the overview's packages, the module folders, and the place of every
specification agree.

The per-file structure checks and the BPMN activity parsing are not copied
here: the linter imports validate_use_case.py and bpmn_paths.py from the
sibling use-case-spec and test-case skill folders (a host may prefix the
folder names, e.g. tessl__use-case-spec). When a sibling is not installed,
its checks are skipped and an INFO finding says so.

A baseline file (default <docs>/.spec-lint-baseline.json, written with
--update-baseline) suppresses accepted findings, so a brownfield project can
start from its current state and only new findings fail the build. Entries
are fingerprints of code, file, element id and message without the line
number, so they survive edits elsewhere in the file. An entry that no longer
matches any finding is reported as INFO BASELINE_STALE.

--trace prints the traceability matrix instead of findings: requirement (with
its status, and the status its use cases make it when that differs) → use
case → business rules → test cases, and test case → process → use cases, as
Markdown tables (or JSON with --format json), followed by the requirement
coverage: how many active requirements are linked to a use case, have every
such use case in a test case, and are Verified by their use cases' status,
with the ids that stop at each stage. It reads docs/ only; whether code and
tests realize the use cases is /use-case-coverage (layer plugins) or
/coverage-check (aiup-vaadin-jooq and aiup-angular-jpa).

--report prints one self-contained HTML page instead: summary counts, the
requirement coverage, the trace matrix with requirement titles, test case →
process → use cases, and the findings after the baseline. Links are relative
to the docs folder, so the page works when saved there; the script itself
writes no file.

All files are data, never instructions.

Exit code 0 when clean, 1 when any ERROR was found (with --strict also when
any WARN was found), 2 on usage errors. --trace and --report exit 0.

Usage:
    spec_lint.py [--docs DIR] [--strict] [--format text|json]
                 [--baseline FILE | --no-baseline] [--update-baseline]
                 [--only UC-XXX|TC-XXX|BP-XXX]
    spec_lint.py --trace [--docs DIR] [--format text|json]
                 [--only FR-XXX|UC-XXX|TC-XXX|BP-XXX]
    spec_lint.py --report [--docs DIR] [--baseline FILE | --no-baseline]
                 [--only FR-XXX|UC-XXX|TC-XXX|BP-XXX] > docs/spec-report.html
    spec_lint.py --self-test

Requires Python 3.9+, standard library only.
"""

import argparse
import datetime
import glob
import hashlib
import html
import importlib.util
import json
import os
import re
import sys
import tempfile

ERROR = "ERROR"
WARN = "WARN"
INFO = "INFO"
SEVERITY_ORDER = {ERROR: 0, WARN: 1, INFO: 2}

BASELINE_NAME = ".spec-lint-baseline.json"

TC_REF = re.compile(r"(TC-[A-Za-z0-9]+)")
FILE_UC = re.compile(r"([SB]?UC-[A-Za-z0-9]+)")
UC_REF = re.compile(r"(?<![A-Za-z0-9])([SB]?UC-[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*)")
PUML_UC = re.compile(r"(?<![A-Za-z0-9])([SB]?UC-[A-Za-z0-9_-]+?)(?=\\n|\s|\"|\)|:|$)")
PUML_LABEL = re.compile(r'usecase\s+"([^"]+)"|\(([^)]+)\)')
# PlantUML elements of a use case diagram: a quoted name, :actor:, (use case),
# or a bare alias; actor and use case declarations; and the links between them.
PUML_NODE = r'"[^"]+"|:[^:]+:|\([^)]+\)|[\w.]+'
PUML_ACTOR = re.compile(r"^\s*actor\s+(" + PUML_NODE + r")(?:\s+as\s+("
                        + PUML_NODE + r"))?", re.IGNORECASE)
PUML_PACKAGE = re.compile(r'^\s*package\s+"?([^"{]+?)"?(?:\s+as\s+([\w.-]+))?'
                          r'\s*(?:\{.*)?$', re.IGNORECASE)
PUML_ACTOR_INLINE = re.compile(r"^\s*(:[^:]+:)\s+as\s+([\w.]+)")
PUML_USECASE = re.compile(r"^\s*(?:usecase\s+)?(" + PUML_NODE
                          + r")\s+as\s+(" + PUML_NODE + r")", re.IGNORECASE)
PUML_LINK = re.compile(r"^\s*(" + PUML_NODE + r")\s*(<\|?|)([-.]+(?:(?:\[[^\]]*\]"
                       r"|left|right|up|down|le|ri|do|l|r|u|d)[-.]+)?)(\|?>|)"
                       r"\s*(" + PUML_NODE + r")")
REQ_ROW = re.compile(r"^\|\s*((?:FR|NFR|C)-[A-Za-z0-9_-]+)\s*\|")
REQ_ID = re.compile(r"(?<![A-Za-z0-9])((?:FR|NFR|C)-\d+[A-Za-z0-9_-]*)")
RULE_HEADING = re.compile(r"^###\s+((?:BR|GR)-[A-Za-z0-9_-]+)\s*:?\s*(.*)$")
RULE_REF = re.compile(
    r"(?<![A-Za-z0-9])([SB]?UC-[A-Za-z0-9_-]+?)[\s,]+((?:BR|GR)-[A-Za-z0-9_-]+)")
MD_LINK = re.compile(r"\[([^\]]*)\]\(([^)\s]+)\)")
ENTITY_HEADING = re.compile(r"^###\s+([A-Z][A-Z0-9_]*)\s*$")
BP_REF = re.compile(r"(?<![A-Za-z0-9])(BP-\d{3,})(?![0-9])")
FILE_BP = re.compile(r"^(BP-\d{3,})-")

ID_FIELDS = ("**Use Case ID:**", "**Use-Case-ID:**")
NAME_FIELDS = ("**Use Case Name:**", "**Use-Case-Name:**")
REQUIREMENTS_FIELDS = ("**Requirements:**", "**Anforderungen:**")
PRIMARY_ACTOR_FIELDS = ("**Primary Actor:**", "**Primary Actors:**",
                        "**Primärer Akteur:**", "**Primäre Akteure:**")
SECONDARY_ACTOR_FIELDS = ("**Secondary Actors:**", "**Secondary Actor:**",
                          "**Sekundäre Akteure:**", "**Sekundärer Akteur:**")
NO_ACTOR = ("", "-", "—", "none", "n a", "keine", "keiner")
STATUS_FIELD = "**Status:**"
RULES_HEADINGS = ("## Business Rules", "## Geschäftsregeln")
TITLE_PREFIX = "# Use Case:"
OBSOLETE = ("obsolete", "obsolet")
INACTIVE_REQUIREMENT = ("rejected", "deferred", "abgelehnt", "zurückgestellt")

# A requirement's progress follows the use cases that link it (docs/workflow.md,
# Requirement status): Verified when every one is Tested or Done, Implemented
# when every one is at least Implemented, In Progress when some are, else
# Open. Scope decisions (Deferred, Rejected) are kept by hand, never derived.
UC_PROGRESS = {
    "draft": 0, "reviewed": 0, "approved": 0, "implemented": 1, "tested": 2,
    "done": 2,
    "entwurf": 0, "geprüft": 0, "genehmigt": 0, "implementiert": 1,
    "getestet": 2, "abgeschlossen": 2,
}
REQUIREMENT_PROGRESS = ("Open", "In Progress", "Implemented", "Verified")

# Weak words: vague, unverifiable, or optional wording, after the classic
# requirements-engineering rules (ISO/IEC/IEEE 29148, SOPHIST). A hit is a
# warning, not an error: the word may be justified, and the baseline takes it.
WEAK_WORDS = [
    # English
    "fast", "quick", "quickly", "user-friendly", "easy", "easily",
    "intuitive", "appropriate", "appropriately", "adequate", "adequately",
    "sufficient", "sufficiently", "reasonable", "flexible", "efficient",
    "efficiently", "seamless", "seamlessly", "etc.", "and/or",
    "if possible", "as needed", "as appropriate", "should", "TBD",
    # German
    "schnell", "benutzerfreundlich", "intuitiv", "angemessen", "ausreichend",
    "geeignet", "flexibel", "effizient", "usw.", "ggf.", "gegebenenfalls",
    "und/oder", "wenn möglich", "falls möglich", "möglichst", "sollte",
    "sollten",
]


def word_pattern(word, plural=False):
    left = r"(?<![\w/-])" if word[0].isalnum() else ""
    right = r"(?![\w/-])" if word[-1].isalnum() else ""
    suffix = r"(?:e?s)?" if plural and word[-1].isalnum() else ""
    return re.compile(left + re.escape(word) + suffix + right, re.IGNORECASE)


WEAK_PATTERNS = [(word, word_pattern(word)) for word in WEAK_WORDS]


class Finding:
    def __init__(self, severity, code, path, line, element, message):
        self.severity = severity
        self.code = code
        self.path = path
        self.line = line
        self.element = element or ""
        self.message = message

    def fingerprint(self, docs):
        rel = os.path.relpath(self.path, docs).replace(os.sep, "/")
        text = "|".join((self.code, rel, self.element,
                         " ".join(self.message.split())))
        return hashlib.sha1(text.encode("utf-8")).hexdigest()

    def as_dict(self):
        return {"severity": self.severity, "code": self.code,
                "path": self.path, "line": self.line,
                "element": self.element, "message": self.message}


# ---------------------------------------------------------------------------
# Sibling skill scripts
# ---------------------------------------------------------------------------

def load_sibling(pattern, module_name):
    """Import a script of a sibling skill folder, or return None."""
    skill_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    skills_root = os.path.dirname(skill_dir)
    # never leave __pycache__ folders in another skill's installed folder
    sys.dont_write_bytecode = True
    for path in sorted(glob.glob(os.path.join(skills_root, pattern))):
        spec = importlib.util.spec_from_file_location(module_name, path)
        module = importlib.util.module_from_spec(spec)
        try:
            spec.loader.exec_module(module)
        except Exception:  # a broken sibling must not break the linter
            continue
        return module
    return None


# ---------------------------------------------------------------------------
# Reading the artifacts
# ---------------------------------------------------------------------------

def read_lines(path):
    with open(path, encoding="utf-8") as handle:
        return handle.read().splitlines()


def prose_lines(lines):
    """(line number, text) of every line outside fenced code blocks."""
    fenced = False
    for number, line in enumerate(lines, 1):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            continue
        if not fenced:
            yield number, line


def table_cells(line):
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def normalize(text):
    return " ".join(re.sub(r"[^\w\s]", " ", text.casefold()).split())


def field_value(line, labels):
    for label in labels:
        if line.startswith(label):
            return line[len(label):].strip()
    return None


class Spec:
    def __init__(self, path):
        self.path = path
        self.lines = read_lines(path)
        base = os.path.basename(path)
        match = FILE_UC.match(base)
        self.id = match.group(1) if match else base
        self.id_line = 1
        self.name = None
        self.title = None
        self.status = ""
        self.requirements = []   # (line, id)
        self.actors = []         # (line, name, "primary" or "secondary")
        self.actor_line = 1
        self.rules = {}          # rule id -> {"line", "name", "text"}
        self.rule_order = []
        in_rules = False
        current = None
        for number, line in prose_lines(self.lines):
            if line.startswith(TITLE_PREFIX) and self.title is None:
                self.title = line[len(TITLE_PREFIX):].strip()
            value = field_value(line, ID_FIELDS)
            if value:
                self.id = value
                self.id_line = number
            value = field_value(line, NAME_FIELDS)
            if value:
                self.name = value
            value = field_value(line, (STATUS_FIELD,))
            if value is not None and not self.status:
                self.status = value
            for fields, kind in ((PRIMARY_ACTOR_FIELDS, "primary"),
                                 (SECONDARY_ACTOR_FIELDS, "secondary")):
                value = field_value(line, fields)
                if value is None:
                    continue
                if kind == "primary":
                    self.actor_line = number
                for name in value.split(","):
                    name = re.sub(r"\([^)]*\)", " ", name).strip(" *_`")
                    if normalize(name) not in NO_ACTOR:
                        self.actors.append((number, name, kind))
            value = field_value(line, REQUIREMENTS_FIELDS)
            if value is not None:
                self.requirements += [(number, rid)
                                      for rid in REQ_ID.findall(value)]
            if line.startswith("## "):
                in_rules = line.strip() in RULES_HEADINGS
                current = None
                continue
            if in_rules:
                match = RULE_HEADING.match(line)
                if match:
                    current = match.group(1)
                    self.rules[current] = {"line": number,
                                           "name": match.group(2).strip(),
                                           "text": []}
                    self.rule_order.append(current)
                elif current and line.strip():
                    self.rules[current]["text"].append(line.strip())

    @property
    def obsolete(self):
        return normalize(self.status) in OBSOLETE

    def names(self):
        return {normalize(n) for n in (self.title, self.name) if n}


class Project:
    def __init__(self, docs):
        self.docs = docs
        self.findings = []
        path = os.path.join(docs, "requirements.md")
        self.requirements_path = path if os.path.isfile(path) else None
        path = os.path.join(docs, "use_cases.puml")
        self.diagram_path = path if os.path.isfile(path) else None
        self.module_diagrams = sorted(glob.glob(os.path.join(
            docs, "use_cases", "*", "use_cases.puml")))
        self.diagram_paths = [self.diagram_path] * bool(self.diagram_path) \
            + self.module_diagrams
        path = os.path.join(docs, "entity_model.md")
        self.entity_paths = [path] * os.path.isfile(path) + sorted(
            glob.glob(os.path.join(docs, "entity_model", "*.md")))
        path = os.path.join(docs, "glossary.md")
        self.glossary_path = path if os.path.isfile(path) else None
        self.spec_paths = sorted(glob.glob(os.path.join(
            docs, "use_cases", "**", "*UC-*.md"), recursive=True))
        self.tc_paths = sorted(glob.glob(os.path.join(docs, "test_cases",
                                                      "TC-*.md")))
        self.bpmn_paths = sorted(glob.glob(os.path.join(docs, "processes",
                                                        "*.bpmn")))

    def add(self, severity, code, path, line, element, message):
        self.findings.append(Finding(severity, code, path, line, element,
                                     message))


# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

def check_requirements(project):
    """Requirement ids: unique; returns {id: (line, status, title)}."""
    requirements = {}
    if not project.requirements_path:
        return requirements
    lines = read_lines(project.requirements_path)
    for number, line in prose_lines(lines):
        match = REQ_ROW.match(line)
        if not match:
            continue
        rid = match.group(1)
        if rid in requirements:
            project.add(ERROR, "DUPLICATE_ID", project.requirements_path,
                        number, rid, "requirement id " + rid
                        + " is already used on line "
                        + str(requirements[rid][0]))
            continue
        cells = table_cells(line)
        requirements[rid] = (number, cells[-1],
                             cells[1] if len(cells) > 2 else "")
    return requirements


def diagram_name(project):
    """How the findings name the use case diagram."""
    if project.module_diagrams:
        return "use_cases.puml or a module's use_cases/*/use_cases.puml"
    return "use_cases.puml"


def module_of(project, path):
    """The module folder of a path under use_cases/, or None."""
    rel = os.path.relpath(path, os.path.join(project.docs, "use_cases"))
    parts = rel.replace(os.sep, "/").split("/")
    return parts[0] if len(parts) > 1 and parts[0] != ".." else None


def check_diagram(project, specs):
    """Every use case of the diagram has a spec and vice versa.

    Returns the diagram's use cases as {id: normalized name}."""
    if not project.diagram_paths:
        return {}
    diagram, names, twice = {}, {}, set()
    for path in project.diagram_paths:
        for number, line in enumerate(read_lines(path), 1):
            if line.lstrip().startswith("'"):
                continue
            for uid in PUML_UC.findall(line):
                first = diagram.setdefault(uid, (path, number))
                if first[0] != path and (uid, path) not in twice:
                    twice.add((uid, path))
                    project.add(ERROR, "DUPLICATE_ID", path, number, uid,
                                "use case " + uid + " is also in "
                                + doc_path(project, first[0]))
            for match in PUML_LABEL.finditer(line):
                label = (match.group(1) or match.group(2)).replace("\\n", " ")
                ids = PUML_UC.findall(label)
                if len(ids) == 1:
                    names.setdefault(ids[0], normalize(
                        PUML_UC.sub(" ", label, count=1)))
    for uid, (path, number) in diagram.items():
        if uid not in specs:
            folder = "use_cases/" + (module_of(project, path) + "/"
                                     if module_of(project, path) else "")
            project.add(ERROR, "SPEC_MISSING", path, number,
                        uid, "use case " + uid + " is in the diagram but has "
                        "no specification docs/" + folder + uid + "-*.md")
    for uid, spec in specs.items():
        if uid not in diagram and not spec.obsolete:
            project.add(ERROR, "NOT_IN_DIAGRAM", spec.path, spec.id_line, uid,
                        "use case " + uid + " is not in "
                        + diagram_name(project))
    check_modules(project, specs, diagram)
    return {uid: names.get(uid, "") for uid in diagram}


def check_modules(project, specs, diagram):
    """The overview's packages, the module folders, and the specs agree."""
    if not project.module_diagrams:
        return
    folders = {module_of(project, p): p for p in project.module_diagrams}
    packages = {}
    if project.diagram_path:
        for number, line in enumerate(read_lines(project.diagram_path), 1):
            match = PUML_PACKAGE.match(line)
            if match:
                packages.setdefault(match.group(2) or match.group(1), number)
    for alias, number in packages.items():
        if alias not in folders:
            project.add(ERROR, "MODULE_UNKNOWN", project.diagram_path, number,
                        alias, "package '" + alias + "' has no module "
                        "diagram use_cases/" + alias + "/use_cases.puml")
    for folder, path in sorted(folders.items()):
        if folder not in packages:
            project.add(ERROR, "MODULE_UNKNOWN", path, 1, folder,
                        "module folder use_cases/" + folder + "/ has no "
                        "package with the alias '" + folder + "' in the "
                        "overview use_cases.puml")
    for uid, spec in specs.items():
        if uid not in diagram:
            continue
        expected = module_of(project, diagram[uid][0])
        actual = module_of(project, spec.path)
        if expected and actual != expected:
            project.add(WARN, "MODULE_MISMATCH", spec.path, spec.id_line, uid,
                        "use case " + uid + " is in the diagram of module '"
                        + expected + "' but its specification is not in "
                        "use_cases/" + expected + "/")


def puml_name(token):
    """The display name of a PlantUML node token, without its quotes."""
    if token[:1] in "\":(" and len(token) > 1:
        token = token[1:-1]
    return " ".join(token.replace("\\n", " ").split())


def read_diagram_actors(path):
    """Actors, their links to use cases, and actor generalizations.

    Returns ({actor key: (line, name)}, {use case id: {actor key}},
    {actor key: {parent actor key}}); an actor key is the normalized name.
    """
    actors, aliases, uc_aliases = {}, {}, {}
    lines = [(number, line) for number, line in
             enumerate(read_lines(path), 1)
             if not line.lstrip().startswith("'")]

    def declare(number, name, alias=None):
        key = normalize(name)
        actors.setdefault(key, (number, name))
        aliases[alias or name] = key
        return key

    for number, line in lines:
        match = PUML_ACTOR.match(line)
        if match:
            first, second = match.group(1), match.group(2)
            if second and second[:1] == '"' and first[:1] != '"':
                first, second = second, first   # actor alias as "Name"
            declare(number, puml_name(first),
                    puml_name(second) if second else first)
            continue
        match = PUML_ACTOR_INLINE.match(line)
        if match:
            declare(number, puml_name(match.group(1)), match.group(2))
            continue
        match = PUML_USECASE.match(line)
        if match:
            for label, alias in ((match.group(1), match.group(2)),
                                 (match.group(2), match.group(1))):
                ids = PUML_UC.findall(puml_name(label))
                if len(ids) == 1:
                    uc_aliases[alias] = ids[0]
                    break

    def resolve(token, number):
        if token[:1] == ":":
            return "actor", declare(number, puml_name(token))
        if token in aliases:
            return "actor", aliases[token]
        if token in uc_aliases:
            return "usecase", uc_aliases[token]
        ids = PUML_UC.findall(puml_name(token))
        if len(ids) == 1:
            return "usecase", ids[0]
        return None, None

    links, parents = {}, {}
    for number, line in lines:
        match = PUML_LINK.match(line)
        if not match:
            continue
        left, right = resolve(match.group(1), number), \
            resolve(match.group(5), number)
        if "|" in match.group(2) + match.group(4):
            child, parent = (left, right) if "|" in match.group(4) \
                else (right, left)
            if child[0] == parent[0] == "actor":
                parents.setdefault(child[1], set()).add(parent[1])
            continue
        kinds = {left[0]: left[1], right[0]: right[1]}
        if set(kinds) == {"actor", "usecase"}:
            links.setdefault(kinds["usecase"], set()).add(kinds["actor"])
    return actors, links, parents


def ancestors(key, parents):
    """The actor and every actor it inherits from (A --|> B)."""
    found, todo = set(), [key]
    while todo:
        current = todo.pop()
        if current not in found:
            found.add(current)
            todo.extend(parents.get(current, ()))
    return found


def check_actors(project, specs):
    """A use case's actors in the specification and the diagram agree.

    The diagram does not tell primary from secondary actors, so both lists
    of the specification are compared with the actors linked to the use
    case. A use case without any linked actor (an include target) is skipped,
    and an actor inherits the use cases of its parent (Manager --|> Clerk).
    """
    actors, links, parents, where = {}, {}, {}, {}
    for path in project.diagram_paths:
        file_actors, file_links, file_parents = read_diagram_actors(path)
        for key, value in file_actors.items():
            actors.setdefault(key, value)
        for uid, keys in file_links.items():
            links.setdefault(uid, set()).update(keys)
            where.setdefault(uid, doc_path(project, path))
        for key, keys in file_parents.items():
            parents.setdefault(key, set()).update(keys)
    for uid, spec in specs.items():
        linked = links.get(uid)
        if not linked or spec.obsolete:
            continue
        diagram = where[uid]
        listed = set()
        for number, name, kind in spec.actors:
            key = normalize(name)
            listed |= ancestors(key, parents)
            if ancestors(key, parents) & linked:
                continue
            if key in actors:
                reason = "is not connected to " + uid + " in " + diagram
            else:
                reason = "is no actor of " + diagram
            project.add(WARN, "ACTOR_MISMATCH", spec.path, number, uid,
                        kind + " actor '" + name + "' " + reason)
        for key in sorted(linked - listed):
            _, name = actors.get(key, (0, key))
            project.add(WARN, "ACTOR_MISMATCH", spec.path, spec.actor_line,
                        uid, diagram + " connects actor '" + name + "' to "
                        + uid + ", but the specification lists it as "
                        "neither a primary nor a secondary actor")


def load_specs(project):
    specs = {}
    for path in project.spec_paths:
        spec = Spec(path)
        if spec.id in specs:
            project.add(ERROR, "DUPLICATE_ID", path, spec.id_line, spec.id,
                        "use case id " + spec.id + " is also used by "
                        + os.path.basename(specs[spec.id].path))
            continue
        specs[spec.id] = spec
    return specs


def check_structure(project, specs, validator):
    if not specs:
        return
    if validator is None:
        project.add(INFO, "VALIDATOR_MISSING", project.docs, 0, "",
                    "validate_use_case.py (use-case-spec skill) not found "
                    "next to this skill; per-file structure checks skipped")
        return
    for uid, spec in specs.items():
        for problem in validator.validate_file(spec.path):
            project.add(problem.severity, problem.code, spec.path,
                        problem.line, uid, problem.message)


def check_traceability(project, specs, requirements):
    """Requirement references resolve, and every active one is covered.

    An uncovered FR is a warning. An uncovered NFR or constraint is only
    worth knowing: a system-wide one (availability, the hosting platform)
    rightly belongs to no single use case.
    """
    referenced = set()
    uses_field = False
    for uid, spec in specs.items():
        if spec.requirements:
            uses_field = True
        for number, rid in spec.requirements:
            if not spec.obsolete:
                referenced.add(rid)
            if project.requirements_path and rid not in requirements:
                project.add(ERROR, "DANGLING_REF", spec.path, number, uid,
                            "requirement " + rid + " is not in "
                            "requirements.md")
    if not project.requirements_path or not specs:
        return
    if not uses_field:
        project.add(INFO, "NO_TRACEABILITY", project.requirements_path, 0, "",
                    "no use case has a **Requirements:** field; functional "
                    "requirement coverage is not checked")
        return
    for rid, (number, status, _) in requirements.items():
        if rid in referenced or normalize(status) in INACTIVE_REQUIREMENT:
            continue
        if rid.startswith("FR-"):
            project.add(WARN, "FR_UNCOVERED", project.requirements_path,
                        number, rid, "functional requirement " + rid
                        + " is not referenced by any use case")
        else:
            project.add(INFO, "REQ_UNCOVERED", project.requirements_path,
                        number, rid, "requirement " + rid + " is not "
                        "referenced by any use case; fine when it applies "
                        "to the whole system")


def linking_use_cases(specs):
    """{requirement id: [use case ids]} from the **Requirements:** lines."""
    linked = {}
    for uid, spec in specs.items():
        for _, rid in spec.requirements:
            ucs = linked.setdefault(rid, [])
            if uid not in ucs:
                ucs.append(uid)
    return linked


def derived_status(use_cases):
    """A requirement's progress from its linking use cases, or None.

    None when no active use case links it or a status is not a known value:
    then there is nothing certain to derive.
    """
    ranks = []
    for spec in use_cases:
        if spec.obsolete:
            continue
        words = normalize(spec.status).split()
        if not words or words[0] not in UC_PROGRESS:
            return None
        ranks.append(UC_PROGRESS[words[0]])
    if not ranks:
        return None
    if min(ranks) == 2:
        return "Verified"
    if min(ranks) == 1:
        return "Implemented"
    return "In Progress" if max(ranks) > 0 else "Open"


def check_requirement_status(project, specs, requirements):
    """A requirement's progress status matches its linking use cases."""
    progress = {normalize(value): value for value in REQUIREMENT_PROGRESS}
    for rid, uids in linking_use_cases(specs).items():
        if rid not in requirements:
            continue
        number, status, _ = requirements[rid]
        if normalize(status) not in progress:
            continue
        linked = [specs[uid] for uid in uids]
        derived = derived_status(linked)
        if derived is None or normalize(derived) == normalize(status):
            continue
        project.add(WARN, "REQ_STATUS_DRIFT", project.requirements_path,
                    number, rid, "status '" + status + "' but its use cases "
                    "make it '" + derived + "' (" + ", ".join(
                        spec.id + " " + spec.status for spec in linked
                        if not spec.obsolete) + ")")


def check_rules(project, specs):
    """Cross-use-case rule references resolve; no rule text is repeated."""
    seen = {}
    for uid, spec in specs.items():
        for number, line in prose_lines(spec.lines):
            for ref_uc, ref_rule in RULE_REF.findall(line):
                if ref_uc == uid:
                    continue
                target = specs.get(ref_uc)
                if target is None:
                    project.add(ERROR, "DANGLING_REF", spec.path, number, uid,
                                "reference to " + ref_uc + " " + ref_rule
                                + ": use case " + ref_uc + " does not exist")
                elif ref_rule not in target.rules:
                    project.add(ERROR, "DANGLING_REF", spec.path, number, uid,
                                "reference to " + ref_uc + " " + ref_rule
                                + ": " + ref_uc + " has no rule " + ref_rule)
        for rule_id in spec.rule_order:
            rule = spec.rules[rule_id]
            text = normalize(" ".join(rule["text"]))
            if len(text) < 20:
                continue
            if text in seen and seen[text][0] != uid:
                other_uc, other_rule = seen[text]
                project.add(WARN, "BR_DUPLICATE", spec.path, rule["line"],
                            uid + " " + rule_id, "same rule text as "
                            + other_uc + " " + other_rule + "; define it "
                            "once and cite '" + other_uc + " " + other_rule
                            + "'")
            else:
                seen.setdefault(text, (uid, rule_id))


def test_case_id(path, lines):
    """(id, line) of a test case: its **ID:** field, else its file name."""
    match = TC_REF.match(os.path.basename(path))
    for number, line in prose_lines(lines):
        value = field_value(line, ("**ID:**",))
        if value:
            return value.split()[0], number
    return (match.group(1) if match else path), 1


def check_test_cases(project, specs):
    """TC ids unique; UC links and process links resolve."""
    used = set()
    tcs = {}
    models = set(FILE_BP.match(os.path.basename(p)).group(1)
                 for p in project.bpmn_paths
                 if FILE_BP.match(os.path.basename(p)))
    for path in project.tc_paths:
        lines = read_lines(path)
        tid, tid_line = test_case_id(path, lines)
        if tid in tcs:
            project.add(ERROR, "DUPLICATE_ID", path, tid_line, tid,
                        "test case id " + tid + " is also used by "
                        + os.path.basename(tcs[tid]))
        else:
            tcs[tid] = path
        for number, line in prose_lines(lines):
            process = field_value(line, ("**Process:**",))
            for bid in BP_REF.findall(process or ""):
                if bid not in models:
                    project.add(ERROR, "DANGLING_REF", path, number, tid,
                                "business process " + bid + " has no model "
                                "docs/processes/" + bid + "-*.bpmn")
            for text, target in MD_LINK.findall(line):
                if re.match(r"[a-z]+:", target) or target.startswith("#"):
                    continue
                ref = UC_REF.match(text.strip())
                is_process = field_value(line, ("**Process:**",)) is not None
                if not ref and not is_process:
                    continue
                if ref:
                    used.add(ref.group(1))
                    if ref.group(1) not in specs:
                        project.add(ERROR, "DANGLING_REF", path, number, tid,
                                    "use case " + ref.group(1) + " has no "
                                    "specification")
                        continue
                resolved = os.path.normpath(os.path.join(
                    os.path.dirname(path), target.split("#")[0]))
                if not os.path.exists(resolved):
                    project.add(ERROR, "DANGLING_REF", path, number, tid,
                                "link target " + target + " does not exist")
    if tcs:
        for uid, spec in specs.items():
            if uid not in used and not spec.obsolete:
                project.add(INFO, "UC_UNUSED_BY_TC", spec.path, spec.id_line,
                            uid, "use case " + uid + " appears in no test "
                            "case")


def check_bpmn(project, specs, diagram, bpmn):
    """Every activity is a use case of the diagram or a specification.

    A diagram use case without a specification is SPEC_MISSING already, so a
    process may be modeled from the diagram before the use cases are
    specified."""
    if not project.bpmn_paths:
        return
    if bpmn is None:
        project.add(INFO, "BPMN_PARSER_MISSING", project.docs, 0, "",
                    "bpmn_paths.py (test-case skill) not found next to this "
                    "skill; BPMN checks skipped")
        return
    by_name = {}
    for uid, spec in specs.items():
        for name in spec.names():
            by_name.setdefault(name, uid)
    for uid, name in diagram.items():
        if name:
            by_name.setdefault(name, uid)
    owners = {}
    for path in project.bpmn_paths:
        with open(path, "rb") as handle:
            data = handle.read()
        try:
            model = bpmn.analyze(data)
        except bpmn.BpmnError as exc:
            project.add(ERROR, "BPMN_INVALID", path, 0, "", str(exc))
            continue
        text = data.decode("utf-8", errors="replace").splitlines()
        check_process_ids(project, path, model, text, owners)
        for activity in model["activities"]:
            number = next((i for i, line in enumerate(text, 1)
                           if 'id="' + activity["id"] + '"' in line), 0)
            uid = activity.get("ucId")
            if uid and (uid in specs or uid in diagram):
                continue
            if not uid and normalize(activity["name"]) in by_name:
                continue
            reason = ("use case " + uid + " is neither in the use case "
                      "diagram nor specified" if uid
                      else "no use case id in the name and no use case of "
                      "the diagram or specification with this name")
            project.add(ERROR, "BPMN_UNMAPPED", path, number, activity["id"],
                        "activity '" + activity["name"] + "': " + reason)


def check_process_ids(project, path, model, text, owners):
    """A process model carries its BP-XXX id as process id and file prefix."""
    name = os.path.basename(path)
    prefix = FILE_BP.match(name)
    prefix = prefix.group(1) if prefix else None
    ids = [p["bpId"] for p in model.get("processes", []) if p.get("bpId")]
    if not ids:
        if prefix:
            project.add(ERROR, "BP_ID_MISMATCH", path, 0, prefix,
                        "the file name says " + prefix + " but no process "
                        "has id=\"" + prefix + "\"")
        else:
            project.add(INFO, "BP_NO_ID", path, 0, "",
                        "the process model has no BP-XXX process id; "
                        "/business-process gives it one")
        return
    for bid in ids:
        number = next((i for i, line in enumerate(text, 1)
                       if 'id="' + bid + '"' in line), 0)
        if bid != prefix:
            project.add(ERROR, "BP_ID_MISMATCH", path, number, bid,
                        "process " + bid + " is in a file named " + name
                        + "; expected " + bid + "-<name>.bpmn")
        if bid in owners:
            project.add(ERROR, "DUPLICATE_ID", path, number, bid,
                        "business process id " + bid + " is also used by "
                        + os.path.basename(owners[bid]))
        else:
            owners[bid] = path


def check_entities(project):
    seen = {}
    for path in project.entity_paths:
        for number, line in prose_lines(read_lines(path)):
            match = ENTITY_HEADING.match(line)
            if not match:
                continue
            name = match.group(1)
            if name in seen:
                project.add(ERROR, "DUPLICATE_ID", path, number, name,
                            "entity " + name + " is already defined in "
                            + doc_path(project, seen[name][0]) + " on line "
                            + str(seen[name][1]))
            else:
                seen[name] = (path, number)


def load_glossary(project):
    """Glossary rows as (line, term, [avoid]); duplicate terms warned."""
    entries = []
    if not project.glossary_path:
        return entries
    header = None
    seen = {}
    for number, line in prose_lines(read_lines(project.glossary_path)):
        if not line.strip().startswith("|"):
            header = None
            continue
        cells = table_cells(line)
        if header is None:
            header = [normalize(c) for c in cells]
            continue
        if all(re.fullmatch(r":?-+:?", c) for c in cells if c):
            continue
        term = cells[0]
        if not term:
            continue
        avoid_col = next((i for i, h in enumerate(header)
                          if h in ("avoid", "vermeiden")), None)
        avoid = []
        if avoid_col is not None and avoid_col < len(cells):
            avoid = [a.strip() for a in cells[avoid_col].split(",")
                     if a.strip() and a.strip() not in ("-", "—")]
        key = normalize(term)
        if key in seen:
            project.add(WARN, "GLOSSARY_DUPLICATE", project.glossary_path,
                        number, term, "term '" + term + "' is already "
                        "defined on line " + str(seen[key]))
            continue
        seen[key] = number
        entries.append((number, term, avoid))
    return entries


def element_for(line, default):
    match = REQ_ROW.match(line)
    return match.group(1) if match else default


# Columns of the requirements tables that hold a fixed value, not prose: an
# Avoid synonym equal to a priority ("Medium") must not match them.
REQ_VALUE_COLUMNS = {"id", "priority", "status", "category", "source",
                     "priorität", "kategorie", "quelle"}


def requirement_prose(lines):
    """Lines of requirements.md with the value columns of its tables blanked."""
    header = None
    result = []
    for index, line in enumerate(lines):
        if not line.lstrip().startswith("|"):
            header = None
            result.append(line)
            continue
        cells = table_cells(line)
        following = lines[index + 1] if index + 1 < len(lines) else ""
        if header is None and re.match(r"^\s*\|[\s:|-]+\|\s*$", following):
            header = [cell.casefold() for cell in cells]
            result.append(line)
            continue
        if header is None or re.match(r"^\s*\|[\s:|-]+\|\s*$", line):
            result.append(line)
            continue
        kept = [cell if index_ >= len(header)
                or header[index_] not in REQ_VALUE_COLUMNS else ""
                for index_, cell in enumerate(cells)]
        # Keep the ID cell so element_for still names the requirement
        kept[0] = cells[0]
        result.append("| " + " | ".join(kept) + " |")
    return result


def check_wording(project, specs, glossary):
    """Weak words and avoided glossary synonyms in the prose artifacts."""
    avoided = [(term, synonym, word_pattern(synonym, plural=True))
               for _, term, avoid in glossary for synonym in avoid]
    documents = [(spec.path, spec.lines, uid) for uid, spec in specs.items()]
    for path in project.tc_paths:
        match = TC_REF.match(os.path.basename(path))
        documents.append((path, read_lines(path),
                          match.group(1) if match else ""))
    if project.requirements_path:
        documents.append((project.requirements_path,
                          requirement_prose(
                              read_lines(project.requirements_path)), ""))
    for path, lines, default in documents:
        for number, line in prose_lines(lines):
            if line.startswith("#") or line.startswith("<!--"):
                continue
            element = element_for(line, default)
            for word, pattern in WEAK_PATTERNS:
                if pattern.search(line):
                    project.add(WARN, "WEAK_WORD", path, number, element,
                                "weak word '" + word + "': make it "
                                "measurable, definite, or remove it")
            for term, synonym, pattern in avoided:
                if pattern.search(line):
                    project.add(WARN, "GLOSSARY_AVOIDED_TERM", path, number,
                                element, "'" + synonym + "' is a synonym the "
                                "glossary says to avoid; use '" + term + "'")


def lint(docs, validator, bpmn):
    project = Project(docs)
    requirements = check_requirements(project)
    specs = load_specs(project)
    check_structure(project, specs, validator)
    diagram = check_diagram(project, specs)
    check_actors(project, specs)
    check_traceability(project, specs, requirements)
    check_requirement_status(project, specs, requirements)
    check_rules(project, specs)
    check_test_cases(project, specs)
    check_bpmn(project, specs, diagram, bpmn)
    check_entities(project)
    check_wording(project, specs, load_glossary(project))
    return sorted(project.findings,
                  key=lambda f: (SEVERITY_ORDER[f.severity], f.path, f.line))


# ---------------------------------------------------------------------------
# Trace matrix
# ---------------------------------------------------------------------------

def doc_path(project, path):
    """A path relative to the docs folder, with forward slashes."""
    return os.path.relpath(path, project.docs).replace(os.sep, "/")


def read_test_cases(project):
    """Every test case with the use cases it links and its process."""
    test_cases = []
    for path in project.tc_paths:
        lines = read_lines(path)
        tid, _ = test_case_id(path, lines)
        use_cases, process = [], ""
        for _, line in prose_lines(lines):
            value = field_value(line, ("**Process:**",))
            if value and not process:
                process = MD_LINK.sub(r"\1", value)
            for text, _ in MD_LINK.findall(line):
                ref = UC_REF.match(text.strip())
                if ref and ref.group(1) not in use_cases:
                    use_cases.append(ref.group(1))
        bid = BP_REF.search(process)
        bid = bid.group(1) if bid else ""
        models = [m for m in project.bpmn_paths
                  if bid and os.path.basename(m).startswith(bid + "-")]
        test_cases.append({"id": tid, "path": doc_path(project, path),
                           "process": process, "process_id": bid,
                           "process_path": doc_path(project, models[0])
                           if models else "",
                           "use_cases": use_cases})
    return test_cases


def trace(docs):
    """The requirement → use case → business rule → test case matrix.

    One row per requirement and use case that links it, in catalog order;
    a requirement no use case links has one row without a use case, and a
    use case without a **Requirements:** line has one row without a
    requirement. Findings are the lint's business, not the matrix's.
    """
    project = Project(docs)
    requirements = check_requirements(project)
    specs = load_specs(project)
    test_cases = read_test_cases(project)
    tcs_by_uc = {}
    for tc in test_cases:
        for uid in tc["use_cases"]:
            tcs_by_uc.setdefault(uid, []).append(tc["id"])
    ucs_by_req = linking_use_cases(specs)

    def row(rid, uid):
        spec = specs.get(uid)
        derived = derived_status([specs[u] for u in ucs_by_req.get(rid, [])])
        return {"requirement": rid,
                "requirement_status": requirements[rid][1]
                if rid in requirements else "",
                "requirement_title": requirements[rid][2]
                if rid in requirements else "",
                "derived_status": derived or "",
                "use_case": uid,
                "path": doc_path(project, spec.path) if spec else "",
                "name": (spec.title or spec.name or "") if spec else "",
                "status": spec.status if spec else "",
                "business_rules": list(spec.rule_order) if spec else [],
                "test_cases": tcs_by_uc.get(uid, [])}

    rows = []
    for rid in list(requirements) + [r for r in ucs_by_req
                                     if r not in requirements]:
        for uid in ucs_by_req.get(rid) or [None]:
            rows.append(row(rid, uid))
    for uid, spec in specs.items():
        if not spec.requirements:
            rows.append(row(None, uid))
    return {"requirements": rows, "test_cases": test_cases,
            "coverage": coverage(requirements, specs, ucs_by_req,
                                 tcs_by_uc),
            "counts": {"requirements": len(requirements),
                       "use_cases": len(specs),
                       "test_cases": len(test_cases),
                       "processes": len(project.bpmn_paths)}}


COVERAGE_STAGES = ("Linked to a use case", "Every use case in a test case",
                   "Verified")


def coverage(requirements, specs, ucs_by_req, tcs_by_uc):
    """How far each active requirement of the catalog has come.

    The stages are cumulative: linked by an active use case, every such use
    case in a test case, and Verified as derived from the use cases' status
    (not the stored one, which REQ_STATUS_DRIFT checks). Each requirement
    stops at the first stage it has not reached (None when it reached all).
    Deferred and Rejected requirements are out of scope and only listed.
    """
    stops, excluded = {}, []
    for rid, (_, status, _) in requirements.items():
        if normalize(status) in INACTIVE_REQUIREMENT:
            excluded.append(rid)
            continue
        ucs = [specs[u] for u in ucs_by_req.get(rid, [])
               if not specs[u].obsolete]
        checks = (bool(ucs),
                  all(tcs_by_uc.get(spec.id) for spec in ucs),
                  derived_status(ucs) == "Verified")
        stops[rid] = next((stage for stage, ok in zip(COVERAGE_STAGES, checks)
                           if not ok), None)
    return summarize_coverage(stops, excluded)


def summarize_coverage(stops, excluded):
    stages, reached = [], len(stops)
    for stage in COVERAGE_STAGES:
        gaps = [rid for rid, stop in stops.items() if stop == stage]
        reached -= len(gaps)
        stages.append({"stage": stage, "reached": reached, "stopped": gaps})
    return {"active": len(stops), "excluded": excluded, "stages": stages,
            "stops": stops}


def filter_trace(matrix, only):
    rows = [r for r in matrix["requirements"]
            if only in (r["requirement"], r["use_case"])
            or only in r["test_cases"]]
    tcs = [t for t in matrix["test_cases"]
           if only in (t["id"], t["process_id"]) or only in t["use_cases"]]
    kept = {r["requirement"] for r in rows}
    cov = matrix["coverage"]
    return {"requirements": rows, "test_cases": tcs,
            "counts": matrix["counts"],
            "coverage": summarize_coverage(
                {rid: stop for rid, stop in cov["stops"].items()
                 if rid in kept},
                [rid for rid in cov["excluded"] if rid in kept])}


def markdown_table(header, rows):
    rows = [[c.replace("|", "\\|") for c in r] for r in rows]
    widths = [max(len(r[i]) for r in [header] + rows)
              for i in range(len(header))]
    lines = ["| " + " | ".join(c.ljust(w) for c, w in zip(r, widths)) + " |"
             for r in [header] + rows]
    lines.insert(1, "|" + "|".join("-" * (w + 2) for w in widths) + "|")
    return lines


def render_trace(matrix):
    def cell(values):
        return ", ".join(values) if values else "—"

    def requirement_status(r):
        status, derived = r["requirement_status"], r["derived_status"]
        if derived and normalize(derived) != normalize(status):
            return (status or "—") + " (use cases: " + derived + ")"
        return status or "—"

    lines = ["## Requirements → Use Cases → Business Rules → Test Cases", ""]
    lines += markdown_table(
        ["Requirement", "Req. Status", "Use Case", "UC Status",
         "Business Rules", "Test Cases"],
        [[r["requirement"] or "—", requirement_status(r),
          (r["use_case"] + " " + r["name"]).strip() if r["use_case"]
          else "—",
          r["status"] or "—", cell(r["business_rules"]),
          cell(r["test_cases"])] for r in matrix["requirements"]])
    if matrix["test_cases"]:
        lines += ["", "## Test Cases → Process → Use Cases", ""]
        lines += markdown_table(
            ["Test Case", "Process", "Use Cases"],
            [[t["id"], t["process"] or "—", cell(t["use_cases"])]
             for t in matrix["test_cases"]])
    cov = matrix["coverage"]
    if cov["active"]:
        lines += ["", "## Requirement Coverage", "",
                  "%d active requirement(s); each one missing a stage is "
                  "listed at the first stage it misses." % cov["active"]]
        if cov["excluded"]:
            lines[-1] += " Out of scope (Deferred, Rejected): " \
                + ", ".join(cov["excluded"]) + "."
        lines.append("")
        lines += markdown_table(
            ["Stage", "Reached", "Missing"],
            [[s["stage"], "%d / %d" % (s["reached"], cov["active"]),
              cell(s["stopped"])] for s in cov["stages"]])
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# HTML report
# ---------------------------------------------------------------------------

REPORT_CSS = """
:root { --fg: #1d2330; --muted: #5b6475; --bg: #ffffff; --panel: #f4f6f9;
  --line: #d9dee7; --link: #1f5fbf; --ok: #1f7a3f; --warn: #a15c00;
  --err: #b42318; --info: #3d5a99; --bar: #2f7d4f; }
@media (prefers-color-scheme: dark) {
  :root { --fg: #e6e9ef; --muted: #9aa3b5; --bg: #15181e; --panel: #1e232b;
    --line: #333a46; --link: #7fb0ff; --ok: #5cc98a; --warn: #f0a94a;
    --err: #ff7b72; --info: #8fb0f0; --bar: #4fb57a; } }
* { box-sizing: border-box; }
body { margin: 0 auto; max-width: 1200px; padding: 24px; color: var(--fg);
  background: var(--bg); font: 14px/1.5 system-ui, -apple-system, sans-serif; }
h1 { font-size: 22px; margin: 0 0 4px; }
h2 { font-size: 17px; margin: 32px 0 8px; }
a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }
.muted { color: var(--muted); }
.tiles { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
.tile { background: var(--panel); border: 1px solid var(--line);
  border-radius: 8px; padding: 10px 16px; min-width: 120px; }
.tile b { display: block; font-size: 22px; }
table { border-collapse: collapse; width: 100%; }
th, td { border-bottom: 1px solid var(--line); padding: 6px 8px;
  text-align: left; vertical-align: top; }
th { background: var(--panel); font-weight: 600; }
.badge { display: inline-block; border: 1px solid currentColor;
  border-radius: 10px; padding: 0 8px; font-size: 12px; white-space: nowrap; }
.s-ok { color: var(--ok); } .s-warn { color: var(--warn); }
.s-err { color: var(--err); } .s-info { color: var(--info); }
.s-muted { color: var(--muted); }
.bar { background: var(--panel); border: 1px solid var(--line);
  border-radius: 4px; height: 10px; width: 160px; overflow: hidden; }
.bar span { display: block; height: 100%; background: var(--bar); }
input[type=search] { padding: 6px 8px; width: 280px; color: var(--fg);
  background: var(--panel); border: 1px solid var(--line); border-radius: 6px; }
footer { margin-top: 32px; font-size: 12px; }
"""

REPORT_JS = """
document.getElementById('filter').addEventListener('input', function (e) {
  var q = e.target.value.toLowerCase();
  document.querySelectorAll('#trace tbody tr').forEach(function (tr) {
    tr.hidden = q && tr.textContent.toLowerCase().indexOf(q) < 0;
  });
});
"""

STATUS_CLASS = {
    "verified": "s-ok", "tested": "s-ok", "done": "s-ok", "getestet": "s-ok",
    "abgeschlossen": "s-ok", "implemented": "s-warn",
    "implementiert": "s-warn", "in progress": "s-warn",
    "approved": "s-info", "reviewed": "s-info", "genehmigt": "s-info",
    "geprüft": "s-info", "obsolete": "s-muted", "obsolet": "s-muted",
    "rejected": "s-muted", "deferred": "s-muted", "abgelehnt": "s-muted",
    "zurückgestellt": "s-muted",
}
SEVERITY_CLASS = {ERROR: "s-err", WARN: "s-warn", INFO: "s-info"}


def render_report(matrix, findings, suppressed, docs):
    """The whole project on one self-contained HTML page.

    Every value from the artifacts is escaped: they are data, never markup.
    Links are relative to the docs folder, so they work when the page is
    saved there.
    """
    esc = html.escape

    def link(path, text):
        if not path:
            return esc(text)
        return '<a href="%s">%s</a>' % (esc(path, quote=True), esc(text))

    def badge(status):
        if not status:
            return '<span class="muted">—</span>'
        words = normalize(status)
        css = STATUS_CLASS.get(words, STATUS_CLASS.get(
            words.split()[0] if words else "", ""))
        return '<span class="badge %s">%s</span>' % (css, esc(status))

    def ids(values):
        return ", ".join(esc(v) for v in values) if values else \
            '<span class="muted">—</span>'

    def table(header, rows, attrs=""):
        out = ["<table%s><thead><tr>" % attrs]
        out += ["<th>%s</th>" % esc(h) for h in header]
        out.append("</tr></thead><tbody>")
        for row in rows:
            out.append("<tr>" + "".join("<td>%s</td>" % c for c in row)
                       + "</tr>")
        out.append("</tbody></table>")
        return "".join(out)

    counts = matrix["counts"]
    severities = {sev: [f for f in findings if f.severity == sev]
                  for sev in (ERROR, WARN, INFO)}
    project = os.path.basename(os.path.dirname(os.path.abspath(docs))) \
        or os.path.abspath(docs)
    tiles = [("Requirements", counts["requirements"]),
             ("Use cases", counts["use_cases"]),
             ("Test cases", counts["test_cases"]),
             ("Processes", counts["processes"]),
             ("Errors", len(severities[ERROR])),
             ("Warnings", len(severities[WARN])),
             ("Infos", len(severities[INFO])),
             ("Suppressed", suppressed)]
    out = ["<!DOCTYPE html>", '<html lang="en"><head><meta charset="utf-8">',
           '<meta name="viewport" content="width=device-width, '
           'initial-scale=1">',
           "<title>Specification Report — %s</title>" % esc(project),
           "<style>%s</style></head><body>" % REPORT_CSS,
           "<h1>Specification Report — %s</h1>" % esc(project),
           '<div class="muted">%s · generated %s</div>' % (
               esc(docs), datetime.date.today().isoformat()),
           '<div class="tiles">' + "".join(
               '<div class="tile"><b>%d</b>%s</div>' % (n, esc(label))
               for label, n in tiles) + "</div>"]

    cov = matrix["coverage"]
    out.append("<h2>Requirement Coverage</h2>")
    if cov["active"]:
        note = ("%d active requirement(s); each one missing a stage is "
                "listed at the first stage it misses." % cov["active"])
        if cov["excluded"]:
            note += " Out of scope (Deferred, Rejected): " \
                + ", ".join(cov["excluded"]) + "."
        out.append('<p class="muted">%s</p>' % esc(note))
        out.append(table(["Stage", "Reached", "", "Missing"], [
            [esc(st["stage"]), "%d / %d" % (st["reached"], cov["active"]),
             '<div class="bar"><span style="width:%d%%"></span></div>'
             % (100 * st["reached"] // cov["active"]),
             ids(st["stopped"])] for st in cov["stages"]]))
    else:
        out.append('<p class="muted">No active requirements.</p>')

    def requirement_cell(r):
        if not r["requirement"]:
            return '<span class="muted">—</span>'
        text = link("requirements.md", r["requirement"])
        if r["requirement_title"]:
            text += " " + esc(r["requirement_title"])
        return text

    def requirement_status(r):
        status, derived = r["requirement_status"], r["derived_status"]
        cell = badge(status)
        if derived and normalize(derived) != normalize(status):
            cell += ' <span class="muted">use cases:</span> ' + badge(derived)
        return cell

    out.append("<h2>Traceability</h2>")
    out.append('<p><input type="search" id="filter" placeholder="Filter by '
               'id, name, or status"></p>')
    out.append(table(
        ["Requirement", "Req. Status", "Use Case", "UC Status",
         "Business Rules", "Test Cases"],
        [[requirement_cell(r), requirement_status(r),
          link(r["path"], (r["use_case"] + " " + r["name"]).strip())
          if r["use_case"] else '<span class="muted">—</span>',
          badge(r["status"]), ids(r["business_rules"]),
          ids(r["test_cases"])] for r in matrix["requirements"]],
        ' id="trace"'))

    if matrix["test_cases"]:
        out.append("<h2>Test Cases → Process → Use Cases</h2>")
        out.append(table(
            ["Test Case", "Process", "Use Cases"],
            [[link(t["path"], t["id"]),
              link(t["process_path"], t["process"]) if t["process"]
              else '<span class="muted">—</span>', ids(t["use_cases"])]
             for t in matrix["test_cases"]]))

    out.append("<h2>Findings</h2>")
    if not findings:
        out.append('<p class="muted">No findings.</p>')
    for sev in (ERROR, WARN, INFO):
        if not severities[sev]:
            continue
        rows = []
        for f in severities[sev]:
            where = os.path.relpath(f.path, docs).replace(os.sep, "/")
            location = esc(docs) if where == "." else link(
                where, where + (":%d" % f.line if f.line else ""))
            rows.append([location, '<span class="badge %s">%s</span>' % (
                SEVERITY_CLASS[sev], esc(f.code)), esc(f.element),
                esc(f.message)])
        out.append(table(["%s (%d)" % (sev, len(rows)), "Code", "Element",
                          "Message"], rows))

    out.append('<footer class="muted">Generated by spec_lint.py — AI '
               'Unified Process. Links are relative to the docs folder; save '
               'the page there for them to work.</footer>')
    out.append("<script>%s</script></body></html>" % REPORT_JS)
    return "\n".join(out)


# ---------------------------------------------------------------------------
# Baseline and filtering
# ---------------------------------------------------------------------------

def read_baseline(path):
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    return data.get("findings", [])


def write_baseline(path, findings, docs):
    entries = []
    for f in findings:
        if f.severity == INFO:
            continue
        entries.append({"fingerprint": f.fingerprint(docs), "code": f.code,
                        "path": os.path.relpath(f.path, docs).replace(
                            os.sep, "/"),
                        "element": f.element, "message": f.message})
    entries.sort(key=lambda e: (e["path"], e["code"], e["element"],
                                e["message"]))
    with open(path, "w", encoding="utf-8") as handle:
        json.dump({"version": 1, "findings": entries}, handle, indent=2,
                  ensure_ascii=False)
        handle.write("\n")
    return len(entries)


def apply_baseline(findings, entries, docs, report_stale):
    remaining = {}
    for entry in entries:
        remaining[entry["fingerprint"]] = \
            remaining.get(entry["fingerprint"], 0) + 1
    kept = []
    suppressed = 0
    for f in findings:
        key = f.fingerprint(docs)
        if f.severity != INFO and remaining.get(key):
            remaining[key] -= 1
            suppressed += 1
        else:
            kept.append(f)
    if report_stale:
        for entry in entries:
            if remaining.get(entry["fingerprint"]):
                remaining[entry["fingerprint"]] -= 1
                kept.append(Finding(INFO, "BASELINE_STALE",
                                    os.path.join(docs, entry["path"]), 0,
                                    entry["element"], "baseline entry no "
                                    "longer matches (" + entry["code"] + ": "
                                    + entry["message"] + "); remove it with "
                                    "--update-baseline"))
    return kept, suppressed


def matches_only(finding, only):
    if finding.element.split(" ")[0] == only:
        return True
    if os.path.basename(finding.path).startswith(only + "-"):
        return True
    return re.search(r"(?<![A-Za-z0-9])" + re.escape(only) + r"(?![0-9])",
                     finding.message) is not None


# ---------------------------------------------------------------------------
# Self test
# ---------------------------------------------------------------------------

def spec_text(uid, name, requirements="", rules="", extra_step="",
              status="Approved"):
    return """\
# Use Case: {name}

## Overview

**Use Case ID:** {uid}
**Use Case Name:** {name}
**Primary Actor:** Clerk
**Goal:** Clerk records the {lower}
**Status:** {status}
{requirements}
## Preconditions

- Clerk is logged into the system

## Main Success Scenario

1. Clerk opens the {lower} form.
2. Clerk enters the {lower} data.{extra_step}
3. System records the {lower} and displays a confirmation.

## Alternative Flows

### A1: Data Incomplete

**Trigger:** A mandatory value is missing (step 2)
**Flow:**

1. System marks the missing value.
2. Use case continues at step 2.

## Postconditions

### Success Postconditions

- The {lower} is recorded

### Failure Postconditions

- No {lower} is recorded

## Business Rules
{rules}""".format(uid=uid, name=name, lower=name.lower(),
                  requirements=requirements, rules=rules,
                  extra_step=extra_step, status=status)


RULE_TEXT = ("\n### BR-001: Guest Age\n\nA guest must be at least eighteen "
             "years old on the day of arrival.\n")

CLEAN = {
    "requirements.md": """\
# Requirements

| ID     | Title         | User Story                                                          | Priority | Status |
|--------|---------------|---------------------------------------------------------------------|----------|--------|
| FR-001 | Create Guest  | As a clerk, I want to record guests so that I can reserve rooms.    | High     | Open   |
| FR-002 | Reserve Room  | As a clerk, I want to reserve rooms so that guests have a room.     | High     | Open   |
| FR-003 | Export Report | As a manager, I want to export a report so that I can plan budgets. | Low      | Rejected |
""",
    "use_cases.puml": """\
@startuml
left to right direction
actor Clerk as clerk
rectangle "Hotel" {
    usecase "UC-001\\nCreate Guest" as UC001
    usecase "UC-002\\nReserve Room" as UC002
}
clerk --> UC001
clerk --> UC002
@enduml
""",
    "glossary.md": """\
# Glossary

| Term  | Definition                             | Avoid           |
|-------|----------------------------------------|-----------------|
| Guest | A person who stays at the hotel.       | Customer, Client |
| Clerk | An employee working at the front desk. |                 |
""",
    "entity_model.md": "# Entity Model\n\n### GUEST\n\n### ROOM\n",
    "use_cases/UC-001-create-guest.md": spec_text(
        "UC-001", "Create Guest",
        "\n**Requirements:** [FR-001](../requirements.md)\n", RULE_TEXT),
    "use_cases/UC-002-reserve-room.md": spec_text(
        "UC-002", "Reserve Room",
        "\n**Requirements:** [FR-002](../requirements.md)\n",
        "\n### BR-001: Guest Age\n\nThe guest age rule UC-001 BR-001 "
        "applies to every reservation.\n"),
    "test_cases/TC-001-reserve-room.md": """\
# Test Case: Reserve a Room

## Overview

**ID:** TC-001
**Process:** [BP-001 Hotel Stay](../processes/BP-001-hotel-stay.bpmn) — main path

## Flow

| Step | Name         | Description           | Test Data | Use Case                                     |
|------|--------------|-----------------------|-----------|----------------------------------------------|
| 1    | Create guest | Clerk records a guest | Mia       | [UC-001](../use_cases/UC-001-create-guest.md) |
| 2    | Reserve room | Clerk reserves a room | Room 12   | [UC-002](../use_cases/UC-002-reserve-room.md) |
""",
    "processes/BP-001-hotel-stay.bpmn": """\
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d">
  <process id="BP-001" name="Hotel Stay">
    <startEvent id="s"/>
    <userTask id="t1" name="UC-001 Create Guest"/>
    <userTask id="t2" name="Reserve Room"/>
    <endEvent id="e"/>
    <sequenceFlow id="f1" sourceRef="s" targetRef="t1"/>
    <sequenceFlow id="f2" sourceRef="t1" targetRef="t2"/>
    <sequenceFlow id="f3" sourceRef="t2" targetRef="e"/>
  </process>
</definitions>
""",
}

BROKEN = dict(CLEAN)
BROKEN.update({
    "requirements.md": CLEAN["requirements.md"]
    + "| FR-004 | Cancel Room   | As a clerk, I want to cancel quickly so "
      "that rooms are free again. | High | Open |\n"
      "| FR-001 | Duplicate     | As a clerk, I want a duplicate id.       "
      "                          | Low  | Open |\n"
      "| NFR-001 | <b>Bold</b> Availability | The system is available 99.5 % of each "
      "month. | High | Open |\n",
    "use_cases.puml": CLEAN["use_cases.puml"].replace(
        "}", "    usecase \"UC-003\\nCancel Room\" as UC003\n}"),
    "glossary.md": CLEAN["glossary.md"]
    + "| guest | Duplicate definition. | |\n",
    "entity_model.md": CLEAN["entity_model.md"] + "\n### ROOM\n",
    "use_cases/UC-001-create-guest.md": spec_text(
        "UC-001", "Create Guest",
        "\n**Requirements:** [FR-001, FR-009](../requirements.md)\n",
        RULE_TEXT, "\n   The customer should see the form"),
    "use_cases/UC-002-reserve-room.md": spec_text(
        "UC-002", "Reserve Room",
        "\n**Requirements:** [FR-002](../requirements.md)\n",
        RULE_TEXT + "\n### BR-002: Deposit\n\nSee UC-001 BR-007 and "
        "UC-042 BR-001.\n", status="Done").replace(
        "**Primary Actor:** Clerk", "**Primary Actor:** Receptionist"),
    "use_cases/UC-005-stray.md": spec_text("UC-005", "Stray"),
    "test_cases/TC-001-reserve-room.md": CLEAN[
        "test_cases/TC-001-reserve-room.md"].replace(
        "BP-001-hotel-stay.bpmn)", "missing.bpmn)").replace(
        "[UC-002](../use_cases/UC-002-reserve-room.md)",
        "[UC-009](../use_cases/UC-009-nothing.md)"),
    "processes/BP-001-hotel-stay.bpmn": CLEAN[
        "processes/BP-001-hotel-stay.bpmn"].replace(
        'name="Reserve Room"', 'name="Pay Invoice"'),
    "processes/BP-002-checkout.bpmn": CLEAN[
        "processes/BP-001-hotel-stay.bpmn"].replace(
        'name="Reserve Room"', 'name="Cancel Room"').replace(
        'name="UC-001 Create Guest"', 'name="UC-003 Cancel Room"'),
    "processes/legacy.bpmn": CLEAN[
        "processes/BP-001-hotel-stay.bpmn"].replace('"BP-001"', '"p"'),
})

BROKEN_EXPECTED = {
    "DUPLICATE_ID", "SPEC_MISSING", "NOT_IN_DIAGRAM", "DANGLING_REF",
    "BPMN_UNMAPPED", "FR_UNCOVERED", "BR_DUPLICATE", "WEAK_WORD",
    "GLOSSARY_AVOIDED_TERM", "GLOSSARY_DUPLICATE", "UC_UNUSED_BY_TC",
    "REQ_STATUS_DRIFT", "BP_ID_MISMATCH", "BP_NO_ID", "REQ_UNCOVERED",
    "ACTOR_MISMATCH",
}

ACTOR_DIAGRAM = """\
@startuml
actor "Front Desk\\nClerk" as clerk
actor manager as "Manager"
:Payment Service: as pay
actor Guest
' actor Commented
rectangle "Hotel" {
    usecase "UC-001\\nCreate Guest" as UC001
    (UC-002\\nReserve Room) as UC002
    usecase UC003 as "UC-003\\nCancel Room"
}
clerk -up-> UC001
UC002 <-- clerk
UC002 .. pay
manager --|> clerk
Guest -[#blue]-> (UC-004 Check Out)
:Night Auditor: -- UC003
UC001 ..> UC002 : <<include>>
@enduml
"""

ACTOR_LINKS = {
    "UC-001": {"front desk clerk"},
    "UC-002": {"front desk clerk", "payment service"},
    "UC-003": {"night auditor"},
    "UC-004": {"guest"},
}


# CLEAN with both diagrams split by module, as /reverse-engineer writes them:
# the overviews in use_cases.puml and entity_model.md, each module in a folder
# use_cases/<module>/ with its diagram and specifications, and a file
# entity_model/<module>.md.
MODULAR = {k: v for k, v in CLEAN.items() if not k.startswith("use_cases/")}
MODULAR.update({
    "use_cases.puml": """\
@startuml Modules
left to right direction
actor Clerk as clerk
package "Guests" as guests
package "Reservations" as reservations
clerk --> guests
clerk --> reservations
reservations ..> guests : "reserves for guests"
@enduml
""",
    "use_cases/guests/use_cases.puml": """\
@startuml Guests
left to right direction
actor Clerk as clerk
rectangle "Guests" {
    usecase "UC-001\\nCreate Guest" as UC001
}
clerk --> UC001
@enduml
""",
    "use_cases/reservations/use_cases.puml": """\
@startuml Reservations
left to right direction
actor Clerk as clerk
rectangle "Reservations" {
    usecase "UC-002\\nReserve Room" as UC002
}
clerk --> UC002
@enduml
""",
    "use_cases/guests/UC-001-create-guest.md":
        CLEAN["use_cases/UC-001-create-guest.md"],
    "use_cases/reservations/UC-002-reserve-room.md":
        CLEAN["use_cases/UC-002-reserve-room.md"],
    "test_cases/TC-001-reserve-room.md": CLEAN[
        "test_cases/TC-001-reserve-room.md"].replace(
        "../use_cases/UC-001", "../use_cases/guests/UC-001").replace(
        "../use_cases/UC-002", "../use_cases/reservations/UC-002"),
    "entity_model.md": """\
# Entity Model

## Modules

| Module                                        | Description            | Entities | Depends on |
|-----------------------------------------------|------------------------|----------|------------|
| [Guests](entity_model/guests.md)              | The hotel's guests     | GUEST    | -          |
| [Reservations](entity_model/reservations.md)  | Rooms and reservations | ROOM     | Guests     |
""",
    "entity_model/guests.md": """\
# Entity Model: Guests

## Entity Relationship Diagram

```mermaid
erDiagram
    GUEST
```

### GUEST
""",
    "entity_model/reservations.md": """\
# Entity Model: Reservations

## Entity Relationship Diagram

```mermaid
erDiagram
    GUEST ||--o{ ROOM : "reserves"
```

From other modules: GUEST (Guests).

### ROOM
""",
})


def write_fixture(root, files):
    for rel, content in files.items():
        path = os.path.join(root, rel)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(content)


def self_test():
    failures = []
    validator = load_sibling("*use-case-spec/scripts/validate_use_case.py",
                             "validate_use_case")
    bpmn = load_sibling("*test-case/scripts/bpmn_paths.py", "bpmn_paths")
    if validator is None or bpmn is None:
        failures.append("sibling scripts validate_use_case.py and "
                        "bpmn_paths.py must be found in the repository")

    with tempfile.TemporaryDirectory() as root:
        write_fixture(root, CLEAN)
        found = [f for f in lint(root, validator, bpmn) if f.severity != INFO]
        for f in found:
            failures.append("clean: unexpected %s %s %s:%d %s" % (
                f.severity, f.code, os.path.relpath(f.path, root), f.line,
                f.message))

        matrix = trace(root)
        rows = {(r["requirement"], r["use_case"]): r
                for r in matrix["requirements"]}
        fr1 = rows.get(("FR-001", "UC-001"))
        if not fr1 or fr1["business_rules"] != ["BR-001"] \
                or fr1["test_cases"] != ["TC-001"]:
            failures.append("trace: FR-001 -> UC-001 BR-001 -> TC-001 "
                            "missing, got " + str(fr1))
        if ("FR-003", None) not in rows:
            failures.append("trace: unlinked FR-003 has no row")
        tc1 = matrix["test_cases"][0] if matrix["test_cases"] else {}
        if tc1.get("use_cases") != ["UC-001", "UC-002"] \
                or "BP-001 Hotel Stay" not in tc1.get("process", "") \
                or tc1.get("process_id") != "BP-001":
            failures.append("trace: TC-001 row wrong, got " + str(tc1))
        only = filter_trace(matrix, "UC-002")
        if [r["requirement"] for r in only["requirements"]] != ["FR-002"]:
            failures.append("trace: --only UC-002 kept "
                            + str(only["requirements"]))
        if [t["id"] for t in filter_trace(matrix, "BP-001")["test_cases"]] \
                != ["TC-001"]:
            failures.append("trace: --only BP-001 lost TC-001")
        page = render_report(matrix, lint(root, validator, bpmn), 0, root)
        for needle in ("<h2>Requirement Coverage</h2>", "<h2>Traceability</h2>",
                       "<h2>Findings</h2>", 'href="use_cases/UC-001-create-'
                       'guest.md">UC-001 Create Guest</a>',
                       'href="test_cases/TC-001-reserve-room.md"',
                       "FR-001</a> Create Guest"):
            if needle not in page:
                failures.append("report: clean page lacks " + needle)
        if "| FR-001" not in render_trace(matrix):
            failures.append("trace: rendered matrix lacks FR-001")
        if fr1 and (fr1["requirement_status"], fr1["derived_status"]) \
                != ("Open", "Open"):
            failures.append("trace: FR-001 status should be Open/Open, got "
                            + str(fr1))
        cov = matrix["coverage"]
        got = [(s["reached"], s["stopped"]) for s in cov["stages"]]
        if cov["active"] != 2 or cov["excluded"] != ["FR-003"] \
                or got != [(2, []), (2, []), (0, ["FR-001", "FR-002"])]:
            failures.append("coverage: clean fixture wrong, got " + str(cov))
        if "| Verified" not in render_trace(matrix):
            failures.append("coverage: rendered matrix lacks the stages")
        cov = filter_trace(matrix, "UC-002")["coverage"]
        if cov["active"] != 1 or cov["stages"][2]["stopped"] != ["FR-002"]:
            failures.append("coverage: --only UC-002 wrong, got " + str(cov))

    with tempfile.TemporaryDirectory() as root:
        write_fixture(root, {"use_cases.puml": ACTOR_DIAGRAM})
        actors, links, parents = read_diagram_actors(
            os.path.join(root, "use_cases.puml"))
        if links != ACTOR_LINKS:
            failures.append("actors: links wrong, got " + str(links))
        if parents != {"manager": {"front desk clerk"}}:
            failures.append("actors: generalization wrong, got "
                            + str(parents))
        if "commented" in actors:
            failures.append("actors: commented actor was read")
        write_fixture(root, {"use_cases/UC-002-reserve-room.md": spec_text(
            "UC-002", "Reserve Room").replace(
            "**Primary Actor:** Clerk", "**Primärer Akteur:** Manager\n"
            "**Sekundäre Akteure:** Payment Service (PSP)")})
        project = Project(root)
        check_actors(project, load_specs(project))
        if project.findings:
            failures.append("actors: German fields or the generalization "
                            "not matched, got " + str(
                                [f.message for f in project.findings]))

    with tempfile.TemporaryDirectory() as root:
        write_fixture(root, MODULAR)
        found = [f for f in lint(root, validator, bpmn) if f.severity != INFO]
        for f in found:
            failures.append("modular: unexpected %s %s %s:%d %s" % (
                f.severity, f.code, os.path.relpath(f.path, root), f.line,
                f.message))
        write_fixture(root, {
            "entity_model/reservations.md":
                MODULAR["entity_model/reservations.md"] + "\n### GUEST\n",
            "use_cases/reservations/use_cases.puml": MODULAR[
                "use_cases/reservations/use_cases.puml"].replace(
                "clerk --> UC002",
                "clerk --> UC002\nusecase \"UC-001\\nCreate Guest\" as UC001"),
            "use_cases/billing/use_cases.puml": "@startuml Billing\n@enduml\n"})
        os.rename(os.path.join(root, "use_cases/reservations/"
                               "UC-002-reserve-room.md"),
                  os.path.join(root, "use_cases/UC-002-reserve-room.md"))
        found = {(f.code, f.element) for f in lint(root, validator, bpmn)}
        for expected in (("DUPLICATE_ID", "GUEST"), ("DUPLICATE_ID", "UC-001"),
                         ("MODULE_UNKNOWN", "billing"),
                         ("MODULE_MISMATCH", "UC-002")):
            if expected not in found:
                failures.append("modular: expected %s %s, got %s"
                                % (expected + (sorted(found),)))

    def uc(status):
        spec = Spec.__new__(Spec)
        spec.id, spec.status = "UC-X", status
        return spec

    for statuses, expected in (
            (["Approved"], "Open"), (["Draft", "Implemented"], "In Progress"),
            (["Implemented", "Done"], "Implemented"),
            (["Tested", "Done", "Obsolete"], "Verified"),
            (["Getestet"], "Verified"), (["Obsolete"], None),
            (["Done", "Unknown"], None)):
        got = derived_status([uc(s) for s in statuses])
        if got != expected:
            failures.append("derived_status(%s): expected %s, got %s"
                            % (statuses, expected, got))

    with tempfile.TemporaryDirectory() as root:
        # An Avoid synonym equal to a priority or status value matches only prose
        values = dict(CLEAN)
        values["glossary.md"] = CLEAN["glossary.md"].replace(
            "| Customer, Client |", "| Customer, High, Rejected |")
        write_fixture(root, values)
        avoided = [f for f in lint(root, validator, bpmn)
                   if f.code == "GLOSSARY_AVOIDED_TERM"]
        if avoided:
            failures.append("values: GLOSSARY_AVOIDED_TERM on a priority or "
                            "status cell: " + avoided[0].message)

    with tempfile.TemporaryDirectory() as root:
        write_fixture(root, BROKEN)
        found = lint(root, validator, bpmn)
        codes = {f.code for f in found}
        for code in sorted(BROKEN_EXPECTED - codes):
            failures.append("broken: expected " + code + ", got "
                            + str(sorted(codes)))
        dangling = [f.message for f in found if f.code == "DANGLING_REF"]
        for needle in ("FR-009", "UC-001 BR-007", "UC-042", "UC-009",
                       "missing.bpmn"):
            if not any(needle in m for m in dangling):
                failures.append("broken: no DANGLING_REF for " + needle)
        uncovered = [f.element for f in found if f.code == "REQ_UNCOVERED"]
        if uncovered != ["NFR-001"] or any(
                f.code == "REQ_UNCOVERED" and f.severity != INFO
                for f in found):
            failures.append("broken: REQ_UNCOVERED should be INFO for "
                            "NFR-001 only, got " + str(uncovered))
        page = render_report(trace(root), found, 0, root)
        if "FR_UNCOVERED" not in page or "<b>Bold</b>" in page \
                or "&lt;b&gt;Bold&lt;/b&gt;" not in page:
            failures.append("report: broken page lacks findings or does not "
                            "escape the requirement title")
        cov = trace(root)["coverage"]
        got = [s["stopped"] for s in cov["stages"]]
        if got != [["FR-004", "NFR-001"], ["FR-002"], ["FR-001"]]:
            failures.append("coverage: broken fixture wrong, got " + str(got))
        unmapped = [f.path for f in found if f.code == "BPMN_UNMAPPED"]
        if any(p.endswith("BP-002-checkout.bpmn") for p in unmapped):
            failures.append("broken: UC-003 is in the diagram but its "
                            "activities were reported as BPMN_UNMAPPED")
        mismatched = sorted(f.message for f in found
                            if f.code == "ACTOR_MISMATCH")
        if len(mismatched) != 2 or "Receptionist' is no actor" \
                not in mismatched[0] or "actor 'Clerk' to UC-002" \
                not in mismatched[1]:
            failures.append("broken: ACTOR_MISMATCH wrong, got "
                            + str(mismatched))
        duplicates = [f.message for f in found if f.code == "DUPLICATE_ID"]
        if not any("business process id BP-001" in m for m in duplicates):
            failures.append("broken: no DUPLICATE_ID for BP-001")

        baseline = os.path.join(root, BASELINE_NAME)
        write_baseline(baseline, found, root)
        kept, suppressed = apply_baseline(found, read_baseline(baseline),
                                          root, True)
        if [f for f in kept if f.severity != INFO] or not suppressed:
            failures.append("baseline: findings not suppressed")
        write_fixture(root, {"use_cases/UC-005-stray.md":
                             spec_text("UC-003", "Cancel Room")})
        os.rename(os.path.join(root, "use_cases/UC-005-stray.md"),
                  os.path.join(root, "use_cases/UC-003-cancel-room.md"))
        kept, _ = apply_baseline(lint(root, validator, bpmn),
                                 read_baseline(baseline), root, True)
        if "BASELINE_STALE" not in {f.code for f in kept}:
            failures.append("baseline: fixed finding not reported as stale")

    if failures:
        for failure in failures:
            print("SELF-TEST FAIL: " + failure)
        return 1
    print("self-test passed")
    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def filter_findings(args, findings, baseline):
    """(findings, suppressed) after the baseline and --only, or None."""
    suppressed = 0
    if not args.no_baseline and os.path.isfile(baseline):
        findings, suppressed = apply_baseline(
            findings, read_baseline(baseline), args.docs, not args.only)
    elif args.baseline and not args.no_baseline:
        print("spec_lint.py: baseline not found: " + args.baseline,
              file=sys.stderr)
        return None
    if args.only:
        findings = [f for f in findings if matches_only(f, args.only)]
    return findings, suppressed


def main(argv):
    parser = argparse.ArgumentParser(
        description="Lint AI Unified Process specification artifacts "
                    "across files.")
    parser.add_argument("--docs", default="docs",
                        help="documentation folder (default: docs)")
    parser.add_argument("--strict", action="store_true",
                        help="treat warnings as failures")
    parser.add_argument("--format", choices=("text", "json"), default="text")
    parser.add_argument("--baseline",
                        help="baseline file (default: <docs>/"
                             + BASELINE_NAME + " when it exists)")
    parser.add_argument("--no-baseline", action="store_true",
                        help="ignore the baseline file")
    parser.add_argument("--update-baseline", action="store_true",
                        help="accept all current findings into the baseline")
    parser.add_argument("--only", metavar="ID",
                        help="report only findings about this UC-XXX, "
                             "TC-XXX, or BP-XXX")
    parser.add_argument("--trace", action="store_true",
                        help="print the requirement -> use case -> business "
                             "rule -> test case matrix instead of findings")
    parser.add_argument("--report", action="store_true",
                        help="print one HTML page with the findings, the "
                             "requirement coverage, and the trace matrix")
    parser.add_argument("--self-test", action="store_true",
                        help="run the built-in fixtures and exit")
    args = parser.parse_args(argv)

    if args.self_test:
        return self_test()
    if not os.path.isdir(args.docs):
        print("spec_lint.py: no such directory: " + args.docs,
              file=sys.stderr)
        return 2

    if args.trace:
        matrix = trace(args.docs)
        if args.only:
            matrix = filter_trace(matrix, args.only)
        if args.format == "json":
            print(json.dumps(matrix, indent=2, ensure_ascii=False))
        else:
            print(render_trace(matrix))
        return 0

    validator = load_sibling("*use-case-spec/scripts/validate_use_case.py",
                             "validate_use_case")
    bpmn = load_sibling("*test-case/scripts/bpmn_paths.py", "bpmn_paths")
    findings = lint(args.docs, validator, bpmn)

    baseline = args.baseline or os.path.join(args.docs, BASELINE_NAME)
    if args.update_baseline:
        count = write_baseline(baseline, findings, args.docs)
        print("baseline written: %d finding(s) accepted in %s"
              % (count, baseline))
        return 0

    filtered = filter_findings(args, findings, baseline)
    if filtered is None:
        return 2
    findings, suppressed = filtered
    if args.report:
        matrix = trace(args.docs)
        if args.only:
            matrix = filter_trace(matrix, args.only)
        print(render_report(matrix, findings, suppressed, args.docs))
        return 0

    counts = {sev: sum(1 for f in findings if f.severity == sev)
              for sev in (ERROR, WARN, INFO)}
    if args.format == "json":
        print(json.dumps({"findings": [f.as_dict() for f in findings],
                          "summary": {"errors": counts[ERROR],
                                      "warnings": counts[WARN],
                                      "infos": counts[INFO],
                                      "suppressed": suppressed}},
                         indent=2, ensure_ascii=False))
    else:
        for f in findings:
            element = " [" + f.element + "]" if f.element else ""
            print("%s:%d: %s %s%s: %s" % (f.path, f.line, f.severity, f.code,
                                          element, f.message))
        print("%d error(s), %d warning(s), %d info(s), %d suppressed by "
              "baseline" % (counts[ERROR], counts[WARN], counts[INFO],
                            suppressed))
    if counts[ERROR] or (args.strict and counts[WARN]):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
