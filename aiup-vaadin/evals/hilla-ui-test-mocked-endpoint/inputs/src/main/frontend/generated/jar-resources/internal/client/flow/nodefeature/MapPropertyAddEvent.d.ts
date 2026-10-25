import { ReactiveValueChangeEvent } from '../reactive/ReactiveValueChangeEvent';
import type { MapProperty } from './MapProperty';
import type { NodeMap } from './NodeMap';
/**
 * Event fired when a property is added to a {@link NodeMap}.
 */
export declare class MapPropertyAddEvent extends ReactiveValueChangeEvent {
    #private;
    /**
     * Creates a new property add event.
     *
     * @param source - the changed map
     * @param property - the newly added property
     */
    constructor(source: NodeMap, property: MapProperty);
    getSource(): NodeMap;
    /**
     * Gets the added property.
     *
     * @returns the added property
     */
    getProperty(): MapProperty;
}
