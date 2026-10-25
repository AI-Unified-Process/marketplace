import type { EventRemover } from '../../../EventRemover';
import type { ReactiveValueChangeListener } from './ReactiveValueChangeListener';
/**
 * A reactive value fires reactive value change events when its value changes
 * and registers itself as dependent on the current computation when the value
 * is accessed.
 *
 * A reactive value typically uses a {@link ReactiveEventRouter} for keeping
 * track of listeners, firing events and registering the value as dependent to
 * the current computation.
 */
export interface ReactiveValue {
    /**
     * Adds a listener that has a dependency to this value, and should be
     * notified when this value changes.
     *
     * @param listener - the listener to add
     * @returns an event remover that can be used for removing the added listener
     */
    addReactiveValueChangeListener(listener: ReactiveValueChangeListener): EventRemover;
}
