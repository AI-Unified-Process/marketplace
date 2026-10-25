import type { Registry } from '../Registry';
import type { Command } from '../Command';
import type { PushConnection } from './PushConnection';
import type { PushConnectionFactory } from './PushConnectionFactory';
/**
 * Splits a message into websocket fragments of at most WEBSOCKET_FRAGMENT_SIZE
 * characters; the first fragment is prefixed with `<length><delimiter>` so the
 * receiver can reassemble it. Mirrors AtmospherePushConnection.FragmentedMessage.
 */
export declare class FragmentedMessage {
    #private;
    /**
     * Creates a new instance based on the given message.
     *
     * @param message - the message to wrap
     */
    constructor(message: string);
    /**
     * Checks if there is another fragment which can be retrieved using
     * {@link FragmentedMessage.getNextFragment} or if all fragments have been
     * retrieved.
     *
     * @returns true if there is another fragment to retrieve, false otherwise
     */
    hasNextFragment(): boolean;
    /**
     * Gets the following fragment and increments the internal fragment counter so the
     * following call to this method will return the following fragment. This method
     * should not be called if all fragments have been received ({@link FragmentedMessage.hasNextFragment}
     * returns false).
     *
     * @returns the next fragment
     */
    getNextFragment(): string;
}
/** The atmosphere configuration/response key holding the transport name. */
export declare const TRANSPORT_KEY = "transport";
/** An Atmosphere response object (the subset used here). atmosphere.js exposes
 * these as plain properties, not the getX() overlay methods GWT's JSNI wrapped
 * them in. */
interface AtmosphereResponse {
    [TRANSPORT_KEY]: string;
    responseBody: string;
}
/**
 * The default {@link PushConnection} implementation that uses Atmosphere for
 * handling the communication channel.
 *
 * Composes the Atmosphere-wiring helpers above and the FragmentedMessage
 * splitter.
 */
export declare class AtmospherePushConnection implements PushConnection {
    #private;
    constructor(registry: Registry);
    isActive(): boolean;
    isBidirectional(): boolean;
    push(message: Record<string, unknown>): void;
    protected getConfig(): Record<string, unknown>;
    protected onReopen(response: AtmosphereResponse): void;
    protected onOpen(response: AtmosphereResponse): void;
    /**
     * Called whenever a server push connection is established (or re-established).
     *
     * @param response - the response
     */
    protected onConnect(response: AtmosphereResponse): void;
    disconnect(command: Command): void;
    /**
     * Called whenever a message is received by Atmosphere.
     *
     * @param response - the Atmosphere response object, which contains the message
     */
    protected onMessage(response: AtmosphereResponse): void;
    protected onTransportFailure(): void;
    /**
     * Called if the push connection fails.
     *
     * Atmosphere will automatically retry the connection until successful.
     *
     * @param response - the Atmosphere response for the failed connection
     */
    protected onError(response: AtmosphereResponse): void;
    /**
     * Called when the push connection has been closed.
     *
     * This does not necessarily indicate an error and Atmosphere might try to
     * reconnect or downgrade to the fallback transport automatically.
     *
     * @param response - the Atmosphere response which was closed
     */
    protected onClose(response: AtmosphereResponse): void;
    /**
     * Called when the Atmosphere client side timeout occurs.
     *
     * The connection will be closed at this point and reconnect will not happen
     * automatically.
     *
     * @param response - the Atmosphere response which was used when the timeout
     *          occurred
     */
    protected onClientTimeout(response: AtmosphereResponse): void;
    /**
     * Called when the push connection has lost the connection to the server and
     * will proceed to try to re-establish the connection.
     *
     * @param _request - the Atmosphere request
     * @param _response - the Atmosphere response
     */
    protected onReconnect(_request: unknown, _response: AtmosphereResponse): void;
    /**
     * Creates the default Atmosphere configuration object.
     *
     * @returns the Atmosphere configuration object
     */
    protected createConfig(): Record<string, unknown>;
    getTransportType(): string | null;
}
/** The default {@link PushConnectionFactory}: creates an AtmospherePushConnection. */
export declare const atmospherePushConnectionFactory: PushConnectionFactory;
export {};
