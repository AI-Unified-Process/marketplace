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
import type {
  FlowContextMenu,
  FlowContextMenuItem,
  FlowContextMenuItemComponent
} from './vaadin-context-menu-types.js';

function getContainer(appId: string, nodeId: number): Element | null {
  try {
    return window.Vaadin.Flow.clients[appId].getByNodeId(nodeId);
  } catch (error) {
    console.error('Could not get node %s from app %s', nodeId, appId);
    console.error(error);
    return null;
  }
}

/**
 * contextMenuConnector is a communication layer between ContextMenu's flow
 * component (server-side) and web component (client-side).
 */
export class ContextMenuConnector {
  readonly #contextMenu: FlowContextMenu;
  readonly #appId: string;

  constructor(contextMenu: FlowContextMenu, appId: string) {
    this.#contextMenu = contextMenu;
    this.#appId = appId;
  }

  /**
   * Generates and assigns the items to the context menu.
   */
  generateItems(nodeId: number): void {
    this.#contextMenu.items = generateItemsTree(this.#appId, nodeId);
  }
}

function initLazy(contextMenu: FlowContextMenu, appId: string): void {
  // Init the connector only once for the context menu
  contextMenu.$connector ??= new ContextMenuConnector(contextMenu, appId);
}

/**
 * Generates an items tree compatible with the context-menu web component
 * by traversing the given Flow DOM tree of context menu item nodes
 * whose root node is identified by the `nodeId` argument.
 *
 * The app id is required to access the store of Flow DOM nodes.
 */
export function generateItemsTree(appId: string, nodeId: number): FlowContextMenuItem[] | undefined {
  const container = getContainer(appId, nodeId);
  if (!container) {
    return;
  }

  return Array.from(container.children).map((element) => {
    const child = element as FlowContextMenuItemComponent;
    // Use getters to provide up to date values for the web component when
    // the menu is rendered or tooltip is shown without regenerating items.
    let children: FlowContextMenuItem[] | undefined;
    const item: FlowContextMenuItem = {
      component: child,
      get checked() {
        return child._checked;
      },
      get keepOpen() {
        return child._keepOpen;
      },
      get disabled() {
        return child.disabled;
      },
      get className() {
        return child.className;
      },
      get theme() {
        return child.__theme;
      },
      get tooltip() {
        return child.tooltip;
      },
      get tooltipPosition() {
        return child.tooltipPosition;
      },
      // Flow does not send the container node id for the invisible item, so
      // reading it while generating items would leave item without sub menu.
      // Result is cached as web component reads `children` on every render.
      // Generating items builds both new containers and new items, so a cached
      // sub menu never outlives the node id it was resolved from.
      get children() {
        // Do not hardcode tag name to allow `vaadin-menu-bar-item`
        if (!children && child._hasVaadinItemMixin && child._containerNodeId) {
          children = generateItemsTree(appId, child._containerNodeId);
        }
        return children;
      }
    };
    child._item = item;
    return item;
  });
}

/**
 * Toggles the checkmark attribute for a keep-open context menu item.
 *
 * The items array reflects the new checked state through a getter, but a menu
 * that stays open after a click does not re-render its items, so the attribute
 * is toggled directly to show the checkmark immediately.
 */
export function setChecked(component: FlowContextMenuItemComponent, checked: boolean): void {
  if (component._item?.keepOpen) {
    component.toggleAttribute('menu-item-checked', checked);
  }
}

window.Vaadin.Flow.contextMenuConnector = {
  initLazy,
  generateItemsTree,
  setChecked
};
