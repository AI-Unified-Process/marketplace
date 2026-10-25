import type { InvalidateEvent } from './InvalidateEvent';
/**
 * Listens to invalidate events fired by a computation.
 */
export type InvalidateListener = (event: InvalidateEvent) => void;
