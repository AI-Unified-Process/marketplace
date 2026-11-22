/**
 * Returns the current screen orientation type synchronously, or
 * {@code 'unsupported'} if the Screen Orientation API is unavailable. Used by
 * the bootstrap path to seed the server-side signal without waiting for a DOM
 * event.
 */
export declare function currentScreenOrientationType(): string;
/**
 * Returns the current screen orientation angle synchronously, or 0 if the
 * Screen Orientation API is unavailable.
 */
export declare function currentScreenOrientationAngle(): number;
