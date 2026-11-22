import type { MapPropertyAddEvent } from './MapPropertyAddEvent';
/**
 * Listener notified when a property is added to a {@link NodeMap}.
 *
 * Invoked when a property is added.
 *
 * @param event - the property add event
 */
export type MapPropertyAddListener = (event: MapPropertyAddEvent) => void;
