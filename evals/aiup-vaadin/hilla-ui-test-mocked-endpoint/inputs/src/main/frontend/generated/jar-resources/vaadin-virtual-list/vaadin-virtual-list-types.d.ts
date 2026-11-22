// Types for the Flow-specific virtual list API, including the private
// @vaadin/virtual-list API that the connector relies on. The public API types
// come from the @vaadin npm packages, resolved from the integration tests
// module's node_modules (see tsconfig.json in the module root).
import type { VirtualList, VirtualListItemModel } from '@vaadin/virtual-list/src/vaadin-virtual-list.js';
import type { Debouncer } from '@vaadin/component-base/src/debounce.js';
import type { VirtualListConnector } from './virtualListConnector.js';

export type { VirtualListConnector };

/** An item sent by the server-side data communicator */
export interface Item {
  key: string;
  accessibleName?: string;
}

/**
 * The item the renderer uses for rows whose data has not been loaded yet.
 * The server-provided placeholder carries arbitrary serialized properties,
 * including a `*_nodeid` property when it renders as a server component.
 */
export interface PlaceholderItem {
  __placeholder?: true;
  [key: string]: unknown;
}

/** An inclusive range of item indexes: [start, end] */
export type ItemRange = [start: number, end: number];

/** The server-side RPC proxy of the virtual list */
export interface VirtualListServer {
  setViewportRange(startIndex: number, size: number): void;
}

/** A root element the renderer renders an item into, extended with the connector's bookkeeping properties */
export interface VirtualListRenderRoot extends HTMLElement {
  __virtualListIndex: number;
  __hasComponentRendererPlaceholder?: boolean;
  _$litPart$?: unknown;
}

/** The web component's renderer function, extended with the connector's patch marker and LitRenderer's id */
export type FlowVirtualListRenderer = ((
  root: VirtualListRenderRoot,
  list: FlowVirtualList,
  model: VirtualListItemModel<Item | PlaceholderItem | undefined>
) => void) & {
  __virtualListConnectorPatched?: boolean;
  __rendererId?: string;
};

/**
 * The private @vaadin/virtual-list API and the Flow-specific API that the
 * virtual list connector relies on. Also narrows the public API to the
 * connector's invariants: `items` is always an array whose entries are
 * `undefined` outside the loaded range.
 */
export interface FlowVirtualListInternals {
  $connector: VirtualListConnector;
  $server: VirtualListServer;
  __requestDebounce: Debouncer | null;
  items: Array<Item | undefined>;
  renderer: FlowVirtualListRenderer | undefined;
  itemAccessibleNameGenerator?(item: Item | undefined): string | undefined;
  patchVirtualListRenderer(): void;
  _createPropertyObserver(property: string, method: string, dynamicFn?: boolean): void;
}

/** The Flow virtual list element */
export type FlowVirtualList = Omit<
  VirtualList<Item | undefined>,
  'items' | 'renderer' | 'itemAccessibleNameGenerator'
> &
  FlowVirtualListInternals;

declare global {
  // Augments the global Vaadin interface declared by @vaadin/component-base
  // with the Flow namespace used by the connector. The namespace is a shared
  // interface that each module merges its own members into, so that connectors
  // from different modules can be type-checked in the same program.
  interface Vaadin {
    Flow: VaadinFlow;
  }

  interface VaadinFlow {
    virtualListConnector: { initLazy(list: FlowVirtualList): void };
    /** The store of Flow DOM nodes, keyed by app id */
    clients: Record<string, VaadinFlowClient>;
  }

  /** The Flow client of an app instance on the page */
  interface VaadinFlowClient {
    getByNodeId(nodeId: number): HTMLElement | null;
  }
}
