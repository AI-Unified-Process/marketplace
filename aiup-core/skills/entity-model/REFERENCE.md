# Entity Model Reference

## Validation Rules

Use these values in the "Validation Rules" column (never leave empty):

| Attribute Type | Validation Rules Value           |
|----------------|----------------------------------|
| Primary key    | Primary Key, Sequence            |
| Required field | Not Null                         |
| Unique field   | Not Null, Unique                 |
| Foreign key    | Not Null, Foreign Key (TABLE.id) |
| Optional field | Optional                         |
| With range     | Not Null, Min: X, Max: Y         |
| With values    | Not Null, Values: A, B, C        |
| Email          | Not Null, Format: Email          |

## Data Types

| Data Type | Length/Precision | Usage                 |
|-----------|------------------|-----------------------|
| Long      | 19               | IDs, foreign keys     |
| String    | varies (50-500)  | Text fields           |
| Integer   | 10               | Whole numbers         |
| Decimal   | 10,2             | Currency, percentages |
| Boolean   | 1                | True/false flags      |
| Date      | -                | Date only             |
| DateTime  | -                | Date and time         |
