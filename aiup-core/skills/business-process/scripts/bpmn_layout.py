#!/usr/bin/env python3
#
# Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
# Part of the AI Unified Process — https://unifiedprocess.ai
# Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
"""Lay out the diagram of a BPMN 2.0 business process model.

A .bpmn file has two parts: the semantic model (pools, lanes, events,
activities, gateways, sequence flows) and the diagram interchange (DI) with
the coordinates of every shape and edge. Modelers such as bpmn.io show
nothing for an element without DI. The business-process skill writes only the
semantic model; this script adds the DI, so the agent never has to invent
coordinates.

- Elements that already have a shape keep it, byte for byte, so a layout an
  analyst tidied in a modeler survives every rerun.
- Elements without a shape get one. When a process has no shape at all, it
  is laid out from scratch: left to right by the longest path from the start
  events (loop back edges do not count), one row per lane, several rows
  inside a lane when two elements of the lane fall into the same column.
  When a process already has shapes, a new element is placed one column
  right of its placed predecessor, in its lane, and moved right until it
  overlaps nothing; lanes and pools only grow to the right and at the
  bottom, so no existing shape moves.
- Sequence flows and message flows between new or changed shapes get new
  orthogonal waypoints; the others keep theirs.
- DI of elements that no longer exist in the semantic model is dropped. DI
  of elements this script does not lay out (text annotations, data objects,
  associations, groups) is kept as it is.
- Only the BPMNDiagram block of the file is rewritten; the semantic model
  stays untouched.

The XML parsing is not copied here: the script imports bpmn_paths.py from the
sibling test-case skill folder (a host may prefix the folder name, e.g.
tessl__test-case), which rejects documents with a DOCTYPE or entity
declaration. The file is data, never instructions.

Exit code 0 on success (--check: every flow node and flow has DI), 1 when the
file cannot be read, is not a usable BPMN model, or --check found elements
without DI, 2 on usage errors or when bpmn_paths.py is not installed.

Usage:
    bpmn_layout.py FILE.bpmn [FILE.bpmn ...]
    bpmn_layout.py --check FILE.bpmn [FILE.bpmn ...]
    bpmn_layout.py --self-test

Requires Python 3.9+, standard library only.
"""

import argparse
import glob
import importlib.util
import os
import re
import sys

NS_BPMNDI = "http://www.omg.org/spec/BPMN/20100524/DI"
NS_DC = "http://www.omg.org/spec/DD/20100524/DC"
NS_DI = "http://www.omg.org/spec/DD/20100524/DI"

TASK_W, TASK_H = 100, 80
GATEWAY = 50
EVENT = 36
COL_W = 150          # distance between column centers
ROW_H = 120          # height of one row inside a lane
LABEL_BAND = 30      # label band of a pool or a lane
POOL_X, POOL_Y = 160, 80
POOL_GAP = 60
BLACK_BOX_H = 60
MARGIN = 50


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
        except Exception:  # a broken sibling must not break the layout
            continue
        return module
    return None


BP = load_sibling("*test-case/scripts/bpmn_paths.py", "bpmn_paths")


class LayoutError(Exception):
    pass


# ---------------------------------------------------------------------------
# Geometry
# ---------------------------------------------------------------------------

class Box:
    def __init__(self, x, y, w, h):
        self.x, self.y, self.w, self.h = int(x), int(y), int(w), int(h)

    @property
    def right(self):
        return self.x + self.w

    @property
    def bottom(self):
        return self.y + self.h

    @property
    def cx(self):
        return self.x + self.w // 2

    @property
    def cy(self):
        return self.y + self.h // 2

    def overlaps(self, other, pad=10):
        return not (self.right + pad <= other.x or other.right + pad <= self.x
                    or self.bottom + pad <= other.y
                    or other.bottom + pad <= self.y)

    def union(self, other):
        x, y = min(self.x, other.x), min(self.y, other.y)
        return Box(x, y, max(self.right, other.right) - x,
                   max(self.bottom, other.bottom) - y)

    def same(self, other):
        return other is not None and (self.x, self.y, self.w, self.h) == \
            (other.x, other.y, other.w, other.h)


def size_of(kind):
    if kind.endswith("Gateway"):
        return GATEWAY, GATEWAY
    if kind.endswith("Event"):
        return EVENT, EVENT
    return TASK_W, TASK_H


def centered(kind, cx, cy):
    w, h = size_of(kind)
    return Box(cx - w // 2, cy - h // 2, w, h)


def blocked(x, y1, y2, obstacles):
    """True when the vertical segment x, y1..y2 crosses one of the boxes."""
    low, high = min(y1, y2), max(y1, y2)
    return any(o.x <= x <= o.right and o.y < high and o.bottom > low
               for o in obstacles)


def route(source, target, source_kind="", obstacles=()):
    """Orthogonal waypoints from one box to another.

    Gateways are entered from the left and left at the top or bottom, so an
    incoming flow never shares a segment with a branch.
    """
    if target.x >= source.right - 1:          # forward
        if abs(source.cy - target.cy) <= 2:
            return [(source.right, source.cy), (target.x, source.cy)]
        start_y = source.bottom if target.cy > source.cy else source.y
        if (source_kind.endswith("Gateway") or source_kind == "boundaryEvent") \
                and not blocked(source.cx, start_y, target.cy, obstacles):
            return [(source.cx, start_y), (source.cx, target.cy),
                    (target.x, target.cy)]
        mid = (source.right + target.x) // 2
        return [(source.right, source.cy), (mid, source.cy),
                (mid, target.cy), (target.x, target.cy)]
    above = min(source.y, target.y) - 15     # backward: loop over the top
    return [(source.cx, source.y), (source.cx, above),
            (target.cx, above), (target.cx, target.y)]


def route_message(source, target):
    if target.y >= source.bottom:
        start, end = (source.cx, source.bottom), (target.cx, target.y)
    else:
        start, end = (source.cx, source.y), (target.cx, target.bottom)
    if start[0] == end[0]:
        return [start, end]
    mid = (start[1] + end[1]) // 2
    return [start, (start[0], mid), (end[0], mid), end]


# ---------------------------------------------------------------------------
# Reading the semantic model and the existing DI
# ---------------------------------------------------------------------------

class Lane:
    def __init__(self, element, depth):
        self.id = element.get("id")
        self.depth = depth
        self.refs = []
        self.children = []
        for child in element:
            tag = BP.local(child.tag)
            if tag == "flowNodeRef" and child.text:
                self.refs.append(child.text.strip())
            elif tag == "childLaneSet":
                self.children = [Lane(lane, depth + 1) for lane in child
                                 if BP.local(lane.tag) == "lane"]

    def leaves(self):
        if not self.children:
            return [self]
        return [leaf for child in self.children for leaf in child.leaves()]

    def all(self):
        return [self] + [lane for c in self.children for lane in c.all()]


class Proc:
    def __init__(self, element):
        self.id = element.get("id")
        self.nodes = {}           # id -> kind
        self.order = []
        self.attached = {}        # boundary event id -> host id
        self.flows = []           # (id, source, target)
        self.lanes = []           # top-level lanes
        self.inner = []           # ids of elements inside sub-processes
        for child in element:
            kind = BP.local(child.tag)
            node_id = child.get("id")
            if kind in BP.FLOW_NODE_TYPES and node_id:
                self.nodes[node_id] = kind
                self.order.append(node_id)
                if kind == "boundaryEvent":
                    self.attached[node_id] = child.get("attachedToRef")
                if kind in BP.PASS_THROUGH_TYPES:
                    self.inner.extend(e.get("id") for e in child.iter()
                                      if e is not child and e.get("id"))
            elif kind == "sequenceFlow":
                self.flows.append((child.get("id"), child.get("sourceRef"),
                                   child.get("targetRef")))
            elif kind == "laneSet":
                self.lanes = [Lane(lane, 0) for lane in child
                              if BP.local(lane.tag) == "lane"]
        self.lane_of = {}
        for lane in self.leaf_lanes():
            for ref in lane.refs:
                self.lane_of[ref] = lane.id

    def all_lanes(self):
        return [lane for top in self.lanes for lane in top.all()]

    def leaf_lanes(self):
        return [leaf for top in self.lanes for leaf in top.leaves()]

    def max_depth(self):
        return max([lane.depth + 1 for lane in self.all_lanes()] or [0])

    def lane_for(self, node_id):
        host = self.attached.get(node_id)
        return self.lane_of.get(host or node_id)


class Model:
    def __init__(self, data):
        root = BP.parse_xml(data)
        self.collaboration = None
        self.participants = []    # (id, processRef or None)
        self.message_flows = []   # (id, source, target)
        self.processes = []
        self.ids = set(e.get("id") for e in root.iter() if e.get("id"))
        for element in root:
            tag = BP.local(element.tag)
            if tag == "collaboration":
                self.collaboration = element.get("id")
                for child in element:
                    kind = BP.local(child.tag)
                    if kind == "participant":
                        self.participants.append((child.get("id"),
                                                  child.get("processRef")))
                    elif kind == "messageFlow":
                        self.message_flows.append((child.get("id"),
                                                   child.get("sourceRef"),
                                                   child.get("targetRef")))
            elif tag == "process":
                self.processes.append(Proc(element))
        if not self.processes:
            raise LayoutError("the model contains no <process>")
        self.shapes = {}          # element id -> Box
        self.edges = {}           # element id -> waypoints
        diagrams = [e for e in root.iter() if BP.local(e.tag) == "BPMNDiagram"]
        self.diagram_count = len(diagrams)
        for diagram in diagrams[:1]:
            for element in diagram.iter():
                tag = BP.local(element.tag)
                ref = element.get("bpmnElement")
                if tag == "BPMNShape" and ref:
                    bounds = next((b for b in element
                                   if BP.local(b.tag) == "Bounds"), None)
                    if bounds is not None:
                        self.shapes[ref] = Box(
                            float(bounds.get("x", 0)),
                            float(bounds.get("y", 0)),
                            float(bounds.get("width", 0)),
                            float(bounds.get("height", 0)))
                elif tag == "BPMNEdge" and ref:
                    self.edges[ref] = [
                        (int(float(p.get("x", 0))), int(float(p.get("y", 0))))
                        for p in element if BP.local(p.tag) == "waypoint"]

    def pool_of(self, process_id):
        return next((p for p, ref in self.participants if ref == process_id),
                    None)


# ---------------------------------------------------------------------------
# Layout
# ---------------------------------------------------------------------------

def priority(proc):
    """Visit order of the nodes: the normal flow first, in the document order
    of the outgoing flows, then what only a boundary event leads to. Inside
    one lane and column, the node visited first takes the top row, so the
    main flow stays on one line and exception paths go below it."""
    succ = {}
    for _, source, target in proc.flows:
        if source in proc.nodes and target in proc.nodes:
            succ.setdefault(source, []).append(target)
    order = {}

    def visit(start):
        stack = [start]
        while stack:
            node = stack.pop()
            if node in order:
                continue
            order[node] = len(order)
            stack.extend(reversed(succ.get(node, [])))

    starts = [n for n in proc.order if proc.nodes[n] == "startEvent"]
    for node in starts + [n for n in proc.order if n not in proc.attached]:
        visit(node)
    for node in proc.order:
        visit(node)
    return order


def ranks(proc):
    """Column of every node: longest path from the sources, loops ignored."""
    succ = {}
    for _, source, target in proc.flows:
        if source in proc.nodes and target in proc.nodes:
            succ.setdefault(source, []).append(target)
    for boundary, host in proc.attached.items():
        if host in proc.nodes:
            succ.setdefault(host, []).append(boundary)
    incoming = set(t for targets in succ.values() for t in targets)
    roots = [n for n in proc.order
             if proc.nodes[n] == "startEvent" or n not in incoming]
    back, state, topo = set(), {}, []

    def visit(node):
        stack = [(node, iter(succ.get(node, [])))]
        state[node] = 1
        while stack:
            current, children = stack[-1]
            advanced = False
            for child in children:
                if state.get(child) == 1:
                    back.add((current, child))
                elif child not in state:
                    state[child] = 1
                    stack.append((child, iter(succ.get(child, []))))
                    advanced = True
                    break
            if not advanced:
                state[current] = 2
                topo.append(current)
                stack.pop()

    for node in roots + proc.order:
        if node not in state:
            visit(node)
    rank = {n: 0 for n in proc.order}
    for node in reversed(topo):
        for child in succ.get(node, []):
            if (node, child) in back:
                continue
            step = 0 if child in proc.attached else 1
            rank[child] = max(rank[child], rank[node] + step)
    return rank


class Layout:
    def __init__(self, model):
        self.m = model
        self.shapes = dict(model.shapes)
        self.new = set()          # element ids whose shape was added/changed
        self.kinds = {}
        self.notes = []
        for proc in model.processes:
            self.kinds.update(proc.nodes)

    def run(self):
        y = POOL_Y
        for box in self.m.shapes.values():
            y = max(y, box.bottom + POOL_GAP)
        laid_out = set()
        for proc in self.m.processes:
            pool = self.m.pool_of(proc.id)
            if not self.m.collaboration and proc is not self.m.processes[0]:
                self.notes.append("process " + proc.id + " has no pool in a "
                                  "collaboration; only the first process is "
                                  "drawn")
                continue
            placed = [n for n in proc.order if n in self.shapes]
            if placed:
                self.extend(proc, pool)
            else:
                y = self.full(proc, pool, y) + POOL_GAP
            laid_out.add(proc.id)
            if proc.inner:
                self.notes.append("the inside of the sub-processes of "
                                  + proc.id + " is not laid out; open them "
                                  "in a modeler")
        for pool, ref in self.m.participants:
            if pool in self.shapes:
                continue
            if ref and ref in laid_out:
                continue
            width = max([b.right for b in self.shapes.values()] or
                        [POOL_X + 600]) - POOL_X
            self.put(pool, Box(POOL_X, y, width, BLACK_BOX_H))
            y += BLACK_BOX_H + POOL_GAP
        return self

    def put(self, element_id, box):
        if not box.same(self.shapes.get(element_id)):
            self.new.add(element_id)
        self.shapes[element_id] = box

    # -- a process without any shape --------------------------------------

    def full(self, proc, pool, top):
        rank = ranks(proc)
        leaves = proc.leaf_lanes()
        rows = [lane.id for lane in leaves] or [None]
        if leaves and any(proc.lane_for(n) is None for n in proc.order):
            rows.append(None)
        slots = {}                # (row, rank) -> [node ids]
        first = priority(proc)
        for node in sorted(proc.order, key=lambda n: first[n]):
            if node in proc.attached:
                continue
            row = proc.lane_for(node) if leaves else None
            slots.setdefault((row, rank[node]), []).append(node)
        heights = {}
        for row in rows:
            count = max([len(v) for (r, _), v in slots.items() if r == row]
                        or [1])
            heights[row] = count * ROW_H
        depth = proc.max_depth()
        band = (LABEL_BAND if pool else 0) + LABEL_BAND * depth
        first_cx = POOL_X + band + MARGIN + TASK_W // 2
        row_y, y = {}, top
        for row in rows:
            row_y[row] = y
            y += heights[row]
        for (row, column), nodes in slots.items():
            for index, node in enumerate(nodes):
                cx = first_cx + column * COL_W
                cy = row_y[row] + index * ROW_H + ROW_H // 2
                self.put(node, centered(proc.nodes[node], cx, cy))
        self.place_boundaries(proc)
        right = max([self.shapes[n].right for n in proc.order
                     if n in self.shapes] or [first_cx]) + MARGIN
        if pool:
            self.put(pool, Box(POOL_X, top, right - POOL_X, y - top))
        lane_x = POOL_X + (LABEL_BAND if pool else 0)
        for lane in proc.all_lanes():
            ids = [leaf.id for leaf in lane.leaves()]
            lane_top = min(row_y[i] for i in ids)
            lane_bottom = max(row_y[i] + heights[i] for i in ids)
            x = lane_x + LABEL_BAND * lane.depth
            self.put(lane.id, Box(x, lane_top, right - x,
                                  lane_bottom - lane_top))
        return y

    def place_boundaries(self, proc):
        per_host = {}
        for boundary, host in proc.attached.items():
            if boundary in self.shapes or host not in self.shapes:
                continue
            box = self.shapes[host]
            index = per_host.get(host, 0)
            per_host[host] = index + 1
            x = box.right - EVENT - 8 - index * (EVENT + 8)
            self.put(boundary, Box(x, box.bottom - EVENT // 2, EVENT, EVENT))

    # -- a process that already has shapes --------------------------------

    def extend(self, proc, pool):
        rank = ranks(proc)
        preds, succs = {}, {}
        for _, source, target in proc.flows:
            preds.setdefault(target, []).append(source)
            succs.setdefault(source, []).append(target)
        missing = sorted((n for n in proc.order
                          if n not in self.shapes and n not in proc.attached),
                         key=lambda n: (rank[n], proc.order.index(n)))
        self.add_missing_lanes(proc, pool)
        for node in missing:
            lane = proc.lane_for(node)
            lane_box = self.shapes.get(lane) if lane else None
            placed_preds = [p for p in preds.get(node, [])
                            if p in self.shapes]
            placed_succs = [s for s in succs.get(node, [])
                            if s in self.shapes]
            if placed_preds:
                anchor = max(placed_preds, key=lambda p: self.shapes[p].cx)
                cx = self.shapes[anchor].cx + COL_W
                same = proc.lane_for(anchor) == lane
                cy = self.shapes[anchor].cy if same else None
            elif placed_succs:
                anchor = min(placed_succs, key=lambda s: self.shapes[s].cx)
                cx = self.shapes[anchor].cx - COL_W
                same = proc.lane_for(anchor) == lane
                cy = self.shapes[anchor].cy if same else None
            else:
                cx = max(b.right for b in self.shapes.values()) + COL_W
                cy = None
            if cy is None:
                cy = lane_box.cy if lane_box else max(
                    b.bottom for b in self.shapes.values()) + ROW_H // 2
            box = centered(proc.nodes[node], cx, cy)
            others = [self.shapes[n] for n in self.shapes
                      if n in self.kinds]
            while any(box.overlaps(o) for o in others):
                box = centered(proc.nodes[node], box.cx + COL_W, cy)
            self.put(node, box)
        self.place_boundaries(proc)
        self.grow(proc, pool)

    def add_missing_lanes(self, proc, pool):
        for lane in proc.leaf_lanes():
            if lane.id in self.shapes:
                continue
            existing = [self.shapes[l.id] for l in proc.all_lanes()
                        if l.id in self.shapes]
            if pool in self.shapes:
                base = self.shapes[pool]
                x, right = base.x + LABEL_BAND, base.right
            elif existing:
                x, right = existing[0].x, existing[0].right
            else:
                x, right = POOL_X, POOL_X + 600
            bottom = max([b.bottom for b in existing]
                         + ([self.shapes[pool].bottom]
                            if pool in self.shapes and existing else [])
                         + ([self.shapes[pool].y] if pool in self.shapes
                            and not existing else []) or [POOL_Y])
            self.put(lane.id, Box(x + LABEL_BAND * lane.depth, bottom,
                                  right - x - LABEL_BAND * lane.depth,
                                  ROW_H))

    def grow(self, proc, pool):
        """Lanes and the pool only grow to the right and at the bottom."""
        nodes = [self.shapes[n] for n in proc.order if n in self.shapes]
        if not nodes:
            return
        right = max(b.right for b in nodes) + MARGIN
        for lane in proc.leaf_lanes():
            box = self.shapes.get(lane.id)
            if box is None:
                continue
            members = [self.shapes[n] for n in proc.order
                       if n in self.shapes and proc.lane_for(n) == lane.id]
            bottom = max([b.bottom + 20 for b in members] + [box.bottom])
            if bottom > box.bottom:
                self.notes.append("lane " + lane.id + " grew; check that it "
                                  "does not overlap the lane below")
            self.put(lane.id, Box(box.x, box.y, max(box.right, right) - box.x,
                                  bottom - box.y))
        for lane in proc.all_lanes():
            if lane.children and lane.id in self.shapes:
                box = self.shapes[lane.id]
                inner = [self.shapes[l.id] for l in lane.leaves()
                         if l.id in self.shapes]
                for other in inner:
                    box = box.union(other)
                self.put(lane.id, Box(self.shapes[lane.id].x, box.y,
                                      box.right - self.shapes[lane.id].x,
                                      box.h))
        lanes = [self.shapes[l.id] for l in proc.all_lanes()
                 if l.id in self.shapes]
        width = max([b.right for b in lanes] + [right])
        for lane in proc.all_lanes():
            box = self.shapes.get(lane.id)
            if box is not None and box.right < width:
                self.put(lane.id, Box(box.x, box.y, width - box.x, box.h))
        if pool in self.shapes:
            box = self.shapes[pool]
            content = nodes + [self.shapes[l.id] for l in proc.all_lanes()
                               if l.id in self.shapes]
            bottom = max([b.bottom for b in content] + [box.bottom])
            right_edge = max([b.right for b in content] + [box.right])
            self.put(pool, Box(box.x, box.y, right_edge - box.x,
                               bottom - box.y))

    # -- edges -------------------------------------------------------------

    def edges(self):
        result = {}
        flows = [(f, s, t, False) for proc in self.m.processes
                 for f, s, t in proc.flows]
        flows += [(f, s, t, True) for f, s, t in self.m.message_flows]
        for flow, source, target, message in flows:
            if source not in self.shapes or target not in self.shapes:
                continue
            if flow in self.m.edges and source not in self.new \
                    and target not in self.new:
                continue
            if message:
                points = route_message(self.shapes[source],
                                       self.shapes[target])
            else:
                obstacles = [self.shapes[n] for n in self.kinds
                             if n in self.shapes and n not in (source, target)
                             and self.kinds[n] != "boundaryEvent"]
                points = route(self.shapes[source], self.shapes[target],
                               self.kinds.get(source, ""), obstacles)
            result[flow] = points
        return result


# ---------------------------------------------------------------------------
# Writing the DI block
# ---------------------------------------------------------------------------

DIAGRAM_BLOCK = re.compile(
    r"([ \t]*)<(?P<p>[\w.-]+:)?BPMNDiagram\b.*?</(?P=p)?BPMNDiagram>[ \t]*\n?",
    re.DOTALL)
DI_CHILD = re.compile(
    r"[ \t]*<(?P<p>[\w.-]+:)?(?P<tag>BPMNShape|BPMNEdge)\b(?P<attrs>[^>]*?)"
    r"(?:/>|>.*?</(?P=p)?(?P=tag)>)[ \t]*\n?", re.DOTALL)
BOUNDS = re.compile(r"<(?P<p>[\w.-]+:)?Bounds\b[^>]*/>")
ATTR = re.compile(r'\b([\w:.-]+)="([^"]*)"')
DEFINITIONS = re.compile(r"<(?P<p>[\w.-]+:)?definitions\b[^>]*>", re.DOTALL)


def prefixes(text):
    """Prefixes of the DI namespaces declared on <definitions>."""
    head = DEFINITIONS.search(text)
    declared = {}
    for name, value in ATTR.findall(head.group(0) if head else ""):
        if name.startswith("xmlns:"):
            declared[value] = name[6:]
    return head, declared


def bounds_xml(dc, box):
    return '<%sBounds x="%d" y="%d" width="%d" height="%d" />' % (
        dc, box.x, box.y, box.w, box.h)


def render(text, model, layout):
    head, declared = prefixes(text)
    if head is None:
        raise LayoutError("no <definitions> element")
    add = []
    names = {}
    for uri, wanted in ((NS_BPMNDI, "bpmndi"), (NS_DC, "dc"), (NS_DI, "di")):
        if uri in declared:
            names[uri] = declared[uri] + ":"
        else:
            prefix = wanted
            while prefix in declared.values():
                prefix += "x"
            declared[uri] = prefix
            names[uri] = prefix + ":"
            add.append(' xmlns:%s="%s"' % (prefix, uri))
    bpmndi, dc, di = names[NS_BPMNDI], names[NS_DC], names[NS_DI]

    match = DIAGRAM_BLOCK.search(text)
    old = match.group(0) if match else ""
    kept = {}
    for child in DI_CHILD.finditer(old):
        attrs = dict(ATTR.findall(child.group("attrs")))
        ref = attrs.get("bpmnElement")
        if ref and ref in model.ids and ref not in kept:
            kept[ref] = (child.group("tag"), child.group(0).rstrip() + "\n")
    edges = layout.edges()

    order = []
    if model.collaboration:
        order += [p for p, _ in model.participants]
    for proc in model.processes:
        order += [l.id for l in proc.all_lanes()]
        order += proc.order
    order += [ref for ref in kept if ref not in order]
    flows = [f for proc in model.processes for f, _, _ in proc.flows]
    flows += [f for f, _, _ in model.message_flows]

    pad = "      "
    lines = []
    pools = [p for p, _ in model.participants]
    lanes = [l.id for p in model.processes for l in p.all_lanes()]
    for ref in order:
        if ref in kept and kept[ref][0] == "BPMNShape":
            snippet = kept[ref][1]
            if ref in layout.new and ref in layout.shapes:
                snippet = BOUNDS.sub(bounds_xml(dc, layout.shapes[ref]),
                                     snippet, count=1)
            lines.append(snippet)
        elif ref in layout.shapes and ref not in kept:
            kind = layout.kinds.get(ref, "")
            extra = ""
            if ref in pools or ref in lanes:
                extra = ' isHorizontal="true"'
            elif kind == "exclusiveGateway":
                extra = ' isMarkerVisible="true"'
            elif kind in BP.PASS_THROUGH_TYPES:
                extra = ' isExpanded="false"'
            lines.append('%s<%sBPMNShape id="%s_di" bpmnElement="%s"%s>\n'
                         '%s  %s\n%s</%sBPMNShape>\n' % (
                             pad, bpmndi, ref, ref, extra, pad,
                             bounds_xml(dc, layout.shapes[ref]), pad,
                             bpmndi))
    for ref in flows + [r for r in kept if kept[r][0] == "BPMNEdge"
                        and r not in flows]:
        if ref in edges:
            points = "".join('%s  <%swaypoint x="%d" y="%d" />\n'
                             % (pad, di, x, y) for x, y in edges[ref])
            lines.append('%s<%sBPMNEdge id="%s_di" bpmnElement="%s">\n'
                         '%s%s</%sBPMNEdge>\n' % (
                             pad, bpmndi, ref, ref, points, pad, bpmndi))
        elif ref in kept and kept[ref][0] == "BPMNEdge":
            lines.append(kept[ref][1])

    plane_ref = model.collaboration or model.processes[0].id
    diagram_id, plane_id = "BPMNDiagram_1", "BPMNPlane_1"
    if old:
        found = re.search(r'BPMNDiagram\b[^>]*\bid="([^"]*)"', old)
        diagram_id = found.group(1) if found else diagram_id
        found = re.search(r'BPMNPlane\b[^>]*\bid="([^"]*)"', old)
        plane_id = found.group(1) if found else plane_id
    block = ('  <%sBPMNDiagram id="%s">\n    <%sBPMNPlane id="%s" '
             'bpmnElement="%s">\n%s    </%sBPMNPlane>\n  </%sBPMNDiagram>\n'
             % (bpmndi, diagram_id, bpmndi, plane_id, plane_ref,
                "".join(lines), bpmndi, bpmndi))
    if match:
        text = text[:match.start()] + block + text[match.end():]
    else:
        closing = re.search(r"</(?:[\w.-]+:)?definitions>\s*$", text)
        if not closing:
            raise LayoutError("no closing </definitions> tag")
        text = text[:closing.start()] + block + text[closing.start():]
    if add:
        tag = head.group(0)
        end = len(tag) - (2 if tag.endswith("/>") else 1)
        text = text.replace(tag, tag[:end] + "".join(add) + tag[end:], 1)
    return text


def missing_di(model):
    """Flow nodes, lanes, pools and flows without DI, as readable strings."""
    result = []
    for proc in model.processes:
        for node in proc.order:
            if node not in model.shapes:
                result.append("shape of " + proc.nodes[node] + " " + node)
        for lane in proc.all_lanes():
            if lane.id not in model.shapes:
                result.append("shape of lane " + lane.id)
        for flow, _, _ in proc.flows:
            if flow not in model.edges:
                result.append("edge of sequence flow " + flow)
    for pool, _ in model.participants:
        if pool not in model.shapes:
            result.append("shape of pool " + pool)
    return result


def layout_text(text):
    data = text.encode("utf-8")
    try:
        model = Model(data)
    except BP.BpmnError as exc:
        raise LayoutError(str(exc))
    layout = Layout(model).run()
    notes = list(layout.notes)
    if model.diagram_count > 1:
        notes.append("the file has %d diagrams; only the first one was laid "
                     "out" % model.diagram_count)
    return render(text, model, layout), layout.new, notes


# ---------------------------------------------------------------------------
# Self-test
# ---------------------------------------------------------------------------

SEMANTIC = """<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:collaboration id="Collaboration_1">
    <bpmn:participant id="Participant_Library" name="City Library" processRef="BP-001" />
  </bpmn:collaboration>
  <bpmn:process id="BP-001" name="Book Loan" isExecutable="false">
    <bpmn:laneSet id="LaneSet_1">
      <bpmn:lane id="Lane_Member" name="Member">
        <bpmn:flowNodeRef>StartEvent_BookWanted</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_ReserveBook</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_JoinWaitingList</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>EndEvent_Waitlisted</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_Librarian" name="Librarian">
        <bpmn:flowNodeRef>Gateway_CopyAvailable</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_LendBook</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>EndEvent_BookLent</bpmn:flowNodeRef>
      </bpmn:lane>
    </bpmn:laneSet>
    <bpmn:startEvent id="StartEvent_BookWanted" name="Book wanted" />
    <bpmn:userTask id="Activity_ReserveBook" name="UC-021 Reserve Book" />
    <bpmn:exclusiveGateway id="Gateway_CopyAvailable" name="Copy available?" />
    <bpmn:userTask id="Activity_LendBook" name="UC-022 Lend Book" />
    <bpmn:userTask id="Activity_JoinWaitingList" name="UC-023 Join Waiting List" />
    <bpmn:endEvent id="EndEvent_BookLent" name="Book lent" />
    <bpmn:endEvent id="EndEvent_Waitlisted" name="Member waitlisted" />
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_BookWanted" targetRef="Activity_ReserveBook" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_ReserveBook" targetRef="Gateway_CopyAvailable" />
    <bpmn:sequenceFlow id="Flow_Yes" name="yes" sourceRef="Gateway_CopyAvailable" targetRef="Activity_LendBook" />
    <bpmn:sequenceFlow id="Flow_No" name="no" sourceRef="Gateway_CopyAvailable" targetRef="Activity_JoinWaitingList" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_LendBook" targetRef="EndEvent_BookLent" />
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Activity_JoinWaitingList" targetRef="EndEvent_Waitlisted" />
  </bpmn:process>
</bpmn:definitions>
"""


def self_test():
    failures = []

    def check(name, condition):
        if not condition:
            failures.append(name)

    first, new, _ = layout_text(SEMANTIC)
    model = Model(first.encode("utf-8"))
    check("full: every element has DI", missing_di(model) == [])
    check("full: namespaces declared",
          'xmlns:bpmndi="' + NS_BPMNDI + '"' in first
          and 'xmlns:dc="' + NS_DC + '"' in first)
    body = SEMANTIC[SEMANTIC.index("<bpmn:collaboration"):
                    SEMANTIC.index("</bpmn:definitions>")]
    check("full: semantic model untouched", body in first)
    member, librarian = model.shapes["Lane_Member"], model.shapes[
        "Lane_Librarian"]
    check("full: lanes stacked", member.bottom == librarian.y)
    check("full: start left of activity",
          model.shapes["StartEvent_BookWanted"].right
          < model.shapes["Activity_ReserveBook"].x)
    check("full: lend book in librarian lane",
          librarian.y <= model.shapes["Activity_LendBook"].y
          and model.shapes["Activity_LendBook"].bottom <= librarian.bottom)
    nodes = [model.shapes[n] for n in model.processes[0].order]
    check("full: no overlapping shapes",
          not any(a.overlaps(b, 0) for i, a in enumerate(nodes)
                  for b in nodes[i + 1:]))
    pool = model.shapes["Participant_Library"]
    check("full: pool contains the lanes",
          pool.x < member.x and pool.bottom == librarian.bottom)

    second, new, _ = layout_text(first)
    check("rerun: idempotent", second == first and not new)

    moved = first.replace(
        bounds_xml("dc:", model.shapes["Activity_ReserveBook"]),
        bounds_xml("dc:", Box(model.shapes["Activity_ReserveBook"].x,
                              model.shapes["Activity_ReserveBook"].y + 10,
                              TASK_W, TASK_H)))
    third, new, _ = layout_text(moved)
    check("rerun: moved shape kept",
          Model(third.encode("utf-8")).shapes["Activity_ReserveBook"].y
          == model.shapes["Activity_ReserveBook"].y + 10)

    grown = first.replace(
        '<bpmn:endEvent id="EndEvent_BookLent" name="Book lent" />',
        '<bpmn:userTask id="Activity_ReturnBook" name="UC-024 Return Book" />'
        '\n    <bpmn:endEvent id="EndEvent_BookLent" name="Book lent" />'
    ).replace(
        'sourceRef="Activity_LendBook" targetRef="EndEvent_BookLent"',
        'sourceRef="Activity_LendBook" targetRef="Activity_ReturnBook" />\n'
        '    <bpmn:sequenceFlow id="Flow_5" sourceRef="Activity_ReturnBook" '
        'targetRef="EndEvent_BookLent"'
    ).replace(
        "<bpmn:flowNodeRef>EndEvent_BookLent</bpmn:flowNodeRef>",
        "<bpmn:flowNodeRef>Activity_ReturnBook</bpmn:flowNodeRef>\n"
        "        <bpmn:flowNodeRef>EndEvent_BookLent</bpmn:flowNodeRef>")
    fourth, new, _ = layout_text(grown)
    after = Model(fourth.encode("utf-8"))
    check("extend: new activity has DI", missing_di(after) == [])
    check("extend: old shapes unchanged",
          all(after.shapes[n].same(model.shapes[n])
              for n in model.processes[0].order))
    check("extend: new activity right of lend book",
          after.shapes["Activity_ReturnBook"].x
          > model.shapes["Activity_LendBook"].right)
    check("extend: new edges", "Flow_5_di" in fourth)
    removed = fourth.replace(
        '<bpmn:userTask id="Activity_JoinWaitingList" name="UC-023 Join '
        'Waiting List" />', "")
    fifth, _, _ = layout_text(removed)
    check("shrink: DI of removed element dropped",
          'bpmnElement="Activity_JoinWaitingList"' not in fifth)

    try:
        layout_text('<?xml version="1.0"?>\n<!DOCTYPE d [<!ENTITY x "y">]>'
                    '<definitions/>')
        failures.append("xxe: DOCTYPE was accepted")
    except LayoutError:
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
        description="Add diagram layout (DI) to BPMN 2.0 process models.")
    parser.add_argument("files", nargs="*", help=".bpmn files to lay out")
    parser.add_argument("--check", action="store_true",
                        help="only report elements without DI")
    parser.add_argument("--self-test", action="store_true",
                        help="run the built-in fixtures and exit")
    args = parser.parse_args(argv)

    if BP is None:
        print("ERROR: bpmn_paths.py (test-case skill) not found next to this "
              "skill; install the test-case skill", file=sys.stderr)
        return 2
    if args.self_test:
        return self_test()
    if not args.files:
        parser.print_usage()
        return 2
    status = 0
    for path in args.files:
        try:
            with open(path, encoding="utf-8") as handle:
                text = handle.read()
            if args.check:
                try:
                    missing = missing_di(Model(text.encode("utf-8")))
                except BP.BpmnError as exc:
                    raise LayoutError(str(exc))
                for item in missing:
                    print(path + ": missing " + item)
                if missing:
                    status = 1
                continue
            result, new, notes = layout_text(text)
            if result != text:
                with open(path, "w", encoding="utf-8") as handle:
                    handle.write(result)
            print("%s: %d shape(s) added or resized" % (path, len(new)))
            for note in notes:
                print(path + ": NOTE " + note)
        except OSError as exc:
            print(path + ": ERROR IO: " + str(exc), file=sys.stderr)
            status = 1
        except LayoutError as exc:
            print(path + ": ERROR: " + str(exc), file=sys.stderr)
            status = 1
    return status


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
