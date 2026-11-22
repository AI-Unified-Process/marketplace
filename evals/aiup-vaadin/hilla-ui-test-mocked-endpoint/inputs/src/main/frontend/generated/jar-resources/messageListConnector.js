/*
 * Copyright 2000-2026 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * Creates a DateTimeFormat with the given locale, or throws if invalid.
 */
function createDateTimeFormatter(locale) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
}

function getFormatter(locale) {
  // Try creating formatter with progressive fallbacks
  const localeParts = locale?.split('-');
  const fallbackLocales = [
    locale, // Full locale (e.g., "de-DE-hw")
    localeParts?.slice(0, 2).join('-'), // Base locale without variant (e.g., "de-DE")
    localeParts?.[0] // Language only (e.g., "de")
  ];

  for (const fallbackLocale of fallbackLocales) {
    try {
      return createDateTimeFormatter(fallbackLocale);
    } catch (e) {
      // Continue to next fallback
    }
  }

  return createDateTimeFormatter(undefined); // Default locale
}

/**
 * Maps the given items to a new array of items with formatted time.
 */
function formatItems(items, locale) {
  const formatter = getFormatter(locale);

  return items.map((item) =>
    item.time
      ? Object.assign(item, {
          time: formatter.format(new Date(item.time))
        })
      : item
  );
}

window.Vaadin.Flow.messageListConnector = {
  /**
   * Initializes the connector for the given message list element.
   * Sets up event listeners for attachment clicks.
   */
  initLazy(list) {
    if (list._flowConnectorInitialized) {
      return;
    }
    list._flowConnectorInitialized = true;

    // Listen for attachment-click events and re-dispatch with indexes for Flow
    list.addEventListener('attachment-click', (e) => {
      const { item, attachment } = e.detail;

      // Compute indexes from the item and attachment references
      const itemIndex = list.items.indexOf(item);
      const attachmentIndex = item?.attachments?.indexOf(attachment) ?? -1;

      // Only dispatch if indexes are valid
      if (itemIndex < 0 || attachmentIndex < 0) {
        return;
      }

      // Dispatch a new event with indexes for Flow's @DomEvent handling
      list.dispatchEvent(
        new CustomEvent('attachment-click-flow', {
          detail: { itemIndex, attachmentIndex }
        })
      );
    });
  },

  /**
   * Fully replaces the items in the list with the given items.
   */
  setItems(list, items, locale) {
    this.initLazy(list);
    list.items = formatItems(items, locale);
  },

  /**
   * Sets the text of the item at the given index to the given text.
   */
  setItemText(list, text, index) {
    list.items[index].text = text;
    list.items = [...list.items];
  },

  /**
   * Appends the given text to the text of the item at the given index.
   */
  appendItemText(list, appendedText, index) {
    const currentText = list.items[index].text || '';
    this.setItemText(list, currentText + appendedText, index);
  },

  /**
   * Adds the given items to the end of the list.
   */
  addItems(list, newItems, locale) {
    this.initLazy(list);
    list.items = [...(list.items || []), ...formatItems(newItems, locale)];
  }
};
