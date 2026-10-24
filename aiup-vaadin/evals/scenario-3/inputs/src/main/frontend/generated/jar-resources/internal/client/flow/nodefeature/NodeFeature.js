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
/**
 * Holder of the actual data in a state node. The state node data is isolated
 * into different features of related data.
 */
export class NodeFeature {
    #id;
    #node;
    /**
     * Creates a new feature.
     *
     * @param id - the id of the feature
     * @param node - the node that the feature belongs to
     */
    constructor(id, node) {
        this.#id = id;
        this.#node = node;
    }
    /**
     * Gets the id of this feature.
     *
     * @returns the id
     */
    getId() {
        return this.#id;
    }
    /**
     * Gets the node of this feature.
     *
     * @returns the node
     */
    getNode() {
        return this.#node;
    }
    /**
     * Helper for getting a JSON representation of a child value.
     *
     * @param value - the child value
     * @returns the JSON representation
     */
    getAsDebugJson(value) {
        if (isStateNode(value)) {
            return value.getDebugJson();
        }
        return value;
    }
}
/**
 * Tells whether the given value is a `StateNode`, i.e. exposes a `getDebugJson`
 * method. Port deviation: Java uses `value instanceof StateNode`
 * ({@link NodeFeature.getAsDebugJson}), but `NodeFeature` is the base class of
 * `NodeList`/`NodeMap`, so a runtime (value) import of `StateNode` — needed for a
 * real `instanceof` — would form a circular `class NodeList extends NodeFeature`
 * initialization cycle (`NodeFeature` → `StateNode` → `NodeList`/`NodeMap` →
 * `NodeFeature`). `StateNode` is therefore imported type-only and the check is
 * structural; it is behaviorally equivalent for the values a feature holds
 * (primitives or child `StateNode`s).
 */
function isStateNode(value) {
    return (value !== null &&
        typeof value === 'object' &&
        typeof value.getDebugJson === 'function');
}
//# sourceMappingURL=NodeFeature.js.map