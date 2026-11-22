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
import { Reactive } from './Reactive';
/**
 * Event router providing integration with reactive features in {@link Reactive}
 * and {@link Computation}. Listeners can be added both for a specific event
 * type and for the generic value change. All events are fired to both types of
 * listeners, as well as to event collectors registered using
 * {@link Reactive.addEventCollector}.
 *
 * Mirrors ReactiveEventRouter.java in its decoupled, callback form.
 *
 * @typeParam L - the listener type of this router
 * @typeParam E - the reactive event type of this router
 */
export class ReactiveEventRouter {
    #listeners = new Set();
    #reactiveValue;
    #wrapper;
    #dispatcher;
    /**
     * Creates a new event router for a reactive value.
     *
     * @param reactiveValue - the reactive value, not `null`
     * @param wrapper - callback for wrapping a generic reactive change listener
     *   to an instance of the listener type natively supported by this event
     *   router
     * @param dispatcher - callback for dispatching an event to a listener
     */
    constructor(reactiveValue, wrapper, dispatcher) {
        this.#reactiveValue = reactiveValue;
        this.#wrapper = wrapper;
        this.#dispatcher = dispatcher;
    }
    /**
     * Adds a listener to this event router.
     *
     * @param listener - the listener to add, not `null`
     * @returns an event remover that can be used for removing the added listener
     */
    addListener(listener) {
        this.#listeners.add(listener);
        const remover = {
            remove: () => {
                this.#listeners.delete(listener);
            }
        };
        const computation = Reactive.getCurrentComputation();
        if (computation !== null) {
            computation.onNextInvalidate(() => remover.remove());
        }
        return remover;
    }
    /**
     * Adds a generic reactive change listener to this router.
     *
     * @param reactiveValueChangeListener - the change listener to add, not `null`
     * @returns an event remover that can be used for removing the added listener
     */
    addReactiveListener(reactiveValueChangeListener) {
        return this.addListener(this.#wrapper(reactiveValueChangeListener));
    }
    /**
     * Fires an event to all listeners added to this router using
     * {@link addListener} or {@link addReactiveListener} as well as all
     * global event collectors added using {@link Reactive.addEventCollector}.
     *
     * @param event - the event to fire
     */
    fireEvent(event) {
        const copy = new Set(this.#listeners);
        copy.forEach((listener) => this.#dispatcher(listener, event));
        Reactive.notifyEventCollectors(event);
    }
    /**
     * Registers access to the data for which this event router fires event.
     * This registers the event source of this event router to be set as a
     * dependency of the current computation if there is one.
     */
    registerRead() {
        const computation = Reactive.getCurrentComputation();
        if (computation !== null) {
            computation.addDependency(this.#reactiveValue);
        }
    }
    /**
     * Gets the reactive value for which this router fires event.
     *
     * @returns the reactive value
     */
    getReactiveValue() {
        return this.#reactiveValue;
    }
}
//# sourceMappingURL=ReactiveEventRouter.js.map