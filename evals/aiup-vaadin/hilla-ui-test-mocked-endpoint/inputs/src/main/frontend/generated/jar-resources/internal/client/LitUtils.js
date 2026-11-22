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
 * Utils class, intended to ease working with LitElement related code on client
 * side.
 *
 * Implementations migrated from LitUtils.java.
 */
/**
 * Checks if the given element is a LitElement.
 *
 * @param element - the custom element
 * @returns `true` if the element is a Lit element, `false`
 *         otherwise
 */
export function isLitElement(element) {
    const el = element;
    return (typeof el.update === 'function' &&
        el.updateComplete instanceof Promise &&
        typeof el.shouldUpdate === 'function' &&
        typeof el.firstUpdated === 'function');
}
/**
 * Invokes the `runnable` when the given Lit element has been rendered
 * at least once.
 *
 * @param element - the Lit element
 * @param runnable - the command to run
 */
export function whenRendered(element, runnable) {
    const el = element;
    void el.updateComplete.then(runnable);
}
//# sourceMappingURL=LitUtils.js.map