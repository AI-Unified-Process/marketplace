<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Lint Codes

`scripts/spec_lint.py` prints one line per finding:

```text
docs/use_cases/UC-004-book-room.md:12: ERROR DANGLING_REF [UC-004]: requirement FR-019 is not in requirements.md
```

The format is `path:line: SEVERITY CODE [element]: message`. Line `0` means the finding concerns the whole file.
The exit code is 0 when the run is clean, 1 on any `ERROR` (with `--strict`, also on any `WARN`), and 2 on usage
errors.

## Cross-file codes

| Severity | Code                    | Meaning                                                                                        | Fix with            |
|----------|-------------------------|------------------------------------------------------------------------------------------------|---------------------|
| ERROR    | `SPEC_MISSING`          | A use case in `use_cases.puml` has no `use_cases/UC-XXX-*.md`                                  | `/use-case-spec`    |
| ERROR    | `NOT_IN_DIAGRAM`        | A specification (not `Obsolete`) whose use case is not in `use_cases.puml`                    | `/use-case-diagram` |
| ERROR    | `DUPLICATE_ID`          | A UC, TC, FR, NFR, or C id, or an entity heading, is used twice                                | the owning skill    |
| ERROR    | `DANGLING_REF`          | An FR, NFR, or C id in `**Requirements:**`, a `UC-xxx BR-yyy` citation, a UC link in a test case, or a `**Process:**` link points to nothing | the owning skill |
| ERROR    | `BPMN_UNMAPPED`         | A BPMN activity whose name carries no known use case id and matches no use case title         | `/use-case-spec`    |
| ERROR    | `BPMN_INVALID`          | A `.bpmn` file that cannot be parsed                                                          | the modeling tool   |
| WARN     | `FR_UNCOVERED`          | An FR (not `Rejected` or `Deferred`) that no use case lists in `**Requirements:**`             | `/use-case-spec`    |
| WARN     | `REQ_STATUS_DRIFT`      | A requirement's progress status (Open, In Progress, Implemented, Verified) differs from the one the `**Status:**` of its linking use cases gives it | `/requirements` |
| WARN     | `BR_DUPLICATE`          | Two use cases carry the same rule text; keep it in one and cite it as `UC-xxx BR-yyy`          | `/use-case-spec`    |
| WARN     | `WEAK_WORD`             | A vague or optional word ("fast", "appropriate", "etc.", "and/or", "should", "ggf.", …)        | the owning skill    |
| WARN     | `GLOSSARY_AVOIDED_TERM` | A synonym that `glossary.md` lists in its Avoid column                                         | the owning skill    |
| WARN     | `GLOSSARY_DUPLICATE`    | A term defined twice in `glossary.md`                                                          | `/requirements`     |
| INFO     | `NO_TRACEABILITY`       | No use case has a `**Requirements:**` field, so FR coverage is not checked                     | `/use-case-spec`    |
| INFO     | `UC_UNUSED_BY_TC`       | Test cases exist, but none of them includes this use case                                     | `/test-case`        |
| INFO     | `BASELINE_STALE`        | A baseline entry that no longer matches any finding; refresh with `--update-baseline`          | —                   |
| INFO     | `VALIDATOR_MISSING`, `BPMN_PARSER_MISSING` | A sibling skill is not installed, so its checks were skipped                | install `aiup-core` |

## Per-file codes

`spec_lint.py` runs `validate_use_case.py` from the `use-case-spec` skill over every use case and passes its findings
through unchanged: `ERROR` means the document does not parse (`TITLE_MISSING`, `OVERVIEW_MISSING`, `FIELD_MISSING`,
`STATUS_INVALID`, `FLOW_INCOMPLETE`, `UNEXPECTED_CONTENT`), and `WARN` means a rule of the use-case-spec skill is
broken (`SECTION_MISSING`, `NUMBERING`, `NO_ALTERNATIVE_FLOWS`, `TRIGGER_STEP_REF`, `FLOW_TERMINATION`,
`POSTCONDITIONS_EMPTY`, `RULE_LABEL_MISSING`, `RULE_NUMBERING`, `TECHNICAL_TERM`, `UC_TRIGGER_EMPTY`,
`UC_TRIGGER_STEP_REF`, `UC_TRIGGER_IS_PRECONDITION`, …). Fix them with `/use-case-spec`.

## Options

| Option                       | Effect                                                                                  |
|------------------------------|-----------------------------------------------------------------------------------------|
| `--docs DIR`                 | documentation folder (default `docs`)                                                    |
| `--only UC-XXX` / `TC-XXX`   | report only findings about this element                                                  |
| `--strict`                   | fail on warnings too                                                                     |
| `--format json`              | print `{"findings": [...], "summary": {...}}`                                            |
| `--baseline FILE`            | use this baseline (default `DIR/.spec-lint-baseline.json` when it exists)               |
| `--no-baseline`              | report every finding                                                                     |
| `--update-baseline`          | accept all current `ERROR` and `WARN` findings into the baseline, then exit 0            |
| `--self-test`                | run the built-in fixtures                                                                |

A baseline entry is a fingerprint of code, file, element, and message — not the line number — so it survives edits
elsewhere in the file.
