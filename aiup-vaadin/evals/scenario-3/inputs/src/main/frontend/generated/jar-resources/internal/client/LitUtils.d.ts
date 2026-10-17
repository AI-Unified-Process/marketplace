/**
 * Utils class, intended to ease working with LitElement related code on client
 * side.
 *
 * Implementations migrated from LitUtils.java.
 */
/**
 * Checks if the given element is a LitElement.
 *
 * @param element - the custom element
 * @returns `true` if the element is a Lit element, `false`
 *         otherwise
 */
export declare function isLitElement(element: Node): boolean;
/**
 * Invokes the `runnable` when the given Lit element has been rendered
 * at least once.
 *
 * @param element - the Lit element
 * @param runnable - the command to run
 */
export declare function whenRendered(element: Element, runnable: () => void): void;
