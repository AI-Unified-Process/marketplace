# Drama Finder API Reference

Vendored from the Drama Finder `1.1.0` Javadoc (`org.vaadin.addons:dramafinder:1.1.0`). This is the
authoritative API reference for writing Playwright tests — use it instead of fetching docs at runtime.
If you need a class not listed here, or have upgraded the dependency, look it up via the JavaDocs MCP
server (see SKILL.md) and update this file.

All element wrappers live under `org.vaadin.addons.dramafinder.element` (shared mixins under
`...element.shared`). The test base class is `org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT`.

## Locator levels

Every wrapper exposes two locator levels (from `VaadinElement` / `HasValueElement`):

- `getLocator()` — the component root. Use for `theme`, CSS class, `opened`, `invalid` state.
- `getInputLocator()` — the internal native input. Use for `value`, `maxlength`, `pattern`, focus.

CSS selectors pierce shadow DOM automatically; XPath does NOT.

## Available element classes

`AccordionElement`, `AccordionPanelElement`, `AvatarElement`, `BigDecimalFieldElement`,
`ButtonElement`, `CardElement`, `CheckboxElement`, `ComboBoxElement`, `ContextMenuElement`,
`DatePickerElement`, `DateTimePickerElement`, `DetailsElement`, `DialogElement`, `EmailFieldElement`,
`GridElement` (+ `RowElement`, `CellElement`, `HeaderCellElement`), `IntegerFieldElement`,
`ListBoxElement`, `MenuBarElement`, `MenuElement`, `MenuItemElement`, `MessageInputElement`,
`MessageListElement`, `MultiSelectComboBoxElement`, `NotificationElement`, `NumberFieldElement`,
`PasswordFieldElement`, `PopoverElement`, `ProgressBarElement`, `RadioButtonGroupElement`,
`SelectElement`, `SideNavigationElement`, `SideNavigationItemElement`, `SplitLayoutElement`,
`TabElement`, `TabSheetElement`, `TextAreaElement`, `TextFieldElement`, `TimePickerElement`,
`TreeGridElement` (+ `TreeRowElement`), `UploadElement`, `VirtualListElement`.

## Shared methods (available on every element)

### `VaadinElement` (base class)

- `void click()` — click the component root
- `String getText()` — text content of the root (or `null`)
- `com.microsoft.playwright.Locator getLocator()`
- `boolean isVisible()` / `void assertVisible()`
- `boolean isHidden()` / `void assertHidden()`
- `Object getProperty(String name)` / `void setProperty(String name, Object value)` — raw DOM property access

### Shared mixin interfaces (inherited where the component supports them)

- **`HasValueElement`**: `void setValue(String)`, `String getValue()`, `void clear()`,
  `void assertValue(String)`, `Locator getInputLocator()`
- **`HasValidationPropertiesElement`**: `void assertValid()`, `void assertInvalid()`,
  `void assertErrorMessage(String)`, `Locator getErrorMessageLocator()`
- **`HasEnabledElement`**: `boolean isEnabled()`, `void assertEnabled()`, `void assertDisabled()`
- **`HasLabelElement`**: `String getLabel()`, `void assertLabel(String)`
- **`HasPlaceholderElement`**: `String getPlaceholder()`, `void setPlaceholder(String)`, `void assertPlaceholder(String)`
- **`HasHelperElement`**: `String getHelperText()`, `void assertHelperHasText(String)`
- **`HasClearButtonElement`**: `void clickClearButton()`, `boolean isClearButtonVisible()`,
  `void assertClearButtonVisible()` / `assertClearButtonNotVisible()`
- **`FocusableElement`**: `void focus()`, `void blur()`, `void assertIsFocused()`, `void assertIsNotFocused()`, `int getTabIndex()`
- **`HasAriaLabelElement`**: `String getAriaLabel()`, `void assertAriaLabel(String)`
- **`HasThemeElement`**: `String getTheme()`, `void assertTheme(String)`
- **`HasStyleElement`**: `void assertCssClass(String...)`, `String getCssClass()`
- **`HasTooltipElement`**: `String getTooltipText()`, `void assertTooltipHasText(String)`
- **`HasPrefixElement`** / **`HasSuffixElement`**: `assertPrefixHasText(String)` / `assertSuffixHasText(String)`

## Element APIs

### `TextFieldElement` (and subclasses `EmailFieldElement`, `PasswordFieldElement`, `TextAreaElement`)

Implements `HasValueElement`, `HasValidationPropertiesElement`, `HasEnabledElement`, `HasLabelElement`,
`HasPlaceholderElement`, `HasHelperElement`, `HasClearButtonElement`, `FocusableElement` and more.

- `static TextFieldElement getByLabel(Page page, String label)`
- `static TextFieldElement getByLabel(Locator scope, String label)`
- `Integer getMinLength()` / `void setMinLength(int)` / `void assertMinLength(Integer)`
- `Integer getMaxLength()` / `void setMaxLength(int)` / `void assertMaxLength(Integer)`
- `String getPattern()` / `void setPattern(String)` / `void assertPattern(String)`
- plus all `HasValueElement` (`setValue`/`getValue`/`clear`/`assertValue`) and validation asserts

### `ButtonElement`

`getByText` matches accessible name OR visible text. For icon-only buttons set `setAriaLabel(...)`
server-side, then look up with `getByText(page, "<aria label>")`.

- `static ButtonElement getByText(Page page, String text)`
- `static ButtonElement getByText(Locator scope, String text)`
- `static ButtonElement getByLabel(Page page, String text)` — alias for `getByText`
- inherits `click()`, `assertEnabled()/assertDisabled()`, `focus()`, theming/tooltip asserts

### `ComboBoxElement`

Implements `HasValueElement` (read-only `getValue`/`assertValue` — value is the displayed label),
`HasValidationPropertiesElement`, `HasEnabledElement`, `HasLabelElement`.

- `static ComboBoxElement getByLabel(Page page, String label)` / `(Locator scope, String label)`
- `void selectItem(String item)` — open overlay and click the matching item by visible label
- `void filterAndSelectItem(String filter, String item)`
- `void setFilter(String filter)` / `String getFilter()`
- `void open()` / `void close()` / `boolean isOpened()` / `assertOpened()` / `assertClosed()`
- `void clickToggleButton()`
- `int getOverlayItemCount()` / `void assertItemCount(int)`
- `boolean isReadOnly()` / `assertReadOnly()` / `assertNotReadOnly()`
- `String getValue()` / `void assertValue(String)`

### `CheckboxElement`

Implements `HasValueElement`, `HasValidationPropertiesElement`, `HasEnabledElement`, `HasLabelElement`.

- `static CheckboxElement getByLabel(Page page, String label)`
- `void check()` / `void uncheck()`
- `boolean isChecked()` / `void assertChecked()` / `void assertNotChecked()`
- `boolean isIndeterminate()` / `void setIndeterminate(boolean)` / `assertIndeterminate()` / `assertNotIndeterminate()`

### `DatePickerElement`

Works with `java.time.LocalDate`. The String value/`setValue(String)` uses the view format `dd/mm/yyyy`.

- `static DatePickerElement getByLabel(Page page, String label)` / `(Locator scope, String label)`
- `void setValue(LocalDate date)` — sets value as ISO-8601
- `void setValue(String value)` — value formatted as in the view (`dd/mm/yyyy`)
- `LocalDate getValueAsLocalDate()`
- `void assertValue(LocalDate value)` / `void assertValue(String value)`
- inherits validation, clear-button, enablement asserts

### `DialogElement`

- `new DialogElement(Page page)` — resolve the dialog via ARIA role
- `new DialogElement(Locator locator)`
- `static DialogElement getByHeaderText(Page page, String headerText)`
- `boolean isOpen()` / `void assertOpen()` / `void assertClosed()`
- `String getHeaderText()` / `void assertHeaderText(String)`
- `boolean isModal()` / `void assertModal()` / `void assertModeless()`
- `void closeWithEscape()`
- `Locator getHeaderLocator()` / `getContentLocator()` / `getFooterLocator()`

Scope lookups within a dialog by passing `dialog.getLocator()` to another element's factory, e.g.
`ButtonElement.getByText(dialog.getLocator(), "Confirm")`.

### `NotificationElement`

Wraps `<vaadin-notification-card>`.

- `new NotificationElement(Page page)` / `new NotificationElement(Locator locator)`
- `boolean isOpen()` / `void assertOpen()` / `void assertClosed()`
- `Locator getContentLocator()`

### `GridElement`

Cell access uses JS evaluation on the grid's internal APIs (body cells are virtualized in shadow DOM).
Always use `getTotalRowCount()` for data assertions — the viewport limits how many rows render.

- `static GridElement get(Page page)` / `static GridElement get(Locator parent)`
- `static GridElement getById(Page page, String id)`
- `int getTotalRowCount()` — total data items (use this for counts)
- `int getRenderedRowCount()` — rows currently in the DOM (≤ total due to virtualization)
- `int getColumnCount()`
- `List<String> getHeaderCellContents()`
- `Optional<CellElement> findCell(int row, int column)`
- `Optional<CellElement> findCell(int row, String columnHeaderText)`
- `Optional<RowElement> findRow(int rowIndex)` — scrolls if needed
- `Optional<HeaderCellElement> findHeaderCell(int columnIndex)` / `findHeaderCellByText(String)`
- `List<Integer> findRowIndexesWithColumnText(int columnIndex, String text)`
- `void select(int rowIndex)` / `void deselect(int rowIndex)` / `int getSelectedItemCount()`
- select-all: `checkSelectAll()` / `uncheckSelectAll()` / `isSelectAllChecked()` / `isSelectAllIndeterminate()`
- `void scrollToRow(int)` / `scrollToStart()` / `scrollToEnd()`
- `void waitForGridToStopLoading()` — call after scrolling an async/lazy grid

#### `GridElement.RowElement`

- `int getRowIndex()` / `Locator getRowLocator()`
- `CellElement getCell(int columnIndex)` / `CellElement getCell(String columnHeaderText)`
- `void select()` / `void deselect()` / `boolean isSelected()`
- `void openDetails()` / `void closeDetails()` / `boolean isDetailsOpen()` / `CellElement getDetailsCell()`

#### `GridElement.CellElement`

- `Locator getCellContentLocator()` — the `vaadin-grid-cell-content` (use for text asserts, e.g. `assertThat(cell.getCellContentLocator()).hasText("..."))`
- `Locator getTableCellLocator()` — the `td`/`th`
- `int getColumnIndex()` (`-1` for details cells)
- `void click()`

## Notes

- Prefer auto-retrying assertions (`assertValue`, `assertVisible`, Playwright `assertThat(locator)...`) over
  raw `isVisible()`/`getAttribute()` boolean checks — only the asserts retry.
- `TreeGridElement` extends `GridElement` (adds `TreeRowElement`); `MultiSelectComboBoxElement` mirrors
  `ComboBoxElement` for multi-select.
