# Entity Model

## Product

| Attribute | Description                     | Data Type | Length/Precision | Validation Rules        |
|-----------|---------------------------------|-----------|------------------|-------------------------|
| id        | Primary key                     | Long      | 19               | Primary Key, Sequence   |
| name      | Product name                    | String    | 150              | Not Null                |
| category  | Product category                | String    | 60               | Not Null                |
| price     | Unit price                      | Decimal   | 10,2             | Not Null, Min: 0        |
| inStock   | Whether the product is in stock | Boolean   | —                | Not Null, Default: true |
