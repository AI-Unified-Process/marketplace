import type { Registry } from '../Registry';
import type { EventRemover } from '../../EventRemover';
import type { ReconnectionAttemptEventHandler } from './ReconnectionAttemptEvent';
import type { RequestStartingEventHandler } from './RequestStartingEvent';
import type { ResponseHandlingEndedEventHandler } from './ResponseHandlingEndedEvent';
import type { ResponseHandlingStartedEventHandler } from './ResponseHandlingStartedEvent';
/** Tracks active server UIDL requests and fires their lifecycle events; mirrors RequestResponseTracker.java. */
export declare class RequestResponseTracker {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /** Marks that a new request has started and fires the request-starting event. */
    startRequest(): void;
    /**
     * Checks is there is an active UIDL request.
     *
     * @returns true if there is an active request, false otherwise
     */
    hasActiveRequest(): boolean;
    /**
     * Marks that the current request has ended, sending any pending invocations
     * and firing the response-handling-ended event.
     */
    endRequest(): void;
    /** Fires the response-handling-started event (called by the message handler). */
    fireResponseHandlingStarted(): void;
    /** Fires a reconnection-attempt event with the attempt count. */
    fireReconnectionAttempt(attempt: number): void;
    /**
     * Adds a handler for {@link RequestStartingEvent}s.
     *
     * @param handler - the handler to add
     * @returns a registration object which can be used to remove the handler
     */
    addRequestStartingHandler(handler: RequestStartingEventHandler): EventRemover;
    /**
     * Adds a handler for {@link ResponseHandlingStartedEvent}s.
     *
     * @param handler - the handler to add
     * @returns a registration object which can be used to remove the handler
     */
    addResponseHandlingStartedHandler(handler: ResponseHandlingStartedEventHandler): EventRemover;
    /**
     * Adds a handler for {@link ResponseHandlingEndedEvent}s.
     *
     * @param handler - the handler to add
     * @returns a registration object which can be used to remove the handler
     */
    addResponseHandlingEndedHandler(handler: ResponseHandlingEndedEventHandler): EventRemover;
    /**
     * Adds a handler for {@link ReconnectionAttemptEvent}s.
     *
     * @param handler - the handler to add
     * @returns a registration object which can be used to remove the handler
     */
    addReconnectionAttemptHandler(handler: ReconnectionAttemptEventHandler): EventRemover;
}
