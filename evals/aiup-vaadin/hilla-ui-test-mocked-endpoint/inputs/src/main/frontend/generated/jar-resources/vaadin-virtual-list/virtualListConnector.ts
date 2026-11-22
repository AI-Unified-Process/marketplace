import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import type {
  FlowVirtualList,
  FlowVirtualListRenderer,
  Item,
  ItemRange,
  PlaceholderItem,
  VirtualListRenderRoot
} from './vaadin-virtual-list-types.js';

const EXTRA_ITEMS_BUFFER = 20;

/**
 * virtualListConnector is a communication layer between VirtualList's flow
 * component (server-side) and web component (client-side).
 */
export class VirtualListConnector {
  /** The item the renderer uses to render items that are being loaded */
  placeholderItem: PlaceholderItem = { __placeholder: true };

  readonly #list: FlowVirtualList;
  #placeholderElement: HTMLElement | null = null;
  #lastRequestedRange: ItemRange = [0, 0];

  constructor(list: FlowVirtualList) {
    this.#list = list;

    list.itemAccessibleNameGenerator = (item) => item && item.accessibleName;

    // The renderer is patched to render placeholders for items outside the
    // loaded range. Observing the property re-applies the patch whenever the
    // web component gets a new renderer.
    list.patchVirtualListRenderer = () => this.#patchRenderer();
    list._createPropertyObserver('renderer', 'patchVirtualListRenderer', true);
    list.patchVirtualListRenderer();

    list.items = [];
  }

  set(index: number, items: Array<Item | undefined>): void {
    const list = this.#list;
    list.items.splice(index, items.length, ...items);
    list.items = [...list.items];
  }

  clear(index: number, length: number): void {
    // How many items, starting from "index", should be set as undefined
    const clearCount = Math.min(length, this.#list.items.length - index);
    this.set(index, [...Array(clearCount)]);
  }

  updateData(items: Item[]): void {
    const updatedItemsMap = items.reduce<Record<string, Item>>((map, item) => {
      map[item.key] = item;
      return map;
    }, {});

    this.#list.items = this.#list.items.map((item) => {
      // Items can be undefined if they are outside the viewport
      if (!item) {
        return item;
      }
      // Replace existing item with updated item,
      // return existing item as fallback if it was not updated
      return updatedItemsMap[item.key] || item;
    });
  }

  updateSize(newSize: number): void {
    const list = this.#list;
    const delta = newSize - list.items.length;
    if (delta > 0) {
      list.items = [...list.items, ...Array(delta)];
    } else if (delta < 0) {
      list.items = list.items.slice(0, newSize);
    }
  }

  setPlaceholderItem(placeholderItem: PlaceholderItem = {}, appId: string): void {
    placeholderItem.__placeholder = true;
    this.placeholderItem = placeholderItem;
    const nodeId = Object.entries(placeholderItem).find(([key]) => key.endsWith('_nodeid'));
    this.#placeholderElement = nodeId ? window.Vaadin.Flow.clients[appId].getByNodeId(nodeId[1] as number) : null;
  }

  /**
   * Wraps the web component's renderer so that items outside the loaded range
   * are rendered as placeholders, and so that the rendered range is reported
   * back to the server.
   */
  #patchRenderer(): void {
    const originalRenderer = this.#list.renderer;

    if (!originalRenderer || originalRenderer.__virtualListConnectorPatched) {
      // The list either doesn't have a renderer yet or it's already been patched
      return;
    }

    const renderer: FlowVirtualListRenderer = (root, list, model) => {
      root.__virtualListIndex = model.index;

      if (model.item === undefined) {
        if (this.#placeholderElement) {
          // ComponentRenderer
          if (!root.__hasComponentRendererPlaceholder) {
            // The root was previously rendered by the ComponentRenderer. Clear and add a placeholder.
            root.innerHTML = '';
            delete root._$litPart$;
            root.appendChild(this.#placeholderElement.cloneNode(true));
            root.__hasComponentRendererPlaceholder = true;
          }
        } else {
          // LitRenderer
          originalRenderer.call(list, root, list, {
            ...model,
            item: this.placeholderItem
          });
        }
      } else {
        if (root.__hasComponentRendererPlaceholder) {
          // The root was previously populated with a placeholder. Clear it.
          root.innerHTML = '';
          root.__hasComponentRendererPlaceholder = false;
        }

        originalRenderer.call(list, root, list, model);
      }

      /*
       * Check if we need to do anything once things have settled down.
       * This method is called multiple times in sequence for the same user
       * action, but we only want to do the check once.
       */
      this.#scheduleRangeUpdate();
    };
    renderer.__virtualListConnectorPatched = true;
    renderer.__rendererId = originalRenderer.__rendererId;

    this.#list.renderer = renderer;
  }

  #scheduleRangeUpdate(): void {
    const list = this.#list;
    // Kept on the element: `VirtualListElement` flushes the debouncer to make
    // the visible range available to tests without waiting.
    list.__requestDebounce = Debouncer.debounce(list.__requestDebounce, timeOut.after(50), () =>
      this.#updateRequestedRange()
    );
  }

  /**
   * Asks the server for the rendered items, plus a buffer above and below, so
   * that scrolling has data ready ahead of rendering.
   */
  #updateRequestedRange(): void {
    const list = this.#list;

    /*
     * TODO virtual list seems to do a small index adjustment after scrolling
     * has stopped. This causes a redundant request to be sent to make a
     * corresponding minimal change to the buffer. We should avoid these
     * requests by making the logic skip doing a request if the available
     * buffer is within some tolerance compared to the requested buffer.
     */
    const visibleIndexes = [...list.children]
      .filter((el): el is VirtualListRenderRoot => '__virtualListIndex' in el)
      .map((el) => el.__virtualListIndex);
    const firstNeededItem = Math.min(...visibleIndexes);
    const lastNeededItem = Math.max(...visibleIndexes);

    const first = Math.max(0, firstNeededItem - EXTRA_ITEMS_BUFFER);
    const last = Math.min(lastNeededItem + EXTRA_ITEMS_BUFFER, list.items.length);

    if (this.#lastRequestedRange[0] != first || this.#lastRequestedRange[1] != last) {
      this.#lastRequestedRange = [first, last];
      const count = 1 + last - first;
      list.$server.setViewportRange(first, count);
    }
  }
}

function initLazy(list: FlowVirtualList): void {
  // Init the connector only once for the virtual list
  list.$connector ??= new VirtualListConnector(list);
}

window.Vaadin.Flow.virtualListConnector = { initLazy };
