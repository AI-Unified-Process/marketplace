# Inventory Item Deletion Tests

## Problem/Feature Description

The warehouse team has a new Inventory Management view (`InventoryView`) that lets operators manage stock items. Each item row has a right-click context menu with **Edit**, **Delete**, and **View History** options. Choosing **Delete** opens a three-button confirmation dialog — **Confirm**, **Cancel**, and **Archive Instead** — so that accidental deletions are prevented.

The team now needs a server-side unit test suite covering the deletion flow described in use case UC-015 ("Delete Inventory Item"). The spec lives at `docs/use-cases/UC-015-delete-inventory-item.md`. The view scaffold is already in place at `src/main/java/com/example/inventory/view/InventoryView.java` and shows the component types in use: a `Grid`, a `ConfirmDialog`, and a `ContextMenu`.

Your task is to write a comprehensive Vaadin Browserless (server-side) unit test class that exercises three scenarios from the spec:

1. **Main flow** — the operator invokes Delete from the context menu, the confirmation dialog appears, and the operator confirms.
2. **Cancel flow** — the operator opens the dialog and clicks Cancel; no deletion occurs.
3. **Archive flow** — the operator opens the dialog and clicks Archive Instead; the item is archived rather than deleted.

## Output Specification

Produce the following files:

- `src/test/java/com/example/inventory/view/UC015DeleteInventoryItemTest.java` — the test class with all three test methods.
- If the project does not already contain a `UseCase` annotation type, also create `src/main/java/com/example/inventory/usecase/UseCase.java`.

The test class should be self-contained, compilable (even if the build is not run), and follow the project's existing structure. Do not add a `pom.xml` — assume the correct Vaadin Browserless testing dependency is already declared.
