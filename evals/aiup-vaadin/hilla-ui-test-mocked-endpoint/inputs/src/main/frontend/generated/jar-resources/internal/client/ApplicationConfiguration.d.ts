import type { ErrorMessage } from './bootstrap/ErrorMessage';
/** Holds the bootstrap configuration of a UI; mirrors ApplicationConfiguration.java. */
export declare class ApplicationConfiguration {
    #private;
    /**
     * Gets the id generated for the application.
     *
     * @returns the id for the application
     */
    getApplicationId(): string;
    /**
     * Sets the id generated for the application.
     *
     * @param applicationId - the id for the application
     */
    setApplicationId(applicationId: string): void;
    /**
     * Gets the URL to the server-side VaadinService.
     *
     * @returns the URL to the server-side service as a string
     */
    getServiceUrl(): string;
    /**
     * Sets the URL to the server-side VaadinService.
     *
     * @param serviceUrl - the URL to the server-side service as a string
     */
    setServiceUrl(serviceUrl: string): void;
    /**
     * Gets the URL of the context root on the server.
     *
     * @returns the URL of the context root, ending with a "/"
     */
    getContextRootUrl(): string;
    /**
     * Sets the URL of the context root on the server.
     *
     * @param contextRootUrl - the URL of the context root, ending with a "/"
     */
    setContextRootUrl(contextRootUrl: string): void;
    /**
     * Checks whether the application is running as a web-component in the page.
     *
     * @returns true in case the app is a WC
     */
    isWebComponentMode(): boolean;
    /**
     * Sets whether the application is running as a web-component in the page.
     *
     * @param mode - set to true if it's a WC
     */
    setWebComponentMode(mode: boolean): void;
    /**
     * Gets the UI id of the server-side UI associated with this client-side
     * instance. The UI id should be included in every request originating from
     * this instance in order to associate the request with the right UI
     * instance on the server.
     *
     * @returns the UI id
     */
    getUIId(): number;
    /**
     * Sets the UI id of the server-side UI associated with this client-side
     * instance.
     *
     * @param uiId - the UI id
     */
    setUIId(uiId: number): void;
    /**
     * Gets the interval for heartbeat requests.
     *
     * @returns The interval in seconds between heartbeat requests, or -1 if heartbeat is disabled.
     */
    getHeartbeatInterval(): number;
    /**
     * Sets the interval for heartbeat requests.
     *
     * @param heartbeatInterval - The interval in seconds between heartbeat requests, or -1 if heartbeat is disabled.
     */
    setHeartbeatInterval(heartbeatInterval: number): void;
    /**
     * Gets the maximum message suspension delay.
     *
     * @returns The maximum time, in milliseconds, to suspend out-of-order messages waiting for their predecessor before resynchronizing.
     */
    getMaxMessageSuspendTimeout(): number;
    /**
     * Sets the maximum message suspension delay.
     *
     * @param maxMessageSuspendTimeout - The maximum time, in milliseconds, to suspend out-of-order messages waiting for their predecessor before resynchronizing.
     */
    setMaxMessageSuspendTimeout(maxMessageSuspendTimeout: number): void;
    /**
     * Gets the message used when a session expiration error occurs.
     *
     * @returns the session expiration error message
     */
    getSessionExpiredError(): ErrorMessage | null;
    /**
     * Sets the message used when a session expiration error occurs.
     *
     * @param sessionExpiredError - the session expiration error message
     */
    setSessionExpiredError(sessionExpiredError: ErrorMessage | null): void;
    /**
     * Gets the Vaadin servlet version in use.
     *
     * @returns the Vaadin servlet version in use
     */
    getServletVersion(): string;
    /**
     * Sets the Vaadin servlet version in use.
     *
     * @param servletVersion - the Vaadin servlet version in use
     */
    setServletVersion(servletVersion: string): void;
    /**
     * Gets the Atmosphere runtime version in use.
     *
     * @returns the Atmosphere runtime version in use
     */
    getAtmosphereVersion(): string;
    /**
     * Sets the Atmosphere runtime version in use.
     *
     * @param atmosphereVersion - the Atmosphere runtime version in use
     */
    setAtmosphereVersion(atmosphereVersion: string): void;
    /**
     * Gets the Atmosphere JavaScript version in use.
     *
     * @returns the Atmosphere JavaScript version in use
     */
    getAtmosphereJSVersion(): string;
    /**
     * Sets the Atmosphere JavaScript version in use.
     *
     * @param atmosphereJSVersion - the Atmosphere JavaScript version in use
     */
    setAtmosphereJSVersion(atmosphereJSVersion: string): void;
    /**
     * Checks if we are running in production mode.
     *
     * With production mode disabled, a lot more information is logged to the
     * browser console. In production you should always enable production mode,
     * because logging and other debug features can have a significant
     * performance impact.
     *
     * @returns `true` if production mode is enabled, `false` otherwise
     */
    isProductionMode(): boolean;
    /**
     * Checks if request timing info should be made available.
     *
     * @returns `true` if request timing info should be made availble, `false` otherwise
     */
    isRequestTiming(): boolean;
    /**
     * Sets whether we are running in production mode.
     *
     * With production mode disabled, a lot more information is logged to the
     * browser console. In production you should always enable production mode,
     * because logging and other debug features can have a significant
     * performance impact.
     *
     * @param productionMode - `true` if production mode is enabled, `false` otherwise
     */
    setProductionMode(productionMode: boolean): void;
    /**
     * Sets whether request timing info should be made available.
     *
     * @param requestTiming - `true` if request timing info should be made available, `false` otherwise
     */
    setRequestTiming(requestTiming: boolean): void;
    /**
     * Sets the exported web components.
     *
     * @param exportedWebComponents - the exported web components
     */
    setExportedWebComponents(exportedWebComponents: string[]): void;
    /**
     * Gets the exported web components.
     *
     * @returns the exported web components
     */
    getExportedWebComponents(): string[];
    /**
     * Gets if development tools should be added to the page.
     *
     * @returns whether development tools should be added
     */
    isDevToolsEnabled(): boolean;
    /**
     *
     * Sets if development tools should be added to the page.
     *
     * @param devToolsEnabled - whether development tools should be added
     */
    setDevToolsEnabled(devToolsEnabled: boolean): void;
    /**
     * Gets the URL for the live reload websocket connection.
     *
     * @returns URL for the live reload websocket connection
     */
    getLiveReloadUrl(): string;
    /**
     * Sets the URL for the live reload websocket connection.
     *
     * @param liveReloadUrl - URL for the live reload websocket connection
     */
    setLiveReloadUrl(liveReloadUrl: string): void;
    /**
     * Gets the the live reload backend technology identifier.
     *
     * @returns the live reload backend technology identifier
     */
    getLiveReloadBackend(): string;
    /**
     * Sets the live reload backend technology identifier.
     *
     * @param liveReloadBackend - the live reload backend technology identifier
     */
    setLiveReloadBackend(liveReloadBackend: string): void;
    /**
     * Gets the Spring boot live reload port.
     *
     * @returns the Spring boot live reload port
     */
    getSpringBootLiveReloadPort(): string;
    /**
     * Sets the Spring boot live reload port.
     *
     * @param springBootLiveReloadPort - the Spring boot live reload port
     */
    setSpringBootLiveReloadPort(springBootLiveReloadPort: string): void;
}
