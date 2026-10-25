# Entity Model

## Order

Represents a customer order.

| Column        | Type        | Constraints          |
|---------------|-------------|----------------------|
| id            | BIGINT      | PK, not null         |
| customer_name | VARCHAR(255)| not null             |
| created_at    | TIMESTAMP   | not null             |
| status        | VARCHAR(50) | not null             |

Sequence: `order_seq`

## OrderItem

Represents a single line item within an order.

| Column     | Type        | Constraints                    |
|------------|-------------|--------------------------------|
| id         | BIGINT      | PK, not null                   |
| order_id   | BIGINT      | FK → Order.id, not null        |
| product_name | VARCHAR(255) | not null                  |
| quantity   | INT         | not null, > 0                  |
| unit_price | DECIMAL(10,2) | not null                   |

Sequence: `order_item_seq`

## Relationships

- An **Order** has zero or more **OrderItems** (one-to-many)
- An **OrderItem** belongs to exactly one **Order**
