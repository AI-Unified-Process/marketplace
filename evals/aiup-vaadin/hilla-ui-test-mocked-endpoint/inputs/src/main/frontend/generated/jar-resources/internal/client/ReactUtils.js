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
 * Utils class, intended to ease working with React component related code on
 * the client side.
 *
 * Implementations migrated from ReactUtils.java.
 */
/**
 * Add a callback to the react component that is called when the component
 * initialization is ready for binding flow.
 *
 * @param element - react component element
 * @param name - name of container to bind to
 * @param runnable - callback function runnable
 */
export function addReadyCallback(element, name, runnable) {
    const el = element;
    if (el.addReadyCallback) {
        el.addReadyCallback(name, runnable);
    }
}
/**
 * Check if the react element is initialized and functional.
 *
 * Mirrors ReactUtils.isInitialized.
 *
 * @param elementLookup - react element lookup supplier
 * @returns `true` if Flow binding can already be done
 */
export function isInitialized(elementLookup) {
    return elementLookup() !== null;
}
//# sourceMappingURL=ReactUtils.js.map