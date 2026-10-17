import type { EventRemover } from '../../../EventRemover';
import type { ReactiveValue } from '../reactive/ReactiveValue';
import type { ReactiveValueChangeListener } from '../reactive/ReactiveValueChangeListener';
import { MapProperty } from './MapProperty';
import type { MapPropertyAddListener } from './MapPropertyAddListener';
import { NodeFeature, type JsonValue } from './NodeFeature';
/**
 * A state node feature that structures data as a map.
 *
 * The feature works as a reactive value with regards to the set of available
 * properties. A {@link Computation} will get a dependency on this feature by
 * iterating the properties. Accessing a property by name does not create a
 * dependency. The {@link Computation} is invalidated when a property is
 * added (properties are never removed). It is not invalidated when the value of
 * a property changes since the property is a reactive values of its own.
 */
export declare class NodeMap extends NodeFeature implements ReactiveValue {
    #private;
    /**
     * Gets the property with a given name, creating it if necessary.
     *
     * A {@link MapPropertyAddEvent} is fired if a new property instance is
     * created.
     *
     * @param name - the name of the property
     * @returns the property instance
     */
    getProperty(name: string): MapProperty;
    /**
     * Checks if the given property is present and has a value.
     *
     * @param name - the name of the property to check
     * @returns true if the property exists and has a value, false otherwise
     */
    hasPropertyValue(name: string): boolean;
    /**
     * Iterates all properties in this map.
     *
     * @param callback - the callback to invoke for each property
     */
    forEachProperty(callback: (property: MapProperty, name: string) => void): void;
    /**
     * Gets all property names in this map.
     *
     * @returns a list with the property names, never `null`
     */
    getPropertyNames(): string[];
    /**
     * Gets a JSON object representing the contents of this feature. Only
     * intended for debugging purposes.
     *
     * @returns a JSON representation
     */
    getDebugJson(): JsonValue;
    /**
     * Convert the feature values into a {@link JsonValue} using provided
     * `converter` for the values stored in the feature (i.e. primitive
     * types, StateNodes).
     *
     * @param converter - converter to convert values stored in the feature
     * @returns resulting converted value
     */
    convert(converter: (value: unknown) => JsonValue): JsonValue;
    /**
     * Adds a listener that has a dependency to this value, and should be
     * notified when this value changes.
     *
     * @param reactiveValueChangeListener - the listener to add
     * @returns an event remover that can be used for removing the added listener
     */
    addReactiveValueChangeListener(reactiveValueChangeListener: ReactiveValueChangeListener): EventRemover;
    /**
     * Adds a listener that is informed whenever a new property is added to this
     * map.
     *
     * @param listener - the property add listener
     * @returns an event remover that can be used for removing the added listener
     */
    addPropertyAddListener(listener: MapPropertyAddListener): EventRemover;
}
