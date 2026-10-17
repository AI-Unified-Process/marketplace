/**
 * Native JS array operations ported from the `JsArray<T>` interface of
 * JsArray.java. In the GWT client `JsArray<T>` was a thin wrapper over a native
 * JavaScript array (with a separate JRE implementation for server-side use); in
 * TypeScript a plain array already is that native array, so no wrapper is needed
 * and only the operations that are more than a single native call are provided
 * here as free functions.
 *
 * The full public Java API maps as follows:
 *
 * ```
 * Native TypeScript array syntax (intentionally NOT wrapped here):
 *   get(index)                    -> array[index]
 *   set(index, value)             -> array[index] = value
 *   push(...values)               -> array.push(...values)
 *   length()                      -> array.length
 *   splice(index, remove, ...add) -> array.splice(index, remove, ...add)
 *   shift()                       -> array.shift()
 *   forEach(callback)             -> array.forEach(callback)
 *
 * Exported free-function helpers (below), because they are genuinely more than a
 * native operation or bundle several native calls:
 *   pushArray, spliceArray, clear, isEmpty, remove, removeItem
 * ```
 *
 * The private `JsniHelper` statics behind the Java `@JsOverlay` methods are not
 * ported.
 *
 * Java's `JsArray<T>` carried a `@param <T> the type of the array items`. That
 * type parameter is preserved on the helpers whose item argument or return type
 * depends on it (`pushArray`, `spliceArray`, `clear`, `remove`, `removeItem`);
 * it is omitted from `isEmpty`, where the element type appears only once in a
 * single argument and a generic would add nothing.
 */
/**
 * Appends every value (spread) onto the array, returning the new length.
 * Mirrors the public JsArray.pushArray overlay.
 *
 * @typeParam T - the type of the array items
 * @param array - the array to operate on
 * @param values - the new values to add
 * @returns the new length of the array
 */
export declare function pushArray<T>(array: T[], values: readonly T[]): number;
/**
 * Splices the array at index, removing `remove` elements and inserting the
 * `add` values (spread), returning the removed elements. Mirrors the public
 * JsArray.spliceArray overlay.
 *
 * @typeParam T - the type of the array items
 * @param array - the array to operate on
 * @param index - the index at which do do the operation
 * @param remove - the number of items to remove
 * @param add - new items to add
 * @returns an array of removed items
 */
export declare function spliceArray<T>(array: T[], index: number, remove: number, add: readonly T[]): T[];
/**
 * Removes the item at the given index and returns it. Mirrors the public
 * JsArray.remove(int index) overlay (which is `splice(index, 1).get(0)`).
 *
 * @typeParam T - the type of the array items
 * @param array - the array to operate on
 * @param index - the index to remove
 * @returns the remove item
 */
export declare function remove<T>(array: T[], index: number): T;
/**
 * Empties the array and returns it, mirroring the public JsArray.clear overlay
 * (which returns the cleared array).
 *
 * @typeParam T - the type of the array items
 * @param array - the array to operate on
 * @returns the cleared array
 */
export declare function clear<T>(array: T[]): T[];
/**
 * Checks if the array is empty (length === 0). Mirrors the public
 * JsArray.isEmpty overlay.
 *
 * @param array - the array to operate on
 * @returns true if the array is empty, false otherwise
 */
export declare function isEmpty(array: unknown[]): boolean;
/**
 * Removes the first item that is identical (`===`, matching Java reference
 * `==`) to the given value, returning whether one was found and removed. Maps
 * to the by-value Java overload JsArray.remove(T toRemove); it is named
 * `removeItem` here because TypeScript cannot overload `remove` on a single
 * argument whose type may itself be a number.
 *
 * @typeParam T - the type of the array items
 * @param array - the array to operate on
 * @param toRemove - the item to remove
 * @returns `true` if the item was found and removed from the array, `false` otherwise
 */
export declare function removeItem<T>(array: T[], toRemove: T): boolean;
