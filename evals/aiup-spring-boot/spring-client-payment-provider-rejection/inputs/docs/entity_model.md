# Entity Model

## Entity Relationship Diagram

```mermaid
erDiagram
    BOOKING
```

### BOOKING

A confirmed stay of a guest at the hotel.

| Attribute         | Description                                  | Data Type | Length/Precision | Validation Rules      |
|-------------------|----------------------------------------------|-----------|------------------|-----------------------|
| id                | Unique identifier                            | Long      | 19               | Primary Key, Sequence |
| guest_name        | Name of the guest                            | String    | 200              | Not Null              |
| total_price       | Price of the whole stay                      | Decimal   | 10,2             | Not Null, > 0         |
| currency          | ISO 4217 currency code                       | String    | 3                | Not Null              |
| card_token        | Token of the guest's card at the provider    | String    | 64               | Not Null              |
| deposit_charge_id | Charge id of the paid deposit                | String    | 64               |                       |
| deposit_paid      | Whether the deposit is paid                  | Boolean   | -                | Not Null, Default false |
