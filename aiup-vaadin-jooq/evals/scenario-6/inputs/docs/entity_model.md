# Entity Model

## Customer

| Column      | Type          | Constraints         |
|-------------|---------------|---------------------|
| id          | BIGINT        | PK, NOT NULL        |
| name        | VARCHAR(255)  | NOT NULL            |
| email       | VARCHAR(255)  | NOT NULL, UNIQUE    |
| created_at  | TIMESTAMP     | NOT NULL            |

## Order

| Column      | Type          | Constraints                     |
|-------------|---------------|---------------------------------|
| id          | BIGINT        | PK, NOT NULL                    |
| customer_id | BIGINT        | FK → customer.id, NOT NULL      |
| order_date  | DATE          | NOT NULL                        |
| status      | VARCHAR(50)   | NOT NULL                        |

Status values: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

## OrderItem

| Column      | Type          | Constraints                     |
|-------------|---------------|---------------------------------|
| id          | BIGINT        | PK, NOT NULL                    |
| order_id    | BIGINT        | FK → order.id, NOT NULL         |
| product_id  | BIGINT        | NOT NULL                        |
| quantity    | INTEGER       | NOT NULL                        |
| unit_price  | DECIMAL(10,2) | NOT NULL                        |

## Relationships

- One Customer has many Orders (1:N)
- One Order has many OrderItems (1:N)
