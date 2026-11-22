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
import { NodeFeatures } from '../flow/internal/nodefeature/NodeFeatures';
import { getTag, invokeWhenDefined } from './PolymerUtils';
import { Reactive } from './flow/reactive/Reactive';
import { getJsProperty } from './WidgetUtil';
import { UpdatableModelProperties } from './flow/model/UpdatableModelProperties';
import { Console } from './Console';
// Per-node map of initializer id -> cleanup callback.
const initializerCleanups = new Map();
/**
 * Calculate the data required for server side callback to attach existing
 * element and send it to the server.
 *
 * @param parent - the parent node whose child is requested to attach
 * @param previousSibling - previous sibling element
 * @param tagName - the tag name of the element requested to attach
 * @param id - the identifier of the server side node which is requested to be a counterpart of the client side element
 */
export function attachExistingElement(parent, previousSibling, tagName, id) {
    let existingElement = null;
    // Java dereferences the parent's DOM node unguarded.
    const childNodes = parent.getDomNode().childNodes;
    const indices = new Map();
    let afterSibling = previousSibling === null;
    let elementIndex = -1;
    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        indices.set(node, i);
        if (node === previousSibling) {
            afterSibling = true;
        }
        if (afterSibling && hasTag(node, tagName)) {
            existingElement = node;
            elementIndex = i;
            break;
        }
    }
    if (existingElement === null) {
        // Report an error (no matching element found).
        parent.getTree().sendExistingElementAttachToServer(parent, id, -1, tagName, -1);
        return;
    }
    const list = parent.getList(NodeFeatures.ELEMENT_CHILDREN);
    let existingId = null;
    let childIndex = 0;
    for (let i = 0; i < list.length(); i++) {
        const stateNode = list.get(i);
        const domNode = stateNode.getDomNode();
        const index = indices.get(domNode);
        if (index !== undefined && index < elementIndex) {
            childIndex++;
        }
        if (domNode === existingElement) {
            existingId = stateNode.getId();
            break;
        }
    }
    existingId = getExistingIdOrUpdate(parent, id, existingElement, existingId);
    parent.getTree().sendExistingElementAttachToServer(parent, id, existingId, existingElement.tagName, childIndex);
}
function hasTag(node, tag) {
    return node instanceof Element && tag.toLowerCase() === node.tagName.toLowerCase();
}
/**
 * Populate model `properties`: add them into
 * `NodeFeatures.NodeFeatures.ELEMENT_PROPERTIES` {@link NodeMap} if they are
 * not defined by the client-side element or send their client-side value to
 * the server otherwise.
 *
 * @param node - the node whose properties should be populated
 * @param properties - array of property names to populate
 */
export function populateModelProperties(node, properties) {
    const map = node.getMap(NodeFeatures.ELEMENT_PROPERTIES);
    if (node.getDomNode() === null) {
        invokeWhenDefined(getTag(node), () => Reactive.addPostFlushListener(() => populateModelProperties(node, properties)));
        return;
    }
    for (const property of properties) {
        populateMapProperty(node, map, property);
    }
}
function populateMapProperty(node, map, property) {
    const domNode = node.getDomNode();
    if (!isPropertyDefined(domNode, property)) {
        if (!map.hasPropertyValue(property)) {
            map.getProperty(property).setValue(null);
        }
    }
    else {
        const updatableProperties = node.getNodeData(UpdatableModelProperties);
        if (updatableProperties === null || !updatableProperties.isUpdatableProperty(property)) {
            return;
        }
        map.getProperty(property).syncToServer(getJsProperty(domNode, property));
    }
}
/**
 * Register the updatable model properties of the `node`.
 *
 * Only updates for the properties from the `properties` array will be
 * sent to the server without explicit synchronization. The
 * `properties` array includes all properties that are allowed to be
 * updated (including sub properties).
 *
 * @param node - the node whose updatable properties should be registered
 * @param properties - all updatable model properties
 */
export function registerUpdatableModelProperties(node, properties) {
    if (properties.length > 0) {
        node.setNodeData(new UpdatableModelProperties(properties));
    }
}
/**
 * Stores a cleanup callback for a JS initializer registered through
 * {@link com.vaadin.flow.dom.Element#addJsInitializer}. If a callback was
 * previously stored for the same id, it is invoked before being replaced
 * (defensive against stale state from a discarded DOM). On the first
 * registration for a node, an unregister listener is attached so that all
 * remaining cleanups are drained when the node leaves the tree.
 *
 * @param node - the state node owning the initializer, not `null`
 * @param id - the UI-wide initializer id
 * @param cleanup - the JS cleanup function to invoke when disposing, not `null`
 */
export function registerInitializer(node, id, cleanup) {
    let entry = initializerCleanups.get(node);
    if (entry === undefined) {
        entry = new Map();
        initializerCleanups.set(node, entry);
        node.addUnregisterListener(() => drainInitializers(node));
    }
    const existing = entry.get(id);
    // Install the new cleanup before invoking the previous one so a re-entrant
    // register/dispose from inside the existing callback sees the new state.
    entry.set(id, cleanup);
    if (existing !== undefined) {
        invokeSafely(existing);
    }
}
/**
 * Disposes a previously registered JS initializer cleanup. No-op if the id
 * is unknown (e.g. the node has already been unregistered).
 *
 * @param node - the state node owning the initializer, not `null`
 * @param id - the UI-wide initializer id
 */
export function disposeInitializer(node, id) {
    const entry = initializerCleanups.get(node);
    if (entry === undefined) {
        return;
    }
    const fn = entry.get(id);
    if (fn === undefined) {
        return;
    }
    entry.delete(id);
    invokeSafely(fn);
}
function drainInitializers(node) {
    const entry = initializerCleanups.get(node);
    if (entry === undefined) {
        return;
    }
    initializerCleanups.delete(node);
    entry.forEach((fn) => invokeSafely(fn));
}
function invokeSafely(fn) {
    try {
        fn();
    }
    catch (error) {
        Console.error(error instanceof Error ? error.message : String(error));
    }
}
function getExistingIdOrUpdate(parent, serverSideId, existingElement, existingId) {
    if (existingId === null) {
        const map = parent.getTree().getRegistry().getExistingElementMap();
        const fromMap = map.getId(existingElement);
        if (fromMap === null) {
            map.add(serverSideId, existingElement);
            return serverSideId;
        }
        return fromMap;
    }
    return existingId;
}
/**
 * Checks whether the node's element class declares the given property with a
 * default value (Polymer-style static `properties` with a `value`).
 */
function isPropertyDefined(node, property) {
    const ctor = node.constructor;
    const declared = ctor && ctor.properties && ctor.properties[property];
    return !!declared && typeof declared.value !== 'undefined';
}
//# sourceMappingURL=ExecuteJavaScriptElementUtils.js.map