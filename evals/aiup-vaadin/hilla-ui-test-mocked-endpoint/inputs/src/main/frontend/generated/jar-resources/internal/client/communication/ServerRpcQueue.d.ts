import type { Registry } from '../Registry';
/**
 * Manages the queue of server invocations (RPC) which are waiting to be sent to
 * the server.
 */
export declare class ServerRpcQueue {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Adds an explicit RPC method invocation to the send queue.
     *
     * @param invocation - RPC method invocation
     */
    add(invocation: unknown): void;
    /** Clears the queue and cancels any scheduled flush. */
    clear(): void;
    /**
     * Returns the current size of the queue.
     *
     * @returns the number of invocations in the queue
     */
    size(): number;
    /**
     * Checks if the queue is empty.
     *
     * @returns true if the queue is empty, false otherwise
     */
    isEmpty(): boolean;
    /** Triggers a deferred send of the queued invocations to the server. */
    flush(): void;
    /**
     * Checks if a flush operation is pending.
     *
     * @returns true if a flush is pending, false otherwise
     */
    isFlushPending(): boolean;
    /**
     * Checks if a loading indicator should be shown when the RPCs have been sent to the
     * server and we are waiting for a response.
     *
     * @returns true if a loading indicator should be shown, false otherwise
     */
    showLoadingIndicator(): boolean;
    /**
     * Returns the current invocations as JSON.
     *
     * @returns the current invocations in a JSON format ready to be sent to the * server
     */
    toJson(): unknown[];
}
