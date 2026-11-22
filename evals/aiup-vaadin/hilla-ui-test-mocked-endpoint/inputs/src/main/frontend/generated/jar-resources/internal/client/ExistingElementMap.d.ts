/**
 * Mapping between a server side node identifier which has been requested to
 * attach existing client side element.
 */
export declare class ExistingElementMap {
    #private;
    /**
     * Gets the element stored via the {@link add} method by the given `id`.
     *
     * @param id - identifier associated with an element
     * @returns the element associated with the `id` or null if it doesn't exist
     */
    getElement(id: number): Element | null;
    /**
     * Gets the id stored via the {@link add} method by the given `element`.
     *
     * @param element - element associated with an identifier
     * @returns the identifier associated with the `element` or null if it doesn't
     *          exist
     */
    getId(element: Element): number | null;
    /**
     * Remove the identifier and the associated element from the mapping.
     *
     * @param id - identifier to remove
     */
    remove(id: number): void;
    /**
     * Adds the `id` and the `element` to the mapping.
     *
     * @param id - identifier of the server side node
     * @param element - element associated with the identifier
     */
    add(id: number, element: Element): void;
}
