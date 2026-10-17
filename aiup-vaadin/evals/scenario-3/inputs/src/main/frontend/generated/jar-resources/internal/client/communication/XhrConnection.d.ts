import type { Registry } from '../Registry';
type Payload = Record<string, unknown>;
/**
 * Handles the response from the server by forwarding the received message to
 * {@link MessageHandler} or failures to the appropriate method in
 * {@link ConnectionStateHandler}.
 */
export declare class XhrResponseHandler {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * Java declares this handler as an inner class, so it reads the connection's
     * registry field; TypeScript has no inner classes, so the registry is passed
     * in and the Java constructor's no-arg signature cannot be mirrored.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Sets the payload which was sent to the server.
     *
     * @param payload - the payload which was sent to the server
     */
    setPayload(payload: Payload): void;
    /**
     * Sets the relative time (see {@link getRelativeTimeMillis}) when the request
     * was sent.
     *
     * @param requestStartTime - the relative time when the request was sent
     */
    setRequestStartTime(requestStartTime: number): void;
    /**
     * Reports a failed request to the connection-state handler.
     *
     * @param xhr - the request that failed
     * @param error - the exception that a synchronous failure threw, or `null` for
     *          a response other than 200
     */
    onFail(xhr: XMLHttpRequest, error: Error | null): void;
    /**
     * Routes a successful response to the message handler, or reports invalid
     * content when it does not parse.
     *
     * @param xhr - the request that succeeded
     */
    onSuccess(xhr: XMLHttpRequest): void;
}
/**
 * Provides a connection to the UIDL request handler on the server and knows how
 * to send messages to that end point.
 */
export declare class XhrConnection {
    #private;
    constructor(registry: Registry);
    /**
     * Creates the handler that routes this connection's responses.
     *
     * @returns the response handler
     */
    protected createResponseHandler(): XhrResponseHandler;
    /**
     * Sends an asynchronous UIDL request to the server using the given URI.
     *
     * @param payload - The URI to use for the request. May includes GET parameters
     */
    send(payload: Payload): void;
    /**
     * Retrieves the URI to use when sending RPCs to the server
     *
     * @returns The URI to use for server messages.
     */
    getUri(): string;
}
export {};
