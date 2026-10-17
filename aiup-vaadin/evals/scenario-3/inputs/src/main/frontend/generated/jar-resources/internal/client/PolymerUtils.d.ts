import type { StateNode } from './flow/StateNode';
/**
 * Sets new value for list element for specified `htmlNode`.
 *
 * @param htmlNode - node to call set method on
 * @param path - polymer model path to property
 * @param listIndex - list index to set element into
 * @param newValue - new value to be set at desired index
 *
 * @see Polymer docs: https://www.polymer-project.org/2.0/docs/devguide/model-data
 */
export declare function setListValueByIndex(htmlNode: Element, path: string, listIndex: number, newValue: unknown): void;
/**
 * Calls Polymer `splice` method on specified `htmlNode`.
 *
 * Splice call is made via `apply` method in order to force the method to treat
 * `itemsToAdd` as numerous parameters, not a single one.
 *
 * @param htmlNode - node to call splice method on
 * @param path - polymer model path to property
 * @param startIndex - start index of a list for splice operation
 * @param deleteCount - number of elements to delete from the list after startIndex
 * @param itemsToAdd - elements to add after startIndex
 *
 * @see Polymer docs: https://www.polymer-project.org/2.0/docs/devguide/model-data
 */
export declare function splice(htmlNode: Element, path: string, startIndex: number, deleteCount: number, itemsToAdd: unknown[]): void;
/**
 * Store the StateNode.id into the polymer property under 'nodeId'
 *
 * @param domNode - polymer dom node
 * @param id - id of a state node
 * @param path - polymer model path to property
 */
export declare function storeNodeId(domNode: Node, id: number, path: string): void;
/**
 * Sets a property to an element by using the Polymer `set` method.
 *
 * @param element - the element to set the property to
 * @param path - the path of the property
 * @param value - the value
 */
export declare function setProperty(element: Element, path: string, value: unknown): void;
/**
 * Checks whether the `htmlNode` is a polymer 2 element.
 *
 * @param htmlNode - HTML element to check
 * @returns `true` if the `htmlNode` is a polymer element
 */
export declare function isPolymerElement(htmlNode: Element): boolean;
/**
 * Checks whether the `htmlNode` can turn into polymer 2 element later.
 *
 * Lazy loaded dependencies can load Polymer later than the element itself gets
 * processed by the Flow. This method helps to determine such elements.
 *
 * @param htmlNode - HTML element to check
 * @returns `true` if the `htmlNode` can become a polymer 2 element
 *
 * @deprecated This is not in use anywhere and can be removed
 */
export declare function mayBePolymerElement(htmlNode: Element): boolean;
/**
 * Get first element by css query in the shadow root provided.
 *
 * @param shadowRoot - shadow root element
 * @param cssQuery - css query
 * @returns first element matching the query or `null` for no matches
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM
 *
 * @deprecated This is not in use anywhere and can be removed
 */
export declare function searchForElementInShadowRoot(shadowRoot: ShadowRoot, cssQuery: string): Node | null;
/**
 * Get the element by id from the shadow root provided.
 *
 * @param shadowRoot - shadow root element
 * @param id - element id
 * @returns the element with id provided or `null` for no matches
 *
 * @see http://html5index.org/Shadow%20DOM%20-%20ShadowRoot.html
 *
 * @deprecated This is not in use anywhere and can be removed
 */
export declare function getElementInShadowRootById(shadowRoot: ShadowRoot, id: string): Node | null;
/**
 * Find the DOM element inside shadow root of the `shadowRootParent`.
 *
 * @param shadowRootParent - the parent whose shadow root contains the element
 *            with the `id`
 * @param id - the identifier of the element to search for
 * @returns the element with the given `id` inside the shadow root of the parent
 * @deprecated This is Polymer specific. Use {@link ElementUtil.getElementById}
 *             for the generic version
 */
export declare function getDomElementById(shadowRootParent: Node, id: string): Element | null;
/**
 * Returns `true` if the DOM structure of the polymer custom element
 * `shadowRootParent` is ready (meaning that it has shadow root and its shadow
 * root may be queried for children referenced by id).
 *
 * @param shadowRootParent - the polymer custom element
 * @returns `true` if the `shadowRootParent` element is ready
 */
export declare function isReady(shadowRootParent: Node): boolean;
/**
 * Gets the custom element using `path` of indices starting from the `root`.
 *
 * @param root - the root element to start from
 * @param path - the indices path identifying the custom element.
 * @returns the element inside the `root` by the path of indices
 */
export declare function getCustomElement(root: Node, path: unknown[]): Element | null;
/**
 * Returns the shadow root of the `templateElement`.
 *
 * @param templateElement - the owner of the shadow root
 * @returns the shadow root of the element
 */
export declare function getDomRoot(templateElement: Node): Element | null;
/**
 * Invokes the `runnable` when the custom element with the given `tagName` is
 * initialized (its DOM structure becomes available).
 *
 * @param tagName - the name of the custom element
 * @param runnable - the command to run when the element if initialized
 */
export declare function invokeWhenDefined(tagName: string, runnable: () => void): void;
/**
 * Gets the tag name of the `node`.
 *
 * @param node - the node to get the tag name from
 * @returns the tag name of the node
 */
export declare function getTag(node: StateNode): string;
/**
 * Adds the `listener` which will be invoked when the `polymerElement` becomes
 * "ready" meaning that it's method `ready` is called.
 *
 * The listener won't be called if the element is already "ready" and the
 * listener will be removed immediately once it's executed.
 *
 * @param polymerElement - the custom (polymer) element to listen its readiness
 *            state
 * @param listener - the callback to execute once the element becomes ready
 */
export declare function addReadyListener(polymerElement: Element, listener: () => void): void;
/**
 * Fires the ready event for the `polymerElement`.
 *
 * @param polymerElement - the custom (polymer) element whose state is "ready"
 */
export declare function fireReadyEvent(polymerElement: Element): void;
/**
 * Returns true if and only if the element has a shadow root ancestor.
 *
 * @param element - the element to test
 * @returns whether the element is in a shadow root
 */
export declare function isInShadowRoot(element: Element): boolean;
