# Entity Model

## Category

| Column      | Type          | Constraints         |
|-------------|---------------|---------------------|
| id          | BIGINT        | PK, NOT NULL        |
| name        | VARCHAR(255)  | NOT NULL, UNIQUE    |

## Product

| Column         | Type          | Constraints                     |
|----------------|---------------|---------------------------------|
| id             | BIGINT        | PK, NOT NULL                    |
| category_id    | BIGINT        | FK → category.id, NOT NULL      |
| name           | VARCHAR(255)  | NOT NULL                        |
| price          | DECIMAL(10,2) | NOT NULL                        |
| stock_quantity | INTEGER       | NOT NULL                        |

## Customer

| Column      | Type          | Constraints         |
|-------------|---------------|---------------------|
| id          | BIGINT        | PK, NOT NULL        |
| name        | VARCHAR(255)  | NOT NULL            |
| email       | VARCHAR(255)  | NOT NULL, UNIQUE    |

## Relationships

- One Category has many Products (1:N)
