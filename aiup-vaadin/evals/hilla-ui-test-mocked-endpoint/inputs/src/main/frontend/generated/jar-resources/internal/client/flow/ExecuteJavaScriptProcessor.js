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
import { NodeProperties } from '../../flow/internal/nodefeature/NodeProperties';
import { NodeFeatures } from '../../flow/internal/nodefeature/NodeFeatures';
import { assert } from '../../assert';
import { needsRebind } from './binding/SimpleElementBindingStrategy';
import { decodeStateNode, decodeWithTypeInfo } from './util/ClientJsonCodec';
import { attachExistingElement, disposeInitializer, populateModelProperties, registerInitializer, registerUpdatableModelProperties } from '../ExecuteJavaScriptElementUtils';
import { Reactive } from './reactive/Reactive';
import { UIState } from '../UILifecycle';
import { Console } from '../Console';
/**
 * Processes the result of `Page.executeJs` on the client. `Page` is a
 * flow-server class, outside this port, so the reference stays a code span.
 */
export class ExecuteJavaScriptProcessor {
    #registry;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry) {
        this.#registry = registry;
    }
    /**
     * Executes invocations received from the server.
     *
     * @param invocations - a JSON containing invocation data
     */
    execute(invocations) {
        for (const invocation of invocations) {
            this.#handleInvocation(invocation);
        }
    }
    #handleInvocation(invocation) {
        const tree = this.#registry.getStateTree();
        // Last item is the script, the rest are parameters.
        const parameterCount = invocation.length - 1;
        const parameterNamesAndCode = [];
        const parameters = [];
        const nodeParameters = new Map();
        for (let i = 0; i < parameterCount; i++) {
            const parameterJson = invocation[i];
            // The real StateTree's ServerConnector has sendReturnChannelMessage (used
            // by the @v-return branch); StateTree's narrower type omits it.
            const parameter = decodeWithTypeInfo(tree, parameterJson);
            parameters.push(parameter);
            parameterNamesAndCode.push(`$${i}`);
            const stateNode = decodeStateNode(tree, parameterJson);
            if (stateNode !== null) {
                if (this.#isVirtualChildAwaitingInitialization(stateNode) || !this.isBound(stateNode)) {
                    // Defer until the node's DOM is set, then retry the whole invocation.
                    stateNode.addDomNodeSetListener(() => {
                        Reactive.addPostFlushListener(() => this.#handleInvocation(invocation));
                        return true;
                    });
                    return;
                }
                nodeParameters.set(parameter, stateNode);
            }
        }
        parameterNamesAndCode.push(invocation[invocation.length - 1]);
        this.invoke(parameterNamesAndCode, parameters, nodeParameters);
    }
    // A virtual child injected by id / as a sub-template is awaiting initialization
    // until its DOM node is created.
    #isVirtualChildAwaitingInitialization(node) {
        if (node.getDomNode() !== null || node.getTree().getNode(node.getId()) === null) {
            return false;
        }
        const elementData = node.getMap(NodeFeatures.ELEMENT_DATA);
        if (elementData.hasPropertyValue(NodeProperties.PAYLOAD)) {
            const value = elementData.getProperty(NodeProperties.PAYLOAD).getValue();
            if (value !== null && typeof value === 'object') {
                const type = value[NodeProperties.TYPE];
                return type === NodeProperties.INJECT_BY_ID || type === NodeProperties.TEMPLATE_IN_TEMPLATE;
            }
        }
        return false;
    }
    // A node is bound once it has a DOM node that does not need rebinding, and so
    // is each of its ancestors.
    isBound(node) {
        const isNodeBound = node.getDomNode() !== null && !needsRebind(node);
        const parent = node.getParent();
        if (!isNodeBound || parent === null) {
            return isNodeBound;
        }
        return this.isBound(parent);
    }
    /**
     * Executes the actual invocation.
     *
     * Protected instead of private for testing purposes, as in Java.
     *
     * @param parameterNamesAndCode - an array consisting of parameter names
     *          followed by the JavaScript expression to execute
     * @param parameters - an array of parameter values
     * @param nodeParameters - the node parameters
     */
    invoke(parameterNamesAndCode, parameters, nodeParameters) {
        const configuration = this.#registry.getApplicationConfiguration();
        const getNode = (element) => {
            const node = nodeParameters.get(element);
            if (node === undefined) {
                throw new ReferenceError('There is no a StateNode for the given argument.');
            }
            return node;
        };
        const context = getContextExecutionObject(configuration.getApplicationId(), this.#registry, {
            getNode,
            attachExistingElement,
            populateModelProperties,
            registerUpdatableModelProperties,
            stopApplication: () => {
                const lifecycle = this.#registry.getUILifecycle();
                if (!lifecycle.isTerminated()) {
                    lifecycle.setState(UIState.TERMINATED);
                }
            },
            registerInitializer,
            disposeInitializer
        });
        invokeJavaScript(parameterNamesAndCode, parameters, context, configuration.isProductionMode());
    }
}
/**
 * Builds the object the executed JavaScript runs against (its `this`). The
 * application id has its trailing per-UI suffix (`-<number>`) stripped so the
 * script sees the stable app id.
 */
function getContextExecutionObject(appId, registry, callbacks) {
    const object = {};
    object.getNode = callbacks.getNode;
    object.$appId = appId.replace(/-\d+$/, '');
    object.registry = registry;
    object.attachExistingElement = (parent, previousSibling, tagName, id) => callbacks.attachExistingElement(callbacks.getNode(parent), previousSibling, tagName, id);
    object.populateModelProperties = (element, properties) => callbacks.populateModelProperties(callbacks.getNode(element), properties);
    object.registerUpdatableModelProperties = (element, properties) => callbacks.registerUpdatableModelProperties(callbacks.getNode(element), properties);
    object.stopApplication = callbacks.stopApplication;
    object.registerInitializer = callbacks.registerInitializer;
    object.disposeInitializer = callbacks.disposeInitializer;
    return object;
}
/**
 * Manifests and runs a server-sent JavaScript invocation: builds a function from
 * the parameter names followed by the expression, then applies it with the given
 * context as `this` and the parameter values as arguments. Exceptions are caught
 * and reported (the failing code is logged outside production mode). Mirrors
 * ExecuteJavaScriptProcessor.invoke (the context object is assembled by
 * getContextExecutionObject).
 */
function invokeJavaScript(parameterNamesAndCode, parameters, context, productionMode) {
    assert(parameterNamesAndCode.length === parameters.length + 1, 'Expected one more entry in parameterNamesAndCode than there are parameters');
    try {
        // The last entry is the expression; the rest are parameter names.
        const fn = new Function(...parameterNamesAndCode);
        fn.apply(context, parameters);
    }
    catch (exception) {
        // Reported through the ported Console, which rethrows asynchronously and so
        // is not subject to the production-mode log suppression - keeping the stack
        // that a logged message alone would lose.
        Console.reportStacktrace(exception);
        Console.error('Exception is thrown during JavaScript execution. Stacktrace will be dumped separately.');
        if (!productionMode) {
            Console.error(exception);
            // Java brackets the snippets then strips the brackets, netting the join.
            Console.error(`The error has occurred in the JS code: '${parameterNamesAndCode.join(', ')}'`);
        }
    }
}
//# sourceMappingURL=ExecuteJavaScriptProcessor.js.map