# Requirements: Hotel Reservation System

## Functional Requirements

| ID     | Requirement                                                                                                                         | Status |
|--------|-------------------------------------------------------------------------------------------------------------------------------------|--------|
| FR-001 | As a guest, I want to search for available rooms for my arrival and departure dates so that I can choose a room.                    | Draft  |
| FR-002 | As a guest, I want to book a room and pay a deposit by credit card so that the room is reserved for me.                             | Draft  |
| FR-003 | As a guest, I want to receive a booking confirmation by email so that I have proof of my reservation.                               | Draft  |
| FR-004 | As a front desk clerk, I want to find a guest's booking on arrival so that I can check the guest in.                                | Draft  |
| FR-005 | As a front desk clerk, I want to verify the guest's identity document before check-in so that only the booking guest gets the room. | Draft  |
| FR-006 | As a front desk clerk, I want to authorize the remaining balance on the guest's card at check-in so that the stay is paid for.      | Draft  |
| FR-007 | As a front desk clerk, I want to hand the guest a room key card so that the guest can enter the room.                               | Draft  |

## Non-Functional Requirements

| ID      | Requirement                                                                                  | Status |
|---------|----------------------------------------------------------------------------------------------|--------|
| NFR-001 | Room search must return results within 2 seconds for 95% of requests.                        | Draft  |
| NFR-002 | Card payments are processed through the Payment Service REST API (POST /v1/charges, JSON).   | Draft  |
| NFR-003 | Key cards are encoded as RFID Mifare DESFire cards via the Door Lock System API.             | Draft  |
| NFR-004 | Check-in must take no longer than 3 minutes per guest at the front desk.                     | Draft  |

## Constraints

| ID    | Constraint                                                                                        | Status |
|-------|---------------------------------------------------------------------------------------------------|--------|
| C-001 | Confirmation emails are sent via an SMTP-compatible email service.                                | Draft  |
| C-002 | Bookings and room inventory are persisted in a relational database (SQL).                         | Draft  |
| C-003 | Standard check-in time is 15:00; earlier check-in is allowed only when the room is already clean. | Draft  |
| C-004 | The deposit is 20% of the total price and is non-refundable less than 48 hours before arrival.    | Draft  |
