type VaadinPageVisibility = 'VISIBLE' | 'VISIBLE_NOT_FOCUSED' | 'HIDDEN';
/**
 * Returns the current visibility state synchronously. Used by the bootstrap
 * path to seed the server-side signal without waiting for a DOM event.
 */
export declare function currentVisibility(): VaadinPageVisibility;
export {};
