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
// Resolved from the folder Flow merges all jar frontend resources into
import '../vaadin-context-menu/contextMenuConnector.ts';
import type { FlowMenuBar, FlowMenuBarItem } from './vaadin-menu-bar-types.js';

/**
 * menubarConnector is a communication layer between MenuBar's flow component
 * (server-side) and web component (client-side).
 */
export class MenuBarConnector {
  readonly #menuBar: FlowMenuBar;
  readonly #appId: string;

  /** The last generated items tree, before hidden items are filtered out */
  #generatedItems: FlowMenuBarItem[] = [];

  // Observe for hidden and disabled attributes in case they are changed by Flow.
  // When a change occurs, the observer re-assigns the items to re-filter hidden
  // items and re-render the buttons with the new attribute values.
  #observer = new MutationObserver((records) => {
    const hasChangedAttributes = records.some((entry) => {
      const oldValue = entry.oldValue;
      const newValue = (entry.target as Element).getAttribute(entry.attributeName!);
      return oldValue !== newValue;
    });

    if (hasChangedAttributes) {
      this.generateItems();
    }
  });

  constructor(menuBar: FlowMenuBar, appId: string) {
    this.#menuBar = menuBar;
    this.#appId = appId;
  }

  /**
   * Generates and assigns the items to the menu bar.
   *
   * When the method is called without providing a node id,
   * the previously generated items tree will be used.
   * That can be useful if you only want to re-filter hidden items
   * and re-render the buttons.
   */
  generateItems(nodeId?: number): void {
    const menuBar = this.#menuBar;

    if (!menuBar.shadowRoot) {
      // workaround for https://github.com/vaadin/flow/issues/5722
      setTimeout(() => this.generateItems(nodeId));
      return;
    }

    if (!menuBar._container) {
      // Menu-bar defers first buttons render to avoid re-layout
      // See https://github.com/vaadin/web-components/issues/7271
      queueMicrotask(() => this.generateItems(nodeId));
      return;
    }

    if (nodeId) {
      this.#generatedItems = window.Vaadin.Flow.contextMenuConnector.generateItemsTree(this.#appId, nodeId) ?? [];
    }

    this.#generatedItems.forEach((item) => {
      this.#observer.observe(item.component, {
        attributeFilter: ['hidden', 'disabled'],
        attributeOldValue: true
      });
    });

    // Remove hidden items entirely from the array. Just hiding them
    // could cause the overflow button to be rendered without items.
    //
    // The items-prop needs to be set even when all items are visible
    // to re-render the buttons, which snapshot the item properties.
    menuBar.items = this.#generatedItems.filter((item) => !item.component.hidden);
  }
}

function initLazy(menuBar: FlowMenuBar, appId: string): void {
  // Init the connector only once for the menu bar
  menuBar.$connector ??= new MenuBarConnector(menuBar, appId);
}

window.Vaadin.Flow.menubarConnector = { initLazy };
