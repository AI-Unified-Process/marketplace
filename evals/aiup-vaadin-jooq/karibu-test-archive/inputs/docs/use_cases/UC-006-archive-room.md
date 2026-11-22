# UC-006 Archive Room

**Use Case ID:** UC-006  
**Name:** Archive Room  
**Actor:** Facility Manager  
**Preconditions:** The room exists and is not already archived.

## Main Success Scenario

1. The manager navigates to the Rooms view.
2. The system displays the list of active rooms in a grid.
3. The manager clicks the **Archive** action button on a room row.
4. The system archives the room (sets `archived = true`) and removes it from the active rooms grid.
5. The system shows a success notification: "Room archived successfully".

## Alternative Flows

### A1: Room Has Active Reservations

3a. The manager clicks the **Archive** action button on a room that still has active reservations.  
3b. The system detects at least one active reservation linked to that room.  
3c. The system shows an error notification: "Cannot archive room: active reservations exist".  
3d. The room remains in the active rooms grid unchanged.
