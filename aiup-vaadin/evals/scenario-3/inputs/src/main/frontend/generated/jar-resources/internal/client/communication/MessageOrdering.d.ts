import type { ValueMap } from '../ValueMap';
export declare const UNDEFINED_SYNC_ID = -1;
/** The server id of a message, or -1 if it has none. Mirrors getServerId. */
export declare function getServerId(json: ValueMap): number;
/** Whether a message is a resynchronization response. Mirrors isResynchronize. */
export declare function isResynchronize(json: ValueMap): boolean;
/**
 * Tracks the last seen server sync id and the queue of pending (out-of-order or
 * locked) UIDL messages, deciding which to handle next. Mirrors the ordering
 * state of MessageHandler.
 */
export declare class PendingMessageQueue {
    #private;
    /** The last seen server sync id; -1 before any response has been processed. */
    getLastSeenServerSyncId(): number;
    setLastSeenServerSyncId(serverId: number): void;
    /** The server id the client is currently waiting for. */
    getExpectedServerId(): number;
    /** Whether the given server id is the one currently expected (or always-ok). */
    isNextExpectedMessage(serverId: number): boolean;
    /** Whether the given server id has already been seen (a stale re-send). */
    isAlreadySeen(serverId: number): boolean;
    push(json: ValueMap): void;
    isEmpty(): boolean;
    length(): number;
    clear(): void;
    /** The index of the next pending message that can be handled now, or -1. */
    findNextHandlable(): number;
    /** Removes and returns the pending message at the given index. */
    remove(index: number): ValueMap;
    /** Drops pending messages whose server id is older than the expected one. */
    removeOld(): void;
}
