import type { MapPropertyChangeEvent } from './MapPropertyChangeEvent';
/**
 * Listener notified when the value of a {@link MapProperty} changes.
 *
 * @param event - the property change event
 */
export type MapPropertyChangeListener = (event: MapPropertyChangeEvent) => void;
