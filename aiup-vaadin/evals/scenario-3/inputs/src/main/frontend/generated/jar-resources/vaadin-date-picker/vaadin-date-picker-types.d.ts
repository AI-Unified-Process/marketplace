// Types for the Flow-specific date picker API, including the private
// @vaadin/date-picker API that the connector relies on. The public API types
// come from the @vaadin npm packages, resolved from the integration tests
// module's node_modules (see tsconfig.json in the module root).
import type { DatePicker } from '@vaadin/date-picker/src/vaadin-date-picker.js';
import type {
  DatePickerDate,
  DatePickerDateMetadata,
  DatePickerI18n
} from '@vaadin/date-picker/src/vaadin-date-picker-mixin.js';
import type { DatePickerConnector } from './datepickerConnector.js';

export type { DatePickerConnector };

/**
 * The date picker i18n object extended with the Flow-specific properties.
 * The server serializes `referenceDate` as an ISO 8601 string; `updateI18n`
 * converts it into date parts before assigning the object to the web
 * component. `parseDate` returns `false` instead of `undefined` when the
 * text can not be parsed.
 */
export interface FlowDatePickerI18n extends Omit<DatePickerI18n, 'referenceDate' | 'parseDate'> {
  /** Custom date formats from the server, used instead of the locale-based format */
  dateFormats?: string[] | null;
  referenceDate?: string | DatePickerDate;
  parseDate?(date: string): DatePickerDate | false | undefined;
}

/** The date metadata configuration sent by the server */
export interface DateMetadataConfig {
  /** Disabled dates as `[year, month, day]` triples, with a 0-based month */
  disabledDates?: [number, number, number][] | null;
  /** Disabled weekdays as ISO weekday numbers, Monday = 1 ... Sunday = 7 */
  disabledWeekdays?: number[] | null;
  /** Whether a date metadata provider is set on the server */
  hasProvider?: boolean;
}

/** The server-side RPC proxy of the date picker */
export interface DatePickerServer {
  /** The range and the returned entries identify a date by an ISO 8601 string */
  requestDateMetadata(start: string, end: string): Promise<DatePickerDateMetadata[]>;
}

/**
 * The Flow-specific API the date picker connector relies on. Also widens the
 * public API where Flow deviates from it: `isDateDisabled` is cleared with
 * `undefined` and `i18n` holds the Flow-extended i18n object.
 */
export interface FlowDatePickerInternals {
  $connector: DatePickerConnector;
  $server: DatePickerServer;
  i18n: FlowDatePickerI18n;
  isDateDisabled: ((date: DatePickerDate) => boolean) | undefined;
}

/** The Flow date picker element */
export type FlowDatePicker = Omit<DatePicker, 'i18n' | 'isDateDisabled'> & FlowDatePickerInternals;

declare global {
  // Augments the global Vaadin interface declared by @vaadin/component-base
  // with the Flow namespace used by the connector. The namespace is a shared
  // interface that each module merges its own members into, so that connectors
  // from different modules can be type-checked in the same program.
  interface Vaadin {
    Flow: VaadinFlow;
  }

  interface VaadinFlow {
    datepickerConnector: { initLazy(datePicker: FlowDatePicker): void };
  }
}
