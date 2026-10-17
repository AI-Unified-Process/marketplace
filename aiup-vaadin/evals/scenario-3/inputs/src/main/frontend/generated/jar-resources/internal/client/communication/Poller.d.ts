import type { Registry } from '../Registry';
/**
 * Handles polling the server with a given interval.
 */
export declare class Poller {
    #private;
    /**
     * Creates a new instance using the given registry.
     *
     * @param registry - the registry
     */
    constructor(registry: Registry);
    /**
     * Sets the polling interval.
     *
     * Changing the polling interval will stop any current polling and schedule a
     * new poll to happen after the given interval.
     *
     * @param interval - The interval to use
     */
    setInterval(interval: number): void;
    /** Polls the server for changes by sending a poll event on the root node. */
    poll(): void;
}
