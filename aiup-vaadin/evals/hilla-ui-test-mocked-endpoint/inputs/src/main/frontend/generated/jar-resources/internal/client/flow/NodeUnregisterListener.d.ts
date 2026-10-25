import type { NodeUnregisterEvent } from './NodeUnregisterEvent';
/**
 * A listener that will be notified when a state node is unregistered.
 *
 * Invoked when a state node is unregistered.
 *
 * @param event - the node unregister event
 */
export type NodeUnregisterListener = (event: NodeUnregisterEvent) => void;
