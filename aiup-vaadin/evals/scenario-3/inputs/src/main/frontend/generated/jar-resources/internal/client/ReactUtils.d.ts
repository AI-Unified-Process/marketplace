/**
 * Utils class, intended to ease working with React component related code on
 * the client side.
 *
 * Implementations migrated from ReactUtils.java.
 */
/**
 * Add a callback to the react component that is called when the component
 * initialization is ready for binding flow.
 *
 * @param element - react component element
 * @param name - name of container to bind to
 * @param runnable - callback function runnable
 */
export declare function addReadyCallback(element: Element, name: string, runnable: () => void): void;
/**
 * Check if the react element is initialized and functional.
 *
 * Mirrors ReactUtils.isInitialized.
 *
 * @param elementLookup - react element lookup supplier
 * @returns `true` if Flow binding can already be done
 */
export declare function isInitialized(elementLookup: () => Element | null): boolean;
