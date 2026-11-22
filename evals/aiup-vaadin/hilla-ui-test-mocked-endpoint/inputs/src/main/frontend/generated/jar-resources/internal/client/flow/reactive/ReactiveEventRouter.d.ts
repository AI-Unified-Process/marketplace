import type { EventRemover } from '../../../EventRemover';
import type { ReactiveValue } from './ReactiveValue';
import type { ReactiveValueChangeEvent } from './ReactiveValueChangeEvent';
import type { ReactiveValueChangeListener } from './ReactiveValueChangeListener';
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
export declare class ReactiveEventRouter<L, E extends ReactiveValueChangeEvent> {
    #private;
    /**
     * Creates a new event router for a reactive value.
     *
     * @param reactiveValue - the reactive value, not `null`
     * @param wrapper - callback for wrapping a generic reactive change listener
     *   to an instance of the listener type natively supported by this event
     *   router
     * @param dispatcher - callback for dispatching an event to a listener
     */
    constructor(reactiveValue: ReactiveValue, wrapper: (listener: ReactiveValueChangeListener) => L, dispatcher: (listener: L, event: E) => void);
    /**
     * Adds a listener to this event router.
     *
     * @param listener - the listener to add, not `null`
     * @returns an event remover that can be used for removing the added listener
     */
    addListener(listener: L): EventRemover;
    /**
     * Adds a generic reactive change listener to this router.
     *
     * @param reactiveValueChangeListener - the change listener to add, not `null`
     * @returns an event remover that can be used for removing the added listener
     */
    addReactiveListener(reactiveValueChangeListener: ReactiveValueChangeListener): EventRemover;
    /**
     * Fires an event to all listeners added to this router using
     * {@link addListener} or {@link addReactiveListener} as well as all
     * global event collectors added using {@link Reactive.addEventCollector}.
     *
     * @param event - the event to fire
     */
    fireEvent(event: E): void;
    /**
     * Registers access to the data for which this event router fires event.
     * This registers the event source of this event router to be set as a
     * dependency of the current computation if there is one.
     */
    registerRead(): void;
    /**
     * Gets the reactive value for which this router fires event.
     *
     * @returns the reactive value
     */
    getReactiveValue(): ReactiveValue;
}
