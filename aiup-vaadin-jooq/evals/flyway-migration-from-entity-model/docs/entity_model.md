# Entity Model: Hotel Booking System

## RoomType

Represents the category of a hotel room.

| Column      | Type           | Constraints                                 |
|-------------|----------------|---------------------------------------------|
| id          | BIGINT         | PRIMARY KEY                                 |
| name        | VARCHAR(50)    | NOT NULL, UNIQUE                            |
| description | VARCHAR(500)   |                                             |
| capacity    | INTEGER        | NOT NULL, CHECK (capacity BETWEEN 1 AND 10) |
| price       | DECIMAL(10, 2) | NOT NULL, CHECK (price >= 0)               |

## Guest

Represents a hotel guest.

| Column     | Type         | Constraints          |
|------------|--------------|----------------------|
| id         | BIGINT       | PRIMARY KEY          |
| first_name | VARCHAR(100) | NOT NULL             |
| last_name  | VARCHAR(100) | NOT NULL             |
| email      | VARCHAR(255) | NOT NULL, UNIQUE     |
| phone      | VARCHAR(30)  |                      |

## Reservation

Represents a booking of a room type by a guest.

| Column        | Type    | Constraints                              |
|---------------|---------|------------------------------------------|
| id            | BIGINT  | PRIMARY KEY                              |
| room_type_id  | BIGINT  | NOT NULL, FOREIGN KEY → RoomType(id)     |
| guest_id      | BIGINT  | NOT NULL, FOREIGN KEY → Guest(id)        |
| check_in      | DATE    | NOT NULL                                 |
| check_out     | DATE    | NOT NULL, CHECK (check_out > check_in)   |
| num_guests    | INTEGER | NOT NULL, CHECK (num_guests >= 1)        |
| notes         | TEXT    |                                          |

## Relationships

- A **Reservation** references a **RoomType** (many reservations can be for the same room type)
- A **Reservation** references a **Guest** (one guest can have many reservations)
