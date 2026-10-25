// Types for the Flow-specific time picker API. The public API types come
// from the @vaadin npm packages, resolved from the integration tests
// module's node_modules (see tsconfig.json in the module root).
import type { TimePicker } from '@vaadin/time-picker/src/vaadin-time-picker.js';
import type { TimePickerConnector } from './timepickerConnector.js';

export type { TimePickerConnector };

/**
 * A time with numeric parts. The web component passes the object without
 * `seconds` and `milliseconds` when the step granularity excludes them.
 */
export interface FlowTimePickerTime {
  hours: number;
  minutes: number;
  seconds?: number;
  milliseconds?: number;
}

/**
 * The i18n object the connector assigns to the web component. Unlike the
 * public API contract, `formatTime` returns `undefined` for an undefined time.
 */
export interface FlowTimePickerI18n {
  formatTime(time: FlowTimePickerTime | undefined): string | undefined;
  parseTime(time: string): FlowTimePickerTime | undefined;
}

/** The Flow-specific API the time picker connector relies on */
export interface FlowTimePickerInternals {
  $connector: TimePickerConnector;
  i18n: FlowTimePickerI18n;
}

/** The Flow time picker element */
export type FlowTimePicker = Omit<TimePicker, 'i18n'> & FlowTimePickerInternals;

declare global {
  // Augments the global Vaadin interface declared by @vaadin/component-base
  // with the Flow namespace used by the connector. The namespace is a shared
  // interface that each module merges its own members into, so that connectors
  // from different modules can be type-checked in the same program.
  interface Vaadin {
    Flow: VaadinFlow;
  }

  interface VaadinFlow {
    timepickerConnector: { initLazy(timePicker: FlowTimePicker): void };
  }
}
