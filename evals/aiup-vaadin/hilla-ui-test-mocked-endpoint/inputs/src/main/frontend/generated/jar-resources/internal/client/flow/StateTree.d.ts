import type { Registry } from '../Registry';
import type { MapProperty } from './nodefeature/MapProperty';
import { StateNode } from './StateNode';
/**
 * A client-side representation of a server-side state tree.
 */
export declare class StateTree {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Mark this tree as being updated.
     *
     * @param updateInProgress - `true` if the tree is being updated, `false` if
     *          not
     * @see {@link isUpdateInProgress}
     */
    setUpdateInProgress(updateInProgress: boolean): void;
    /**
     * Returns whether this tree is currently being updated by
     * {@link processChanges}.
     *
     * @returns `true` if being updated, `false` if not
     */
    isUpdateInProgress(): boolean;
    /**
     * Registers a node with this tree.
     *
     * @param node - the node to register
     */
    registerNode(node: StateNode): void;
    /**
     * Unregisters a node from this tree. Once the node has been unregistered, it
     * can't be registered again.
     *
     * @param node - the node to unregister
     */
    unregisterNode(node: StateNode): void;
    /**
     * Unregisters all nodes except root from this tree, and clears the root's
     * features. Use to reset the tree in preparation for rebuilding it in in a
     * resynchronization response.
     */
    prepareForResync(): void;
    /**
     * Check if tree is resynchronizing after a {@link prepareForResync}
     *
     * @returns true if resync called
     */
    isResync(): boolean;
    /**
     * Set the resynchronization state for the StateTree.
     *
     * @param resync - resynchronization state to set
     */
    setResync(resync: boolean): void;
    /**
     * Returns the state node in the tree for the given dom node or `null` if none
     * found.
     *
     * Comparison is done with Node.isSameNode() method which is same as `===`
     * comparison.
     *
     * @param domNode - the dom node to find state node for
     * @returns the state node or null
     */
    getStateNodeForDomNode(domNode: Node): StateNode | null;
    /**
     * Finds the node with the given id.
     *
     * @param id - the id
     * @returns the node with the given id, or `null` if no such node is
     *          registered.
     */
    getNode(id: number): StateNode | null;
    /**
     * Gets the root node of this tree.
     *
     * @returns the root node
     */
    getRootNode(): StateNode;
    /**
     * Sends an event to the server.
     *
     * @param node - the node that listened to the event
     * @param eventType - the type of event
     * @param eventData - extra data associated with the event
     */
    sendEventToServer(node: StateNode, eventType: string, eventData: unknown): void;
    /**
     * Sends a map property sync to the server.
     *
     * @param property - the property that should have its value synced to the
     *          server, not `null`
     */
    sendNodePropertySyncToServer(property: MapProperty): void;
    /**
     * Sends a request to call server side method with `methodName` using
     * `argsArray` as argument values.
     *
     * In cases when the state tree has been changed and we receive a delayed or
     * deferred template event the event is just ignored.
     *
     * @param node - the node referring to the server side instance containing the
     *          method
     * @param methodName - the method name
     * @param argsArray - the arguments array for the method
     * @param promiseId - the promise id to use for getting the result back, or -1
     *          if no result is expected
     */
    sendTemplateEventToServer(node: StateNode, methodName: string, argsArray: unknown[], promiseId: number): void;
    /**
     * Sends a data for attach existing element server side callback.
     *
     * @param parent - parent of the node to attach
     * @param requestedId - originally requested id of a server side node
     * @param assignedId - identifier which should be used on the server side for
     *          the element (instead of requestedId)
     * @param tagName - the requested tagName
     * @param index - the index of the element on the server side
     */
    sendExistingElementAttachToServer(parent: StateNode, requestedId: number, assignedId: number, tagName: string, index: number): void;
    /**
     * Sends a data for attach existing element with id server side callback.
     *
     * @param parent - parent of the node to attach
     * @param requestedId - originally requested id of a server side node
     * @param assignedId - identifier which should be used on the server side for
     *          the element (instead of requestedId)
     * @param id - id of requested element
     */
    sendExistingElementWithIdAttachToServer(parent: StateNode, requestedId: number, assignedId: number, id: string | null): void;
    /**
     * Gets the {@link Registry} that this state tree belongs to.
     *
     * @returns the registry of this tree, not `null`
     */
    getRegistry(): Registry;
    /**
     * Returns the visibility state of the `node`.
     *
     * @param node - the node whose visibility is tested
     * @returns `true` is the node is visible, `false` otherwise
     */
    isVisible(node: StateNode): boolean;
    /**
     * Checks whether the `node` is active.
     *
     * The node is active if it's visible and all its ancestors are visible.
     *
     * @param node - the node whose activity is tested
     * @returns `true` is the node is active, `false` otherwise
     */
    isActive(node: StateNode): boolean;
    /**
     * Returns a human readable string for the name space with the given id.
     *
     * Package-private in Java; exported here only because TypeScript has no
     * package-private visibility and the same-package {@link StateNode} needs it. Not
     * public API.
     *
     * @param id - the node feature id
     * @returns a human readable string describing the node feature
     * @internal
     */
    getFeatureDebugName(id: number): string;
}
