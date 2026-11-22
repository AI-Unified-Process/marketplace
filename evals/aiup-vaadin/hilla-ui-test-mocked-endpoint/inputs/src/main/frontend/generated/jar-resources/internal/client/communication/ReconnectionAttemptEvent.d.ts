/**
 * Event fired when a reconnection attempt is requested.
 */
export declare class ReconnectionAttemptEvent {
    #private;
    /**
     * Creates an event object.
     *
     * @param attempt - the reconnection attempt number
     */
    constructor(attempt: number);
    /**
     * Gets the number of the current reconnection attempt.
     *
     * @returns the number of the current reconnection attempt.
     */
    getAttempt(): number;
}
/**
 * Handler for {@link ReconnectionAttemptEvent}s.
 *
 * @param event - the event object
 */
export type ReconnectionAttemptEventHandler = (event: ReconnectionAttemptEvent) => void;
