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
import { Reactive } from '../reactive/Reactive';
import { ReactiveEventRouter } from '../reactive/ReactiveEventRouter';
import { MapPropertyChangeEvent } from './MapPropertyChangeEvent';
/**
 * A property in a node map.
 */
export class MapProperty {
    /**
     * A command that does nothing, returned when there is nothing to synchronize
     * to the server.
     */
    static NO_OP = () => { };
    #name;
    #map;
    // Indicates that a server update is in progress. While this is true we don't
    // accept any changes via syncToServer().
    #isServerUpdate = false;
    #eventRouter = new ReactiveEventRouter(this, (listener) => listener, (listener, event) => listener(event));
    #value = null;
    #hasValueState = false;
    #forceValueUpdate;
    #previousDomValue = undefined;
    /**
     * Creates a new property.
     *
     * @param name - the name of the property
     * @param map - the map that the property belongs to
     * @param forceValueUpdate - whether value update for `name` property should be
     *            applied regardless of previous value
     */
    constructor(name, map, forceValueUpdate = false) {
        this.#name = name;
        this.#map = map;
        this.#forceValueUpdate = forceValueUpdate;
    }
    /**
     * Gets the name of this property.
     *
     * @returns the property name
     */
    getName() {
        return this.#name;
    }
    /**
     * Gets the map that this property belongs to.
     *
     * @returns the map
     */
    getMap() {
        return this.#map;
    }
    /**
     * Gets the property value.
     *
     * @returns the property value
     */
    getValue() {
        this.#eventRouter.registerRead();
        return this.#value;
    }
    /**
     * Checks whether this property has a value. A property has a value if
     * {@link setValue} has been invoked after the property was created or
     * {@link removeValue} was invoked.
     *
     * @see {@link removeValue}
     *
     * @returns `true` if the property has a value, `false` if the property has no
     *         value.
     */
    hasValue() {
        this.#eventRouter.registerRead();
        return this.#hasValueState;
    }
    /**
     * Sets the property value. Changing the value fires a
     * {@link MapPropertyChangeEvent}.
     *
     * @see {@link addChangeListener}
     *
     * @param value - the new property value
     */
    setValue(value) {
        // mark as server update is in progress
        this.#isServerUpdate = true;
        this.#doSetValue(value);
        // unmark server update at the end of flush, i.e. at the end of the current
        // server request processing
        Reactive.addPostFlushListener(() => {
            this.#isServerUpdate = false;
        });
    }
    /**
     * Removes the value of this property so that {@link hasValue} will return
     * `false` and {@link getValue} will return `null` until the next time
     * {@link setValue} is run. A {@link MapPropertyChangeEvent} will be fired if
     * this property has a value.
     *
     * Once a property has been created, it can no longer be removed from its map.
     * The same semantics as e.g. `Map#remove(Object)` is instead provided by
     * marking the value of the property as removed to distinguish it from
     * assigning `null` as the value.
     */
    removeValue() {
        if (this.#hasValueState) {
            // mark as server update is in progress
            this.#isServerUpdate = true;
            this.#updateValue(null, false);
            // unmark server update at the end of flush, i.e. at the end of the current
            // server request processing
            Reactive.addPostFlushListener(() => {
                this.#isServerUpdate = false;
            });
        }
    }
    #doSetValue(value) {
        if (!this.#forceValueUpdate && this.#hasValueState && value === this.#value) {
            // Nothing to do
            return;
        }
        this.#updateValue(value, true);
    }
    #updateValue(value, hasValue) {
        const oldValue = this.#value;
        this.#hasValueState = hasValue;
        this.#value = value;
        this.#eventRouter.fireEvent(new MapPropertyChangeEvent(this, oldValue, value));
    }
    /**
     * Adds a listener that gets notified when the value of this property changes.
     *
     * @param listener - the property change listener to add
     * @returns an event remover for unregistering the listener
     */
    addChangeListener(listener) {
        return this.#eventRouter.addListener(listener);
    }
    addReactiveValueChangeListener(reactiveValueChangeListener) {
        return this.#eventRouter.addReactiveListener(reactiveValueChangeListener);
    }
    getValueOrDefault(defaultValue) {
        if (this.hasValue()) {
            const v = this.getValue();
            if (v === null || v === undefined) {
                return defaultValue;
            }
            if (typeof defaultValue === 'number') {
                // Server side sets everything as double; mirror Double.intValue()
                return Math.trunc(v);
            }
            return v;
        }
        return defaultValue;
    }
    /**
     * Sets the value of this property and synchronizes the value to the server.
     *
     * @param newValue - the new value to set.
     * @see {@link getSyncToServerCommand}
     */
    syncToServer(newValue) {
        this.getSyncToServerCommand(newValue)();
    }
    /**
     * Sets the value of this property and returns a synch to server command.
     *
     * @param newValue - the new value to set.
     * @returns a command that synchronizes the value to the server
     * @see {@link syncToServer}
     */
    getSyncToServerCommand(newValue) {
        const currentValue = this.hasValue() ? this.getValue() : null;
        if (newValue === currentValue) {
            // Unlock client side updates here so that another client side change for
            // the same property can be propagated once the server value is set.
            this.#isServerUpdate = false;
        }
        if (!(newValue === currentValue && this.#hasValueState) && !this.#isServerUpdate) {
            const node = this.getMap().getNode();
            const tree = node.getTree();
            if (tree.isActive(node)) {
                this.#doSetValue(newValue);
                return () => tree.sendNodePropertySyncToServer(this);
            }
            // Fire a fake event to reset the property value back in the DOM element:
            // it has to be set to the property value because of the listener added to
            // the property during binding.
            this.#eventRouter.fireEvent(new MapPropertyChangeEvent(this, currentValue, currentValue));
            // Flush is needed because we are out of the normal lifecycle which calls
            // flush() automatically.
            Reactive.flush();
        }
        return MapProperty.NO_OP;
    }
    /**
     * Stores previous DOM value of this property for detection of value
     * modification by the user during the server round-trip.
     *
     * @param previousDomValue - DOM value of property prior to server round-trip
     *            start. Can be `null`;
     */
    setPreviousDomValue(previousDomValue) {
        this.#previousDomValue = previousDomValue === null ? undefined : previousDomValue;
    }
    /**
     * Returns previous DOM value of this property for detection of value
     * modification by the user during the server round-trip.
     *
     * @returns previous DOM value, or `undefined` if not stored.
     */
    getPreviousDomValue() {
        return this.#previousDomValue;
    }
    /**
     * Clears the previous DOM value of this property.
     */
    clearPreviousDomValue() {
        this.#previousDomValue = undefined;
    }
}
//# sourceMappingURL=MapProperty.js.map