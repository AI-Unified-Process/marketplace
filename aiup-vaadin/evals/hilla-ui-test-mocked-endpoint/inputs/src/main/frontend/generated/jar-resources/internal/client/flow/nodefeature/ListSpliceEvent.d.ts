import { ReactiveValueChangeEvent } from '../reactive/ReactiveValueChangeEvent';
import type { NodeList } from './NodeList';
/**
 * Event fired when the structure of a {@link NodeList} changes.
 */
export declare class ListSpliceEvent extends ReactiveValueChangeEvent {
    #private;
    /**
     * Creates a new list splice event.
     *
     * @param source - the changed list
     * @param index - the start index of the changes
     * @param remove - the removed items, not `null`
     * @param add - the added items, not `null`
     * @param clear - `true` when this is an event triggered upon removing all the
     *   nodes of the given list, `false` otherwise
     */
    constructor(source: NodeList, index: number, remove: unknown[], add: unknown[], clear: boolean);
    getSource(): NodeList;
    /**
     * Gets the start index of the changes.
     *
     * @returns the start index of the changes
     */
    getIndex(): number;
    /**
     * Gets an array of removed items.
     *
     * @returns array of removed items, not `null`
     */
    getRemove(): unknown[];
    /**
     * Gets an array of added items.
     *
     * @returns array of added items, not `null`
     */
    getAdd(): unknown[];
    /**
     * Gets whether this event is a `clear` event.
     *
     * @returns `true` if the event was triggered after a full clear,
     *         `false` otherwise.
     */
    isClear(): boolean;
}
