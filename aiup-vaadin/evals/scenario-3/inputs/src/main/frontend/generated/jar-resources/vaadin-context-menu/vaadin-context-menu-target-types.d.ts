// Types for the Flow-specific context menu target API. Kept apart from the
// main types file so that another module reusing the item types, such as the
// menu bar, does not pull the target connector and its augmentations in.
import type { ContextMenuTargetConnector } from './contextMenuTargetConnector.js';

export type { ContextMenuTargetConnector };

/** The event that opens the context menu, extended with the captured composed path */
export interface OpenEvent extends Event {
  __composedPath?: EventTarget[];
}

/** An element a context menu is attached to */
export interface ContextMenuTarget extends HTMLElement {
  $contextMenuTargetConnector?: ContextMenuTargetConnector;
  /** Used by Grid to prevent context menu on selection column click */
  preventContextMenu?(e: OpenEvent): boolean;
  /** Provides the detail for the `vaadin-context-menu-before-open` event */
  getContextMenuBeforeOpenDetail?(e: OpenEvent): Record<string, unknown>;
}

declare global {
  // Adds to the Flow namespace declared in vaadin-context-menu-types.d.ts
  interface VaadinFlow {
    contextMenuTargetConnector: { init(target: ContextMenuTarget): void };
  }
}
