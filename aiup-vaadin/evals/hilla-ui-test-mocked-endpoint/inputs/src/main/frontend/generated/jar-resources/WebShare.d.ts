/**
 * Returns whether the current browser exposes the Web Share API
 * (`navigator.share`). Used by the bootstrap path to seed the server-side
 * support signal without waiting for a DOM event.
 */
export declare function isShareSupported(): boolean;
