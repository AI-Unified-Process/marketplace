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
 * A representation of a server object able to send notifications to the server.
 */
// TypeScript port of com.vaadin.client.flow.binding.ServerEventObject -- the
// element.$server RPC object that sends event notifications to the server.
//
// It covers the $server lifecycle (get/getIfPresent), method definition
// (defineMethod), method management (initPromiseHandler/removeMethod/getMethods/
// rejectPromises), the node-based getPolymerPropertyObject, and the server
// event-data collection (getEventData and its expression evaluation), operating
// on the TypeScript StateNode/StateTree/ConstantPool.
//
// The Java defineMethod's $entry wrapper -- which routed handler exceptions to
// GWT's uncaught-exception handler -- has no equivalent: the handler is installed
// as a plain function and exceptions surface through the browser. The handler
// reads `this`/`arguments`, so it must stay a regular `function`, not an arrow.
import { JsonConstants } from '../../../flow/shared/JsonConstants';
import { NodeFeatures } from '../../../flow/internal/nodefeature/NodeFeatures';
import { getJsProperty, setJsProperty } from '../../WidgetUtil';
const NODE_ID = 'nodeId';
// Expressions starting with this prefix are evaluated against the DOM event;
// other expressions describe a Polymer model property and resolve to a node id.
const EVENT_PREFIX = 'event';
// The (non-enumerable) key under which the promise-callback function is stored.
const PROMISE_CALLBACK_NAME = JsonConstants.RPC_PROMISE_CALLBACK_NAME;
const expressionCache = new Map();
/**
 * Installs the non-enumerable promise-callback function on the $server object.
 * The server calls it (by the promiseCallbackName key) to settle a pending
 * promise created by a returnPromise method, identified by promiseId.
 */
function initPromiseHandler(serverObject) {
    const promiseCallbackName = PROMISE_CALLBACK_NAME;
    Object.defineProperty(serverObject, promiseCallbackName, {
        value: function (promiseId, success, value) {
            const promise = serverObject[promiseCallbackName].promises[promiseId];
            // undefined if the client-side node was recreated after execution was scheduled
            if (promise !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- frees the settled slot while preserving promise-id indexing
                delete serverObject[promiseCallbackName].promises[promiseId];
                if (success) {
                    promise[0](value);
                }
                else {
                    promise[1](Error('Something went wrong. Check server-side logs for more information.'));
                }
            }
        }
    });
    serverObject[promiseCallbackName].promises = [];
}
/**
 * Defines a method with the given name to be a callback to the server for the
 * given state node.
 *
 * Note! If the Polymer.Element contains an implementation for `methodName` it
 * will be run before the server-side method.
 *
 * @param serverObject - the $server object the method is defined on
 * @param methodName - the name of the method to add
 * @param node - the node to use as an identifier when sending an event to the
 *            server
 * @param returnPromise - `true` if the handler should return a promise that
 *            will reflect the server-side result; `false` to not return any
 *            value
 */
export function defineMethod(serverObject, methodName, node, returnPromise) {
    serverObject[methodName] = function (eventParameter) {
        // Run an existing prototype implementation (e.g. a Polymer element method)
        // before the server-side method.
        const prototype = Object.getPrototypeOf(this);
        if (prototype[methodName] !== undefined) {
            prototype[methodName].apply(this, arguments);
        }
        const event = eventParameter || window.event;
        const tree = node.getTree();
        let args = getEventData(this, event, methodName, node);
        if (args === null) {
            // No server-defined data: send all call arguments.
            args = Array.prototype.slice.call(arguments);
        }
        let returnValue;
        let promiseId = -1;
        if (returnPromise) {
            const promises = this[PROMISE_CALLBACK_NAME].promises;
            promiseId = promises.length;
            returnValue = new Promise(function (resolve, reject) {
                // Store each callback for later use
                promises[promiseId] = [resolve, reject];
            });
        }
        tree.sendTemplateEventToServer(node, methodName, args, promiseId);
        return returnValue;
    };
}
/**
 * Collect extra data for element event if any has been sent from the server.
 * Note! Data is sent in the array in the same order as defined on the server
 * side.
 *
 * @param serverObject - the $server object the method is defined on
 * @param event - The fired Event
 * @param methodName - Method name that is called
 * @param node - Target node
 * @returns Array of extra event data
 */
function getEventData(serverObject, event, methodName, node) {
    const listeners = node.getMap(NodeFeatures.POLYMER_EVENT_LISTENERS);
    if (listeners.hasPropertyValue(methodName)) {
        const dataArray = [];
        const constantPool = node.getTree().getRegistry().getConstantPool();
        const expressionConstantKey = listeners.getProperty(methodName).getValue();
        const dataExpressions = constantPool.get(expressionConstantKey);
        for (let i = 0; i < dataExpressions.length; i++) {
            dataArray[i] = getExpressionValue(serverObject, event, node, dataExpressions[i]);
        }
        return dataArray;
    }
    return null;
}
function getExpressionValue(serverObject, event, node, expression) {
    if (serverExpectsNodeId(expression)) {
        return resolvePolymerPropertyObject(serverObject, event, node, expression);
    }
    return getOrCreateExpression(expression)(event, serverObject);
}
function serverExpectsNodeId(expression) {
    return !expression.startsWith(EVENT_PREFIX) || expression === 'event.model.item';
}
// Mirrors the (event, node, expression) overload of getPolymerPropertyObject:
// an event-based expression is evaluated and wrapped as a node id, otherwise the
// model property is read from the DOM node.
function resolvePolymerPropertyObject(serverObject, event, node, expression) {
    if (expression.startsWith(EVENT_PREFIX)) {
        return createPolymerPropertyObject(serverObject, event, expression);
    }
    return getPolymerPropertyObject(node.getDomNode(), expression);
}
function createPolymerPropertyObject(serverObject, event, expression) {
    const expressionValue = getOrCreateExpression(expression)(event, serverObject);
    // Java reads the value through JsonObject.getNumber(NODE_ID), coercing it to a
    // number before it is sent to the server.
    return { nodeId: Number(expressionValue[NODE_ID]) };
}
/**
 * Reads the Polymer model value at the given path from the node and, when it is
 * a model object carrying a nodeId, returns a `{ nodeId }` wrapper; otherwise
 * null.
 */
function getPolymerPropertyObject(node, propertyName) {
    const polymerNode = node;
    if (typeof polymerNode.get === 'function') {
        const polymerProperty = polymerNode.get(propertyName);
        // Deviation from ServerEventObject.java: the extra `!== null` guard. Java
        // only checks `typeof(polymerProperty) === 'object'` and then dereferences
        // it, which would TypeError when node.get returns null (typeof null is
        // 'object'); guarding returns null instead.
        if (typeof polymerProperty === 'object' &&
            polymerProperty !== null &&
            typeof polymerProperty.nodeId !== 'undefined') {
            return { nodeId: polymerProperty.nodeId };
        }
    }
    return null;
}
/**
 * Removes a method with the given name.
 *
 * @param serverObject - the $server object the method is defined on
 * @param methodName - the name of the method to remove
 */
export function removeMethod(serverObject, methodName) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- removing a dynamically named server method
    delete serverObject[methodName];
}
/**
 * Gets the defined methods.
 *
 * @param serverObject - the $server object the method is defined on
 * @returns an array of defined method names
 */
export function getMethods(serverObject) {
    return Object.keys(serverObject);
}
/**
 * Gets or creates `element.$server` for the given element.
 *
 * @param element - the element to use
 * @returns a reference to the `$server` object in the element
 */
export function get(element) {
    let serverObject = getIfPresent(element);
    if (serverObject === null) {
        serverObject = {};
        initPromiseHandler(serverObject);
        setJsProperty(element, '$server', serverObject);
    }
    return serverObject;
}
/**
 * Gets or creates `element.$server` for the given element, if present.
 *
 * @param node - the element to use
 * @returns a reference to the `$server` object in the element, or `null` if
 *         note present.
 */
export function getIfPresent(node) {
    const serverObject = getJsProperty(node, '$server');
    return serverObject === undefined ? null : serverObject;
}
/**
 * Parses an event-data expression into a function `(event, element) => value`,
 * caching the result per expression string; mirrors getOrCreateExpression. The
 * `element` parameter receives the $server object, matching the Java contract.
 *
 * Java declares this `protected static`, which would map to an `export`. It is
 * kept module-local because its return type mirrors the Java-`private`
 * `ServerEventDataExpression` interface, and with `declaration` emit enabled an
 * exported function cannot reference a non-exported type; exporting the function
 * would force exposing that private type.
 */
function getOrCreateExpression(expressionString) {
    let expression = expressionCache.get(expressionString);
    if (expression === undefined) {
        // Mirrors NativeFunction.create; the server controls these expressions.
        expression = new Function(EVENT_PREFIX, 'element', `return (${expressionString})`);
        expressionCache.set(expressionString, expression);
    }
    return expression;
}
/**
 * Reject all promises pending on this server object. Called during client
 * resynchronization to free consumers of promises that are never delivered by
 * the server.
 *
 * @param serverObject - the $server object the method is defined on
 */
export function rejectPromises(serverObject) {
    const promises = serverObject[PROMISE_CALLBACK_NAME].promises;
    if (promises !== undefined) {
        promises.forEach(function (item) {
            item[1](Error('Client is resynchronizing'));
        });
    }
}
//# sourceMappingURL=ServerEventObject.js.map