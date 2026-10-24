import type { StateNode } from './StateNode';
/**
 * Event fired when a state node is unregistered.
 */
export declare class NodeUnregisterEvent {
    #private;
    /**
     * Creates a new node unregister event.
     *
     * @param node - the unregistered node
     */
    constructor(node: StateNode);
    /**
     * Gets the unregistered node.
     *
     * @returns the unregistered node
     */
    getNode(): StateNode;
}
