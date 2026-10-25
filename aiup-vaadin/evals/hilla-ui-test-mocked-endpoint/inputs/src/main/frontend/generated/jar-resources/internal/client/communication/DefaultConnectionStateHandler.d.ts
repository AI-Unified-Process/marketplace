import type { Registry } from '../Registry';
import type { ConnectionStateHandler } from './ConnectionStateHandler';
import type { PushConnection } from './PushConnection';
import type { XhrConnectionError } from './XhrConnectionError';
/**
 * Default implementation of the connection state handler. Handles temporary
 * errors by showing a reconnect dialog to the user while trying to re-establish
 * the connection to the server and re-send the pending message. Handles
 * permanent errors by showing a critical system notification to the user
 */
export declare class DefaultConnectionStateHandler implements ConnectionStateHandler {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    xhrException(xhrConnectionError: XhrConnectionError): void;
    heartbeatException(_request: XMLHttpRequest, exception: Error): void;
    heartbeatInvalidStatusCode(xhr: XMLHttpRequest): void;
    heartbeatOk(): void;
    /**
     * Called after a problem occurred.
     *
     * This method is responsible for re-sending the payload to the server (if not
     * null) or re-send a heartbeat request at some point
     *
     * @param payload - the payload that did not reach the server, null if the
     *          problem was detected by a heartbeat
     */
    protected scheduleReconnect(payload: unknown): void;
    /**
     * Re-sends the payload to the server (if not null) or re-sends a heartbeat
     * request immediately.
     *
     * @param payload - the payload that did not reach the server, null if the
     *          problem was detected by a heartbeat
     */
    protected doReconnect(payload: unknown): void;
    /**
     * Gets the text to show in the reconnect dialog after giving up (reconnect
     * limit reached).
     *
     * @param reconnectAttempt - The number of the current reconnection attempt
     * @returns The text to show in the reconnect dialog after giving up
     */
    protected getDialogTextGaveUp(reconnectAttempt: number): string;
    /**
     * Gets the text to show in the reconnect dialog.
     *
     * @param reconnectAttempt - The number of the current reconnection attempt
     * @returns The text to show in the reconnect dialog
     */
    protected getDialogText(reconnectAttempt: number): string;
    configurationUpdated(): void;
    xhrInvalidContent(xhrConnectionError: XhrConnectionError): void;
    pushInvalidContent(pushConnection: PushConnection, message: string): void;
    xhrInvalidStatusCode(xhrConnectionError: XhrConnectionError): void;
    /**
     * Called when the server returns 401 Unauthorized.
     *
     * @param xhrConnectionError - the error that occurred
     */
    protected handleUnauthorized(_xhrConnectionError: XhrConnectionError): void;
    /**
     * Called when a communication error occurs and we cannot recover from it.
     *
     * @param details - message details or `null` if there are no details
     * @param statusCode - the status code
     */
    protected handleCommunicationError(details: string, _statusCode: number): void;
    xhrOk(): void;
    pushOk(pushConnection: PushConnection): void;
    pushScriptLoadError(resourceUrl: string): void;
    pushNotConnected(payload: Record<string, unknown>): void;
    pushReconnectPending(pushConnection: PushConnection): void;
    pushError(_pushConnection: PushConnection, response: unknown): void;
    pushClientTimeout(_pushConnection: PushConnection, _response: unknown): void;
    pushClosed(_pushConnection: PushConnection, _response: unknown): void;
}
