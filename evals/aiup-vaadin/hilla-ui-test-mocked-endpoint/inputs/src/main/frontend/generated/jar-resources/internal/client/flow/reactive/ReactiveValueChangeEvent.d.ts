import type { ReactiveValue } from './ReactiveValue';
/**
 * Event fired when a reactive value has changed.
 */
export declare class ReactiveValueChangeEvent {
    #private;
    /**
     * Creates a new event fired from a source.
     *
     * @param source - the reactive value that will fire the event
     */
    constructor(source: ReactiveValue);
    /**
     * Gets the reactive value from which this event originates.
     *
     * @returns the event source
     */
    getSource(): ReactiveValue;
}
