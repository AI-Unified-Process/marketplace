/**
 * Registers the callback that the bootstrap javascript uses to start
 * applications once the widgetset is loaded and all required information is
 * available.
 *
 * @param widgetsetName - the name of this widgetset
 */
export declare function registerCallback(widgetsetName: string): void;
/**
 * Starts the application with a given id by reading the configuration options
 * stored by the bootstrap javascript. On the next deferred tick it starts
 * immediately, or defers until the WebComponents polyfill signals it is ready.
 *
 * @param applicationId - id of the application to load, this is also the id of
 *          the html element into which the application should be rendered
 */
export declare function startApplication(applicationId: string): void;
/**
 * The client bootstrap entry point: verifies the bootstrap JavaScript is present
 * and registers the widgetset start callback so the server bootstrap can start
 * applications once the widgetset is loaded. Runs at most once. Mirrors the GWT
 * Bootstrapper onModuleLoad / initModule entry.
 */
export declare function onModuleLoad(): void;
