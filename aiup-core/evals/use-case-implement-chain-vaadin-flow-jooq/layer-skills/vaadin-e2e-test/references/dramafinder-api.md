<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Drama Finder API Reference

Vendored from the Drama Finder `2.0.1` sources and Javadoc (`org.vaadin.addons:dramafinder:2.0.1`, built against
Vaadin 25.3, Playwright 1.63, and Java 21). This is the authoritative API reference for writing Playwright tests —
use it instead of fetching docs at runtime. If you need a class not listed here, or the project pins another
version, look it up in the published Javadoc (https://javadoc.io/doc/org.vaadin.addons/dramafinder) for that
version: a project on Drama Finder 1.x has none of what is marked *(2.x)* below.

All element wrappers live under `org.vaadin.addons.dramafinder.element` (shared mixins under
`...element.shared`). The test base class is `org.vaadin.addons.dramafinder.AbstractBasePlaywrightIT`: it opens a
fresh `page` before each test at `getUrl() + getView()` and waits for Vaadin; the test class implements
`String getUrl()` and overrides `String getView()`. It also offers `navigate(Class<?> view)`,
`navigate(Class<?> view, Object parameter)`, `assertAt(Class<?> view)`, `assertPath(String path)`, and
`assertQueryParameter(String name, String value)` *(2.x)*, and writes a failure report with a screenshot to
`target/agent-report/<TestClass>/<testMethod>/` for every failing test *(2.x)*.

## Locator levels

Every wrapper exposes two locator levels (from `VaadinElement` / `HasValueElement`):

- `getLocator()` — the component root. Use for `theme`, CSS class, `opened`, `invalid` state.
- `getInputLocator()` — the internal native input. Use for `value`, `maxlength`, `pattern`, focus.

CSS selectors pierce shadow DOM automatically; XPath does NOT.

## Available element classes

`AccordionElement`, `AccordionPanelElement`, `AppLayoutElement`, `AvatarElement`, `AvatarGroupElement`,
`BadgeElement`, `BigDecimalFieldElement`, `BreadcrumbsElement`, `BreadcrumbsItemElement`, `ButtonElement`,
`CardElement`, `CheckboxElement`, `CheckboxGroupElement`, `ComboBoxElement`, `ConfirmDialogElement`,
`ContextMenuElement`, `CustomFieldElement`, `DatePickerElement`, `DateTimePickerElement`, `DetailsElement`,
`DialogElement`, `EmailFieldElement`, `FormLayoutElement`,
`GridElement` (+ `RowElement`, `CellElement`, `HeaderCellElement`, `FooterCellElement`), `IntegerFieldElement`,
`ListBoxElement`, `LoginFormElement`, `LoginOverlayElement`, `MarkdownElement`, `MenuBarElement`, `MenuElement`,
`MenuItemElement`, `MessageInputElement`, `MessageListElement`, `MultiSelectComboBoxElement`,
`NotificationElement`, `NumberFieldElement`, `PasswordFieldElement`, `PopoverElement`, `ProgressBarElement`,
`RadioButtonElement`, `RadioButtonGroupElement`, `SelectElement`, `SideNavigationElement`,
`SideNavigationItemElement`, `SliderElement`, `SplitLayoutElement`, `SwitchElement`, `TabElement`, `TabsElement`,
`TabSheetElement`, `TextAreaElement`, `TextFieldElement`, `TimePickerElement`, `TooltipElement`,
`TreeGridElement` (+ `TreeRowElement`), `UploadElement`, `VirtualListElement`.

Every wrapper also has `getById(Page|Locator, String id)` and `getByTestId(Page|Locator, String testId)`
factories *(2.x)* — fallbacks for a component without a user-visible name; prefer the label and text lookups.

## Shared methods (available on every element)

### `VaadinElement` (base class)

- `void click()` — click the component root
- `String getText()` — text content of the root (or `null`)
- `com.microsoft.playwright.Locator getLocator()`
- `boolean isVisible()` / `void assertVisible()` / `void assertVisible(boolean visible)` *(2.x)*
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
- **`FocusableElement`**: `void focus()`, `void blur()`, `void assertIsFocused()`, `void assertIsNotFocused()`, `String getTabIndex()`
- **`HasCheckedElement`** *(2.x; on the element class itself in 1.x)*: `void check()`, `void uncheck()`,
  `void setChecked(boolean)`, `boolean isChecked()`, `void assertChecked()`, `void assertNotChecked()`
- **`HasReadOnlyElement`** *(2.x; on the element class itself in 1.x)*: `boolean isReadOnly()`,
  `void assertReadOnly()`, `void assertNotReadOnly()`
- **`HasAriaLabelElement`**: `String getAriaLabel()`, `void assertAriaLabel(String)`
- **`HasThemeElement`**: `String getTheme()`, `void assertTheme(String)`, `void assertHasThemeVariant(String)` and
  `void assertHasNoThemeVariant(String)` *(2.x)*
- **`HasStyleElement`**: `void assertCssClass(String...)`, `String getCssClass()`
- **`HasTooltipElement`**: `String getTooltipText()`, `void assertTooltipHasText(String)`
- **`HasPrefixElement`** / **`HasSuffixElement`**: `assertPrefixHasText(String)` / `assertSuffixHasText(String)`

## Element APIs

### `TextFieldElement` (and subclasses `EmailFieldElement`, `PasswordFieldElement`, `TextAreaElement`)

Implements `HasValueElement`, `HasValidationPropertiesElement`, `HasEnabledElement`, `HasLabelElement`,
`HasPlaceholderElement`, `HasHelperElement`, `HasClearButtonElement`, `FocusableElement` and more.

- `static TextFieldElement getByLabel(Page page, String label)`
- `static TextFieldElement getByLabel(Locator scope, String label)`
- `static TextFieldElement getByLabelContaining(Page page, String text)` / `(Locator scope, String text)` *(2.x)*
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
- `static ButtonElement getByTextContaining(Page page, String text)` / `(Locator scope, String text)` *(2.x)*
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
- `String getSelectedItemLabel()` / `List<String> getItemLabels()` *(2.x)*

### `CheckboxElement`

Implements `HasValueElement`, `HasValidationPropertiesElement`, `HasEnabledElement`, `HasLabelElement`.

- `static CheckboxElement getByLabel(Page page, String label)` / `(Locator scope, String label)`
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

`DialogElement` matches `<vaadin-dialog>` only; a `<vaadin-confirm-dialog>` is a `ConfirmDialogElement`.

### `ConfirmDialogElement` *(2.x)*

Wraps `<vaadin-confirm-dialog>`, found by its `alertdialog` role with the header as accessible name (Vaadin 25). A
Flow `ConfirmDialog` is attached to the page only while it is open, so look it up again after it was answered
instead of reusing the wrapper.

- `static ConfirmDialogElement get(Page page)` — the one open confirm dialog
- `static ConfirmDialogElement getByHeaderText(Page page, String header)` — the full header, case-sensitive
- `new ConfirmDialogElement(Locator locator)`
- `void confirm()` / `void cancel()` / `void reject()` — click the button; `cancel` and `reject` fail when the
  dialog has no such button
- `void closeWithEscape()`
- `boolean isOpen()` / `void assertOpen()` / `void assertClosed()` — `assertClosed` also passes once the dialog
  is gone
- `String getHeaderText()` / `void assertHeaderText(String)`
- `String getMessage()` / `void assertMessage(String)` — the message text, whitespace collapsed
- `ButtonElement getConfirmButton()` / `getCancelButton()` / `getRejectButton()`
- `void assertConfirmText(String)` / `assertCancelText(String)` / `assertRejectText(String)`
- `void assertCancelable()` / `assertNotCancelable()` / `assertRejectable()` / `assertNotRejectable()`
- `Locator getHeaderLocator()` / `getMessageLocator()` / `getOverlayLocator()`

Drama Finder 1.x has no such class. There, and on Vaadin 24 (where the role sits on
`vaadin-confirm-dialog-overlay`), locate the dialog by role and name narrowed to its tag —
`page.getByRole(AriaRole.ALERTDIALOG, new Page.GetByRoleOptions().setName(header)).and(page.locator("vaadin-confirm-dialog"))`
— and pass that locator to `ButtonElement.getByText(locator, text)`.

### `NotificationElement`

Wraps `<vaadin-notification-card>`.

- `new NotificationElement(Page page)` / `new NotificationElement(Locator locator)`
- `static NotificationElement getByText(Page page, String text)` — the open notification containing `text` *(2.x)*
- `boolean isOpen()` / `void assertOpen()` / `void assertClosed()`
- `Locator getContentLocator()`
- `void assertContent(String content)` — the notification contains the text *(2.x)*; for the full message assert
  `hasText` on `getContentLocator()`

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
- `void waitForGridToStopLoading()` — call after opening a view with a lazy grid, before the first `findCell`/`getTotalRowCount`, and after scrolling
- retrying asserts *(2.x)*: `assertRowCount(int)`, `assertEmpty()`, `assertCellContent(int row, int column, String)` /
  `(int row, String columnHeaderText, String)`, `assertRowIndexesWithColumnText(int column, String text, Integer...)`,
  `assertHeaderCellContents(String...)`, `assertColumnPresent(String)` / `assertColumnNotPresent(String)`,
  `assertRowSelected(int)` / `assertRowNotSelected(int)`, `assertSelectedItemCount(int)`
- `List<String> getColumnTexts(int columnIndex)` *(2.x)*

#### `GridElement.RowElement`

- `int getRowIndex()` / `Locator getRowLocator()`
- `CellElement getCell(int columnIndex)` / `CellElement getCell(String columnHeaderText)`
- `void select()` / `void deselect()` / `boolean isSelected()`
- `void openDetails()` / `void closeDetails()` / `boolean isDetailsOpen()` / `CellElement getDetailsCell()`

#### `GridElement.CellElement`

- `Locator getCellContentLocator()` — the `vaadin-grid-cell-content` (use for text asserts, e.g. `PlaywrightAssertions.assertThat(cell.getCellContentLocator()).hasText("...")`)
- `Locator getTableCellLocator()` — the `td`/`th`
- `int getColumnIndex()` (`-1` for details cells)
- `void click()`
- `String getText()` / `void assertText(String expected)` *(2.x)*

## Notes

- Prefer auto-retrying assertions (`assertValue`, `assertVisible`, Playwright `assertThat(locator)...`) over
  raw `isVisible()`/`getAttribute()` boolean checks — only the asserts retry.
- `TreeGridElement` extends `GridElement` (adds `TreeRowElement`); `MultiSelectComboBoxElement` mirrors
  `ComboBoxElement` for multi-select.
