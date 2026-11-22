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
var _a;
// TypeScript port of com.vaadin.client.flow.binding.TextBindingStrategy, built
// alongside the Java version on top of the TS reactive core and state node.
import { assert } from '../../../assert';
import { Reactive } from '../reactive/Reactive';
import { getTag as polymerGetTag } from '../../PolymerUtils';
import { NodeFeatures } from '../../../flow/internal/nodefeature/NodeFeatures';
import { NodeProperties } from '../../../flow/internal/nodefeature/NodeProperties';
/** Binding strategy for simple (not template) text `Node`. */
export class TextBindingStrategy {
    /**
     * This is used as a weak set. Only keys are important so that they are weakly
     * referenced
     */
    static #bound = new WeakMap();
    create(_node) {
        return document.createTextNode('');
    }
    isApplicable(node) {
        return node.hasFeature(NodeFeatures.TEXT_NODE);
    }
    bind(stateNode, htmlNode, _nodeFactory) {
        assert(stateNode.hasFeature(NodeFeatures.TEXT_NODE), 'Node must have the text feature');
        if (_a.#bound.has(stateNode)) {
            return;
        }
        _a.#bound.set(stateNode, true);
        const textMap = stateNode.getMap(NodeFeatures.TEXT_NODE);
        const textProperty = textMap.getProperty(NodeProperties.TEXT);
        const computation = Reactive.runWhenDependenciesChange(() => {
            htmlNode.data = textProperty.getValue();
        });
        stateNode.addUnregisterListener(() => this.#unbind(stateNode, computation));
    }
    #unbind(node, computation) {
        computation.stop();
        _a.#bound.delete(node);
    }
    /**
     * Gets the tag value from the {@link NodeFeatures.ELEMENT_DATA} feature for
     * the `node`.
     *
     * @param node - the state node
     * @returns tag of the `node`
     */
    getTag(node) {
        return polymerGetTag(node);
    }
}
_a = TextBindingStrategy;
//# sourceMappingURL=TextBindingStrategy.js.map