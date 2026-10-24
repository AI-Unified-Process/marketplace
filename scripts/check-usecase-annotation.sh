#!/usr/bin/env bash
# Verify that every layer test skill defines the @UseCase test annotation with the same shape.
#
# The Java test skills of the layer plugins each carry the canonical annotation, because a host installs skills one
# folder at a time and no skill can link another's file. Whichever test skill runs first creates
# src/test/java/<root package>/usecase/UseCase.java and the others reuse it, so two different shapes make the second
# skill's tests fail to compile (an attribute it uses is missing). This check takes every java code block that
# declares @interface UseCase in the layer plugins - meta-annotations and body, everything but the package and import
# lines, which some copies leave out - requires one in each Java test skill, and fails when any two differ. The
# deprecated combined stack plugins keep their own shape and are not checked.
set -euo pipefail

cd "$(dirname "$0")/.."

python3 - <<'PY'
import glob, os, re, sys

# Every plugin directory except core and the combined stack plugins is a layer plugin, so a new layer plugin is
# checked without an edit here.
NOT_LAYER = {"aiup-core", "aiup-vaadin-jooq", "aiup-angular-jpa", "aiup-blazor-dotnet", "aiup-nestjs-nextjs"}
LAYER_PLUGINS = sorted(os.path.dirname(p) for p in glob.glob("aiup-*/plugin.json")
                       if os.path.dirname(p) not in NOT_LAYER)
# The Java test skills that create the annotation when it is missing; each must carry it.
REQUIRED = ("aiup-jooq/skills/jooq-persistence-test", "aiup-jpa/skills/jpa-persistence-test",
            "aiup-spring-boot/skills/spring-service-test", "aiup-spring-boot/skills/spring-rest-test",
            "aiup-vaadin/skills/vaadin-flow-ui-test")
# A fence opens with three or more backticks or tildes, at any indentation (a code block inside a list item), and
# closes with a line of the same character, at least as long, and nothing else.
OPEN = re.compile(r"^\s*(`{3,}|~{3,})\s*([^\s`]*)")


def code_blocks(text):
    """(info word, body) of every fenced code block, CommonMark-style."""
    blocks, fence, lang, body = [], None, "", []
    for line in text.splitlines():
        if fence is None:
            match = OPEN.match(line)
            if match:
                fence, lang, body = match.group(1), match.group(2).lower(), []
        elif re.fullmatch(rf"\s*{re.escape(fence[0])}{{{len(fence)},}}\s*", line):
            blocks.append((lang, "\n".join(body)))
            fence = None
        else:
            body.append(line)
    return blocks


def normalize(block):
    lines = [line.strip() for line in block.splitlines() if line.strip()]
    return "\n".join(line for line in lines if not line.startswith(("package ", "import ")))


shapes = {}
per_skill = {}
for plugin in LAYER_PLUGINS:
    for path in sorted(glob.glob(f"{plugin}/skills/*/**/*.md", recursive=True)):
        skill = "/".join(path.split(os.sep)[:3])
        text = open(path, encoding="utf-8").read()
        for lang, body in code_blocks(text):
            if lang != "java" or not re.search(r"@interface\s+UseCase\b", body):
                continue
            shapes.setdefault(normalize(body), []).append(path)
            per_skill[skill] = per_skill.get(skill, 0) + 1

errors = 0
for skill in REQUIRED:
    if not per_skill.get(skill):
        print(f"ERROR: {skill} has no java code block defining @interface UseCase", file=sys.stderr)
        errors += 1
if len(shapes) > 1:
    print("ERROR: the layer test skills define @UseCase in different shapes:", file=sys.stderr)
    for shape, paths in shapes.items():
        print("  " + ", ".join(paths), file=sys.stderr)
        print("    " + shape.replace("\n", "\n    "), file=sys.stderr)
    errors += 1
if errors:
    sys.exit(1)
paths = next(iter(shapes.values()))
print(f"@UseCase annotation identical in {len(paths)} definitions")
PY
