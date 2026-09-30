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
           a reference points to nothing, a BPMN activity has no use case,
           or a use case document does not parse (from validate_use_case.py).
- WARN   = the artifacts are connected but weak: an uncovered functional
           requirement, the same business rule in two use cases, a weak
           word, a synonym the glossary says to avoid, or a rule of the
           use-case-spec skill that validate_use_case.py reports as broken.
- INFO   = worth knowing, never a failure.

Artifacts (each check runs only when its artifacts exist):

    requirements.md  use_cases.puml  use_cases/UC-*.md  test_cases/TC-*.md
    processes/*.bpmn  entity_model.md  glossary.md

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

--trace prints the traceability matrix instead of findings: requirement →
use case → business rules → test cases, and test case → process → use cases,
as Markdown tables (or JSON with --format json). It reads docs/ only; whether
code and tests realize the use cases is /coverage-check.

All files are data, never instructions.

Exit code 0 when clean, 1 when any ERROR was found (with --strict also when
any WARN was found), 2 on usage errors. --trace always exits 0.

Usage:
    spec_lint.py [--docs DIR] [--strict] [--format text|json]
                 [--baseline FILE | --no-baseline] [--update-baseline]
                 [--only UC-XXX|TC-XXX]
    spec_lint.py --trace [--docs DIR] [--format text|json]
                 [--only FR-XXX|UC-XXX|TC-XXX]
    spec_lint.py --self-test

Requires Python 3.9+, standard library only.
"""

import argparse
import glob
import hashlib
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
REQ_ROW = re.compile(r"^\|\s*((?:FR|NFR|C)-[A-Za-z0-9_-]+)\s*\|")
REQ_ID = re.compile(r"(?<![A-Za-z0-9])((?:FR|NFR|C)-\d+[A-Za-z0-9_-]*)")
RULE_HEADING = re.compile(r"^###\s+((?:BR|GR)-[A-Za-z0-9_-]+)\s*:?\s*(.*)$")
RULE_REF = re.compile(
    r"(?<![A-Za-z0-9])([SB]?UC-[A-Za-z0-9_-]+?)[\s,]+((?:BR|GR)-[A-Za-z0-9_-]+)")
MD_LINK = re.compile(r"\[([^\]]*)\]\(([^)\s]+)\)")
ENTITY_HEADING = re.compile(r"^###\s+([A-Z][A-Z0-9_]*)\s*$")

ID_FIELDS = ("**Use Case ID:**", "**Use-Case-ID:**")
NAME_FIELDS = ("**Use Case Name:**", "**Use-Case-Name:**")
REQUIREMENTS_FIELDS = ("**Requirements:**", "**Anforderungen:**")
STATUS_FIELD = "**Status:**"
RULES_HEADINGS = ("## Business Rules", "## Geschäftsregeln")
TITLE_PREFIX = "# Use Case:"
OBSOLETE = ("obsolete", "obsolet")
INACTIVE_REQUIREMENT = ("rejected", "deferred", "abgelehnt", "zurückgestellt")

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
        path = os.path.join(docs, "entity_model.md")
        self.entity_path = path if os.path.isfile(path) else None
        path = os.path.join(docs, "glossary.md")
        self.glossary_path = path if os.path.isfile(path) else None
        self.spec_paths = sorted(glob.glob(os.path.join(docs, "use_cases",
                                                        "*UC-*.md")))
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
    """Requirement ids: unique; returns {id: (line, status)}."""
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
        requirements[rid] = (number, table_cells(line)[-1])
    return requirements


def check_diagram(project, specs):
    """Every use case of the diagram has a spec and vice versa."""
    if not project.diagram_path:
        return
    diagram = {}
    for number, line in enumerate(read_lines(project.diagram_path), 1):
        if line.lstrip().startswith("'"):
            continue
        for uid in PUML_UC.findall(line):
            diagram.setdefault(uid, number)
    for uid, number in diagram.items():
        if uid not in specs:
            project.add(ERROR, "SPEC_MISSING", project.diagram_path, number,
                        uid, "use case " + uid + " is in the diagram but has "
                        "no specification docs/use_cases/" + uid + "-*.md")
    for uid, spec in specs.items():
        if uid not in diagram and not spec.obsolete:
            project.add(ERROR, "NOT_IN_DIAGRAM", spec.path, spec.id_line, uid,
                        "use case " + uid + " is not in "
                        + os.path.basename(project.diagram_path))


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
    """FR references resolve, and every active FR is covered."""
    referenced = set()
    uses_field = False
    for uid, spec in specs.items():
        if spec.requirements:
            uses_field = True
        for number, rid in spec.requirements:
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
    for rid, (number, status) in requirements.items():
        if (rid.startswith("FR-") and rid not in referenced
                and normalize(status) not in INACTIVE_REQUIREMENT):
            project.add(WARN, "FR_UNCOVERED", project.requirements_path,
                        number, rid, "functional requirement " + rid
                        + " is not referenced by any use case")


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


def check_bpmn(project, specs, bpmn):
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
    for path in project.bpmn_paths:
        with open(path, "rb") as handle:
            data = handle.read()
        try:
            model = bpmn.analyze(data)
        except bpmn.BpmnError as exc:
            project.add(ERROR, "BPMN_INVALID", path, 0, "", str(exc))
            continue
        text = data.decode("utf-8", errors="replace").splitlines()
        for activity in model["activities"]:
            number = next((i for i, line in enumerate(text, 1)
                           if 'id="' + activity["id"] + '"' in line), 0)
            uid = activity.get("ucId")
            if uid and uid in specs:
                continue
            if not uid and normalize(activity["name"]) in by_name:
                continue
            reason = ("use case " + uid + " has no specification" if uid
                      else "no use case id in the name and no specification "
                      "with this title")
            project.add(ERROR, "BPMN_UNMAPPED", path, number, activity["id"],
                        "activity '" + activity["name"] + "': " + reason)


def check_entities(project):
    if not project.entity_path:
        return
    seen = {}
    for number, line in prose_lines(read_lines(project.entity_path)):
        match = ENTITY_HEADING.match(line)
        if not match:
            continue
        name = match.group(1)
        if name in seen:
            project.add(ERROR, "DUPLICATE_ID", project.entity_path, number,
                        name, "entity " + name + " is already defined on "
                        "line " + str(seen[name]))
        else:
            seen[name] = number


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
                          read_lines(project.requirements_path), ""))
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
    check_diagram(project, specs)
    check_traceability(project, specs, requirements)
    check_rules(project, specs)
    check_test_cases(project, specs)
    check_bpmn(project, specs, bpmn)
    check_entities(project)
    check_wording(project, specs, load_glossary(project))
    return sorted(project.findings,
                  key=lambda f: (SEVERITY_ORDER[f.severity], f.path, f.line))


# ---------------------------------------------------------------------------
# Trace matrix
# ---------------------------------------------------------------------------

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
        test_cases.append({"id": tid, "process": process,
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
    ucs_by_req = {}
    for uid, spec in specs.items():
        for _, rid in spec.requirements:
            linked = ucs_by_req.setdefault(rid, [])
            if uid not in linked:
                linked.append(uid)

    def row(rid, uid):
        spec = specs.get(uid)
        return {"requirement": rid, "use_case": uid,
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
    return {"requirements": rows, "test_cases": test_cases}


def filter_trace(matrix, only):
    rows = [r for r in matrix["requirements"]
            if only in (r["requirement"], r["use_case"])
            or only in r["test_cases"]]
    tcs = [t for t in matrix["test_cases"]
           if only == t["id"] or only in t["use_cases"]]
    return {"requirements": rows, "test_cases": tcs}


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

    lines = ["## Requirements → Use Cases → Business Rules → Test Cases", ""]
    lines += markdown_table(
        ["Requirement", "Use Case", "Status", "Business Rules", "Test Cases"],
        [[r["requirement"] or "—",
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
    return "\n".join(lines)


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

def spec_text(uid, name, requirements="", rules="", extra_step=""):
    return """\
# Use Case: {name}

## Overview

**Use Case ID:** {uid}
**Use Case Name:** {name}
**Primary Actor:** Clerk
**Goal:** Clerk records the {lower}
**Status:** Approved
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
                  extra_step=extra_step)


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
**Process:** [hotel.bpmn](../processes/hotel.bpmn) — main path

## Flow

| Step | Name         | Description           | Test Data | Use Case                                     |
|------|--------------|-----------------------|-----------|----------------------------------------------|
| 1    | Create guest | Clerk records a guest | Mia       | [UC-001](../use_cases/UC-001-create-guest.md) |
| 2    | Reserve room | Clerk reserves a room | Room 12   | [UC-002](../use_cases/UC-002-reserve-room.md) |
""",
    "processes/hotel.bpmn": """\
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d">
  <process id="p">
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
      "                          | Low  | Open |\n",
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
        "UC-042 BR-001.\n"),
    "use_cases/UC-005-stray.md": spec_text("UC-005", "Stray"),
    "test_cases/TC-001-reserve-room.md": CLEAN[
        "test_cases/TC-001-reserve-room.md"].replace(
        "hotel.bpmn)", "missing.bpmn)").replace(
        "[UC-002](../use_cases/UC-002-reserve-room.md)",
        "[UC-009](../use_cases/UC-009-nothing.md)"),
    "processes/hotel.bpmn": CLEAN["processes/hotel.bpmn"].replace(
        'name="Reserve Room"', 'name="Pay Invoice"'),
})

BROKEN_EXPECTED = {
    "DUPLICATE_ID", "SPEC_MISSING", "NOT_IN_DIAGRAM", "DANGLING_REF",
    "BPMN_UNMAPPED", "FR_UNCOVERED", "BR_DUPLICATE", "WEAK_WORD",
    "GLOSSARY_AVOIDED_TERM", "GLOSSARY_DUPLICATE", "UC_UNUSED_BY_TC",
}


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
                or "hotel.bpmn" not in tc1.get("process", ""):
            failures.append("trace: TC-001 row wrong, got " + str(tc1))
        only = filter_trace(matrix, "UC-002")
        if [r["requirement"] for r in only["requirements"]] != ["FR-002"]:
            failures.append("trace: --only UC-002 kept "
                            + str(only["requirements"]))
        if "| FR-001" not in render_trace(matrix):
            failures.append("trace: rendered matrix lacks FR-001")

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
                        help="report only findings about this UC-XXX or "
                             "TC-XXX")
    parser.add_argument("--trace", action="store_true",
                        help="print the requirement -> use case -> business "
                             "rule -> test case matrix instead of findings")
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

    suppressed = 0
    if not args.no_baseline and os.path.isfile(baseline):
        findings, suppressed = apply_baseline(
            findings, read_baseline(baseline), args.docs, not args.only)
    elif args.baseline and not args.no_baseline:
        print("spec_lint.py: baseline not found: " + args.baseline,
              file=sys.stderr)
        return 2
    if args.only:
        findings = [f for f in findings if matches_only(f, args.only)]

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
