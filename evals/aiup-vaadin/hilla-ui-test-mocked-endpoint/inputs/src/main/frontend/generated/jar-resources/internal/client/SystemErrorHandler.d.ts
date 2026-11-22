import type { Registry } from './Registry';
import type { ErrorMessage } from './bootstrap/ErrorMessage';
/**
 * Handles system errors in the application.
 */
export declare class SystemErrorHandler {
    #private;
    /**
     * Creates a new instance connected to the given registry.
     *
     * @param registry - the global registry
     */
    constructor(registry: Registry);
    /**
     * Shows the session expiration notification.
     *
     * @param details - message details or null if there are no details
     */
    handleSessionExpiredError(details: string | null): void;
    /**
     * Shows an error notification for an error which is unrecoverable.
     *
     * Named apart from the caption/message/details overloads, which JavaScript
     * cannot distinguish by arity alone.
     *
     * @param details - message details or null if there are no details
     * @param message - an ErrorMessage describing the error
     */
    protected handleUnrecoverableErrorFor(details: string | null, message: ErrorMessage | null): void;
    /**
     * Shows an error notification for an error which is unrecoverable, using the
     * given parameters.
     *
     * @param caption - the caption of the message
     * @param message - the message body
     * @param details - message details or `null` if there are no details
     * @param url - a URL to redirect to when the user clicks the message or
     *          `null` to refresh on click
     * @param querySelector - query selector to find the element under which the
     *          error will be added . If element is not found or the selector is
     *          `null`, body will be used
     */
    handleUnrecoverableError(caption: string | null, message: string | null, details: string | null, url: string | null, querySelector: string | null): void;
    /**
     * Shows the given error message if not running in production mode and logs
     * it to the console if running in production mode.
     *
     * @param errorMessage - the error message to show
     */
    handleError(errorMessage: string): void;
    /**
     * Shows the given error message if not running in production mode and logs it
     * to the console.
     *
     * @param error - the throwable which occurred
     */
    handleErrorObject(error: unknown): void;
}
