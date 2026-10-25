import type { ApplicationConfiguration, ApplicationConnection } from './clientApi';
/**
 * Builds the per-application client API object published on
 * `window.Vaadin.Flow.clients[appId]`.
 *
 * This is the TypeScript replacement for the JSNI `publishJavascriptMethods` /
 * `publishDevelopmentModeJavascriptMethods` blocks in
 * com.vaadin.client.ApplicationConnection: it delegates to the methods of the
 * {@link ApplicationConnection} instance. Those blocks wrap every published
 * function in `$entry`; the port has no equivalent, as the engine is plain
 * JavaScript.
 *
 * Called by ApplicationConnection.create with the constructed instance. The live
 * page still runs the GWT engine, so the JSNI publication is what actually
 * populates `window.Vaadin.Flow.clients` today; removing it is part of the
 * cutover that makes the bootstrap start this engine instead.
 *
 * @param applicationConnection - the engine to publish
 * @param configuration - the application configuration, which supplies the
 *          application id the client is published under, whether the client runs
 *          in production mode, whether request timing info should be made
 *          available, and the web component tags exported by this UI
 */
export declare function publishClient(applicationConnection: ApplicationConnection, configuration: ApplicationConfiguration): void;
