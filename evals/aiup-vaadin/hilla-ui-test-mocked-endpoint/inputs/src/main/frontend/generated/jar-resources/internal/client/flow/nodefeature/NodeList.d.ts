import type { EventRemover } from '../../../EventRemover';
import type { ReactiveValue } from '../reactive/ReactiveValue';
import type { ReactiveValueChangeListener } from '../reactive/ReactiveValueChangeListener';
import type { ListSpliceListener } from './ListSpliceListener';
import { NodeFeature, type JsonValue } from './NodeFeature';
/**
 * A state node feature that structures data as a list.
 *
 * The list works as a reactive value with regards to its structure. A
 * {@link Computation} will get a dependency on this list for any read operation
 * that depends on the list structure, such as querying the length, iterating
 * the list or finding the index of an item. Accessing an item by index does not
 * create a dependency. The {@link Computation} is invalidated when items
 * are added, removed, reordered or replaced. It is not invalidated when the
 * contents of an item is updated since all items are expected to be either
 * immutable or reactive values of their own.
 */
export declare class NodeList extends NodeFeature implements ReactiveValue {
    #private;
    /**
     * Gets the number of items in this list.
     *
     * @returns the number of items
     */
    length(): number;
    /**
     * Gets the item at the given index.
     *
     * @param index - the index
     * @returns the item at the index
     */
    get(index: number): unknown;
    /**
     * Sets the value at the given index.
     *
     * @param index - the index
     * @param value - the value to set
     */
    set(index: number, value: unknown): void;
    /**
     * Shorthand for adding the given item at the given index. This method
     * delegates to {@link splice} which updates the list
     * contents and fires the appropriate event.
     *
     * @param index - the index where the item should be added
     * @param item - the new item to add
     */
    add(index: number, item: unknown): void;
    /**
     * Removes and adds a number of items at the given index.
     *
     * This causes a {@link ListSpliceEvent} to be fired.
     *
     * Port deviation: merges the Java `splice(int, int)` and
     * `splice(int, int, JsArray)` overloads into one method with an optional
     * `add` argument; omitting `add` removes items without adding any.
     *
     * @param index - the index at which do do the operation
     * @param remove - the number of items to remove
     * @param add - an array of new items to add
     */
    splice(index: number, remove: number, add?: unknown[]): void;
    /**
     * Removes all the nodes from the list. This causes a
     * {@link ListSpliceEvent} to be fired, with
     * {@link ListSpliceEvent.isClear} as `true`.
     */
    clear(): void;
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
     * Adds a listener that will be notified when the list structure changes.
     *
     * @param listener - the list change listener
     * @returns an event remover that can be used for removing the added listener
     */
    addSpliceListener(listener: ListSpliceListener): EventRemover;
    addReactiveValueChangeListener(reactiveValueChangeListener: ReactiveValueChangeListener): EventRemover;
    /**
     * Iterates all values in this list.
     *
     * @param callback - the callback to invoke for each value
     */
    forEach(callback: (value: unknown) => void): void;
    /**
     * Returns `true` if the list instance has been cleared at some point.
     *
     * @returns `true` if the list instance has been cleared
     */
    hasBeenCleared(): boolean;
}
