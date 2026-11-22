import type { StateNode } from './flow/StateNode';
/** A JS cleanup callback for a registered initializer. */
type JsCallback = () => void;
/**
 * Calculate the data required for server side callback to attach existing
 * element and send it to the server.
 *
 * @param parent - the parent node whose child is requested to attach
 * @param previousSibling - previous sibling element
 * @param tagName - the tag name of the element requested to attach
 * @param id - the identifier of the server side node which is requested to be a counterpart of the client side element
 */
export declare function attachExistingElement(parent: StateNode, previousSibling: Element | null, tagName: string, id: number): void;
/**
 * Populate model `properties`: add them into
 * `NodeFeatures.NodeFeatures.ELEMENT_PROPERTIES` {@link NodeMap} if they are
 * not defined by the client-side element or send their client-side value to
 * the server otherwise.
 *
 * @param node - the node whose properties should be populated
 * @param properties - array of property names to populate
 */
export declare function populateModelProperties(node: StateNode, properties: string[]): void;
/**
 * Register the updatable model properties of the `node`.
 *
 * Only updates for the properties from the `properties` array will be
 * sent to the server without explicit synchronization. The
 * `properties` array includes all properties that are allowed to be
 * updated (including sub properties).
 *
 * @param node - the node whose updatable properties should be registered
 * @param properties - all updatable model properties
 */
export declare function registerUpdatableModelProperties(node: StateNode, properties: string[]): void;
/**
 * Stores a cleanup callback for a JS initializer registered through
 * {@link com.vaadin.flow.dom.Element#addJsInitializer}. If a callback was
 * previously stored for the same id, it is invoked before being replaced
 * (defensive against stale state from a discarded DOM). On the first
 * registration for a node, an unregister listener is attached so that all
 * remaining cleanups are drained when the node leaves the tree.
 *
 * @param node - the state node owning the initializer, not `null`
 * @param id - the UI-wide initializer id
 * @param cleanup - the JS cleanup function to invoke when disposing, not `null`
 */
export declare function registerInitializer(node: StateNode, id: number, cleanup: JsCallback): void;
/**
 * Disposes a previously registered JS initializer cleanup. No-op if the id
 * is unknown (e.g. the node has already been unregistered).
 *
 * @param node - the state node owning the initializer, not `null`
 * @param id - the UI-wide initializer id
 */
export declare function disposeInitializer(node: StateNode, id: number): void;
export {};
