import type { ReactiveValueChangeEvent } from './ReactiveValueChangeEvent';
/**
 * Listens to changes to a reactive value.
 *
 * @see {@link ReactiveValue.addReactiveValueChangeListener}
 */
export type ReactiveValueChangeListener = (event: ReactiveValueChangeEvent) => void;
