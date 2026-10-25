# Hotel Room Booking System — Requirements

## Overview

A boutique hotel chain needs a web-based reservation management system. The system allows guests to book rooms and hotel staff to manage availability. Rooms belong to a room type that defines amenities and pricing. Each reservation is associated with a single guest and a single room, with explicit check-in and check-out dates.

## Entities and Relationships

### Guests

A guest is an individual who makes reservations. Each guest has a unique email address, a full name, and a phone number. A guest may have zero or more reservations over time.

### Room Types

A room type classifies rooms by their characteristics (e.g., Standard, Deluxe, Suite). Each room type has a name, a short description, and a base nightly rate. Multiple rooms can share the same room type.

### Rooms

A room is a physical unit within the hotel. Each room has a room number, a floor number, and a capacity (maximum number of guests). Every room belongs to exactly one room type.

### Reservations

A reservation links a guest to a room for a specific date range. It records the check-in date, check-out date, the total price charged, and the current status of the booking. A reservation must belong to exactly one guest and exactly one room. The check-out date must always be after the check-in date.

### Payments

A payment records a financial transaction tied to a reservation. Each payment has an amount, a payment method (Credit Card, Debit Card, Cash), a payment date, and a confirmation code. A reservation may have multiple payments (e.g., deposit then final balance).

## Business Rules

- A guest email must be unique across the system.
- Room numbers must be unique across the hotel.
- Reservation status must be one of: Pending, Confirmed, Cancelled, Completed.
- Payment method must be one of: Credit Card, Debit Card, Cash.
- The total price must be a positive decimal value.
- Check-out date must be strictly after check-in date.
