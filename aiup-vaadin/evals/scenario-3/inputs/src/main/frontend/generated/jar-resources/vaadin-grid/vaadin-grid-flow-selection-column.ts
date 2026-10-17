import '@vaadin/checkbox/src/vaadin-checkbox.js';
import '@vaadin/grid/src/vaadin-grid-column.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';
import { GridSelectionColumnBaseMixin } from '@vaadin/grid/src/vaadin-grid-selection-column-base-mixin.js';
import type { GridServer, Item } from './vaadin-grid-types.js';

export class GridFlowSelectionColumn extends GridSelectionColumnBaseMixin<Item, typeof GridColumn>(GridColumn) {
  declare $server: GridServer;

  static get is() {
    return 'vaadin-grid-flow-selection-column';
  }

  static get properties() {
    return {
      /**
       * Override property to enable auto-width
       */
      autoWidth: {
        type: Boolean,
        value: true
      },

      /**
       * Override property to set custom width
       */
      width: {
        type: String,
        value: '56px'
      }
    };
  }

  /**
   * Override method from `GridSelectionColumnBaseMixin` to add ID to select all
   * checkbox
   *
   * @override
   */
  _defaultHeaderRenderer(root: HTMLElement, _column: GridColumn) {
    super._defaultHeaderRenderer(root, _column);
    const checkbox = root.firstElementChild;
    if (checkbox) {
      checkbox.id = 'selectAllCheckbox';
    }
  }

  /**
   * Override a method from `GridSelectionColumnBaseMixin` to handle the user
   * selecting all items.
   *
   * @protected
   * @override
   */
  protected _selectAll() {
    this.selectAll = true;
    this.$server.selectAll();
  }

  /**
   * Override a method from `GridSelectionColumnBaseMixin` to handle the user
   * deselecting all items.
   *
   * @protected
   * @override
   */
  protected _deselectAll() {
    this.selectAll = false;
    this.$server.deselectAll();
  }

  /**
   * Override a method from `GridSelectionColumnBaseMixin` to handle the user
   * selecting an item.
   *
   * @param item the item to select
   * @protected
   * @override
   */
  protected _selectItem(item: Item) {
    this.$server.setShiftKeyDown(this._shiftKeyDown);
    this._grid.$connector.doSelection([item], true);
  }

  /**
   * Override a method from `GridSelectionColumnBaseMixin` to handle the user
   * deselecting an item.
   *
   * @param item the item to deselect
   * @protected
   * @override
   */
  protected _deselectItem(item: Item) {
    this.$server.setShiftKeyDown(this._shiftKeyDown);
    this._grid.$connector.doDeselection([item], true);
    // Optimistically update select all state
    this.selectAll = false;
  }
}

customElements.define(GridFlowSelectionColumn.is, GridFlowSelectionColumn);
