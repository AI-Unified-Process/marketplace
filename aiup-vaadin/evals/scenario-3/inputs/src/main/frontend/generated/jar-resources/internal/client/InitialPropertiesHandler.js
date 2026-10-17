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
import { Reactive } from './flow/reactive/Reactive';
import { NodeFeatures } from '../flow/internal/nodefeature/NodeFeatures';
/**
 * Handles server initial property values so client-side defaults don't override
 * them; mirrors InitialPropertiesHandler.java.
 */
export class InitialPropertiesHandler {
    #registry;
    #newNodeDuringUpdate = new Set();
    #propertyUpdateQueue = [];
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry) {
        this.#registry = registry;
    }
    /**
     * Flushes the collected property update queue. Supposed to be called at the
     * end of tree change processing.
     */
    flushPropertyUpdates() {
        if (!this.#registry.getStateTree().isUpdateInProgress()) {
            const properties = new Map();
            this.#newNodeDuringUpdate.forEach((node) => this.#collectInitialProperties(node, properties));
            Reactive.addPostFlushListener(() => this.#doFlushPropertyUpdates(properties));
        }
    }
    /**
     * Notifies the handler about registered node.
     *
     * The method is called for the newly created `node` which is registered in
     * the {@link StateTree}.
     *
     * @param node - the newly registered node
     */
    nodeRegistered(node) {
        this.#newNodeDuringUpdate.add(node.getId());
    }
    /**
     * Handles the property update before it's sent to the server via RPC.
     *
     * The method returns `true` for the `property` which shouldn't be sent to
     * the server because it's going to be handled by the handler (queued and sent
     * later on if allowed).
     *
     * @param property - property to handle
     * @returns `true` if property is handled by the handler, `false` otherwise
     */
    handlePropertyUpdate(property) {
        if (this.#isNodeNewlyCreated(property.getMap().getNode())) {
            this.#propertyUpdateQueue.push(property);
            return true;
        }
        return false;
    }
    #resetProperty(property, properties) {
        const ignoreProperties = properties.get(property.getMap().getNode().getId());
        if (ignoreProperties !== undefined && ignoreProperties.has(property.getName())) {
            property.setValue(ignoreProperties.get(property.getName()));
            return true;
        }
        return false;
    }
    #isNodeNewlyCreated(node) {
        return this.#newNodeDuringUpdate.has(node.getId());
    }
    #doFlushPropertyUpdates(properties) {
        this.#newNodeDuringUpdate.clear();
        while (this.#propertyUpdateQueue.length > 0) {
            const property = this.#propertyUpdateQueue.shift();
            if (!this.#resetProperty(property, properties)) {
                this.#registry.getStateTree().sendNodePropertySyncToServer(property);
            }
            /*
             * Do flush after each property update. There may be several properties
             * and it looks like a property update may trigger default values of other
             * properties back. See https://github.com/vaadin/flow/issues/2304
             */
            Reactive.flush();
        }
    }
    #collectInitialProperties(id, properties) {
        // Java dereferences the looked-up node unguarded: a node that is gone must
        // fail here rather than silently contribute no initial properties.
        const node = this.#registry.getStateTree().getNode(id);
        if (node.hasFeature(NodeFeatures.ELEMENT_PROPERTIES)) {
            const map = new Map();
            node
                .getMap(NodeFeatures.ELEMENT_PROPERTIES)
                .forEachProperty((property, name) => map.set(name, property.getValue()));
            properties.set(id, map);
        }
    }
}
//# sourceMappingURL=InitialPropertiesHandler.js.map