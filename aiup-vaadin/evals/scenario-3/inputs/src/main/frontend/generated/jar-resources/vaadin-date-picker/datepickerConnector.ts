import { format as dateFnsFormat } from 'date-fns/format';
import { parse as dateFnsParse } from 'date-fns/parse';
import { isValid as dateFnsIsValid } from 'date-fns/isValid';
import { createDate, extractDateParts, parseDate } from '@vaadin/date-picker/src/vaadin-date-picker-helper.js';
import type {
  DatePickerDate,
  DatePickerDateMetadataProvider
} from '@vaadin/date-picker/src/vaadin-date-picker-mixin.js';
import type { DateMetadataConfig, FlowDatePicker, FlowDatePickerI18n } from './vaadin-date-picker-types.js';

function createLocaleBasedDateFormat(locale: string | null): string {
  try {
    // Check whether the locale is supported or not. An unsupported locale,
    // null included, makes toLocaleDateString throw.
    new Date().toLocaleDateString(locale!);
  } catch (e) {
    console.warn('The locale is not supported, using default format setting (ISO 8601).');
    return 'yyyy-MM-dd';
  }

  // format test date and convert to date-fns pattern
  const testDate = new Date(Date.UTC(1234, 4, 6));
  let pattern = testDate.toLocaleDateString(locale!, { timeZone: 'UTC' });
  pattern = pattern
    // escape date-fns pattern letters by enclosing them in single quotes
    .replace(/([a-zA-Z]+)/g, "'$1'")
    // insert date placeholder
    .replace('06', 'dd')
    .replace('6', 'd')
    // insert month placeholder
    .replace('05', 'MM')
    .replace('5', 'M')
    // insert year placeholder
    .replace('1234', 'yyyy');
  const isValidPattern = pattern.includes('d') && pattern.includes('M') && pattern.includes('y');
  if (!isValidPattern) {
    console.warn('The locale is not supported, using default format setting (ISO 8601).');
    return 'yyyy-MM-dd';
  }

  return pattern;
}

function getShortYearFormat(format: string): string | undefined {
  if (format.includes('yyyy') && !format.includes('yyyyy')) {
    return format.replace('yyyy', 'yy');
  }
  if (format.includes('YYYY') && !format.includes('YYYYY')) {
    return format.replace('YYYY', 'YY');
  }
  return undefined;
}

function isFormatWithYear(format: string): boolean {
  return format.includes('y') || format.includes('Y');
}

function isShortYearFormat(format: string): boolean {
  // Format is long if it includes a four-digit year.
  return !format.includes('yyyy') && !format.includes('YYYY');
}

function getExtendedFormats(formats: string[]): string[] {
  return formats.reduce<string[]>((acc, format) => {
    // Add a variant with a short year to the formats as long
    // as short years are supported with the long date format.
    if (isFormatWithYear(format) && !isShortYearFormat(format)) {
      const shortYearFormat = getShortYearFormat(format);
      if (shortYearFormat) {
        acc.push(shortYearFormat);
      }
    }
    acc.push(format);
    return acc;
  }, []);
}

/**
 * datepickerConnector is a communication layer between DatePicker's flow
 * component (server-side) and web component (client-side).
 */
export class DatePickerConnector {
  readonly #datePicker: FlowDatePicker;

  /** `'successful'`, `'error'`, or `undefined` when nothing was parsed since the overlay opened */
  #lastParseStatus?: 'successful' | 'error';
  #lastParsedDate?: DatePickerDate;

  // STABLE reference — created once per connector, never reassigned. Assigning a new function
  // to `dateMetadataProvider` clears the web component's cache and re-fetches every visible
  // range, so the same function object is reused for every update.
  #dateMetadataProvider: DatePickerDateMetadataProvider = ({ start, end }) => {
    // The range bounds are ISO 8601 dates, which the server parses as they are.
    return this.#datePicker.$server.requestDateMetadata(start, end);
  };

  constructor(datePicker: FlowDatePicker) {
    this.#datePicker = datePicker;

    datePicker.addEventListener('opened-changed', () => (this.#lastParseStatus = undefined));
  }

  updateI18n(locale: string | null, i18n: FlowDatePickerI18n | null): void {
    if (i18n && i18n.referenceDate && typeof i18n.referenceDate === 'string') {
      i18n.referenceDate = extractDateParts(new Date(i18n.referenceDate));
    }
    // Either use custom formats specified in I18N, or create format from locale
    const usedFormats = i18n?.dateFormats?.length ? i18n.dateFormats : [createLocaleBasedDateFormat(locale)];

    // Merge new I18N settings with formatting and parsing functions
    this.#datePicker.i18n = Object.assign({}, i18n, this.#createFormatterAndParser(usedFormats));
  }

  setDateMetadataConfig(config: DateMetadataConfig): void {
    // Keys are `year-month-day` with a 0-based month, matching what the web component
    // passes to `isDateDisabled`, so nothing has to be parsed or converted per date.
    const disabledDates = new Set((config.disabledDates || []).map(([y, m, d]) => `${y}-${m}-${d}`));
    // ISO weekday numbers, 1..7.
    const disabledWeekdays = new Set(config.disabledWeekdays || []);
    const hasDisabledDates = disabledDates.size > 0;
    const hasDisabledWeekdays = disabledWeekdays.size > 0;

    this.#datePicker.isDateDisabled =
      !hasDisabledDates && !hasDisabledWeekdays
        ? undefined
        : ({ year, month, day }) =>
            (hasDisabledDates && disabledDates.has(`${year}-${month}-${day}`)) ||
            (hasDisabledWeekdays && disabledWeekdays.has(createDate(year, month, day).getDay() || 7));

    this.#datePicker.dateMetadataProvider = config.hasProvider ? this.#dateMetadataProvider : null;
  }

  /**
   * Creates the `formatDate` and `parseDate` functions the web component's i18n
   * object expects, bound to the given date formats.
   */
  #createFormatterAndParser(formats: string[]): Pick<FlowDatePickerI18n, 'formatDate' | 'parseDate'> {
    if (!formats || formats.length === 0) {
      throw new Error('Array of custom date formats is null or empty');
    }

    return {
      formatDate: (dateParts) => this.#formatDate(dateParts, formats[0]),
      parseDate: (dateString) => this.#parseDate(dateString, formats)
    };
  }

  #formatDate(dateParts: DatePickerDate, format: string): string {
    const date = createDate(dateParts.year, dateParts.month, dateParts.day);

    return dateFnsFormat(date, format);
  }

  #parseDate(dateString: string, formats: string[]): DatePickerDate | false {
    const referenceDate = this.#getReferenceDate();
    for (const format of getExtendedFormats(formats)) {
      const parsedDate = this.#doParseDate(dateString, format, referenceDate);
      if (parsedDate) {
        this.#lastParseStatus = 'successful';
        this.#lastParsedDate = parsedDate;
        return parsedDate;
      }
    }
    this.#lastParseStatus = 'error';
    return false;
  }

  #doParseDate(dateString: string, format: string, referenceDate: Date): DatePickerDate | undefined {
    // When format does not contain a year, then current year should be used.
    const refDate = isFormatWithYear(format) ? referenceDate : new Date();
    const date = dateFnsParse(dateString, format, refDate);
    if (dateFnsIsValid(date)) {
      if (isFormatWithYear(format) && isShortYearFormat(format)) {
        this.#correctFullYear(date);
      }
      return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      };
    }
    return undefined;
  }

  #correctFullYear(date: Date): void {
    // The last parsed date check handles the case where a four-digit year is parsed, then formatted
    // as a two-digit year, and then parsed again. In this case we want to keep the century of the
    // originally parsed year, instead of using the century of the reference date.

    // Do not apply any correction if the previous parse attempt was failed.
    if (this.#lastParseStatus === 'error') {
      return;
    }

    // Update century if the last parsed date is the same except the century.
    const lastParsedDate = this.#lastParsedDate;
    if (this.#lastParseStatus === 'successful' && lastParsedDate) {
      if (
        lastParsedDate.day === date.getDate() &&
        lastParsedDate.month === date.getMonth() &&
        lastParsedDate.year % 100 === date.getFullYear() % 100
      ) {
        date.setFullYear(lastParsedDate.year);
      }
      return;
    }

    // Update century if this is the first parse after overlay open.
    const currentValue = parseDate(this.#datePicker.value);
    if (
      currentValue &&
      currentValue.getDate() === date.getDate() &&
      currentValue.getMonth() === date.getMonth() &&
      currentValue.getFullYear() % 100 === date.getFullYear() % 100
    ) {
      date.setFullYear(currentValue.getFullYear());
    }
  }

  #getReferenceDate(): Date {
    const { referenceDate } = this.#datePicker.i18n;
    // A string referenceDate is converted into date parts by `updateI18n`, so
    // only the web component's default empty string can appear here.
    return typeof referenceDate === 'object'
      ? new Date(referenceDate.year, referenceDate.month, referenceDate.day)
      : new Date();
  }
}

function initLazy(datePicker: FlowDatePicker): void {
  // Init the connector only once for the date picker
  datePicker.$connector ??= new DatePickerConnector(datePicker);
}

window.Vaadin.Flow.datepickerConnector = { initLazy };
