/**
 * Utils class, intended to ease working with DOM elements on client side.
 *
 * Migrated from `com.vaadin.client.ElementUtil`, which stays in place until the
 * GWT client is retired.
 */
/**
 * Checks whether the `node` has required `tag`.
 *
 * @param node - the node to check
 * @param tag - the required tag name
 * @returns `true` if the node has required tag name
 */
export declare function hasTag(node: Node, tag: string): boolean;
/**
 * Searches the shadow root of the given context element for the given id or
 * searches the light DOM if the element has no shadow root.
 *
 * @param context - the container element to search through
 * @param id - the identifier of the element to search for
 * @returns the element with the given `id` if found, otherwise
 *          `null`
 */
export declare function getElementById(context: Node, id: string): Element | null;
/** Searches the context for an element with the given `name` attribute. */
export declare function getElementByName(context: Node, name: string): Element | null;
