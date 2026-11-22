# Entity Model

## Entity Relationship Diagram

```mermaid
erDiagram
    GUEST ||--o{ RESERVATION : "books"
    ROOM_TYPE ||--o{ RESERVATION : "is reserved as"
```

### ROOM_TYPE

A category of rooms with shared capacity and price.

| Attribute   | Description           | Data Type | Length/Precision | Validation Rules          |
|-------------|-----------------------|-----------|------------------|---------------------------|
| id          | Primary key           | Long      | 19               | Primary Key, Sequence     |
| name        | Room type name        | String    | 50               | Not Null, Unique          |
| capacity    | Guest capacity        | Integer   | 10               | Not Null, Min: 1, Max: 10 |
| price       | Nightly price in CHF  | Decimal   | 10,2             | Not Null                  |

### GUEST

A person who stays at the hotel.

| Attribute | Description        | Data Type | Length/Precision | Validation Rules      |
|-----------|--------------------|-----------|------------------|-----------------------|
| id        | Primary key        | Long      | 19               | Primary Key, Sequence |
| firstName | Guest's first name | String    | 100              | Not Null              |
| lastName  | Guest's last name  | String    | 100              | Not Null              |
| email     | Contact email      | String    | 150              | Not Null, Unique      |

### RESERVATION

A guest's booking of a room type for a stay.

| Attribute     | Description                    | Data Type | Length/Precision | Validation Rules                                   |
|---------------|--------------------------------|-----------|------------------|----------------------------------------------------|
| id            | Primary key                    | Long      | 19               | Primary Key, Sequence                              |
| version       | Version for optimistic locking | Integer   | 10               | Not Null                                           |
| guestId       | The guest who booked           | Long      | 19               | Not Null, Foreign Key (GUEST.id)                   |
| roomTypeId    | The reserved room type         | Long      | 19               | Not Null, Foreign Key (ROOM_TYPE.id)               |
| arrivalDate   | First night                    | Date      | -                | Not Null                                           |
| departureDate | Day of departure               | Date      | -                | Not Null                                           |
| status        | State of the reservation       | String    | 20               | Not Null, Values: CONFIRMED, CHECKED_IN, CANCELLED |

#### Constraints

- The departure date must be after the arrival date.
