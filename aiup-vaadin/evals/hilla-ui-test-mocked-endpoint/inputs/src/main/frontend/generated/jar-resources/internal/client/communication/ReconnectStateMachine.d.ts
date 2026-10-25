import type { Registry } from '../Registry';
import type { Command } from '../Command';
import { ConnectionMessageType } from './ConnectionMessageType';
/**
 * Tracks reconnection state and decides retry/give-up; mirrors the
 * handleRecoverableError / resolveTemporaryError / giveUp logic of
 * DefaultConnectionStateHandler.
 */
export declare class ReconnectStateMachine {
    #private;
    /**
     * Creates a new instance connected to the given registry, driving the retry
     * mechanics the full handler owns.
     *
     * @param registry - the registry, narrowed to the members this machine reads
     * @param scheduleReconnect - schedules the next reconnect attempt, receiving
     *          the message which did not reach the server, or null if no message
     *          was involved (heartbeat or push connection failed)
     * @param cancelScheduledReconnect - cancels a reconnect this machine has
     *          already scheduled; defaults to doing nothing, for a caller that
     *          schedules nothing cancellable
     */
    constructor(registry: Registry, scheduleReconnect: (payload: unknown) => void, cancelScheduledReconnect?: Command);
    /**
     * Checks if we are currently trying to reconnect.
     *
     * @returns true if we have noted a problem and are trying to re-establish
     *          server connection, false otherwise
     */
    isReconnecting(): boolean;
    /** The current reconnection cause, or null if not reconnecting. */
    getReconnectionCause(): ConnectionMessageType | null;
    /** The number of reconnection attempts made for the current cause. */
    getReconnectAttempt(): number;
    /**
     * Called whenever an error occurs in communication which should be handled by
     * showing the reconnect dialog and retrying communication until successful
     * again.
     *
     * @param type - The type of failure detected
     * @param payload - The message which did not reach the server, or null if no
     *          message was involved (heartbeat or push connection failed)
     */
    handleRecoverableError(type: ConnectionMessageType, payload: unknown): void;
    /** Resolves the temporary error for the given type if it is the active cause. Mirrors resolveTemporaryError. */
    resolveTemporaryError(type: ConnectionMessageType): void;
    /** Stops reconnecting and goes to CONNECTION_LOST. Mirrors giveUp. */
    giveUp(): void;
}
