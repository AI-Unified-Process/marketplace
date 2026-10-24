import type { Registry } from '../Registry';
/**
 * Provides the push configuration stored in the root node with an easier to use
 * API.
 *
 * Additionally tracks when push is enabled/disabled and informs {@link
 * MessageSender}.
 */
export declare class PushConfiguration {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Gets the push servlet mapping configured or determined on the server.
     *
     * @returns the push servlet mapping configured or determined on the server or
     *          null if none has been configured
     */
    getPushServletMapping(): string | null;
    /**
     * Checks if XHR should be used for client -\> server messages even though we are using
     * a bidirectional push transport such as websockets.
     *
     * @returns true if XHR should always be used, false otherwise
     */
    isAlwaysXhrToServer(): boolean;
    /**
     * Gets all configured push parameters.
     *
     * The parameters configured on the server, including transports.
     *
     * @returns a map of all parameters configured on the server
     */
    getParameters(): Map<string, string>;
    /**
     * Checks if push is enabled.
     *
     * @returns true if push is enabled, false otherwise
     */
    isPushEnabled(): boolean;
}
