package com.example.inventory.view;

import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

import java.util.List;

@Route("inventory")
public class InventoryView extends VerticalLayout {

    private final Grid<InventoryItem> grid = new Grid<>(InventoryItem.class, false);
    private final ConfirmDialog confirmDialog = new ConfirmDialog();
    private final ContextMenu contextMenu = new ContextMenu();

    public InventoryView() {
        setupGrid();
        setupContextMenu();
        setupConfirmDialog();
        add(grid, confirmDialog);
        loadItems();
    }

    private void setupGrid() {
        grid.addColumn(InventoryItem::getName).setHeader("Name");
        grid.addColumn(InventoryItem::getSku).setHeader("SKU");
        grid.addColumn(InventoryItem::getQuantity).setHeader("Quantity");
    }

    private void setupContextMenu() {
        contextMenu.setTarget(grid);
        contextMenu.addItem("Edit", e -> handleEdit());
        contextMenu.addItem("Delete", e -> handleDelete());
        contextMenu.addItem("View History", e -> handleViewHistory());
    }

    private void setupConfirmDialog() {
        confirmDialog.setHeader("Delete Item");
        confirmDialog.setText("Are you sure you want to permanently delete this item?");
        confirmDialog.setCancelable(true);
        confirmDialog.setRejectable(true);
        confirmDialog.setRejectText("Archive Instead");
        confirmDialog.addConfirmListener(e -> performDelete());
        confirmDialog.addCancelListener(e -> {/* no-op */});
        confirmDialog.addRejectListener(e -> performArchive());
    }

    private void loadItems() {
        grid.setItems(List.of(
            new InventoryItem(1L, "Widget A", "WGT-001", 42),
            new InventoryItem(2L, "Gadget B", "GDG-002", 7),
            new InventoryItem(3L, "Doohickey C", "DOO-003", 150)
        ));
    }

    private void handleEdit() {
        // Navigate to edit form
    }

    private void handleDelete() {
        confirmDialog.open();
    }

    private void handleViewHistory() {
        // Open history panel
    }

    private void performDelete() {
        // Delete item from backend
    }

    private void performArchive() {
        // Archive item in backend
    }

    public record InventoryItem(Long id, String name, String sku, int quantity) {
        public String getName() { return name; }
        public String getSku() { return sku; }
        public int getQuantity() { return quantity; }
    }
}
