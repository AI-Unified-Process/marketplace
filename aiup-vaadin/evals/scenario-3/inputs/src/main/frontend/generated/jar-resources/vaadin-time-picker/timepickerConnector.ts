import {
  TEST_PM_TIME,
  escapeRegExp,
  formatMilliseconds,
  parseMillisecondsIntoInteger,
  parseDigitsIntoInteger,
  getAmString,
  getPmString,
  getSeparator,
  searchAmOrPmToken
} from './helpers.ts';
import type { FlowTimePicker, FlowTimePickerTime } from './vaadin-time-picker-types.js';

/**
 * timepickerConnector is a communication layer between TimePicker's flow
 * component (server-side) and web component (client-side).
 */
export class TimePickerConnector {
  readonly #timePicker: FlowTimePicker;

  // Locale and the values derived from it, assigned by `setLocale`
  #locale?: string;
  #amString: string | null = null;
  #pmString: string | null = null;
  #separator: string | null = null;
  #escapedSeparator = '';

  // The result of the last successful parse, reused when the same string is
  // parsed again
  #cachedTimeString?: string;
  #cachedTimeObject?: FlowTimePickerTime;

  constructor(timePicker: FlowTimePicker) {
    this.#timePicker = timePicker;
  }

  setLocale(locale: string): void {
    try {
      // Check whether the locale is supported by the browser or not
      TEST_PM_TIME.toLocaleTimeString(locale);
    } catch (e) {
      // FIXME should do a callback for server to throw an exception ?
      throw new Error(`vaadin-time-picker: The locale ${locale} is not supported.`);
    }

    this.#locale = locale;

    // 1. 24 or 12 hour clock, if latter then what are the am/pm strings ?
    this.#pmString = getPmString(locale);
    this.#amString = getAmString(locale);

    // 2. What is the separator ?
    this.#separator = getSeparator(locale);
    // The separator can be a regexp special character, such as the dot used by fi-FI
    this.#escapedSeparator = escapeRegExp(this.#separator || '');

    // A cached result was parsed with the previous locale, so it no longer applies
    this.#cachedTimeString = undefined;
    this.#cachedTimeObject = undefined;

    // Assigning a new object makes the web component re-format the current value
    this.#timePicker.i18n = {
      formatTime: (timeObject) => this.#formatTime(timeObject),
      parseTime: (timeString) => this.#parseTime(timeString)
    };
  }

  #includeSeconds(): boolean {
    return !!this.#timePicker.step && this.#timePicker.step < 60;
  }

  #includeMilliseconds(): boolean {
    return !!this.#timePicker.step && this.#timePicker.step < 1;
  }

  #formatTime(timeObject: FlowTimePickerTime | undefined): string | undefined {
    if (!timeObject) return undefined;

    const timeToBeFormatted = new Date();
    timeToBeFormatted.setHours(timeObject.hours);
    timeToBeFormatted.setMinutes(timeObject.minutes);
    timeToBeFormatted.setSeconds(timeObject.seconds !== undefined ? timeObject.seconds : 0);

    // the web component expects the correct granularity used for the time string,
    // thus need to format the time object in correct granularity by passing the format options
    let localeTimeString = timeToBeFormatted.toLocaleTimeString(this.#locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: this.#includeSeconds() ? 'numeric' : undefined
    });

    // milliseconds not part of the time format API
    if (this.#includeMilliseconds()) {
      localeTimeString = formatMilliseconds(localeTimeString, timeObject.milliseconds, this.#amString, this.#pmString);
    }

    return localeTimeString;
  }

  #parseTime(timeString: string): FlowTimePickerTime | undefined {
    if (timeString && timeString === this.#cachedTimeString && this.#cachedTimeObject) {
      return this.#cachedTimeObject;
    }

    if (!timeString) {
      // when nothing is returned, the component shows the invalid state for the input
      return undefined;
    }

    const amToken = searchAmOrPmToken(timeString, this.#amString);
    const pmToken = searchAmOrPmToken(timeString, this.#pmString);

    const numbersOnlyTimeString = timeString
      .replace(amToken || '', '')
      .replace(pmToken || '', '')
      .trim();

    // A regexp that allows to find the numbers with optional separator and continuing searching after it.
    const numbersRegExp = new RegExp('([\\d\\u0660-\\u0669]){1,2}(?:' + this.#escapedSeparator + ')?', 'g');

    const hoursMatch = numbersRegExp.exec(numbersOnlyTimeString);
    if (hoursMatch) {
      let hours = parseDigitsIntoInteger(hoursMatch[0].replace(this.#separator || '', ''));
      // handle 12 am -> 0
      // do not do anything if am & pm are not used or if those are the same,
      // as with locale bg-BG there is always ч. at the end of the time
      if (amToken !== pmToken) {
        if (hours === 12 && amToken) {
          hours = 0;
        }
        if (hours !== 12 && pmToken) {
          hours += 12;
        }
      }
      const minutes = numbersRegExp.exec(numbersOnlyTimeString);
      const seconds = minutes && numbersRegExp.exec(numbersOnlyTimeString);
      // detecting milliseconds from input, expects am/pm removed from end, eg. .0 or .00 or .000
      const millisecondRegExp = /[[\.][\d\u0660-\u0669]{1,3}$/;
      // reset to end or things can explode
      let milliseconds: RegExpExecArray | false | null | undefined =
        seconds && this.#includeMilliseconds() && millisecondRegExp.exec(numbersOnlyTimeString);
      // handle case where last numbers are seconds and . is the separator (invalid regexp match)
      if (milliseconds && seconds && milliseconds.index <= seconds.index) {
        milliseconds = undefined;
      }
      // hours is a number at this point, others are either arrays or null
      // the string in [0] from the arrays includes the separator too
      this.#cachedTimeObject = {
        hours: hours,
        minutes: minutes ? parseDigitsIntoInteger(minutes[0].replace(this.#separator || '', '')) : 0,
        seconds: seconds ? parseDigitsIntoInteger(seconds[0].replace(this.#separator || '', '')) : 0,
        milliseconds:
          minutes && seconds && milliseconds ? parseMillisecondsIntoInteger(milliseconds[0].replace('.', '')) : 0
      };
      this.#cachedTimeString = timeString;
      return this.#cachedTimeObject;
    }
    return undefined;
  }
}

function initLazy(timePicker: FlowTimePicker): void {
  // Init the connector only once for the time picker
  timePicker.$connector ??= new TimePickerConnector(timePicker);
}

window.Vaadin.Flow.timepickerConnector = { initLazy };
