import type { EventRemover } from '../../EventRemover';
import type { JsonValue, NodeFeature } from './nodefeature/NodeFeature';
import { NodeList } from './nodefeature/NodeList';
import { NodeMap } from './nodefeature/NodeMap';
import type { NodeUnregisterListener } from './NodeUnregisterListener';
import type { StateTree } from './StateTree';
type Constructor<T> = abstract new (...args: never[]) => T;
/**
 * A client-side representation of a server-side state node.
 */
export declare class StateNode {
    #private;
    /**
     * Creates a new state node.
     *
     * @param id - the id of the node
     * @param tree - the state tree that the node belongs to
     */
    constructor(id: number, tree: StateTree);
    /**
     * Gets the state tree that this node belongs to.
     *
     * @returns the state tree
     */
    getTree(): StateTree;
    /**
     * Gets the id of this state node.
     *
     * @returns the id
     */
    getId(): number;
    /**
     * Gets the node list with the given id. Creates a new node list if one
     * doesn't already exist.
     *
     * @param id - the id of the list
     * @returns the list with the given id
     */
    getList(id: number): NodeList;
    /**
     * Gets the node map with the given id. Creates a new map if one doesn't
     * already exist.
     *
     * @param id - the id of the map
     * @returns the map with the given id
     */
    getMap(id: number): NodeMap;
    /**
     * Checks whether this node has a feature with the given id.
     *
     * @param id - the id of the feature
     * @returns `true` if this node has the given feature; otherwise `false`
     */
    hasFeature(id: number): boolean;
    /**
     * Iterates all features in this node.
     *
     * @param callback - the callback to invoke for each feature
     */
    forEachFeature(callback: (feature: NodeFeature, id: number) => void): void;
    /**
     * Gets a JSON object representing the contents of this node. Only intended
     * for debugging purposes.
     *
     * @returns a JSON representation
     */
    getDebugJson(): JsonValue;
    /**
     * Checks whether this node has been unregistered.
     *
     * @see {@link StateTree.unregisterNode}
     *
     * @returns `true` if this node has been unregistered; `false` if the node is
     *          still registered
     */
    isUnregistered(): boolean;
    /**
     * Unregisters this node, causing all registered node unregister listeners to
     * be notified.
     *
     * @see {@link addUnregisterListener}
     */
    unregister(): void;
    /**
     * Adds a listener that will be notified when this node is unregistered.
     *
     * @param listener - the node unregister listener to add
     * @returns an event remover that can be used for removing the added listener
     */
    addUnregisterListener(listener: NodeUnregisterListener): EventRemover;
    /**
     * Gets the DOM node associated with this state node.
     *
     * @returns the DOM node, or `null` if no DOM node has been associated with
     *          this state node
     */
    getDomNode(): Node | null;
    /**
     * Sets the DOM node associated with this state node.
     *
     * @param node - the associated DOM node
     */
    setDomNode(node: Node | null): void;
    /**
     * Adds a listener to get a notification when the DOM Node is set for this
     * {@link StateNode}.
     *
     * The listener return value is used to decide whether the listener should be
     * removed immediately if it returns `true`.
     *
     * @param listener - listener to add
     * @returns an event remover that can be used for removing the added listener
     */
    addDomNodeSetListener(listener: (node: StateNode) => boolean): EventRemover;
    /**
     * Get the parent {@link StateNode} if set.
     *
     * @returns parent state node
     */
    getParent(): StateNode | null;
    /**
     * Set the parent {@link StateNode} for this node.
     *
     * @param parent - the parent state node
     */
    setParent(parent: StateNode | null): void;
    /**
     * Stores the `object` in the {@link StateNode} instance.
     *
     * The `object` may represent any kind of data. This data can be retrieved
     * later on via the {@link getNodeData} providing the class of the object. So
     * make sure you are using some custom type for your data to avoid clash with
     * other types.
     *
     * @see {@link getNodeData}
     *
     * @param object - the object to store
     * @typeParam T - the type of the node data to set
     */
    setNodeData<T extends object>(object: T): void;
    /**
     * Gets the object previously stored by the {@link setNodeData} by its type.
     *
     * If there is no stored object with the given type then the method returns
     * `null`.
     *
     * @param clazz - the type of the object to get
     * @typeParam T - the type of the node data to get
     * @returns the object by its `clazz`
     */
    getNodeData<T>(clazz: Constructor<T>): T | null;
    /**
     * Removes the `object` from the stored data.
     *
     * @param object - the object to remove
     * @typeParam T - the type of the object to remove
     */
    clearNodeData<T extends object>(object: T): void;
}
export {};
