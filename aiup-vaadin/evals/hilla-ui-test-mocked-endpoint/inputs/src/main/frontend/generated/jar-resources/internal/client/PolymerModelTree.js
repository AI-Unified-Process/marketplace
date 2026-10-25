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
// TypeScript port of the StateNode-coupled model-tree building from
// com.vaadin.client.PolymerUtils (createModelTree and its change handlers). It
// is kept out of internal/PolymerUtils.ts (which holds the DOM/Polymer probes
// and model-data writers) because it depends on the whole reactive state tree;
// it imports the Polymer model-data writers (splice/setProperty/isPolymerElement)
// from there.
//
// createModelTree converts a StateNode/MapProperty model into the plain JS model
// object Polymer binds to, recursively, tagging each object with its nodeId and
// registering reactive change handlers that push later model changes into the
// Polymer element (or the plain payload object when the host is not Polymer).
import { assert } from '../assert';
import { NodeFeatures } from '../flow/internal/nodefeature/NodeFeatures';
import { NodeProperties } from '../flow/internal/nodefeature/NodeProperties';
import { MapProperty } from './flow/nodefeature/MapProperty';
import { NodeList } from './flow/nodefeature/NodeList';
import { NodeMap } from './flow/nodefeature/NodeMap';
import { isPolymerElement, setProperty, splice } from './PolymerUtils';
import { Reactive } from './flow/reactive/Reactive';
import { StateNode } from './flow/StateNode';
import { setJsProperty } from './WidgetUtil';
import { Console } from './Console';
/**
 * Makes an attempt to convert an object into json.
 *
 * @param object - the object to convert to json
 * @returns json from object, `null` for null
 */
export function createModelTree(object) {
    if (object instanceof StateNode) {
        const node = object;
        let feature = null;
        if (node.hasFeature(NodeFeatures.ELEMENT_PROPERTIES)) {
            feature = node.getMap(NodeFeatures.ELEMENT_PROPERTIES);
        }
        else if (node.hasFeature(NodeFeatures.TEMPLATE_MODELLIST)) {
            feature = node.getList(NodeFeatures.TEMPLATE_MODELLIST);
        }
        else if (node.hasFeature(NodeFeatures.BASIC_TYPE_VALUE)) {
            return createModelTree(node.getMap(NodeFeatures.BASIC_TYPE_VALUE).getProperty(NodeProperties.VALUE));
        }
        assert(feature !== null, "Don't know how to convert node without map or list features");
        const convert = feature.convert(createModelTree);
        // Register change handlers for both model objects (ELEMENT_PROPERTIES) and
        // model lists (TEMPLATE_MODELLIST). The Java original gates on
        // `convert instanceof JsonObject`, which in elemental.json is also true for a
        // JsonArray, so list nodes get their splice listener registered too — arrays
        // must NOT be excluded here, otherwise model-list splices never reach Polymer.
        if (typeof convert === 'object' && convert !== null && !('nodeId' in convert)) {
            convert.nodeId = node.getId();
            registerChangeHandlers(node, feature, convert);
        }
        return convert;
    }
    else if (object instanceof MapProperty) {
        const property = object;
        if (property.getMap().getId() === NodeFeatures.BASIC_TYPE_VALUE) {
            return createModelTree(property.getValue());
        }
        const convertedObject = {};
        convertedObject[property.getName()] = createModelTree(property.getValue());
        return convertedObject;
    }
    // Java returns WidgetUtil.crazyJsoCast(object) here; that is a
    // GWT-compiler-only unchecked cast with no runtime effect and no port, so the
    // value is passed straight through.
    return object;
}
function registerChangeHandlers(node, feature, value) {
    const registrations = [];
    if (node.hasFeature(NodeFeatures.ELEMENT_PROPERTIES)) {
        assert(feature instanceof NodeMap, 'Received an inconsistent NodeFeature for a node that has a ELEMENT_PROPERTIES feature. ' +
            `It should be NodeMap, but it is: ${String(feature)}`);
        const map = feature;
        registerPropertyChangeHandlers(value, registrations, map);
        registerPropertyAddHandler(value, registrations, map);
    }
    else if (node.hasFeature(NodeFeatures.TEMPLATE_MODELLIST)) {
        assert(feature instanceof NodeList, 'Received an inconsistent NodeFeature for a node that has a TEMPLATE_MODELLIST feature. ' +
            `It should be NodeList, but it is: ${String(feature)}`);
        const list = feature;
        registrations.push(list.addSpliceListener((event) => handleListChange(event, value)));
    }
    assert(registrations.length !== 0, 'Node should have ELEMENT_PROPERTIES or TEMPLATE_MODELLIST feature');
    registrations.push(node.addUnregisterListener(() => registrations.forEach((registration) => registration.remove())));
}
function registerPropertyAddHandler(value, registrations, map) {
    registrations.push(map.addPropertyAddListener((event) => {
        const property = event.getProperty();
        registrations.push(property.addChangeListener(() => handlePropertyChange(property, value)));
        handlePropertyChange(property, value);
    }));
}
function registerPropertyChangeHandlers(value, registrations, map) {
    map.forEachProperty((property) => registrations.push(property.addChangeListener(() => handlePropertyChange(property, value))));
}
function handleListChange(event, value) {
    Reactive.addFlushListener(() => doHandleListChange(event, value));
}
function doHandleListChange(event, value) {
    const add = event.getAdd();
    const index = event.getIndex();
    const remove = event.getRemove().length;
    const node = event.getSource().getNode();
    const root = getFirstParentWithDomNode(node);
    if (root === null) {
        Console.warn(`Root node for node ${node.getId()} could not be found`);
        return;
    }
    const array = add.map((item) => createModelTree(item));
    if (isPolymerElement(root.getDomNode())) {
        const path = getNotificationPath(root, node, null);
        if (path !== null) {
            splice(root.getDomNode(), path, index, remove, array);
            return;
        }
    }
    value.splice(index, remove, ...array);
}
function handlePropertyChange(property, bean) {
    Reactive.addFlushListener(() => doHandlePropertyChange(property, bean));
}
function doHandlePropertyChange(property, value) {
    const propertyName = property.getName();
    const node = property.getMap().getNode();
    const root = getFirstParentWithDomNode(node);
    if (root === null) {
        Console.warn(`Root node for node ${node.getId()} could not be found`);
        return;
    }
    const modelTree = createModelTree(property.getValue());
    if (isPolymerElement(root.getDomNode())) {
        const path = getNotificationPath(root, node, propertyName);
        if (path !== null) {
            setProperty(root.getDomNode(), path, modelTree);
        }
        return;
    }
    setJsProperty(value, propertyName, modelTree);
}
function getNotificationPath(rootNode, currentNode, propertyName) {
    const path = [];
    if (propertyName !== null) {
        path.push(propertyName);
    }
    return doGetNotificationPath(rootNode, currentNode, path);
}
function doGetNotificationPath(rootNode, currentNode, path) {
    const parent = currentNode.getParent();
    if (parent.hasFeature(NodeFeatures.ELEMENT_PROPERTIES)) {
        const propertyPath = getPropertiesNotificationPath(currentNode);
        if (propertyPath === null) {
            return null;
        }
        path.push(propertyPath);
    }
    else if (parent.hasFeature(NodeFeatures.TEMPLATE_MODELLIST)) {
        const listPath = getListNotificationPath(currentNode);
        if (listPath === null) {
            return null;
        }
        path.push(listPath);
    }
    if (parent !== rootNode) {
        return doGetNotificationPath(rootNode, parent, path);
    }
    let result = '';
    let separator = '';
    for (let i = path.length - 1; i >= 0; i--) {
        result += separator + path[i];
        separator = '.';
    }
    return result;
}
function getListNotificationPath(currentNode) {
    let indexInTheList = -1;
    const children = currentNode.getParent().getList(NodeFeatures.TEMPLATE_MODELLIST);
    for (let i = 0; i < children.length(); i++) {
        if (currentNode === children.get(i)) {
            indexInTheList = i;
            break;
        }
    }
    if (indexInTheList < 0) {
        return null;
    }
    return String(indexInTheList);
}
function getPropertiesNotificationPath(currentNode) {
    let propertyNameInTheMap = null;
    const map = currentNode.getParent().getMap(NodeFeatures.ELEMENT_PROPERTIES);
    for (const propertyName of map.getPropertyNames()) {
        if (currentNode === map.getProperty(propertyName).getValue()) {
            propertyNameInTheMap = propertyName;
            break;
        }
    }
    return propertyNameInTheMap;
}
/**
 * Gets the first parent node that also has a DOM Node attached to it.
 *
 * @param node - the node
 * @returns the first parent node with a DOM Node, or `null` if none can be found
 */
function getFirstParentWithDomNode(node) {
    let parent = node.getParent();
    while (parent !== null && parent.getDomNode() === null) {
        parent = parent.getParent();
    }
    return parent;
}
//# sourceMappingURL=PolymerModelTree.js.map