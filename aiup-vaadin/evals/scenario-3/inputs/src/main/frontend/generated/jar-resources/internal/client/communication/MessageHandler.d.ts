import type { Registry } from '../Registry';
import type { ValueMap } from '../ValueMap';
/**
 * A MessageHandler is responsible for handling all incoming messages (JSON)
 * from the server (state changes, RPCs and other updates) and ensuring that the
 * connectors are updated accordingly.
 */
export declare class MessageHandler {
    #private;
    protected lastProcessingTime: number;
    protected totalProcessingTime: number;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Handles a received UIDL JSON text, parsing it, and passing it on to the
     * appropriate handlers, while logging timing information.
     *
     * @param json - The JSON to handle
     */
    handleMessage(json: ValueMap): void;
    protected handleJSON(valueMap: ValueMap): void;
    /**
     * This method can be used to postpone rendering of a response for a short
     * period of time (e.g. to avoid the rendering process during animation).
     *
     * The Java method name is misspelled; it is kept verbatim to preserve public
     * API parity.
     *
     * @param lock - the lock
     */
    suspendReponseHandling(lock: object): void;
    /**
     * Resumes the rendering process once all locks have been removed.
     *
     * @param lock - the lock
     */
    resumeResponseHandling(lock: object): void;
    /**
     * Profiling data for the last response: last and total processing time, the
     * optional server timing info, and the bootstrap time. Mirrors the
     * getProfilingData JSNI in ApplicationConnection.java.
     */
    getProfilingData(): number[];
    /**
     * Gets the server id included in the last received response.
     *
     * This id can be used by connectors to determine whether new data has been
     * received from the server to avoid doing the same calculations multiple times.
     *
     * No guarantees are made for the structure of the id other than that there will
     * be a new unique value every time a new response with data from the server is
     * received.
     *
     * The initial id when no request has yet been processed is -1.
     *
     * @returns an id identifying the response
     */
    getLastSeenServerSyncId(): number;
    /**
     * Gets the token (synchronizer token pattern) that the server uses to protect against
     * CSRF (Cross Site Request Forgery) attacks.
     *
     * @returns the CSRF token string
     */
    getCsrfToken(): string;
    /**
     * Gets the push connection identifier for this session. Used when establishing a push
     * connection with the client.
     *
     * @returns the push connection identifier string
     */
    getPushId(): string | null;
    /**
     * Checks if the first UIDL has been handled.
     *
     * @returns true if the initial UIDL has already been processed, false * otherwise
     */
    isInitialUidlHandled(): boolean;
    /**
     * Sets a temporary handler for session expiration. This handler will be triggered if
     * and only if the next server message tells that the session has expired.
     *
     * @param handler - the handler to use or null to remove a previously set handler
     */
    setNextResponseSessionExpiredHandler(handler: (() => void) | null): void;
}
/**
 * Parse the given wrapped JSON, received from the server, to a {@link ValueMap}.
 *
 * @param jsonText - The JSON to parse
 * @returns A ValueMap created from the JSON
 */
export declare function parseJson(jsonText: string | null): ValueMap | null;
