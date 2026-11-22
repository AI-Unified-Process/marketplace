import type { EventRemover } from '../../../EventRemover';
import type { ReactiveValue } from '../reactive/ReactiveValue';
import type { ReactiveValueChangeListener } from '../reactive/ReactiveValueChangeListener';
import type { MapPropertyChangeListener } from './MapPropertyChangeListener';
import type { NodeMap } from './NodeMap';
/**
 * A property in a node map.
 */
export declare class MapProperty implements ReactiveValue {
    #private;
    /**
     * A command that does nothing, returned when there is nothing to synchronize
     * to the server.
     */
    static readonly NO_OP: () => void;
    /**
     * Creates a new property.
     *
     * @param name - the name of the property
     * @param map - the map that the property belongs to
     * @param forceValueUpdate - whether value update for `name` property should be
     *            applied regardless of previous value
     */
    constructor(name: string, map: NodeMap, forceValueUpdate?: boolean);
    /**
     * Gets the name of this property.
     *
     * @returns the property name
     */
    getName(): string;
    /**
     * Gets the map that this property belongs to.
     *
     * @returns the map
     */
    getMap(): NodeMap;
    /**
     * Gets the property value.
     *
     * @returns the property value
     */
    getValue(): unknown;
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
    hasValue(): boolean;
    /**
     * Sets the property value. Changing the value fires a
     * {@link MapPropertyChangeEvent}.
     *
     * @see {@link addChangeListener}
     *
     * @param value - the new property value
     */
    setValue(value: unknown): void;
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
    removeValue(): void;
    /**
     * Adds a listener that gets notified when the value of this property changes.
     *
     * @param listener - the property change listener to add
     * @returns an event remover for unregistering the listener
     */
    addChangeListener(listener: MapPropertyChangeListener): EventRemover;
    addReactiveValueChangeListener(reactiveValueChangeListener: ReactiveValueChangeListener): EventRemover;
    /**
     * Returns the value, or the given defaultValue if the property does not have
     * a value or the property value is null.
     *
     * @param defaultValue - the default value
     * @returns the value of the property or the default value if the property
     *         does not have a value or the property value is null
     */
    getValueOrDefault(defaultValue: number): number;
    /**
     * Returns the value, or the given defaultValue if the property does not have
     * a value or the property value is null.
     *
     * @param defaultValue - the default value
     * @returns the value of the property or the default value if the property
     *         does not have a value or the property value is null
     */
    getValueOrDefault(defaultValue: boolean): boolean;
    /**
     * Returns the value, or the given defaultValue if the property does not have
     * a value or the property value is null.
     *
     * @param defaultValue - the default value
     * @returns the value of the property or the default value if the property
     *         does not have a value or the property value is null
     */
    getValueOrDefault(defaultValue: string | null): string | null;
    /**
     * Sets the value of this property and synchronizes the value to the server.
     *
     * @param newValue - the new value to set.
     * @see {@link getSyncToServerCommand}
     */
    syncToServer(newValue: unknown): void;
    /**
     * Sets the value of this property and returns a synch to server command.
     *
     * @param newValue - the new value to set.
     * @returns a command that synchronizes the value to the server
     * @see {@link syncToServer}
     */
    getSyncToServerCommand(newValue: unknown): () => void;
    /**
     * Stores previous DOM value of this property for detection of value
     * modification by the user during the server round-trip.
     *
     * @param previousDomValue - DOM value of property prior to server round-trip
     *            start. Can be `null`;
     */
    setPreviousDomValue(previousDomValue: unknown): void;
    /**
     * Returns previous DOM value of this property for detection of value
     * modification by the user during the server round-trip.
     *
     * @returns previous DOM value, or `undefined` if not stored.
     */
    getPreviousDomValue(): unknown;
    /**
     * Clears the previous DOM value of this property.
     */
    clearPreviousDomValue(): void;
}
