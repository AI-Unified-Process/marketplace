# Entity Model

## Product

| Attribute | Description                     | Data Type | Length/Precision | Validation Rules        |
|-----------|---------------------------------|-----------|------------------|-------------------------|
| id        | Primary key                     | Long      | 19               | Primary Key, Sequence   |
| name      | Product name                    | String    | 150              | Not Null                |
| category  | Product category                | String    | 60               | Not Null                |
| price     | Unit price                      | Decimal   | 10,2             | Not Null, Min: 0        |
| inStock   | Whether the product is in stock | Boolean   | —                | Not Null, Default: true |

## Customer

| Attribute    | Description               | Data Type | Length/Precision | Validation Rules         |
|--------------|---------------------------|-----------|------------------|--------------------------|
| id           | Primary key               | Long      | 19               | Primary Key, Sequence    |
| name         | Full name                 | String    | 120              | Not Null                 |
| email        | Contact e-mail address    | String    | 254              | Not Null, Unique         |
| loyaltyLevel | Loyalty program level     | Enum      | BRONZE, SILVER, GOLD | Not Null, Default: BRONZE, stored as text |

## Order

| Attribute  | Description                    | Data Type | Length/Precision | Validation Rules                       |
|------------|--------------------------------|-----------|------------------|----------------------------------------|
| id         | Primary key                    | Long      | 19               | Primary Key, Sequence                  |
| orderDate  | Date and time the order was placed | DateTime | —             | Not Null                               |
| status     | Order lifecycle status         | Enum      | NEW, PAID, SHIPPED, CANCELLED | Not Null, Default: NEW, stored as text |
| total      | Order total                    | Decimal   | 18,2             | Not Null, Min: 0                       |
| customerId | Customer who placed the order  | Long      | 19               | Not Null, Foreign Key → Customer       |

## Relationships

- A `Customer` has many `Order`s; every `Order` belongs to exactly one `Customer`.
