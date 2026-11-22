/**
 * XhrConnectionError provides detail about an error which occurred during an
 * XHR request to the server.
 */
export declare class XhrConnectionError {
    #private;
    /**
     * Creates a XhrConnectionError for the given request using the given payload.
     *
     * @param xhr - the request which caused the error
     * @param payload - the payload which was on its way to the server
     * @param error - the exception which caused the error or null if the error was
     *          not caused by an exception
     */
    constructor(xhr: XMLHttpRequest, payload: Record<string, unknown>, error: Error | null);
    /**
     * Returns the exception which caused the problem, if available.
     *
     * @returns the exception which caused the problem, or null if not available
     */
    getException(): Error | null;
    /**
     * Returns {@link XMLHttpRequest} which failed to reach the server.
     *
     * @returns the request which failed
     */
    getXhr(): XMLHttpRequest;
    /**
     * Returns the payload which was sent to the server.
     *
     * @returns the payload which was sent, never null
     */
    getPayload(): Record<string, unknown>;
}
