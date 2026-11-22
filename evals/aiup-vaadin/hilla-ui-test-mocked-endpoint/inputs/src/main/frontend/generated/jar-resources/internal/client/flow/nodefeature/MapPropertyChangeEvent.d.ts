import { ReactiveValueChangeEvent } from '../reactive/ReactiveValueChangeEvent';
import type { MapProperty } from './MapProperty';
/**
 * Event fired when the value of a map property changes.
 */
export declare class MapPropertyChangeEvent extends ReactiveValueChangeEvent {
    #private;
    /**
     * Creates a new map property change event.
     *
     * @param source - the changed map property
     * @param oldValue - the old value
     * @param newValue - the new value
     */
    constructor(source: MapProperty, oldValue: unknown, newValue: unknown);
    getSource(): MapProperty;
    /**
     * Gets the old property value.
     *
     * @returns the old value
     */
    getOldValue(): unknown;
    /**
     * Gets the new property value.
     *
     * @returns the new value
     */
    getNewValue(): unknown;
}
