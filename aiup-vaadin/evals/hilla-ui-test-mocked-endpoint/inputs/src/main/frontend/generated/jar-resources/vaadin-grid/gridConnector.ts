import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { isFocusable } from '@vaadin/grid/src/vaadin-grid-active-item-mixin.js';
import { GridFlowSelectionColumn } from './vaadin-grid-flow-selection-column.ts';
import type { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';
import type { GridSorter } from '@vaadin/grid/src/vaadin-grid-sorter.js';
import type { GridSorterDirection } from '@vaadin/grid/src/vaadin-grid-data-provider-mixin.js';
import type { GridCellActivateEvent } from '@vaadin/grid/src/vaadin-grid-mixin.js';
import type { FlowDataProviderController, FlowGrid, Item, ItemRange, SelectionMode } from './vaadin-grid-types.js';

const requestDebouncerDelay = 150;

function isRangeEqual(range1: ItemRange | null, range2: ItemRange | null) {
  return range1?.[0] === range2?.[0] && range1?.[1] === range2?.[1];
}

function renderContent(root: HTMLElement, content: Node | string) {
  if (content instanceof Node) {
    if (content.parentNode !== root) {
      root.appendChild(content);
    }
  } else {
    root.textContent = content;
  }
}

/**
 * gridConnector is a communication layer between Grid's flow component
 * (server-side) and web component (client-side).
 */
export class GridConnector {
  readonly #grid: FlowGrid;
  readonly #dataProviderController: FlowDataProviderController;

  #requestDebouncer: Debouncer | null = null;
  #requestedRange: ItemRange | null = null;

  #selectedKeys: Record<string, Item> = {};
  #selectionMode: SelectionMode = 'SINGLE';

  #sorterDirectionsSetFromServer = false;

  #preventRowUpdatesActive = 0;

  #pendingScrollToItem: { itemKey: string; indexes: number[] } | null = null;

  constructor(grid: FlowGrid) {
    this.#grid = grid;
    this.#dataProviderController = grid._dataProviderController;

    grid.size = 0; // To avoid NaN here and there before we get proper data
    grid.itemIdPath = 'key';

    this.#patchGrid();
    this.#addGridEventListeners();
  }

  hasRootRequestQueue(): boolean {
    const { pendingRequests } = this.#dataProviderController.rootCache;
    return Object.keys(pendingRequests).length > 0 || !!this.#requestDebouncer?.isActive();
  }

  doSelection(items: (Item | null)[], userOriginated?: boolean): void {
    const grid = this.#grid;

    if (this.#selectionMode === 'NONE' || !items.length || (userOriginated && grid.hasAttribute('disabled'))) {
      return;
    }
    if (this.#selectionMode === 'SINGLE') {
      this.#selectedKeys = {};
    }

    let selectedItemsChanged = false;
    items.forEach((item) => {
      const selectable = !userOriginated || grid.isItemSelectable(item);
      selectedItemsChanged = selectedItemsChanged || selectable;
      if (item && selectable) {
        this.#selectedKeys[item.key] = item;
        item.selected = true;
        if (userOriginated) {
          grid.$server.select(item.key);
        }
      }
    });

    if (selectedItemsChanged) {
      grid.selectedItems = Object.values(this.#selectedKeys);
    }
  }

  doDeselection(items: Item[], userOriginated?: boolean): void {
    const grid = this.#grid;

    if (this.#selectionMode === 'NONE' || !items.length || (userOriginated && grid.hasAttribute('disabled'))) {
      return;
    }

    const updatedSelectedItems = grid.selectedItems.slice();
    while (items.length) {
      const itemToDeselect = items.shift();
      const selectable = !userOriginated || grid.isItemSelectable(itemToDeselect);
      if (!selectable) {
        continue;
      }
      for (let i = 0; i < updatedSelectedItems.length; i++) {
        const selectedItem = updatedSelectedItems[i];
        if (itemToDeselect?.key === selectedItem.key) {
          updatedSelectedItems.splice(i, 1);
          break;
        }
      }
      if (itemToDeselect) {
        delete this.#selectedKeys[itemToDeselect.key];
        delete itemToDeselect.selected;
        if (userOriginated) {
          grid.$server.deselect(itemToDeselect.key);
        }
      }
    }
    grid.selectedItems = updatedSelectedItems;
  }

  getRenderedRange(): ItemRange {
    const renderedRows = this.#grid._getRenderedRows();
    return [renderedRows.at(0)?.index ?? 0, renderedRows.at(-1)?.index ?? 0];
  }

  getFetchRange(): ItemRange {
    const grid = this.#grid;

    // Get the range of currently rendered rows
    let range = this.getRenderedRange();

    // Expand the range in both directions to add a buffer, e.g. a rendered
    // range of [100, 120] becomes [80, 140]
    const buffer = range[1] - range[0];
    range[0] = Math.max(range[0] - buffer, 0);
    range[1] = Math.min(range[1] + buffer, grid.size - 1);

    // Align the range to page boundaries (inclusive), e.g. with pageSize 50,
    // a range of [60, 110] becomes [50, 149]
    range[0] = Math.floor(range[0] / grid.pageSize) * grid.pageSize;
    range[1] = (Math.floor(range[1] / grid.pageSize) + 1) * grid.pageSize - 1;

    return range;
  }

  async fetchCurrentRange(): Promise<void> {
    const range = this.getFetchRange();

    if (isRangeEqual(range, this.#requestedRange)) {
      // Skip duplicate requests for the same range.
      return;
    }

    this.#requestedRange = range;

    // The range is inclusive while the server expects a length, hence + 1,
    // e.g. a range of [50, 149] results in a length of 100
    await this.#grid.$server.setViewportRange(range[0], range[1] - range[0] + 1);

    // Resolve any pending callbacks in case the server responded with no new
    // data and $connector.confirm wasn't called because the server assumes all
    // the data is already on the client. This can happen, for example, when
    // scrolling quickly back and forth so that the grid returns to a position
    // whose data has already been delivered and is cached. In that case,
    // resolving the callbacks lets the grid exit the loading state correctly.
    this.resolvePendingCallbacks();
  }

  resolvePendingCallbacks(): void {
    const grid = this.#grid;
    const { rootCache } = this.#dataProviderController;

    grid._hasData = true;

    this.#preventRowUpdates(() => {
      Object.values(rootCache.pendingRequests).forEach((callback) => {
        // Set a flag so the grid re-checks all rendered rows after all callbacks
        // are resolved, and requests any that are still missing, not just the ones
        // covered by this resolved callback.
        grid._shouldLoadAllRenderedRowsAfterPageLoad = true;

        // Resolve this pending callback. This may synchronously trigger new ones
        // to be created or reissued.
        callback([]);
      });
    });

    // If no new data provider requests came in while resolving the callbacks
    // above, clear the current requested range and cancel the active request
    // debouncer (if any) to avoid sending a server request that is no longer
    // needed.
    if (Object.values(rootCache.pendingRequests).length === 0) {
      this.#requestDebouncer?.cancel();
      this.#requestedRange = null;
    }
  }

  setSorterDirections(directions: { column: string; direction: GridSorterDirection }[]): void {
    const grid = this.#grid;

    this.#sorterDirectionsSetFromServer = true;
    setTimeout(() => {
      try {
        // Sorters for hidden columns are removed from DOM but stored in the web component.
        // We need to ensure that all the sorters are reset when using `grid.sort(null)`.
        const sorters = [...new Set([...grid.querySelectorAll('vaadin-grid-sorter'), ...grid._sorters])];

        sorters.forEach((sorter) => {
          sorter.direction = null;
        });

        // Apply directions in correct order, depending on configured multi-sort priority.
        // For the default "prepend" mode, directions need to be applied in reverse, in
        // order for the sort indicators to match the order on the server. For "append"
        // just keep the order passed from the server.
        if (grid.multiSortPriority !== 'append') {
          directions = directions.reverse();
        }
        directions.forEach(({ column, direction }) => {
          sorters.forEach((sorter) => {
            if (sorter.getAttribute('path') === column) {
              sorter.direction = direction;
            }
          });
        });

        // Manually trigger a re-render of the sorter priority indicators
        // in case some of the sorters were hidden while being updated above
        // and therefore didn't notify the grid about their direction change.
        grid.__applySorters();
      } finally {
        this.#sorterDirectionsSetFromServer = false;
      }
    });
  }

  set(startIndex: number, items: Item[]): void {
    const { rootCache } = this.#dataProviderController;
    items.forEach((item, i) => {
      rootCache.items[startIndex + i] = item;
    });

    this.#preventRowUpdates(() => {
      this.doSelection(items.filter((item) => item.selected));
      this.doDeselection(items.filter((item) => !item.selected && this.#selectedKeys[item.key]));
    });

    this.#grid.__updateVisibleRows(startIndex, startIndex + items.length - 1);
  }

  /**
   * Updates the given items for a non-hierarchical grid.
   *
   * @param updatedItems the updated items array
   */
  updateFlatData(updatedItems: Item[]): void {
    const { rootCache } = this.#dataProviderController;

    updatedItems.forEach((item) => {
      const itemContext = this.#dataProviderController.getItemContext(item);
      if (!itemContext) {
        return;
      }

      const { index } = itemContext;
      rootCache.items[index] = item;

      this.#grid.__updateVisibleRows(index, index);
    });
  }

  clear(index: number, length: number): void {
    const grid = this.#grid;
    const { rootCache } = this.#dataProviderController;

    if (index % grid.pageSize !== 0) {
      throw 'Got cleared data for index ' + index + ' which is not aligned with the page size of ' + grid.pageSize;
    }

    const items = rootCache.items.slice(index, index + length).filter((item): item is Item => !!item);
    if (items.length === 0) {
      return;
    }

    this.#preventRowUpdates(() => {
      this.doDeselection(items.filter((item) => this.#selectedKeys[item.key]));
    });

    rootCache.items.fill(undefined, index, index + length);

    grid.__updateVisibleRows(index, index + length - 1);
  }

  reset(): void {
    this.#dataProviderController.clearCache();
    this.#requestedRange = null;
    this.#requestDebouncer?.cancel();
    this.#grid.__updateVisibleRows();
  }

  updateSize(size: number): void {
    this.#grid.size = size;
  }

  updateUniqueItemIdPath(path: string): void {
    this.#grid.itemIdPath = path;
  }

  confirm(id: number): void {
    // We're done applying changes from this batch, resolve pending
    // callbacks
    this.resolvePendingCallbacks();

    // Let server know we're done
    this.#grid.$server.confirmUpdate(id);
  }

  setSelectionMode(mode: SelectionMode): void {
    this.#selectionMode = mode;
    this.#selectedKeys = {};
    this.#grid.selectedItems = [];
    this.#updateAriaMultiSelectable();
  }

  setHeaderRenderer(
    column: GridColumn<Item>,
    options: { content: Node | string | null; showSorter?: boolean; sorterPath?: string }
  ): void {
    const { content, showSorter, sorterPath } = options;

    if (content === null) {
      column.headerRenderer = null;
      return;
    }

    // The renderer can run multiple times, e.g. when the grid re-creates
    // header cells. The sorter is cached between runs: re-creating it would
    // reset its direction and fire a sorters-changed round-trip to the server.
    let sorter: GridSorter | undefined;

    column.headerRenderer = (root) => {
      let contentRoot: HTMLElement = root;
      if (showSorter) {
        sorter ??= document.createElement('vaadin-grid-sorter');
        sorter.setAttribute('path', sorterPath!);
        if (sorter.parentNode !== root) {
          root.appendChild(sorter);
        }

        // Use sorter as content root
        contentRoot = sorter;
      }

      renderContent(contentRoot, content);
    };
  }

  setFooterRenderer(column: GridColumn<Item>, options: { content: Node | string | null }): void {
    const { content } = options;

    if (content === null) {
      column.footerRenderer = null;
      return;
    }

    column.footerRenderer = (root) => renderContent(root, content);
  }

  /**
   * Scrolls to the item unless its row is already fully visible. The check uses
   * the item key, because the web component can only map `indexes` to a row
   * after loading the data around it.
   */
  scrollToItem(itemKey: string, ...indexes: number[]): void {
    const grid = this.#grid;
    this.#pendingScrollToItem = null;
    if (this.#isItemFullyInViewport(itemKey)) {
      return;
    }

    grid.scrollToIndex(...indexes);

    // Before the first render, the grid defers the scroll and has no rows to
    // check yet. Remember the item to check it when the grid replays the scroll.
    this.#pendingScrollToItem = grid.__pendingScrollToIndexes
      ? { itemKey, indexes: grid.__pendingScrollToIndexes }
      : null;
  }

  /**
   * Overrides and extends the grid's methods and properties to integrate with
   * the server-side data communicator and selection state.
   */
  #patchGrid(): void {
    const grid = this.#grid;

    grid.ready = () => {
      Object.getPrototypeOf(grid).ready.call(grid);
      this.#updateAriaMultiSelectable();
    };

    // The grid requests a page only when a row from that page gets rendered,
    // which is too late to keep up while scrolling and leads to blank rows.
    // To load data ahead of rendering, request the fetch range (rendered
    // rows + buffer) on every virtualizer update while scrolling.
    grid.__updateVirtualizerElement = (...args) => {
      Object.getPrototypeOf(grid).__updateVirtualizerElement.call(grid, ...args);

      if (grid.$.scroller.hasAttribute('scrolling')) {
        const fetchRange = this.getFetchRange();
        this.#dataProviderController.ensureFlatIndexLoaded(fetchRange[0]);
        this.#dataProviderController.ensureFlatIndexLoaded(fetchRange[1]);
      }
    };

    // Check visibility before the grid replays a deferred scrollToItem. A newer
    // scroll call replaces the pending indexes, which the grid replays as usual.
    // The grid stores a copy of the indexes, so compare by reference.
    grid.__scrollToPendingIndexes = () => {
      const pending = this.#pendingScrollToItem;
      if (pending && pending.indexes === grid.__pendingScrollToIndexes) {
        delete grid.__pendingScrollToIndexes;
        this.scrollToItem(pending.itemKey, ...pending.indexes);
      } else {
        Object.getPrototypeOf(grid).__scrollToPendingIndexes.call(grid);
      }
    };

    grid.dataProvider = (params, callback) => {
      if (params.pageSize !== grid.pageSize) {
        throw 'Invalid pageSize';
      }

      // size is controlled by the server (data communicator), so if the
      // size is zero, we know that there is no data to fetch.
      // This also prevents an empty grid getting stuck in a loading state.
      // The connector does not cache empty pages, so if the grid requests
      // data again, there would be no cache entry, causing a request to
      // the server. However, the data communicator will never respond,
      // as it assumes that the data is already cached.
      if (grid.size === 0) {
        callback([], 0);
        return;
      }

      this.#requestDebouncer = Debouncer.debounce(
        this.#requestDebouncer,
        timeOut.after(grid._hasData ? requestDebouncerDelay : 0),
        () => {
          this.fetchCurrentRange();
        }
      );
    };

    grid.__updateRow = (row, ...args) => {
      if (this.#preventRowUpdatesActive !== 0) {
        return;
      }

      Object.getPrototypeOf(grid).__updateRow.call(grid, row, ...args);
    };

    grid.__a11yUpdateRowSelected = (row, selected) => {
      if (this.#selectionMode === 'NONE') {
        [row, ...row.children].forEach((el) => el.removeAttribute('aria-selected'));
        return;
      }

      Object.getPrototypeOf(grid).__a11yUpdateRowSelected.call(grid, row, selected);
    };

    // This method is overridden to prevent the grid web component from
    // automatically excluding columns from sorting when they get hidden.
    // In Flow, it's the developer's responsibility to remove the column
    // from the backend sort order when the column gets hidden.
    grid._getActiveSorters = () => {
      return grid._sorters.filter((sorter) => sorter.direction);
    };

    grid.__applySorters = (...args) => {
      const sorters = grid._mapSorters();
      const sortersChanged = JSON.stringify(grid._previousSorters) !== JSON.stringify(sorters);

      // Update the _previousSorters in vaadin-grid-sort-mixin so that the __applySorters
      // method in the mixin will skip calling clearCache().
      //
      // In Flow Grid's case, we never want to clear the cache eagerly when the sorter elements
      // change due to one of the following reasons:
      //
      // 1. Sorted by user: The items in the new sort order need to be fetched from the server,
      // and we want to avoid a heavy re-render before the updated items have actually been fetched.
      //
      // 2. Sorted programmatically on the server: The items in the new sort order have already
      // been fetched and applied to the grid. The sorter element states are updated programmatically
      // to reflect the new sort order, but there's no need to re-render the grid rows.
      grid._previousSorters = sorters;

      // Call the original __applySorters method in vaadin-grid-sort-mixin
      Object.getPrototypeOf(grid).__applySorters.call(grid, ...args);

      if (sortersChanged && !this.#sorterDirectionsSetFromServer) {
        grid.$server.sortersChanged(sorters);
      }
    };

    grid.getContextMenuBeforeOpenDetail = (event) => {
      // For `contextmenu` events, we need to access the source event,
      // when using open on click we just use the click event itself
      const sourceEvent = event.detail.sourceEvent || event;
      const eventContext = grid.getEventContext(sourceEvent);
      const key = eventContext.item?.key || '';
      const columnId = eventContext.column?.id || '';
      return { key, columnId };
    };

    grid.preventContextMenu = (event) => {
      const isLeftClick = event.type === 'click';
      const { column } = grid.getEventContext(event);

      return isLeftClick && column instanceof GridFlowSelectionColumn;
    };

    grid.cellPartNameGenerator = (column, { item }) => {
      const { part } = item;
      if (part) {
        return [part.row, column ? part[column._flowId!] : null].filter(Boolean).join(' ');
      }
      return '';
    };

    grid.dropFilter = ({ item }) => !!item && !item.dropDisabled;

    grid.dragFilter = ({ item }) => !!item && !item.dragDisabled;

    grid.isItemSelectable = (item) => {
      // If there is no selectable data, assume the item is selectable
      return item?.selectable === undefined || item.selectable;
    };

    grid._isDetailsOpened = (item) => {
      return item?.detailsOpened ?? false;
    };
  }

  #addGridEventListeners(): void {
    const grid = this.#grid;

    grid.addEventListener('cell-activate', (e) => this.#onItemActivate(e));
    grid.addEventListener('row-activate', (e) => this.#onItemActivate(e));

    grid.addEventListener('vaadin-context-menu-before-open', (e) => {
      const { key, columnId } = e.detail;
      grid.$server.updateContextMenuTargetItem(key, columnId);
    });

    grid.addEventListener('click', (e) => this.#fireClickEvent(e, 'item-click'));
    grid.addEventListener('dblclick', (e) => this.#fireClickEvent(e, 'item-double-click'));

    grid.addEventListener('column-resize', (e) => {
      const cols = grid._columnTree.at(-1)!.filter((col) => !col.hidden);

      cols.forEach((col) => {
        col.dispatchEvent(new CustomEvent('column-drag-resize'));
      });

      grid.dispatchEvent(
        new CustomEvent('column-drag-resize', {
          detail: {
            resizedColumnKey: e.detail.resizedColumn._flowId
          }
        })
      );
    });

    grid.addEventListener('column-reorder', () => {
      const columns = grid._columnTree
        .at(-1)!
        .filter((c) => c._flowId)
        .sort((a, b) => (a._order ?? 0) - (b._order ?? 0))
        .map((c) => c._flowId);

      grid.dispatchEvent(
        new CustomEvent('column-reorder-all-columns', {
          detail: { columns }
        })
      );
    });

    grid.addEventListener('cell-focus', (e) => {
      const eventContext = grid.getEventContext(e);
      const { section } = eventContext;

      if (!section || section === 'details') {
        return;
      }

      grid.dispatchEvent(
        new CustomEvent('grid-cell-focus', {
          detail: {
            itemKey: eventContext.item?.key ?? null,
            internalColumnId: eventContext.column?._flowId ?? null,
            section
          }
        })
      );
    });

    grid.addEventListener('grid-dragstart', (e) => {
      const { draggedItems, setDragData, setDraggedItemsCount } = e.detail;

      if (this.#selectedKeys[draggedItems[0].key]) {
        // Dragging selected (possibly multiple) items
        if (grid.__selectionDragData) {
          Object.entries(grid.__selectionDragData).forEach(([type, data]) => setDragData(type, data));
        } else {
          (grid.__dragDataTypes || []).forEach((type) => {
            setDragData(type, draggedItems.map((item) => item.dragData![type]).join('\n'));
          });
        }

        const draggedItemsCount = grid.__selectionDraggedItemsCount ?? 0;
        if (draggedItemsCount > 1) {
          setDraggedItemsCount(draggedItemsCount);
        }
      } else {
        // Dragging just one (non-selected) item
        (grid.__dragDataTypes || []).forEach((type) => {
          setDragData(type, draggedItems[0].dragData![type]);
        });
      }
    });
  }

  #onItemActivate(event: GridCellActivateEvent<Item>): void {
    const grid = this.#grid;
    const { item } = event.detail.model;

    // The row model can hold a stale item while its data is being loaded, so
    // skip activation unless the item is actually loaded in the data cache
    if (!this.#dataProviderController.getItemContext(item)) {
      return;
    }

    if (this.#selectionMode === 'SINGLE') {
      if (!this.#selectedKeys[item.key]) {
        this.doSelection([item], true);
      } else if (!grid.__deselectDisallowed) {
        this.doDeselection([item], true);
      }
    }

    if (!grid.__disallowDetailsOnClick) {
      if (!item.detailsOpened) {
        grid.$server.setDetailsVisible(item.key);
      } else {
        grid.$server.setDetailsVisible(null);
      }
    }
  }

  #fireClickEvent(event: MouseEvent & { itemKey?: string; internalColumnId?: string }, eventName: string): void {
    // Click event was handled by the component inside grid, do nothing.
    if (event.defaultPrevented) {
      return;
    }

    const grid = this.#grid;
    const path = event.composedPath() as Element[];
    const idx = path.findIndex((node) => node.localName === 'td' || node.localName === 'th');
    const cell = path[idx] as (Element & { _focusButton?: Element }) | undefined;
    const content = path.slice(0, idx);

    // Do not fire item click event if the click originated inside a Vaadin overlay
    // (Select, ComboBox, DatePicker, MenuBar, ContextMenu, ...). The overlay's
    // menu/list lives in the host component's light DOM, so its clicks bubble
    // through the cell — but by the time we get here, the overlay has typically
    // been hidden synchronously, defeating the offsetParent-based isFocusable check.
    if (content.some((node) => typeof node.localName === 'string' && node.localName.endsWith('-overlay'))) {
      return;
    }

    // Do not fire item click event if cell content contains focusable elements.
    // Use this instead of event.target to detect cases like icon inside button.
    // See https://github.com/vaadin/flow-components/issues/4065
    if (
      content.some((node) => {
        // Ignore focus buttons that the component renders into cells in focus button mode on MacOS
        const focusable = cell?._focusButton !== node && isFocusable(node);
        return focusable || node instanceof HTMLLabelElement;
      })
    ) {
      return;
    }

    const eventContext = grid.getEventContext(event);
    const section = eventContext.section;

    if (eventContext.item && section !== 'details') {
      event.itemKey = eventContext.item.key;
      // if you have a details-renderer, getEventContext().column is undefined
      if (eventContext.column) {
        event.internalColumnId = eventContext.column._flowId;
      }
      grid.dispatchEvent(new CustomEvent(eventName, { detail: event }));
    }
  }

  /*
   * Manage aria-multiselectable attribute depending on the selection mode.
   * see more: https://github.com/vaadin/web-components/issues/1536
   * or: https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable
   */
  #updateAriaMultiSelectable(): void {
    if (!this.#grid.$) {
      return;
    }

    const multiSelectable = { SINGLE: 'false', MULTI: 'true', NONE: null }[this.#selectionMode];
    setOrRemoveAttribute(this.#grid.$.table, 'aria-multiselectable', multiSelectable);
  }

  #preventRowUpdates(callback: () => void): void {
    try {
      this.#preventRowUpdatesActive++;
      callback();
    } finally {
      this.#preventRowUpdatesActive--;
    }
  }

  #isItemFullyInViewport(itemKey: string): boolean {
    const grid = this.#grid;
    const row = grid._getRenderedRows().find((row) => row._item && grid.getItemId(row._item) === itemKey);
    if (!row) {
      return false;
    }
    const rowRect = row.getBoundingClientRect();
    const tableRect = grid.$.table.getBoundingClientRect();
    const headerRect = grid.$.header.getBoundingClientRect();
    const footerRect = grid.$.footer.getBoundingClientRect();
    return rowRect.top >= tableRect.top + headerRect.height && rowRect.bottom <= tableRect.bottom - footerRect.height;
  }
}

function initLazy(grid: FlowGrid) {
  // Init the connector only once for the grid
  grid.$connector ??= new GridConnector(grid);
}

window.Vaadin.Flow.gridConnector = { initLazy };
