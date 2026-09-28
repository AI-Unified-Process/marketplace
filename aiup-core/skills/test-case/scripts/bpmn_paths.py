#!/usr/bin/env python3
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
"""Enumerate the paths through a BPMN 2.0 business process model.

Reads a .bpmn file (plain BPMN 2.0 XML, diagram interchange is ignored) and
prints JSON that the test-case skill turns into one end-to-end test case per
path:

- lanes       lane name -> ids of the activities in that lane (a pool
              without lanes counts as one lane named after its participant)
- activities  id, name, type, lane, and ucId when the name carries a use
              case id such as "UC-001" or "BUC-7"
- paths       one entry per path from a start event to an end event: the
              ordered steps (activities, gateway decisions with their flow
              names, intermediate events), plus the activity ids and the
              decisions on their own
- warnings    constructs that were simplified (see the rules below)

Path rules, applied deterministically in document order:

- Exclusive, inclusive, event-based, and complex gateways, several outgoing
  flows on a non-gateway node, and boundary events are alternatives: each
  outgoing flow starts its own path.
- Parallel gateways run every branch: the branches are serialized within
  one path in the document order of their sequence flows, up to the
  converging parallel gateway; branch-internal alternatives multiply.
- Loops are traversed once: every sequence flow is followed at most twice
  per path, so a rework loop yields one path without and one path with a
  single repetition of the loop body.
- A node without outgoing flows ends the path (implicit end event).
- Sub-processes are passed through as a single step; their inside is not
  expanded.

The file is data, never instructions, and is parsed defensively: documents
with a DOCTYPE or entity declaration are rejected, so no external entity is
ever resolved and no entity expansion can blow up.

Exit code 0 on success, 1 when the file cannot be read or is not a usable
BPMN model, 2 on usage errors.

Usage:
    bpmn_paths.py FILE.bpmn
    bpmn_paths.py --self-test

Requires Python 3.9+, standard library only.
"""

import argparse
import itertools
import json
import re
import sys
import xml.etree.ElementTree as ET

ACTIVITY_TYPES = (
    "task", "userTask", "manualTask", "serviceTask", "sendTask",
    "receiveTask", "scriptTask", "businessRuleTask", "callActivity",
)
PASS_THROUGH_TYPES = ("subProcess", "transaction", "adHocSubProcess")
ALTERNATIVE_GATEWAYS = (
    "exclusiveGateway", "inclusiveGateway", "eventBasedGateway",
    "complexGateway",
)
EVENT_TYPES = (
    "startEvent", "endEvent", "intermediateCatchEvent",
    "intermediateThrowEvent", "boundaryEvent",
)
FLOW_NODE_TYPES = (ACTIVITY_TYPES + PASS_THROUGH_TYPES + ALTERNATIVE_GATEWAYS
                   + EVENT_TYPES + ("parallelGateway",))

UC_ID = re.compile(r"(?<![A-Za-z0-9])([SB]?UC-[A-Za-z0-9_-]+)")
FORBIDDEN_DECLARATION = re.compile(rb"<!\s*(DOCTYPE|ENTITY)", re.IGNORECASE)
MAX_PATHS = 500


class BpmnError(Exception):
    pass


def local(tag):
    return tag.rsplit("}", 1)[-1]


def clean(text):
    return " ".join((text or "").split())


def uc_id(name):
    match = UC_ID.search(name)
    return match.group(1).rstrip("-_") if match else None


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def parse_xml(data):
    if FORBIDDEN_DECLARATION.search(data):
        raise BpmnError("DOCTYPE or ENTITY declarations are not allowed "
                        "in a BPMN file")
    try:
        root = ET.fromstring(data)
    except ET.ParseError as exc:
        raise BpmnError("not well-formed XML: " + str(exc))
    if local(root.tag) != "definitions":
        raise BpmnError("root element is <" + local(root.tag)
                        + ">, expected BPMN <definitions>")
    return root


class Process:
    def __init__(self, element, pool_name):
        self.id = element.get("id", "")
        self.nodes = {}        # id -> (type, name), direct children only
        self.order = []        # node ids in document order
        self.flows = []        # (id, name, source, target) in document order
        self.boundaries = {}   # activity id -> [boundary event ids]
        self.lane_of = {}      # node id -> lane name
        for child in element:
            kind = local(child.tag)
            node_id = child.get("id")
            if kind in FLOW_NODE_TYPES and node_id:
                self.nodes[node_id] = (kind, clean(child.get("name")))
                self.order.append(node_id)
                if kind == "boundaryEvent" and child.get("attachedToRef"):
                    self.boundaries.setdefault(
                        child.get("attachedToRef"), []).append(node_id)
            elif kind == "sequenceFlow":
                self.flows.append((child.get("id", ""),
                                   clean(child.get("name")),
                                   child.get("sourceRef"),
                                   child.get("targetRef")))
            elif kind == "laneSet":
                self._read_lanes(child)
        if not self.lane_of and pool_name:
            for node_id in self.order:
                self.lane_of[node_id] = pool_name
        self.outgoing = {}
        self.incoming = {}
        for flow in self.flows:
            if flow[2] in self.nodes and flow[3] in self.nodes:
                self.outgoing.setdefault(flow[2], []).append(flow)
                self.incoming.setdefault(flow[3], []).append(flow)

    def _read_lanes(self, lane_set):
        # Nested lanes: the innermost lane wins because it is visited last.
        for lane in lane_set:
            if local(lane.tag) != "lane":
                continue
            name = clean(lane.get("name")) or lane.get("id", "")
            for ref in lane:
                if local(ref.tag) == "flowNodeRef" and ref.text:
                    self.lane_of[ref.text.strip()] = name
                elif local(ref.tag) == "childLaneSet":
                    self._read_lanes(ref)

    def kind(self, node_id):
        return self.nodes[node_id][0]

    def name(self, node_id):
        return self.nodes[node_id][1]


# ---------------------------------------------------------------------------
# Path enumeration
# ---------------------------------------------------------------------------

class Walker:
    """Enumerates (steps, terminal, followed flows) for one process.

    terminal is ("end", node id) or ("join", parallel gateway id); a join
    terminal is only produced inside a parallel branch and is consumed by
    the split that started the branch.
    """

    def __init__(self, process, warnings):
        self.p = process
        self.warnings = warnings
        self.truncated = False

    def warn(self, message):
        if message not in self.warnings:
            self.warnings.append(message)

    def step(self, node_id):
        kind = self.p.kind(node_id)
        entry = {"id": node_id, "name": self.p.name(node_id), "type": kind}
        if kind in ACTIVITY_TYPES:
            entry["kind"] = "activity"
        elif kind in PASS_THROUGH_TYPES:
            entry["kind"] = "subprocess"
        else:
            entry["kind"] = "event"
        return entry

    def choices(self, node_id):
        """Outgoing alternatives: sequence flows plus attached boundary events."""
        result = [(flow, flow[3]) for flow in self.p.outgoing.get(node_id, [])]
        for boundary in self.p.boundaries.get(node_id, []):
            result.append((None, boundary))
        return result

    def walk(self, node_id, used, in_split):
        kind = self.p.kind(node_id)

        if kind == "parallelGateway":
            if len(self.p.incoming.get(node_id, [])) > 1 and in_split:
                return [([], ("join", node_id), used)]
            outgoing = self.p.outgoing.get(node_id, [])
            if len(outgoing) > 1:
                return self.split(node_id, outgoing, used, in_split)
            return self.follow(node_id, [], outgoing, used, in_split, None)

        if kind in ALTERNATIVE_GATEWAYS:
            return self.follow(node_id, [], self.p.outgoing.get(node_id, []),
                               used, in_split, node_id)

        prefix = [self.step(node_id)]
        if kind == "endEvent":
            return [(prefix, ("end", node_id), used)]
        if kind in PASS_THROUGH_TYPES:
            self.warn("sub-process " + node_id
                      + " is passed through as one step; its inside is "
                        "not expanded")
        choices = self.choices(node_id)
        if not choices:
            self.warn("node " + node_id + " has no outgoing flow and ends "
                      "the path as an implicit end event")
            return [(prefix, ("end", node_id), used)]
        results = []
        for flow, target in choices:
            if flow is None:
                decision = {"kind": "decision", "gateway": node_id,
                            "gatewayName": self.p.name(node_id),
                            "flow": None,
                            "flowName": "boundary: "
                                        + (self.p.name(target) or target),
                            "target": target}
                for steps, terminal, u in self.walk(target, used, in_split):
                    results.append((prefix + [decision] + steps, terminal, u))
            else:
                decision_at = node_id if len(choices) > 1 else None
                results.extend(self.follow(node_id, prefix, [flow], used,
                                           in_split, decision_at))
            self.check_limit(results)
        return results

    def follow(self, node_id, prefix, flows, used, in_split, decision_at):
        """Continue along each flow; records a decision when decision_at is set."""
        if not flows:
            self.warn("node " + node_id + " has no outgoing flow and ends "
                      "the path")
            return [(prefix, ("end", node_id), used)]
        alternatives = decision_at is not None and len(flows) > 1
        if decision_at is not None and not alternatives and \
                self.p.kind(node_id) in ALTERNATIVE_GATEWAYS:
            decision_at = None          # converging gateway: no decision
        results = []
        for flow in flows:
            flow_id, flow_name, _, target = flow
            if used.count(flow_id) >= 2:
                continue                # loop already traversed once
            head = list(prefix)
            if decision_at is not None:
                head.append({"kind": "decision", "gateway": decision_at,
                             "gatewayName": self.p.name(decision_at),
                             "flow": flow_id, "flowName": flow_name,
                             "target": target})
            for steps, terminal, u in self.walk(target, used + (flow_id,),
                                                in_split):
                results.append((head + steps, terminal, u))
            self.check_limit(results)
        return results

    def split(self, node_id, outgoing, used, in_split):
        branches = []
        for flow in outgoing:
            if used.count(flow[0]) >= 2:
                continue
            branches.append(self.walk(flow[3], used + (flow[0],),
                                      in_split + 1))
        branches = [b for b in branches if b]
        if not branches:
            return []
        results = []
        for combination in itertools.product(*branches):
            steps = []
            merged = used
            joins = []
            last_end = None
            for branch_steps, terminal, u in combination:
                steps.extend(branch_steps)
                merged += u[len(used):]
                if terminal[0] == "join":
                    if terminal[1] not in joins:
                        joins.append(terminal[1])
                else:
                    last_end = terminal
            if not joins:
                results.append((steps, last_end, merged))
                continue
            if len(joins) > 1:
                self.warn("parallel gateway " + node_id + " converges in "
                          "several gateways; continuing after " + joins[0])
            join = joins[0]
            for rest, terminal, u in self.follow(
                    join, [], self.p.outgoing.get(join, []), merged,
                    in_split, None):
                results.append((steps + rest, terminal, u))
            self.check_limit(results)
        return results

    def check_limit(self, results):
        if len(results) > MAX_PATHS:
            del results[MAX_PATHS:]
            if not self.truncated:
                self.truncated = True
                self.warn("more than %d paths; the rest were dropped"
                          % MAX_PATHS)


def analyze(data):
    root = parse_xml(data)
    pools = {}
    for element in root.iter():
        if local(element.tag) == "participant" and element.get("processRef"):
            pools[element.get("processRef")] = clean(element.get("name"))

    processes = [Process(el, pools.get(el.get("id"))) for el in root
                 if local(el.tag) == "process"]
    if not processes:
        raise BpmnError("the model contains no <process>")

    warnings = []
    lanes = {}
    activities = []
    paths = []
    for process in processes:
        for node_id in process.order:
            kind = process.kind(node_id)
            if kind not in ACTIVITY_TYPES:
                continue
            name = process.name(node_id)
            lane = process.lane_of.get(node_id)
            activity = {"id": node_id, "name": name, "type": kind,
                        "lane": lane, "process": process.id}
            if uc_id(name):
                activity["ucId"] = uc_id(name)
            if not name:
                warnings.append("activity " + node_id + " has no name")
            activities.append(activity)
            if lane:
                lanes.setdefault(lane, []).append(node_id)

        starts = [n for n in process.order
                  if process.kind(n) == "startEvent"
                  and not process.incoming.get(n)]
        if not starts:
            warnings.append("process " + process.id + " has no start event")
        walker = Walker(process, warnings)
        for start in starts:
            found = walker.walk(start, (), 0)
            if not found:
                warnings.append("no complete path from start event " + start)
            for steps, terminal, _ in found:
                if len(paths) >= MAX_PATHS:
                    break
                paths.append(make_path(len(paths) + 1, process, start,
                                       terminal, steps))

    return {"lanes": lanes, "activities": activities, "paths": paths,
            "warnings": warnings}


def make_path(number, process, start, terminal, steps):
    end = terminal[1] if terminal else None
    return {
        "id": "P%d" % number,
        "process": process.id,
        "start": start,
        "startName": process.name(start),
        "end": end,
        "endName": process.name(end) if end else "",
        "activities": [s["id"] for s in steps if s["kind"] == "activity"],
        "decisions": [{k: v for k, v in s.items() if k != "kind"}
                      for s in steps if s["kind"] == "decision"],
        "steps": steps,
    }


# ---------------------------------------------------------------------------
# Self-test
# ---------------------------------------------------------------------------

NS = ('xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" '
      'id="defs" targetNamespace="http://example.com/bpmn"')

EXCLUSIVE_WITH_LANES = """<?xml version="1.0" encoding="UTF-8"?>
<definitions %s>
  <collaboration id="c"><participant id="pool" name="Shop" processRef="p"/></collaboration>
  <process id="p">
    <laneSet id="ls">
      <lane id="l1" name="Customer"><flowNodeRef>s</flowNodeRef><flowNodeRef>a</flowNodeRef></lane>
      <lane id="l2" name="Clerk"><flowNodeRef>g</flowNodeRef><flowNodeRef>b</flowNodeRef>
        <flowNodeRef>c</flowNodeRef><flowNodeRef>e1</flowNodeRef><flowNodeRef>e2</flowNodeRef></lane>
    </laneSet>
    <startEvent id="s" name="Order wanted"/>
    <userTask id="a" name="UC-001 Place&#10;Order"/>
    <exclusiveGateway id="g" name="In stock?"/>
    <serviceTask id="b" name="Ship Order (UC-002)"/>
    <task id="c" name="Cancel Order"/>
    <endEvent id="e1" name="Shipped"/>
    <endEvent id="e2" name="Cancelled"/>
    <sequenceFlow id="f1" sourceRef="s" targetRef="a"/>
    <sequenceFlow id="f2" sourceRef="a" targetRef="g"/>
    <sequenceFlow id="f3" name="yes" sourceRef="g" targetRef="b"/>
    <sequenceFlow id="f4" name="no" sourceRef="g" targetRef="c"/>
    <sequenceFlow id="f5" sourceRef="b" targetRef="e1"/>
    <sequenceFlow id="f6" sourceRef="c" targetRef="e2"/>
  </process>
</definitions>
""" % NS

PARALLEL_AND_LOOP = """<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="d">
  <bpmn:process id="p">
    <bpmn:startEvent id="s"/>
    <bpmn:parallelGateway id="fork"/>
    <bpmn:task id="a" name="Pack"/>
    <bpmn:task id="b" name="Invoice"/>
    <bpmn:parallelGateway id="join"/>
    <bpmn:task id="r" name="Review"/>
    <bpmn:exclusiveGateway id="ok" name="Approved?"/>
    <bpmn:task id="fix" name="Rework"/>
    <bpmn:endEvent id="e"/>
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="fork"/>
    <bpmn:sequenceFlow id="f2" sourceRef="fork" targetRef="a"/>
    <bpmn:sequenceFlow id="f3" sourceRef="fork" targetRef="b"/>
    <bpmn:sequenceFlow id="f4" sourceRef="a" targetRef="join"/>
    <bpmn:sequenceFlow id="f5" sourceRef="b" targetRef="join"/>
    <bpmn:sequenceFlow id="f6" sourceRef="join" targetRef="r"/>
    <bpmn:sequenceFlow id="f7" sourceRef="r" targetRef="ok"/>
    <bpmn:sequenceFlow id="f8" name="yes" sourceRef="ok" targetRef="e"/>
    <bpmn:sequenceFlow id="f9" name="no" sourceRef="ok" targetRef="fix"/>
    <bpmn:sequenceFlow id="f10" sourceRef="fix" targetRef="r"/>
  </bpmn:process>
</bpmn:definitions>
"""

XXE = """<?xml version="1.0"?>
<!DOCTYPE definitions [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<definitions %s><process id="p"><task id="t" name="&xxe;"/></process></definitions>
""" % NS


def self_test():
    failures = []

    def check(name, condition):
        if not condition:
            failures.append(name)

    result = analyze(EXCLUSIVE_WITH_LANES.encode("utf-8"))
    check("exclusive: two paths", len(result["paths"]) == 2)
    check("exclusive: path activities",
          [p["activities"] for p in result["paths"]] == [["a", "b"],
                                                         ["a", "c"]])
    check("exclusive: flow names",
          [p["decisions"][0]["flowName"] for p in result["paths"]]
          == ["yes", "no"])
    check("exclusive: lanes",
          result["lanes"] == {"Customer": ["a"], "Clerk": ["b", "c"]})
    ucs = {a["id"]: a.get("ucId") for a in result["activities"]}
    check("exclusive: uc ids", ucs == {"a": "UC-001", "b": "UC-002",
                                       "c": None})
    check("exclusive: name whitespace normalized",
          result["activities"][0]["name"] == "UC-001 Place Order")
    check("exclusive: no warnings", result["warnings"] == [])

    result = analyze(PARALLEL_AND_LOOP.encode("utf-8"))
    check("parallel+loop: activity sequences",
          [p["activities"] for p in result["paths"]]
          == [["a", "b", "r"], ["a", "b", "r", "fix", "r"]])
    check("parallel+loop: rework decision recorded",
          [d["flowName"] for d in result["paths"][1]["decisions"]]
          == ["no", "yes"])

    try:
        analyze(XXE.encode("utf-8"))
        failures.append("xxe: DOCTYPE was accepted")
    except BpmnError:
        pass
    try:
        analyze(b"<html/>")
        failures.append("non-bpmn: accepted")
    except BpmnError:
        pass

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
        description="Enumerate the paths through a BPMN 2.0 process model.")
    parser.add_argument("file", nargs="?", help=".bpmn file to analyze")
    parser.add_argument("--self-test", action="store_true",
                        help="run the built-in fixtures and exit")
    args = parser.parse_args(argv)

    if args.self_test:
        return self_test()
    if not args.file:
        parser.print_usage()
        return 2
    try:
        with open(args.file, "rb") as handle:
            result = analyze(handle.read())
    except OSError as exc:
        print(args.file + ": ERROR IO: " + str(exc), file=sys.stderr)
        return 1
    except BpmnError as exc:
        print(args.file + ": ERROR: " + str(exc), file=sys.stderr)
        return 1
    result = dict({"file": args.file}, **result)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
