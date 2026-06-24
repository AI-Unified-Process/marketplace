# Entity Model — Hotel Booking System

## RoomType

Represents the category of a hotel room (e.g. Single, Double, Suite).

| Column      | Type           | Constraints                        |
|-------------|----------------|------------------------------------|
| id          | BIGINT         | PRIMARY KEY                        |
| name        | VARCHAR(50)    | NOT NULL, UNIQUE                   |
| description | VARCHAR(500)   |                                    |
| capacity    | INTEGER        | NOT NULL, CHECK (1–10)             |
| price       | DECIMAL(10,2)  | NOT NULL, CHECK (>= 0)             |

---

## Guest

A hotel guest who makes reservations.

| Column     | Type         | Constraints       |
|------------|--------------|-------------------|
| id         | BIGINT       | PRIMARY KEY       |
| first_name | VARCHAR(100) | NOT NULL          |
| last_name  | VARCHAR(100) | NOT NULL          |
| email      | VARCHAR(255) | NOT NULL, UNIQUE  |
| phone      | VARCHAR(20)  |                   |

---

## Reservation

A booking of a specific room type by a guest for a date range.

| Column        | Type          | Constraints                                   |
|---------------|---------------|-----------------------------------------------|
| id            | BIGINT        | PRIMARY KEY                                   |
| guest_id      | BIGINT        | NOT NULL, FOREIGN KEY → guest(id)             |
| room_type_id  | BIGINT        | NOT NULL, FOREIGN KEY → room_type(id)         |
| check_in      | DATE          | NOT NULL                                      |
| check_out     | DATE          | NOT NULL, CHECK (check_out > check_in)        |
| total_price   | DECIMAL(10,2) | NOT NULL, CHECK (>= 0)                        |
| status        | VARCHAR(20)   | NOT NULL, DEFAULT 'PENDING'                   |

---

## Payment

A payment record associated with a reservation.

| Column         | Type          | Constraints                                        |
|----------------|---------------|----------------------------------------------------|
| id             | BIGINT        | PRIMARY KEY                                        |
| reservation_id | BIGINT        | NOT NULL, FOREIGN KEY → reservation(id)            |
| amount         | DECIMAL(10,2) | NOT NULL, CHECK (>= 0)                             |
| payment_date   | TIMESTAMP     | NOT NULL                                           |
| method         | VARCHAR(30)   | NOT NULL (e.g. 'CREDIT_CARD', 'CASH', 'TRANSFER')  |
