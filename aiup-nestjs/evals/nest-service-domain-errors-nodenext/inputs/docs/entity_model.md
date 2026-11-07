# Entity Model

## Entity Relationship Diagram

```mermaid
erDiagram
    GUEST
```

### GUEST

A person who stays at the hotel and can be named on a reservation.

| Attribute     | Description                   | Data Type | Length/Precision | Validation Rules        |
|---------------|-------------------------------|-----------|------------------|-------------------------|
| id            | Unique identifier             | Long      | 19               | Primary Key, Sequence   |
| first_name    | First name                    | String    | 100              | Not Null                |
| last_name     | Last name                     | String    | 100              | Not Null                |
| email         | Email address                 | String    | 255              | Not Null, Format: Email |
| birth_date    | Date of birth                 | Date      | -                | Not Null                |
| registered_at | When the guest was registered | DateTime  | -                | Not Null                |
