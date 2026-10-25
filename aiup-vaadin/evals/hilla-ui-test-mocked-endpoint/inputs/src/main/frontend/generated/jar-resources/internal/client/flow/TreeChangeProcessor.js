/*
 * Copyright 2000-2026 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
// TypeScript port of com.vaadin.client.flow.TreeChangeProcessor, built alongside
// the Java version on top of the TS state tree. It applies a batch of
// server-sent JSON changes (attach/detach, map put/remove, list splice/clear,
// feature populate) to the StateTree. Changes are plain JS objects; values are
// passed through ClientJsonCodec.decodeWithoutTypeInfo (a no-op in JS).
import { assert } from '../../assert';
import { decodeWithoutTypeInfo } from './util/ClientJsonCodec';
import { JsonConstants } from '../../flow/shared/JsonConstants';
import { StateNode } from './StateNode';
import { stringify } from '../WidgetUtil';
/**
 * Update a state tree based on a JSON array of changes.
 *
 * @param tree - the tree to update
 * @param changes - the JSON array of changes
 * @returns a set of updated nodes addressed by the `changes`
 */
export function processChanges(tree, changes) {
    assert(!tree.isUpdateInProgress(), 'Previous tree change processing has not completed');
    try {
        tree.setUpdateInProgress(true);
        // Attach all nodes before doing anything else.
        const nodes = processAttachChanges(tree, changes);
        for (const change of changes) {
            if (!isAttach(change)) {
                const value = processChange(tree, change);
                if (value !== null) {
                    nodes.add(value);
                }
            }
        }
        return nodes;
    }
    finally {
        tree.setUpdateInProgress(false);
        tree.setResync(false);
    }
}
function processAttachChanges(tree, changes) {
    const nodes = new Set();
    for (const change of changes) {
        if (isAttach(change)) {
            const nodeId = change[JsonConstants.CHANGE_NODE];
            if (nodeId !== tree.getRootNode().getId()) {
                const node = new StateNode(nodeId, tree);
                tree.registerNode(node);
                nodes.add(node);
            }
        }
    }
    return nodes;
}
function isAttach(change) {
    return change[JsonConstants.CHANGE_TYPE] === JsonConstants.CHANGE_TYPE_ATTACH;
}
/**
 * Update a state tree based on a JSON change. This method is public for testing
 * purposes.
 *
 * @param tree - the tree to update
 * @param change - the JSON change
 * @returns the updated node addressed by the provided `change`
 */
export function processChange(tree, change) {
    const type = change[JsonConstants.CHANGE_TYPE];
    const nodeId = change[JsonConstants.CHANGE_NODE];
    const node = tree.getNode(nodeId);
    if (node === null && tree.isResync()) {
        // Resync should not stop handling changes.
        return node;
    }
    assert(node !== null, 'No attached node found');
    switch (type) {
        case JsonConstants.CHANGE_TYPE_NOOP:
            populateFeature(change, node);
            break;
        case JsonConstants.CHANGE_TYPE_SPLICE:
            processSpliceChange(change, node);
            break;
        case JsonConstants.CHANGE_TYPE_PUT:
            processPutChange(change, node);
            break;
        case JsonConstants.CHANGE_TYPE_REMOVE:
            processRemoveChange(change, node);
            break;
        case JsonConstants.CHANGE_TYPE_DETACH:
            processDetachChange(tree, node);
            break;
        case JsonConstants.CHANGE_TYPE_CLEAR:
            processClearChange(change, node);
            break;
        default:
            assert(false, `Unsupported change type: ${type}`);
    }
    return node;
}
function processDetachChange(tree, node) {
    tree.unregisterNode(node);
    node.setParent(null);
}
function populateFeature(change, node) {
    assert(JsonConstants.CHANGE_FEATURE_TYPE in change, "Change doesn't contain feature type. Don't know how to populate feature");
    const featureId = change[JsonConstants.CHANGE_FEATURE];
    if (change[JsonConstants.CHANGE_FEATURE_TYPE]) {
        // list feature
        node.getList(featureId);
    }
    else {
        node.getMap(featureId);
    }
}
function processPutChange(change, node) {
    const property = findProperty(change, node);
    if (JsonConstants.CHANGE_PUT_VALUE in change) {
        property.setValue(decodeWithoutTypeInfo(change[JsonConstants.CHANGE_PUT_VALUE]));
    }
    else if (JsonConstants.CHANGE_PUT_NODE_VALUE in change) {
        const childId = change[JsonConstants.CHANGE_PUT_NODE_VALUE];
        const child = node.getTree().getNode(childId);
        assert(child !== null, 'No child node found');
        child.setParent(node);
        property.setValue(child);
    }
    else {
        assert(false, `Change should have either value or nodeValue property: ${stringify(change)}`);
    }
}
function processRemoveChange(change, node) {
    findProperty(change, node).removeValue();
}
function findProperty(change, node) {
    const nsId = change[JsonConstants.CHANGE_FEATURE];
    const map = node.getMap(nsId);
    return map.getProperty(change[JsonConstants.CHANGE_MAP_KEY]);
}
function processSpliceChange(change, node) {
    const nsId = change[JsonConstants.CHANGE_FEATURE];
    const list = node.getList(nsId);
    const index = change[JsonConstants.CHANGE_SPLICE_INDEX];
    const remove = JsonConstants.CHANGE_SPLICE_REMOVE in change ? change[JsonConstants.CHANGE_SPLICE_REMOVE] : 0;
    if (JsonConstants.CHANGE_SPLICE_ADD in change) {
        // In JS the JSON array is used as-is.
        list.splice(index, remove, change[JsonConstants.CHANGE_SPLICE_ADD]);
    }
    else if (JsonConstants.CHANGE_SPLICE_ADD_NODES in change) {
        const addNodes = change[JsonConstants.CHANGE_SPLICE_ADD_NODES];
        const tree = node.getTree();
        const add = addNodes.map((childId) => {
            const child = tree.getNode(childId);
            assert(child !== null, `No child node found with id ${childId}`);
            child.setParent(node);
            return child;
        });
        list.splice(index, remove, add);
    }
    else {
        list.splice(index, remove);
    }
}
function processClearChange(change, node) {
    node.getList(change[JsonConstants.CHANGE_FEATURE]).clear();
}
//# sourceMappingURL=TreeChangeProcessor.js.map