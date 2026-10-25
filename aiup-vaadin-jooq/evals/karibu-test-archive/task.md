# Extend the Room Management Test Suite for the Archive Feature

## Background

The hotel management system has an established test suite covering room management operations. The suite uses a server-side Vaadin testing library and already has tests for UC-005 ("Manage Rooms") in `src/test/java/com/example/app/rooms/UC005ManageRoomsTest.java`.

A new feature has just been shipped: **Archive Room** (UC-006). The feature lets facility managers remove rooms from active service — but the system must block archiving a room that still has active reservations. The use case spec is at `docs/use-cases/UC-006-archive-room.md`. Pre-populated test data (rooms and one active reservation) is already in `src/test/resources/db/migration/V001__test_data.sql`.

Your job is to extend the existing test suite by adding a new test class for UC-006. Look at the existing test class in `src/test/java/com/example/app/rooms/UC005ManageRoomsTest.java` to understand the conventions used in this project — your new class should follow the same style and patterns.

## What to Produce

Write the new test class as a `.java` file in `src/test/java/com/example/app/rooms/`. The class should cover:

- The **main success scenario**: navigating to the Rooms view, locating a room in the grid, triggering the archive action, and verifying the success notification.
- **Alternative flow A1** (room has active reservations): triggering the archive action on "Conference Room A" (which has an active reservation per the test data) and verifying that the appropriate error notification is shown and the room remains in the grid.

Include any necessary setup and teardown methods to keep the database in a consistent state between tests.

Deliver only the `.java` source file in the expected location. No build files or additional configuration are needed.
