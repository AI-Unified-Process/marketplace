# Entity Model

## Entity Relationship Diagram

```mermaid
erDiagram
    GUEST
```

### GUEST

A person registered at the front desk who can be assigned to a reservation.

| Attribute     | Description                    | Data Type | Length/Precision | Validation Rules                |
|---------------|--------------------------------|-----------|------------------|---------------------------------|
| id            | Unique identifier              | Long      | 19               | Primary Key, Sequence           |
| first_name    | First name of the guest        | String    | 100              | Not Null                        |
| last_name     | Last name of the guest         | String    | 100              | Not Null                        |
| email         | Email address of the guest     | String    | 255              | Not Null, Unique, Format: Email |
| date_of_birth | Date of birth of the guest     | Date      | -                | Not Null                        |
