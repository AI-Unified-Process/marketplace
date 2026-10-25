/**
 * Helper class for using window.console. Does not log anything except
 * JavaScript exception traces to console if production mode is enabled.
 *
 * The engine's logging facade; mirrors the static Console.java. The log methods
 * are no-ops in production mode unless the `vaadin.browserLog` localStorage flag
 * is set, so that a production application does not write to the browser
 * console.
 */
export declare const Console: {
    /**
     * Changes logger behavior, making it skip all browser logging for production
     * mode. Mirrors Console.setProductionMode.
     *
     * @param productionMode - if an application is in the production mode or not
     */
    setProductionMode(productionMode: boolean): void;
    /**
     * Logs the message using the debug log level, unless suppressed.
     *
     * @param message - the message to log
     */
    debug(message: unknown): void;
    /**
     * Logs the message using the info log level, unless suppressed.
     *
     * @param message - the message to log
     */
    log(message: unknown): void;
    /**
     * Logs the message using the warning log level, unless suppressed.
     *
     * @param message - the message to log
     */
    warn(message: unknown): void;
    /**
     * Logs the message using the error log level, unless suppressed.
     *
     * @param message - the message to log
     */
    error(message: unknown): void;
    /**
     * Logs the stack trace of an exception to the browser console. The exception
     * is rethrown asynchronously (after the current task) so the browser reports
     * it through its global error handler with the highest possible fidelity.
     * Mirrors Console.reportStacktrace; the GWT version deferred the throw to
     * bypass GWT's own uncaught-exception handling, which has no equivalent here,
     * so a plain deferred rethrow is the faithful port. Not gated by production
     * mode, matching Console.java.
     *
     * @param exception - the exception for which
     */
    reportStacktrace(exception: unknown): void;
};
