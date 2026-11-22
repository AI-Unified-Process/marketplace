/**
 * Wraps a native javascript object containing fields for an error message
 */
export interface ErrorMessage {
    /** The error caption, as written by the server bootstrap. */
    caption?: string;
    /** The error message. */
    message?: string;
    /** The URL to navigate to when the message is dismissed. */
    url?: string;
    /** The selector of the element the message is shown in. */
    querySelector?: string;
}
