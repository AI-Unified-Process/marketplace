# UC-015: Delete Inventory Item

## Summary

A warehouse operator selects an item in the inventory list and permanently deletes it after confirming the action. The system requires explicit confirmation before any deletion occurs.

## Actors

- Warehouse Operator

## Preconditions

- The operator is logged in with warehouse management access.
- The inventory list is populated with at least one item.

## Main Success Scenario

1. The operator clicks **Delete** on an inventory item (either via the action button or the row context menu).
2. The system presents a confirmation dialog with **Confirm**, **Cancel**, and **Archive Instead** buttons.
3. The operator clicks **Confirm**.
4. The system permanently removes the item from the inventory.
5. The inventory list refreshes to reflect the removal.

## Alternative Scenarios

### A1: User Cancels

1-2. Same as Main Success Scenario.
3. The operator clicks **Cancel**.
4. The dialog closes. No changes are made to the inventory.

### A2: User Archives Instead

1-2. Same as Main Success Scenario.
3. The operator clicks **Archive Instead**.
4. The system marks the item as archived (soft-delete) rather than permanently deleting it.
5. The item is removed from the active inventory list and moved to the archive.

## Business Rules

### BR-015

A confirmation dialog must be shown before any inventory item is permanently deleted. The operator must explicitly choose **Confirm** to proceed with deletion; clicking outside the dialog or pressing Escape is treated as a cancel.
