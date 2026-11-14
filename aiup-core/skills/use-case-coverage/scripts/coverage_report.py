#!/usr/bin/env python3
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
"""Render a coverage audit report as one self-contained HTML page.

The uc-coverage-layered agent answers in Markdown: a `## UC-XXX Title — mode`
heading, a score line, the coverage matrix, and the sections `### Gaps`,
`### Drift`, `### Open questions`, and `### Suggested status` (plus
`### Since the last run` when the front door compared two runs). This script
turns exactly that text into HTML. It adds no verdict, drops no row, and
changes no word: the page is the report, laid out for a browser.

    python3 coverage_report.py --out docs/coverage/UC-001.html < report.md
    python3 coverage_report.py --self-test

Every character of the report is HTML-escaped; only `code`, **bold**, and
Markdown links with a relative, http, or https target become markup. The
`Spec:` path of the score line becomes a link relative to the output file.
Python standard library only.
"""

import argparse
import datetime
import html
import os
import re
import subprocess
import sys

CSS = """
:root { --fg: #1d2330; --muted: #5b6475; --bg: #ffffff; --panel: #f4f6f9;
  --line: #d9dee7; --link: #1f5fbf; --ok: #1f7a3f; --warn: #a15c00;
  --err: #b42318; --bar: #2f7d4f; }
@media (prefers-color-scheme: dark) {
  :root { --fg: #e6e9ef; --muted: #9aa3b5; --bg: #15181e; --panel: #1e232b;
    --line: #333a46; --link: #7fb0ff; --ok: #5cc98a; --warn: #f0a94a;
    --err: #ff7b72; --bar: #4fb57a; } }
* { box-sizing: border-box; }
body { margin: 0 auto; max-width: 1200px; padding: 24px 16px; color: var(--fg);
  background: var(--bg); font: 14px/1.5 system-ui, -apple-system, sans-serif; }
h1 { font-size: 22px; margin: 0 0 4px; }
h2 { font-size: 19px; margin: 40px 0 4px; }
h3 { font-size: 16px; margin: 28px 0 8px; }
a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }
code { font: 12.5px ui-monospace, SFMono-Regular, Menlo, monospace;
  background: var(--panel); border-radius: 4px; padding: 1px 4px;
  overflow-wrap: anywhere; }
.muted { color: var(--muted); }
.tiles { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
.tile { background: var(--panel); border: 1px solid var(--line);
  border-radius: 8px; padding: 10px 16px; min-width: 160px; }
.tile b { display: block; font-size: 22px; }
.bar { background: var(--bg); border: 1px solid var(--line);
  border-radius: 4px; height: 8px; margin-top: 6px; overflow: hidden; }
.bar span { display: block; height: 100%; background: var(--bar); }
.scroll { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; }
th, td { border-bottom: 1px solid var(--line); padding: 6px 8px;
  text-align: left; vertical-align: top; }
th { background: var(--panel); font-weight: 600; }
.badge { display: inline-block; border: 1px solid currentColor;
  border-radius: 10px; padding: 0 8px; font-size: 12px; }
.s-ok { color: var(--ok); } .s-warn { color: var(--warn); }
.s-err { color: var(--err); } .s-muted { color: var(--muted); }
label { display: inline-block; margin: 4px 0 8px; cursor: pointer; }
footer { margin-top: 40px; font-size: 12px; }
"""

JS = """
document.querySelectorAll('input.open-only').forEach(function (box) {
  box.addEventListener('change', function () {
    var table = document.getElementById(box.dataset.table);
    table.querySelectorAll('tbody tr').forEach(function (tr) {
      tr.hidden = box.checked && tr.dataset.open !== 'yes';
    });
  });
});
"""

HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
LIST_ITEM = re.compile(r"^(\s*)([-*+]|\d+[.)])\s+(.*)$")
SCORE = re.compile(r"(Implementation|Implementierung|Tests?)\s+(\d+)\s*/\s*(\d+)",
                   re.IGNORECASE)
SPEC = re.compile(r"Spec:\s*`?([^`·|\s]+\.md)`?")
LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")
BOLD = re.compile(r"\*\*(.+?)\*\*")


def verdict_class(text):
    """CSS class of a verdict word, or None when the cell is evidence."""
    t = text.strip().strip("*").strip().lower()
    if t.startswith("covered") or t.startswith("abgedeckt"):
        return "s-ok"
    if t.startswith("n/a"):
        return "s-muted"
    if t.startswith("partial") or t.startswith("teilweise"):
        return "s-warn"
    if t in ("missing", "fehlt", "test missing", "implementation missing",
             "test fehlt", "implementierung fehlt"):
        return "s-err"
    return None


def safe_href(target):
    lowered = target.lower()
    if lowered.startswith(("http://", "https://", "#")):
        return True
    return ":" not in target.split("/")[0]


def inline(text):
    """Escape the text and render `code`, **bold**, and safe links."""
    parts = re.split(r"(`[^`]*`)", text)
    out = []
    for part in parts:
        if len(part) >= 2 and part.startswith("`") and part.endswith("`"):
            out.append("<code>%s</code>" % html.escape(part[1:-1]))
            continue
        chunk = html.escape(part, quote=False)

        def link(match):
            label, target = match.group(1), html.unescape(match.group(2))
            if not safe_href(target):
                return match.group(0)
            return '<a href="%s">%s</a>' % (html.escape(target), label)

        chunk = LINK.sub(link, chunk)
        chunk = BOLD.sub(r"<strong>\1</strong>", chunk)
        out.append(chunk)
    return "".join(out)


def split_row(line):
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|") and not line.endswith("\\|"):
        line = line[:-1]
    cells, cell, i = [], "", 0
    while i < len(line):
        if line[i] == "\\" and i + 1 < len(line) and line[i + 1] == "|":
            cell += "|"
            i += 2
            continue
        if line[i] == "|":
            cells.append(cell.strip())
            cell = ""
        else:
            cell += line[i]
        i += 1
    cells.append(cell.strip())
    return cells


def is_separator(line):
    return bool(re.match(r"^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$",
                         line))


class Renderer:
    def __init__(self, out_dir):
        self.out_dir = out_dir
        self.tables = 0
        self.title = None
        self.score_lines = []

    def spec_link(self, text):
        match = SPEC.search(text)
        if not match:
            return inline(text)
        path = match.group(1)
        href = os.path.relpath(path, self.out_dir) if self.out_dir else path
        before, after = text[:match.start()], text[match.end():]
        return "%sSpec: <a href=\"%s\">%s</a>%s" % (
            inline(before), html.escape(href.replace(os.sep, "/")),
            html.escape(path), inline(after))

    def table(self, rows):
        self.tables += 1
        table_id = "matrix-%d" % self.tables
        head, body = rows[0], rows[1:]
        verdict_cols = {i for i, h in enumerate(head)
                        if h.strip().lower() in ("verdict", "urteil", "befund")}
        out = []
        open_rows = 0
        lines = ["<thead><tr>%s</tr></thead><tbody>" % "".join(
            "<th>%s</th>" % inline(h) for h in head)]
        for row in body:
            cells = []
            is_open = False
            for i, cell in enumerate(row):
                cls = verdict_class(cell)
                if cls and (i in verdict_cols or not verdict_cols):
                    cells.append('<td><span class="badge %s">%s</span></td>'
                                 % (cls, inline(cell)))
                    if cls in ("s-err", "s-warn"):
                        is_open = True
                else:
                    cells.append("<td>%s</td>" % inline(cell))
            open_rows += is_open
            lines.append('<tr data-open="%s">%s</tr>'
                         % ("yes" if is_open else "no", "".join(cells)))
        lines.append("</tbody>")
        if any(verdict_class(c) for r in body for c in r):
            out.append('<label><input type="checkbox" class="open-only" '
                       'data-table="%s"> Show open rows only (%d)</label>'
                       % (table_id, open_rows))
        out.append('<div class="scroll"><table id="%s">%s</table></div>'
                   % (table_id, "".join(lines)))
        return out

    def tiles(self, text):
        found = SCORE.findall(text)
        if not found:
            return []
        tiles = []
        for label, done, total in found:
            done, total = int(done), int(total)
            share = 100 * done // total if total else 0
            tiles.append('<div class="tile"><b>%d/%d</b>%s'
                         '<div class="bar"><span style="width:%d%%"></span>'
                         '</div></div>' % (done, total, html.escape(label),
                                           share))
        return ['<div class="tiles">%s</div>' % "".join(tiles)]

    def lists(self, items):
        """items: (indent, ordered, text) — nested by indentation."""
        out, stack = [], []
        for indent, ordered, text in items:
            tag = "ol" if ordered else "ul"
            while stack and indent < stack[-1][0]:
                out.append("</li></%s>" % stack.pop()[1])
            if stack and indent == stack[-1][0]:
                out.append("</li>")
            elif not stack or indent > stack[-1][0]:
                out.append("<%s>" % tag)
                stack.append((indent, tag))
            out.append("<li>%s" % inline(text))
        while stack:
            out.append("</li></%s>" % stack.pop()[1])
        return ["".join(out)]

    def render(self, text):
        lines = text.replace("\r\n", "\n").split("\n")
        body, i, after_heading = [], 0, False
        while i < len(lines):
            line = lines[i]
            if not line.strip():
                i += 1
                continue
            if line.strip().startswith("```"):
                fence, block = line.strip()[:3], []
                i += 1
                while i < len(lines) and not lines[i].strip().startswith(fence):
                    block.append(lines[i])
                    i += 1
                i += 1
                body.append("<pre><code>%s</code></pre>"
                            % html.escape("\n".join(block)))
                continue
            heading = HEADING.match(line)
            if heading:
                level = len(heading.group(1))
                if level <= 2 and self.title is None:
                    self.title = heading.group(2)
                level = max(2, min(level, 4))
                body.append("<h%d>%s</h%d>" % (level, inline(heading.group(2)),
                                               level))
                after_heading = level == 2
                i += 1
                continue
            if line.lstrip().startswith("|"):
                rows = []
                while i < len(lines) and lines[i].lstrip().startswith("|"):
                    if not is_separator(lines[i]):
                        rows.append(split_row(lines[i]))
                    i += 1
                body.extend(self.table(rows))
                after_heading = False
                continue
            if LIST_ITEM.match(line):
                items = []
                while i < len(lines):
                    item = LIST_ITEM.match(lines[i])
                    if item:
                        indent = len(item.group(1).expandtabs(4))
                        ordered = item.group(2)[0].isdigit()
                        items.append([indent, ordered, item.group(3)])
                    elif lines[i].strip() and items and (
                            lines[i].startswith(" ") or lines[i].startswith("\t")):
                        items[-1][2] += " " + lines[i].strip()
                    else:
                        break
                    i += 1
                body.extend(self.lists(items))
                after_heading = False
                continue
            para = []
            while (i < len(lines) and lines[i].strip()
                   and not HEADING.match(lines[i])
                   and not lines[i].lstrip().startswith("|")
                   and not lines[i].strip().startswith("```")
                   and not LIST_ITEM.match(lines[i])):
                para.append(lines[i].strip())
                i += 1
            joined = " ".join(para)
            if after_heading and SCORE.search(joined):
                self.score_lines.append(joined)
                body.extend(self.tiles(joined))
                body.append('<p class="muted">%s</p>' % self.spec_link(joined))
            else:
                body.append("<p>%s</p>" % inline(joined))
            after_heading = False
        return body


def git_commit(cwd):
    try:
        result = subprocess.run(["git", "rev-parse", "--short", "HEAD"],
                                cwd=cwd or ".", capture_output=True, text=True,
                                timeout=10)
    except (OSError, subprocess.SubprocessError):
        return None
    return result.stdout.strip() if result.returncode == 0 else None


def render_page(report, out_path=None, today=None, commit=None):
    out_dir = os.path.dirname(out_path) if out_path else None
    renderer = Renderer(out_dir if out_dir else ("." if out_path else None))
    body = renderer.render(report)
    title = renderer.title or "Coverage Report"
    footer = ["generated %s" % (today or datetime.date.today().isoformat())]
    if commit:
        footer.append("commit %s" % html.escape(commit))
    footer.append("the audit report of the uc-coverage-layered agent, "
                  "rendered unchanged; the agent ran no build and no test")
    return "\n".join([
        "<!DOCTYPE html>",
        '<html lang="en"><head><meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        "<title>Coverage — %s</title>" % html.escape(title),
        "<style>%s</style></head><body>" % CSS,
        "<h1>Specification Coverage</h1>",
        '<div class="muted">AI Unified Process coverage audit</div>',
        *body,
        '<footer class="muted">%s</footer>' % " · ".join(footer),
        "<script>%s</script>" % JS,
        "</body></html>",
        "",
    ])


SAMPLE = """## UC-001 Register Person — implementation and tests

Implementation 8/11 · Tests 6/11 · Spec: docs/use_cases/UC-001-register-person.md

| Unit   | Description                  | Implementation           | Test                            | Verdict      |
|--------|------------------------------|--------------------------|---------------------------------|--------------|
| Step 1 | Actor opens the person form  | PersonView.java:42       | UC001RegisterPersonTest.java:31 | Covered      |
| A1     | Email already exists         | PersonRepository.java:88 | —                               | Test missing |
| BR-002 | Postal code <4 digits> \\| x  | —                        | —                               | Missing      |
| Pre-1  | Logged in                    | —                        | —                               | n/a (role)   |

### Gaps

1. **BR-002 is not enforced.** The form accepts any postal code
   (`PersonForm.java:64`). Close with `/use-case-implement UC-001`.
2. **A1 has no test.** Close with `/use-case-test UC-001`.

### Drift

1. `PersonView.java:120` offers a "Send welcome email" action. See [the spec](../use_cases/UC-001.md) and [x](javascript:alert(1)).

### Open questions

- OQ-004 (UC-001 step 4, blocking, Open): Customer without an email address?

### Suggested status

`Approved` is still correct — one implementation gap remains. <script>alert(1)</script>
"""


def self_test():
    page = render_page(SAMPLE, "docs/coverage/UC-001.html", "2026-01-01", "abc1234")
    checks = [
        ("title", "<title>Coverage — UC-001 Register Person — implementation and tests</title>" in page),
        ("tiles", "<b>8/11</b>Implementation" in page and "<b>6/11</b>Tests" in page),
        ("spec link", 'href="../use_cases/UC-001-register-person.md"' in page),
        ("covered badge", '<span class="badge s-ok">Covered</span>' in page),
        ("missing badge", '<span class="badge s-err">Test missing</span>' in page),
        ("n/a badge", '<span class="badge s-muted">n/a (role)</span>' in page),
        ("evidence kept", "<td>PersonRepository.java:88</td>" in page),
        ("escaped cell", "Postal code &lt;4 digits&gt; | x" in page),
        ("every row", page.count("<tr data-open=") == 4),
        ("open rows", page.count('data-open="yes"') == 2
         and "Show open rows only (2)" in page),
        ("ordered list", "<ol><li><strong>BR-002 is not enforced.</strong>" in page),
        ("continuation", "any postal code (<code>PersonForm.java:64</code>)" in page),
        ("bullet", "<ul><li>OQ-004" in page),
        ("safe link", '<a href="../use_cases/UC-001.md">the spec</a>' in page),
        ("unsafe link", 'href="javascript' not in page),
        ("no raw html", "<script>alert" not in page
         and "&lt;script&gt;alert(1)&lt;/script&gt;" in page),
        ("headings", page.count("<h3>") == 4),
        ("footer", "generated 2026-01-01 · commit abc1234" in page),
    ]
    stdout_page = render_page(SAMPLE, None, "2026-01-01")
    checks.append(("stdout keeps spec path",
                   'href="docs/use_cases/UC-001-register-person.md"' in stdout_page))
    single = render_page("## UC-002 X — tests\n\nTests 1/2 · Spec: docs/use_cases/UC-002-x.md\n\n"
                         "| Unit | Description | Test |\n|---|---|---|\n"
                         "| Step 1 | a | Missing |\n| Step 2 | b | Covered |\n",
                         "docs/coverage/UC-002.html", "2026-01-01")
    checks.append(("single mode badges", '<span class="badge s-err">Missing</span>' in single
                   and "Show open rows only (1)" in single))
    failed = [name for name, ok in checks if not ok]
    for name, ok in checks:
        print("%s %s" % ("ok  " if ok else "FAIL", name))
    if failed:
        print("self-test failed: %s" % ", ".join(failed), file=sys.stderr)
        return 1
    print("self-test passed (%d checks)" % len(checks))
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("report", nargs="?",
                        help="Markdown report file (default: standard input)")
    parser.add_argument("--out", help="HTML file to write (default: standard "
                        "output); its folder is created when missing")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if args.report:
        with open(args.report, encoding="utf-8") as handle:
            report = handle.read()
    else:
        report = sys.stdin.read()
    if not report.strip():
        print("coverage_report.py: the report is empty", file=sys.stderr)
        return 2
    page = render_page(report, args.out, commit=git_commit(None))
    if args.out:
        folder = os.path.dirname(args.out)
        if folder:
            os.makedirs(folder, exist_ok=True)
        with open(args.out, "w", encoding="utf-8") as handle:
            handle.write(page)
        print("wrote %s" % args.out)
    else:
        sys.stdout.write(page)
    return 0


if __name__ == "__main__":
    sys.exit(main())
