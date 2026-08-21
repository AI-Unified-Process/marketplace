#!/usr/bin/env python3
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
"""Validate AI Unified Process use case specification documents.

Checks UC-*.md files against the normative format described in
references/format-spec.md. The grammar and every tolerance mirror the
Studio structured editor's parser (UseCaseSpecificationDocument.java),
which is the executable source of truth for what "parses":

- ERROR  = the Studio structured editor cannot read the document
           (it would open read-only in the plain markdown editor).
- WARN   = Studio tolerates it, but it violates the use-case-spec skill
           contract or is silently rewritten/flattened on save in Studio.

Exit code 0 when clean, 1 when any ERROR was found (with --strict also
when any WARN was found), 2 on usage errors.

Usage:
    validate_use_case.py [--strict] [--quiet] FILE...
    validate_use_case.py --self-test

Requires Python 3.9+, standard library only.
"""

import argparse
import os
import re
import sys

# ---------------------------------------------------------------------------
# Language definitions (UseCaseLanguage.java)
# ---------------------------------------------------------------------------

LANGUAGES = {
    "en": {
        "headings": {
            "overview": "## Overview",
            "preconditions": "## Preconditions",
            "main_scenario": "## Main Success Scenario",
            "alternative_flows": "## Alternative Flows",
            "postconditions": "## Postconditions",
            "success": "### Success Postconditions",
            "failure": "### Failure Postconditions",
            "business_rules": "## Business Rules",
        },
        "fields": {
            "id": "**Use Case ID:**",
            "name": "**Use Case Name:**",
            "actor": "**Primary Actor:**",
            "secondary_actors": "**Secondary Actors:**",
            "goal": "**Goal:**",
            "requirements": "**Requirements:**",
            "trigger": "**Trigger:**",
            "flow": "**Flow:**",
        },
        "trigger_aliases": ["**Trigger:**"],
        "rule_prefix": "BR",
    },
    "de": {
        "headings": {
            "overview": "## Übersicht",
            "preconditions": "## Vorbedingungen",
            "main_scenario": "## Hauptablauf",
            "alternative_flows": "## Alternativabläufe",
            "postconditions": "## Nachbedingungen",
            "success": "### Erfolgsfall",
            "failure": "### Fehlerfall",
            "business_rules": "## Geschäftsregeln",
        },
        "fields": {
            "id": "**Use-Case-ID:**",
            "name": "**Use-Case-Name:**",
            "actor": "**Primärer Akteur:**",
            "secondary_actors": "**Sekundäre Akteure:**",
            "goal": "**Ziel:**",
            "requirements": "**Anforderungen:**",
            "trigger": "**Auslöser:**",
            "flow": "**Ablauf:**",
        },
        # German documents in the wild often keep the English "Trigger" label
        "trigger_aliases": ["**Auslöser:**", "**Trigger:**"],
        "rule_prefix": "GR",
    },
}

TITLE_PREFIX = "# Use Case:"
STATUS_FIELD = "**Status:**"

# UseCaseStatus.java: English enum names and German values, matched
# case-insensitively after stripping non-letter decoration.
STATUS_VALUES = [
    "Draft", "Reviewed", "Approved", "Implemented", "Tested", "Done",
    "Obsolete",
    "Entwurf", "Geprüft", "Genehmigt", "Implementiert", "Getestet",
    "Abgeschlossen", "Obsolet",
]

NUMBERED_ITEM = re.compile(r"(\d+)\.\s+(.*)")
ID_TITLE = re.compile(r"#\s+[SB]?UC-[A-Za-z0-9_-]+\s*:.*")
FLOW_LABEL = re.compile(r"A\d+\s*:\s*(.*)")
# Hyphenated tails like BR-USER-050 are valid Navigator-style rule ids.
RULE_LABEL = re.compile(r"(?:BR|GR)-[A-Za-z0-9_-]+\s*:\s*.*")
RULE_NUMBER = re.compile(r"(?:BR|GR)-(\d+)\s*:")
PLACEHOLDER = re.compile(r"_[^_].*_|\*[^*].*\*")
UC_ID_GRAMMAR = re.compile(r"[SB]?UC-[A-Za-z0-9_-]+")

STEP_REFERENCE = re.compile(r"\((?:step|schritt)\s*\d", re.IGNORECASE)
FLOW_TERMINATION = re.compile(
    r"continues at step \d+|use case ends"
    r"|wird bei schritt \d+ fortgesetzt|use case endet",
    re.IGNORECASE,
)

# Implementation-level terms banned from scenario and flow steps by the
# use-case-spec skill ("Step writing guidelines").
TECHNICAL_TERMS = [
    (re.compile(r"\bSMTP\b", re.IGNORECASE), "SMTP"),
    (re.compile(r"\bemail server\b", re.IGNORECASE), "email server"),
    (re.compile(r"\bJWT\b", re.IGNORECASE), "JWT"),
    (re.compile(r"\bbcrypt\b", re.IGNORECASE), "bcrypt"),
    (re.compile(r"\bhash(?:es|ed|ing)?\b", re.IGNORECASE), "hash"),
    (re.compile(r"\bsalt(?:ed)?\b", re.IGNORECASE), "salt"),
    (re.compile(r"\btokens?\b", re.IGNORECASE), "token"),
    (re.compile(r"\bSHA-?\d*\b"), "SHA"),
    (re.compile(r"\bSQL\b"), "SQL"),
    (re.compile(r"\bSELECT\b"), "SELECT"),
    (re.compile(r"\bINSERT\b"), "INSERT"),
]

ERROR = "ERROR"
WARN = "WARN"


class Problem:
    def __init__(self, line, severity, code, message):
        self.line = line
        self.severity = severity
        self.code = code
        self.message = message


class Document:
    """The structured content collected while validating (for warn checks)."""

    def __init__(self):
        self.language = "en"
        self.overview = {}
        self.overview_seen = False
        self.sections_seen = set()
        self.preconditions = []
        self.main_scenario = []
        self.main_scenario_numbers = []
        self.main_scenario_placeholder = False
        self.flows = []  # dicts: heading, line, trigger, steps
        self.flows_placeholder = False
        self.success_post = []
        self.success_placeholder = False
        self.failure_post = []
        self.failure_placeholder = False
        self.rules = []  # dicts: heading, line
        self.problems = []

    def add(self, line, severity, code, message):
        self.problems.append(Problem(line, severity, code, message))


# ---------------------------------------------------------------------------
# Low-level helpers (mirroring UseCaseSpecificationDocument.java)
# ---------------------------------------------------------------------------

def detect_language(lines):
    scores = {"en": 0, "de": 0}
    for raw in lines:
        line = raw.strip()
        for key, lang in LANGUAGES.items():
            if line in lang["headings"].values():
                scores[key] += 1
                continue
            markers = list(lang["fields"].values())
            if any(line.startswith(field) for field in markers):
                scores[key] += 1
    return "de" if scores["de"] > scores["en"] else "en"


def parse_status(value):
    """UseCaseStatus.parse: decoration before/after the value is ignored."""
    start, end = 0, len(value)
    while start < end and not value[start].isalpha():
        start += 1
    while end > start and not value[end - 1].isalpha():
        end -= 1
    candidate = value[start:end]
    for status in STATUS_VALUES:
        if candidate.lower().startswith(status.lower()):
            if len(candidate) == len(status) or not candidate[len(status)].isalpha():
                return status
    return None


def skip_blank(lines, index):
    while index < len(lines) and not lines[index].strip():
        index += 1
    return index


def is_continuation(line):
    if not line.strip() or line.startswith("#") or line.startswith("**") \
            or line.startswith("- "):
        return False
    return not NUMBERED_ITEM.fullmatch(line.strip()) or line.startswith(" ")


def join_continuation(doc, lines, index, parts):
    """Joins wrapped lines into the current item; a joined line that itself
    looks like a nested list item is flattened by Studio on save (WARN)."""
    while index < len(lines) and is_continuation(lines[index]):
        stripped = lines[index].strip()
        if stripped.startswith(("- ", "* ")) or NUMBERED_ITEM.fullmatch(stripped):
            doc.add(index + 1, WARN, "SUBBULLET_FLATTENED",
                    "nested list item is joined into the line above when "
                    "Studio saves the document: " + stripped)
        parts.append(stripped)
        index += 1
    return index


def is_placeholder_start(line):
    return line.strip().startswith(("_", "*"))


def read_placeholder(doc, lines, index, placeholders):
    parts = [lines[index].strip()]
    nxt = join_continuation(doc, lines, index + 1, parts)
    text = " ".join(parts)
    if PLACEHOLDER.fullmatch(text):
        placeholders.append((index + 1, text))
    else:
        doc.add(index + 1, ERROR, "UNEXPECTED_CONTENT", text)
    return nxt


def flush_placeholders(doc, placeholders, section_empty):
    """An italic paragraph standing in for an empty section is data; next to
    real content it is unexpected."""
    for line, text in placeholders:
        if not section_empty:
            doc.add(line, ERROR, "UNEXPECTED_CONTENT", text)
    return bool(placeholders) and section_empty


# ---------------------------------------------------------------------------
# Section parsers
# ---------------------------------------------------------------------------

def parse_title(doc, lines):
    index = skip_blank(lines, 0)
    if index < len(lines) and (lines[index].startswith(TITLE_PREFIX)
                               or ID_TITLE.fullmatch(lines[index])):
        return index + 1
    found = lines[index] if index < len(lines) else ""
    doc.add(index + 1, ERROR, "TITLE_MISSING",
            "expected '# Use Case: <name>' (or '# UC-XXX: <name>') as the "
            "first line, found: " + (found or "<end of file>"))
    return index


def parse_overview(doc, lines, index):
    lang = LANGUAGES[doc.language]
    fields = lang["fields"]
    overview = doc.overview
    while index < len(lines) and not lines[index].startswith("## "):
        line = lines[index]
        if not line.strip():
            index += 1
        elif line.startswith(fields["id"]):
            overview["id"] = line[len(fields["id"]):].strip()
            index += 1
        elif line.startswith(fields["name"]):
            overview["name"] = line[len(fields["name"]):].strip()
            index += 1
        elif line.startswith(fields["actor"]):
            overview["actor"] = line[len(fields["actor"]):].strip()
            index += 1
        elif line.startswith(fields["secondary_actors"]):
            overview["secondary_actors"] = \
                line[len(fields["secondary_actors"]):].strip()
            index += 1
        elif line.startswith(fields["goal"]):
            parts = [line[len(fields["goal"]):].strip()]
            index = join_continuation(doc, lines, index + 1, parts)
            overview["goal"] = " ".join(parts)
        elif line.startswith(STATUS_FIELD):
            parts = [line[len(STATUS_FIELD):].strip()]
            status_line = index + 1
            index = join_continuation(doc, lines, index + 1, parts)
            overview["status"] = " ".join(parts)
            overview["status_line"] = status_line
        elif line.startswith(fields["requirements"]):
            overview["requirements"] = \
                line[len(fields["requirements"]):].strip()
            index += 1
        else:
            # unknown overview lines are kept verbatim by Studio (pass-through)
            index += 1
    for key in ("id", "name", "actor", "goal", "status"):
        if key not in overview:
            label = STATUS_FIELD if key == "status" else fields[key]
            doc.add(0, ERROR, "FIELD_MISSING",
                    "mandatory overview field missing: " + label)
    return index


def parse_items(doc, lines, index, items):
    """A bullet list ('- '); returns (index, placeholder_present)."""
    placeholders = []
    while index < len(lines) and not lines[index].startswith("#"):
        line = lines[index]
        if not line.strip():
            index += 1
        elif line.startswith("- "):
            parts = [line[2:].strip()]
            index = join_continuation(doc, lines, index + 1, parts)
            items.append(" ".join(parts))
        elif is_placeholder_start(line):
            index = read_placeholder(doc, lines, index, placeholders)
        else:
            doc.add(index + 1, ERROR, "UNEXPECTED_CONTENT", line.strip())
            index += 1
    return index, flush_placeholders(doc, placeholders, not items)


def parse_numbered_items(doc, lines, index, items, numbers):
    placeholders = []
    while index < len(lines) and not lines[index].startswith("#"):
        line = lines[index]
        if not line.strip():
            index += 1
            continue
        match = NUMBERED_ITEM.fullmatch(line.strip())
        if match and not line.startswith(" "):
            numbers.append(int(match.group(1)))
            item_line = index + 1
            parts = [match.group(2).strip()]
            index = join_continuation(doc, lines, index + 1, parts)
            items.append((item_line, " ".join(parts)))
        elif is_placeholder_start(line):
            index = read_placeholder(doc, lines, index, placeholders)
        else:
            doc.add(index + 1, ERROR, "UNEXPECTED_CONTENT", line.strip())
            index += 1
    return index, flush_placeholders(doc, placeholders, not items)


def is_note_start(doc, line):
    lang = LANGUAGES[doc.language]
    stripped = line.strip()
    if stripped == lang["fields"]["flow"] \
            or any(stripped.startswith(a) for a in lang["trigger_aliases"]):
        return False
    return stripped.startswith(("**", "_", "*", ">"))


def read_flow_notes(doc, lines, index):
    index = skip_blank(lines, index)
    while index < len(lines) and not lines[index].startswith("#") \
            and is_note_start(doc, lines[index]) \
            and not NUMBERED_ITEM.fullmatch(lines[index].strip()):
        if lines[index].startswith(">"):
            while index < len(lines) and lines[index].startswith(">"):
                index += 1
        else:
            parts = [lines[index].strip()]
            index = join_continuation(doc, lines, index + 1, parts)
        index = skip_blank(lines, index)
    return index


def parse_flow(doc, lines, index):
    lang = LANGUAGES[doc.language]
    line = lines[index]
    if not line.strip():
        return index + 1
    if not line.startswith("### "):
        doc.add(index + 1, ERROR, "UNEXPECTED_CONTENT", line.strip())
        return index + 1
    heading_line = index + 1
    heading = line[4:].strip()
    index = read_flow_notes(doc, lines, index + 1)

    trigger = None
    if index < len(lines):
        alias = next((a for a in lang["trigger_aliases"]
                      if lines[index].startswith(a)), None)
        if alias:
            parts = [lines[index][len(alias):].strip()]
            index = join_continuation(doc, lines, index + 1, parts)
            trigger = " ".join(parts)
    index = read_flow_notes(doc, lines, index)
    flow_field_seen = False
    if index < len(lines) and lines[index].strip() == lang["fields"]["flow"]:
        flow_field_seen = True
        index += 1

    steps = []
    while index < len(lines) and not lines[index].startswith("#"):
        body = lines[index]
        if not body.strip():
            index += 1
            continue
        match = NUMBERED_ITEM.fullmatch(body.strip())
        if match and not body.startswith(" "):
            step_line = index + 1
            parts = [match.group(2).strip()]
            index = join_continuation(doc, lines, index + 1, parts)
            steps.append((step_line, " ".join(parts)))
        elif is_note_start(doc, body):
            index = read_flow_notes(doc, lines, index)
        else:
            doc.add(index + 1, ERROR, "UNEXPECTED_CONTENT", body.strip())
            index += 1

    if trigger is None or not flow_field_seen or not steps:
        missing = [name for present, name in [
            (trigger is not None, "trigger line (" + lang["fields"]["trigger"] + ")"),
            (flow_field_seen, "flow field line (" + lang["fields"]["flow"] + ")"),
            (bool(steps), "numbered steps"),
        ] if not present]
        doc.add(heading_line, ERROR, "FLOW_INCOMPLETE",
                "alternative flow '" + heading + "' is missing: "
                + ", ".join(missing))
    else:
        doc.flows.append({"heading": heading, "line": heading_line,
                          "trigger": trigger, "steps": steps})
    return index


def parse_alternative_flows(doc, lines, index):
    placeholders = []
    while index < len(lines) and not lines[index].startswith("## "):
        line = lines[index]
        if line.strip() and is_placeholder_start(line):
            index = read_placeholder(doc, lines, index, placeholders)
        else:
            index = parse_flow(doc, lines, index)
    doc.flows_placeholder = flush_placeholders(doc, placeholders,
                                               not doc.flows)
    return index


def parse_postconditions(doc, lines, index):
    lang = LANGUAGES[doc.language]
    placeholders = []
    while index < len(lines) and not lines[index].startswith("## "):
        line = lines[index]
        if not line.strip():
            index += 1
        elif line.strip() == lang["headings"]["success"]:
            doc.sections_seen.add("success")
            index, doc.success_placeholder = \
                parse_items(doc, lines, index + 1, doc.success_post)
        elif line.strip() == lang["headings"]["failure"]:
            doc.sections_seen.add("failure")
            index, doc.failure_placeholder = \
                parse_items(doc, lines, index + 1, doc.failure_post)
        elif is_placeholder_start(line):
            index = read_placeholder(doc, lines, index, placeholders)
        else:
            doc.add(index + 1, ERROR, "UNEXPECTED_CONTENT", line.strip())
            index += 1
    flush_placeholders(doc, placeholders,
                       not doc.success_post and not doc.failure_post)
    return index


def parse_rule(doc, lines, index):
    line = lines[index]
    if not line.strip():
        return index + 1
    if not line.startswith("### "):
        doc.add(index + 1, ERROR, "UNEXPECTED_CONTENT", line.strip())
        return index + 1
    doc.rules.append({"heading": line[4:].strip(), "line": index + 1})
    index += 1
    while index < len(lines) and not lines[index].startswith("### ") \
            and not lines[index].startswith("## "):
        index += 1
    return index


def parse_business_rules(doc, lines, index):
    placeholders = []
    while index < len(lines) and not lines[index].startswith("## "):
        line = lines[index]
        if line.strip() and is_placeholder_start(line):
            index = read_placeholder(doc, lines, index, placeholders)
        else:
            index = parse_rule(doc, lines, index)
    flush_placeholders(doc, placeholders, not doc.rules)
    return index


def parse_extra_section(lines, index):
    """A section outside the template: kept verbatim by Studio."""
    index += 1
    while index < len(lines) and not lines[index].startswith("## "):
        index += 1
    return index


# ---------------------------------------------------------------------------
# Document validation
# ---------------------------------------------------------------------------

def parse_document(text):
    doc = Document()
    lines = [line.rstrip() for line in text.splitlines()]
    doc.language = detect_language(lines)
    lang = LANGUAGES[doc.language]
    headings = lang["headings"]
    index = parse_title(doc, lines)
    while index < len(lines):
        line = lines[index]
        if not line.strip():
            index += 1
        elif line == headings["overview"]:
            doc.overview_seen = True
            doc.sections_seen.add("overview")
            index = parse_overview(doc, lines, index + 1)
        elif line == headings["preconditions"]:
            doc.sections_seen.add("preconditions")
            index, _ = parse_items(doc, lines, index + 1, doc.preconditions)
        elif line == headings["main_scenario"]:
            doc.sections_seen.add("main_scenario")
            index, doc.main_scenario_placeholder = parse_numbered_items(
                doc, lines, index + 1, doc.main_scenario,
                doc.main_scenario_numbers)
        elif line == headings["alternative_flows"]:
            doc.sections_seen.add("alternative_flows")
            index = parse_alternative_flows(doc, lines, index + 1)
        elif line == headings["postconditions"]:
            doc.sections_seen.add("postconditions")
            index = parse_postconditions(doc, lines, index + 1)
        elif line == headings["business_rules"]:
            doc.sections_seen.add("business_rules")
            index = parse_business_rules(doc, lines, index + 1)
        elif line.startswith("#"):
            index = parse_extra_section(lines, index)
        else:
            doc.add(index + 1, ERROR, "UNEXPECTED_CONTENT", line.strip())
            index += 1

    if not doc.overview_seen:
        doc.add(0, ERROR, "OVERVIEW_MISSING",
                "section missing: " + headings["overview"])
    status = doc.overview.get("status")
    if doc.overview_seen and status is not None and parse_status(status) is None:
        doc.add(doc.overview.get("status_line", 0), ERROR, "STATUS_INVALID",
                "not a recognizable status value: " + status)
    return doc


def check_contract(doc, path):
    """Skill-contract checks beyond what Studio's parser enforces (WARN)."""
    lang = LANGUAGES[doc.language]
    headings = lang["headings"]

    for key in ("preconditions", "main_scenario", "alternative_flows",
                "postconditions", "business_rules"):
        if key not in doc.sections_seen:
            doc.add(0, WARN, "SECTION_MISSING",
                    "template section missing: " + headings[key])
    if "postconditions" in doc.sections_seen:
        for key in ("success", "failure"):
            if key not in doc.sections_seen:
                doc.add(0, WARN, "SECTION_MISSING",
                        "postconditions subsection missing: " + headings[key])

    uc_id = doc.overview.get("id")
    if uc_id and not UC_ID_GRAMMAR.fullmatch(uc_id):
        doc.add(0, WARN, "ID_GRAMMAR",
                "use case id does not match [SB]?UC-[A-Za-z0-9_-]+: " + uc_id)
    basename = os.path.basename(path)
    if uc_id and re.match(r"[SB]?UC", basename) \
            and not basename.startswith(uc_id):
        doc.add(0, WARN, "ID_FILENAME_MISMATCH",
                "filename does not start with the use case id " + uc_id)

    if not doc.main_scenario and not doc.main_scenario_placeholder \
            and "main_scenario" in doc.sections_seen:
        doc.add(0, WARN, "MAIN_SCENARIO_EMPTY",
                "the main success scenario has no steps")
    if doc.main_scenario_numbers != list(
            range(1, len(doc.main_scenario_numbers) + 1)):
        doc.add(0, WARN, "NUMBERING",
                "main scenario step numbers are not 1..n without gaps "
                "(Studio renumbers them on save)")

    if not doc.flows and not doc.flows_placeholder \
            and "alternative_flows" in doc.sections_seen:
        doc.add(0, WARN, "NO_ALTERNATIVE_FLOWS",
                "no alternative flow is defined; most use cases have at "
                "least one error or exception path")
    for flow in doc.flows:
        if not STEP_REFERENCE.search(flow["trigger"]):
            doc.add(flow["line"], WARN, "TRIGGER_STEP_REF",
                    "trigger of '" + flow["heading"] + "' does not reference "
                    "a main-scenario step as '(step N)'")
        if flow["steps"] and not FLOW_TERMINATION.search(flow["steps"][-1][1]):
            doc.add(flow["line"], WARN, "FLOW_TERMINATION",
                    "'" + flow["heading"] + "' does not end with 'Use case "
                    "continues at step N.' or 'Use case ends.'")

    if "success" in doc.sections_seen and not doc.success_post \
            and not doc.success_placeholder:
        doc.add(0, WARN, "POSTCONDITIONS_EMPTY",
                "success postconditions are empty")
    if "failure" in doc.sections_seen and not doc.failure_post \
            and not doc.failure_placeholder:
        doc.add(0, WARN, "POSTCONDITIONS_EMPTY",
                "failure postconditions are empty")

    prefix = lang["rule_prefix"]
    for rule in doc.rules:
        if not RULE_LABEL.fullmatch(rule["heading"]):
            doc.add(rule["line"], WARN, "RULE_LABEL_MISSING",
                    "business rule heading has no " + prefix + "-XXX label: "
                    + rule["heading"])
    # Rule ids are scoped to their use case: every document numbers its rules
    # from BR-001 without gaps (Studio renumbers them so on save). Checked only
    # when every label is plainly numeric — Navigator-style ids (BR-USER-050)
    # follow their own scheme.
    numbers = [RULE_NUMBER.match(rule["heading"]) for rule in doc.rules]
    if numbers and all(numbers):
        values = [int(match.group(1)) for match in numbers]
        if values != list(range(1, len(values) + 1)):
            doc.add(doc.rules[0]["line"], WARN, "RULE_NUMBERING",
                    "business rule ids are not " + prefix + "-001.."
                    + prefix + ("-%03d" % len(values)) + " without gaps "
                    "(ids restart per document; Studio renumbers on save)")

    steps = doc.main_scenario + [s for f in doc.flows for s in f["steps"]]
    for step_line, step in steps:
        for pattern, term in TECHNICAL_TERMS:
            if pattern.search(step):
                doc.add(step_line, WARN, "TECHNICAL_TERM",
                        "implementation-level term '" + term + "' in step: "
                        + step)


def validate_file(path):
    with open(path, encoding="utf-8") as handle:
        text = handle.read()
    doc = parse_document(text)
    check_contract(doc, path)
    return doc.problems


# ---------------------------------------------------------------------------
# Self test
# ---------------------------------------------------------------------------

VALID_EN = """\
# Use Case: Create Reservation

## Overview

**Use Case ID:** UC-001
**Use Case Name:** Create Reservation
**Primary Actor:** Clerk
**Goal:** Create a reservation for a guest
**Status:** Approved

**Requirements:** [FR-001, FR-002](../requirements.md)

## Preconditions

- Clerk is logged into the system

## Main Success Scenario

1. Clerk selects "New Reservation".
2. System displays the reservation form.
3. Clerk confirms the reservation.
4. System creates the reservation and displays a confirmation number.

## Alternative Flows

### A1: Guest Already Exists

**Trigger:** Guest email matches existing record (step 2)
**Flow:**

1. System displays existing guest information.
2. Use case continues at step 3.

## Postconditions

### Success Postconditions

- Reservation is stored

### Failure Postconditions

- No reservation is created

## Business Rules

### BR-001: Minimum Stay

Reservations must be for at least one night.
"""

VALID_DE_TOLERANT = """\
# UC-013a: Mitteilung erfassen

## Übersicht

**Use-Case-ID:** UC-013a
**Use-Case-Name:** Mitteilung erfassen
**Primärer Akteur:** SachbearbeiterIn
**Sekundäre Akteure:** TeamleiterIn
**Ziel:** Eine Mitteilung erfassen und dem Team zustellen
**Status:** ✅ Implementiert (2025-07-11)

**Priorität:** Hoch

## Vorbedingungen

- Der Benutzer ist eingeloggt

## Suchkriterien

Die Suche akzeptiert Name und Nummer.

## Hauptablauf

1. Der Benutzer öffnet die Erfassung.
2. Das System speichert die Mitteilung.

## Alternativabläufe

### A1: Pflichtfeld fehlt

**Trigger:** Ein Pflichtfeld ist leer (Schritt 1)

> Hinweis: Die Feldliste ist konfigurierbar.

**Ablauf:**

1. Das System zeigt eine Fehlermeldung.
2. Der Use Case wird bei Schritt 1 fortgesetzt.

## Nachbedingungen

### Erfolgsfall

- Die Mitteilung ist gespeichert

### Fehlerfall

_Keine — die Erfassung ist wiederholbar._

## Geschäftsregeln

### GR-001: Zustellung

Mitteilungen werden nur dem eigenen Team zugestellt.
"""

INVALID = """\
# Use Case: Broken

## Overview

**Use Case ID:** UC-002
**Use Case Name:** Broken
**Primary Actor:** User
**Goal:** Show every error class
**Status:** In Progress

## Preconditions

The user is logged in.

## Main Success Scenario

1. User does something.

## Alternative Flows

### A1: No Trigger

**Flow:**

1. System shows an error.

## Postconditions

### Success Postconditions

- Something happened

### Failure Postconditions

- Nothing happened

## Business Rules
"""


def self_test():
    failures = []

    def expect(name, problems, expected_codes, forbidden_severity=None):
        codes = {p.code for p in problems}
        for code in expected_codes:
            if code not in codes:
                failures.append(name + ": expected " + code + ", got "
                                + str(sorted(codes)))
        if forbidden_severity:
            bad = [p for p in problems if p.severity == forbidden_severity]
            for p in bad:
                failures.append(name + ": unexpected " + p.severity + " "
                                + p.code + ": " + p.message)

    doc = parse_document(VALID_EN)
    check_contract(doc, "UC-001-create-reservation.md")
    expect("valid-en", doc.problems, [], forbidden_severity=ERROR)
    expect("valid-en", doc.problems, [], forbidden_severity=WARN)

    doc = parse_document(VALID_DE_TOLERANT)
    check_contract(doc, "UC-013a-mitteilung-erfassen.md")
    if doc.language != "de":
        failures.append("valid-de: language not detected as German")
    expect("valid-de", doc.problems, [], forbidden_severity=ERROR)
    expect("valid-de", doc.problems, [], forbidden_severity=WARN)

    doc = parse_document(INVALID)
    check_contract(doc, "UC-002-broken.md")
    expect("invalid", doc.problems,
           ["STATUS_INVALID", "UNEXPECTED_CONTENT", "FLOW_INCOMPLETE"])

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
        description="Validate AI Unified Process use case specifications.")
    parser.add_argument("files", nargs="*", help="UC-*.md files to validate")
    parser.add_argument("--strict", action="store_true",
                        help="treat warnings as failures")
    parser.add_argument("--quiet", action="store_true",
                        help="print problems only, no summary")
    parser.add_argument("--self-test", action="store_true",
                        help="run the built-in fixtures and exit")
    args = parser.parse_args(argv)

    if args.self_test:
        return self_test()
    if not args.files:
        parser.print_usage()
        return 2

    errors = warnings = 0
    for path in args.files:
        try:
            problems = validate_file(path)
        except OSError as exc:
            print(path + ": ERROR IO: " + str(exc))
            errors += 1
            continue
        for problem in sorted(problems, key=lambda p: p.line):
            print("%s:%d: %s %s: %s" % (path, problem.line, problem.severity,
                                        problem.code, problem.message))
            if problem.severity == ERROR:
                errors += 1
            else:
                warnings += 1
    if not args.quiet:
        print("%d file(s) checked: %d error(s), %d warning(s)"
              % (len(args.files), errors, warnings))
    if errors or (args.strict and warnings):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
