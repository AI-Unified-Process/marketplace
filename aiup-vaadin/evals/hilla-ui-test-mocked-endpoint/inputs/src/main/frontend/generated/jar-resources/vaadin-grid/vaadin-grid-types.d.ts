// Types for the Flow-specific grid API, including the private/protected
// @vaadin/grid API that the connector files rely on. The public API types
// come from the @vaadin npm packages, resolved from the integration tests
// module's node_modules (see tsconfig.json in the module root).
import type { Grid, GridDefaultItem } from '@vaadin/grid/src/vaadin-grid.js';
import type { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';
import type { GridSorter } from '@vaadin/grid/src/vaadin-grid-sorter.js';
import type { GridSorterDefinition } from '@vaadin/grid/src/vaadin-grid-data-provider-mixin.js';
import type { GridCellActivateEvent } from '@vaadin/grid/src/vaadin-grid-mixin.js';
import type { DataProviderController } from '@vaadin/component-base/src/data-provider-controller/data-provider-controller.js';
import type { GridConnector } from './gridConnector.js';

export type { GridConnector };

/** An item sent by the server-side data communicator */
export interface Item {
  key: string;
  selected?: boolean;
  selectable?: boolean;
  detailsOpened?: boolean;
  expanded?: boolean;
  level?: number;
  part?: Record<string, string>;
  dragData?: Record<string, string>;
  dragDisabled?: boolean;
  dropDisabled?: boolean;
}

/** An inclusive range of item indexes: [start, end] */
export type ItemRange = [start: number, end: number];

export type SelectionMode = 'SINGLE' | 'MULTI' | 'NONE';

/** A row element in the grid body */
export type FlowGridRow = HTMLTableRowElement & {
  index: number;
  _item?: Item;
};

/** The server-side RPC proxy of the grid (and of its selection column) */
export interface GridServer {
  confirmUpdate(id: number): void;
  select(key: string): void;
  selectAll(): void;
  deselect(key: string): void;
  deselectAll(): void;
  setDetailsVisible(key: string | null): void;
  setShiftKeyDown(shiftKeyDown: boolean): void;
  setViewportRange(firstIndex: number, size: number): Promise<void>;
  setViewportRangeByIndexPath(indexes: number[], padding: number): Promise<number>;
  sortersChanged(sorters: GridSorterDefinition[]): void;
  updateContextMenuTargetItem(key: string, columnId: string): void;
  updateExpandedState(key: unknown, expanded: boolean): void;
}

/**
 * The controller managing the grid's data cache. The item type is
 * `Item | undefined` because the connector fills the cache sparsely.
 */
export type FlowDataProviderController = DataProviderController<Item | undefined, Record<string, unknown>> & {
  _shouldLoadCachePage(cache: unknown, page: number): boolean;
};

/**
 * The private/protected @vaadin/grid API and the Flow-specific API that the
 * grid connector relies on.
 */
export interface FlowGridInternals {
  $: { scroller: HTMLElement; table: HTMLElement; header: HTMLElement; footer: HTMLElement };
  ready(): void;
  $connector: GridConnector;
  $server: GridServer;
  __deselectDisallowed: boolean;
  __disallowDetailsOnClick: boolean;
  __dragDataTypes?: string[];
  __selectionDragData?: Record<string, string>;
  __selectionDraggedItemsCount?: number;
  _columnTree: GridColumn<Item>[][];
  _dataProviderController: FlowDataProviderController;
  _hasData: boolean;
  _previousSorters: GridSorterDefinition[];
  _shouldLoadAllRenderedRowsAfterPageLoad: boolean;
  _sorters: GridSorter[];
  __a11yUpdateRowSelected(row: HTMLElement, selected: boolean): void;
  __pendingScrollToIndexes?: number[];
  __scrollToPendingIndexes(): void;
  __applySorters(...args: unknown[]): void;
  __updateRow(row: HTMLElement, ...args: unknown[]): void;
  __updateVirtualizerElement(...args: unknown[]): void;
  __updateVisibleRows(start?: number, end?: number): void;
  _getActiveSorters(): GridSorter[];
  _getRenderedRows(): FlowGridRow[];
  _isDetailsOpened(item: Item | undefined): boolean;
  isItemSelectable(item: Item | null | undefined): boolean;
  _mapSorters(): GridSorterDefinition[];
  getContextMenuBeforeOpenDetail(event: CustomEvent<{ sourceEvent?: Event }>): { key: string; columnId: string };
  preventContextMenu(event: MouseEvent): boolean;
}

/** The Flow grid element */
export type FlowGrid = Grid<Item> & FlowGridInternals;

/**
 * The private/protected @vaadin/grid API and the Flow-specific API that the
 * tree grid connector relies on, in addition to the grid connector's.
 */
export interface FlowTreeGridInternals {
  __getRowLevel(row: FlowGridRow): number;
  _isExpanded(item: Item | undefined): boolean;
  _scrollToFlatIndex(flatIndex: number): void;
  expandItem(item: Item | undefined): void;
  collapseItem(item: Item | undefined): void;
}

/** The Flow tree grid element */
export type FlowTreeGrid = FlowGrid & FlowTreeGridInternals;

declare global {
  // Augments the global Vaadin interface declared by @vaadin/component-base
  // with the Flow namespace used by the connectors. The namespace is a shared
  // interface that each module merges its own members into, so that connectors
  // from different modules can be type-checked in the same program.
  interface Vaadin {
    Flow: VaadinFlow;
  }

  interface VaadinFlow {
    gridConnector: { initLazy(grid: FlowGrid): void };
    treeGridConnector: { initLazy(grid: FlowTreeGrid): void };
  }
}

declare module '@vaadin/grid/src/vaadin-grid-mixin.js' {
  interface GridCustomEventMap<TItem> {
    'row-activate': GridCellActivateEvent<TItem>;
    'vaadin-context-menu-before-open': CustomEvent<{ key: string; columnId: string }>;
  }
}

declare module '@vaadin/grid/src/vaadin-grid-column.js' {
  interface GridColumn<TItem = GridDefaultItem> {
    _flowId?: string;
    _order?: number | null;
    _grid: FlowGrid;
  }
}

declare module '@vaadin/grid/src/vaadin-grid-selection-column-base-mixin.js' {
  interface GridSelectionColumnBaseMixinClass<TItem> {
    _defaultHeaderRenderer(root: HTMLElement, column: GridColumn): void;
  }
}
