// Types for the Flow-specific combo box API, including the private/protected
// @vaadin/combo-box API that the connector relies on. The public API types
// come from the @vaadin npm packages, resolved from the integration tests
// module's node_modules (see tsconfig.json in the module root).
import type { ComboBox } from '@vaadin/combo-box/src/vaadin-combo-box.js';
import type { ComboBoxItem } from '@vaadin/combo-box/src/vaadin-combo-box-item.js';
import type { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import type { ComboBoxScroller } from '@vaadin/combo-box/src/vaadin-combo-box-scroller.js';
import type { DataProviderController } from '@vaadin/component-base/src/data-provider-controller/data-provider-controller.js';
import type { Debouncer } from '@vaadin/component-base/src/debounce.js';
import type { ComboBoxConnector } from './comboBoxConnector.js';

export type { ComboBoxConnector };

/** An item sent by the server-side data communicator */
export interface Item {
  key: string;
  className?: string;
}

/** An inclusive range of item indexes: [start, end] */
export type ItemRange = [start: number, end: number];

/** The server-side RPC proxy of the combo box */
export interface ComboBoxServer {
  confirmUpdate(id: number): void;
  resetDataCommunicator(): void;
  setViewportRange(startIndex: number, size: number, filter: string): void;
}

/** The dropdown scroller, whose children are the rendered item elements */
export type FlowComboBoxScroller = Omit<ComboBoxScroller, 'children'> & {
  children: HTMLCollectionOf<ComboBoxItem<Item>>;
};

/**
 * The private/protected @vaadin/combo-box API and the Flow-specific API that
 * the combo box connector relies on.
 */
export interface FlowComboBoxInternals {
  $connector: ComboBoxConnector;
  $server: ComboBoxServer;
  __dataProviderController: DataProviderController<Item, Record<string, unknown>>;
  _clientSideFilter: boolean;
  _filterDebouncer: Debouncer | null;
  _filterTimeout?: number;
  _scroller?: FlowComboBoxScroller;
  _getItemLabel(item: Item): string;
}

/** The Flow combo box element, also used by the multi-select combo box */
export type FlowComboBox = ComboBox<Item> & FlowComboBoxInternals;

declare global {
  // Augments the global Vaadin interface declared by @vaadin/component-base
  // with the Flow namespace used by the connector. The namespace is a shared
  // interface that each module merges its own members into, so that connectors
  // from different modules can be type-checked in the same program.
  interface Vaadin {
    ComboBoxPlaceholder: typeof ComboBoxPlaceholder;
    Flow: VaadinFlow;
  }

  interface VaadinFlow {
    comboBoxConnector: { initLazy(comboBox: FlowComboBox): void };
  }
}
