import type { Registry } from '../Registry';
/**
 * Handles sending of heartbeats to the server and reacting to the response
 */
export declare class Heartbeat {
    #private;
    constructor(registry: Registry);
    /** Sends a heartbeat request to the server. */
    send(): void;
    /**
     * Gets the heartbeat interval.
     *
     * @returns the interval at which heartbeat requests are sent.
     */
    getInterval(): number;
    /** Reschedules the heartbeat to match the interval; a negative interval disables it. */
    schedule(): void;
    /**
     * Changes the heartbeatInterval in runtime and applies it.
     *
     * @param heartbeatInterval - new interval in seconds.
     */
    setInterval(heartbeatInterval: number): void;
}
