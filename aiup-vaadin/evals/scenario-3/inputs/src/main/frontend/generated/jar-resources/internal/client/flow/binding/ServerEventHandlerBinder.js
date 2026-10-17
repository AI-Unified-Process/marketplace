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
import { NodeFeatures } from '../../../flow/internal/nodefeature/NodeFeatures';
import { defineMethod, get, removeMethod } from './ServerEventObject';
// The two Java overloads -- (Element, StateNode) and (Supplier, StateNode, int,
// boolean) -- merge into one implementation, since TypeScript has no separate
// bodies per overload signature. The declared overloads above keep the Java call
// shapes; this signature discriminates on the first parameter and carries the
// defaults the two-argument Java overload passes on.
export function bindServerEventHandlerNames(elementOrProvider, node, featureId = NodeFeatures.CLIENT_DELEGATE_HANDLERS, returnValue = true) {
    const objectProvider = typeof elementOrProvider === 'function' ? elementOrProvider : () => get(elementOrProvider);
    const serverEventHandlerNamesList = node.getList(featureId);
    if (serverEventHandlerNamesList.length() > 0) {
        const object = objectProvider();
        for (let i = 0; i < serverEventHandlerNamesList.length(); i++) {
            defineMethod(object, serverEventHandlerNamesList.get(i), node, returnValue);
        }
    }
    return serverEventHandlerNamesList.addSpliceListener((e) => {
        const serverObject = objectProvider();
        const remove = e.getRemove();
        for (const name of remove) {
            removeMethod(serverObject, name);
        }
        const add = e.getAdd();
        for (const name of add) {
            defineMethod(serverObject, name, node, returnValue);
        }
    });
}
//# sourceMappingURL=ServerEventHandlerBinder.js.map