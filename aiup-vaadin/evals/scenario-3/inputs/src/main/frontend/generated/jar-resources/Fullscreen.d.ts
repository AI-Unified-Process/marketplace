type VaadinFullscreenState = 'UNSUPPORTED' | 'NOT_FULLSCREEN' | 'FULLSCREEN';
/**
 * Returns the current fullscreen state synchronously. Used by the bootstrap
 * path to seed the server-side signal without waiting for a DOM event.
 */
export declare function currentFullscreenState(): VaadinFullscreenState;
export {};
