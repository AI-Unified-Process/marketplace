import type { ListSpliceEvent } from './ListSpliceEvent';
/**
 * Listener notified when the structure of a node list changes.
 *
 * @param event - the list splice event
 */
export type ListSpliceListener = (event: ListSpliceEvent) => void;
