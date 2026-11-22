import type { Registry } from '../Registry';
import type { ConnectionStateHandler } from './ConnectionStateHandler';
/**
 * Tracks the reconnect configuration stored in the root node and provides it
 * with an easier to use API. Also triggers
 * {@link ConnectionStateHandler.configurationUpdated} whenever part of the
 * configuration changes.
 */
export declare class ReconnectConfiguration {
    #private;
    /**
     * Creates a new instance using the given registry.
     *
     * @param registry - the registry
     */
    constructor(registry: Registry);
    /**
     * Binds this ReconnectDialogConfiguration to the given
     * {@link ConnectionStateHandler} so that
     * {@link ConnectionStateHandler.configurationUpdated} is run whenever a
     * relevant part of {@link ReconnectConfiguration} changes.
     *
     * @param connectionStateHandler - the connection state handler to bind to
     */
    static bind(connectionStateHandler: ConnectionStateHandler): void;
    /**
     * Gets the text to show in the reconnect dialog.
     *
     * @returns the text to show in the reconnect dialog.
     *
     * @deprecated The API for configuring the connection indicator has changed.
     */
    getDialogText(): string | null;
    /**
     * Gets the text to show in the reconnect dialog when no longer trying to
     * reconnect.
     *
     * @returns the text to show in the reconnect dialog when no longer trying to
     *          reconnect
     *
     * @deprecated The API for configuring the connection indicator has changed.
     */
    getDialogTextGaveUp(): string | null;
    /**
     * Gets the text to show in the reconnect dialog.
     *
     * @returns the text to show in the reconnect dialog.
     */
    getReconnectAttempts(): number;
    /**
     * Gets the interval in milliseconds to wait between reconnect attempts.
     *
     * @returns the interval in milliseconds to wait between reconnect attempts
     */
    getReconnectInterval(): number;
}
