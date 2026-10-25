<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Entity Model Reference

## Validation Rules

Use these values in the "Validation Rules" column (never leave empty):

**Keys** — a key column takes exactly one of these values:

| Attribute Type                | Validation Rules Value              |
|-------------------------------|-------------------------------------|
| Primary key                   | Primary Key, Sequence               |
| Natural or composite key      | Primary Key                         |
| Composite key and foreign key | Primary Key, Foreign Key (TABLE.id) |

**Every other attribute** — one nullability rule first, then any of the following rules that apply, in this order:

| Position | Rule                     | Meaning                                                                    |
|----------|--------------------------|----------------------------------------------------------------------------|
| 1        | `Not Null` or `Optional` | Required or optional; always present, always first                         |
| 2        | `Unique`                 | No two rows share the value (an optional value: no two non-empty ones)     |
| 3        | `Foreign Key (TABLE.id)` | References another entity, or an external entity named under the title     |
| 4        | `Min: X, Max: Y`         | Range of a number, or of a date as ISO dates; always both bounds           |
| 4        | `Values: A, B, C`        | A fixed set of values; instead of a range, never together with one         |
| 5        | `Format: <format>`       | The value follows a format: `Email`, `Phone` (international, E.164), `URL` |

| Attribute Type                | Validation Rules Value                      |
|-------------------------------|---------------------------------------------|
| Required field                | Not Null                                    |
| Optional field                | Optional                                    |
| Unique field                  | Not Null, Unique                            |
| Foreign key                   | Not Null, Foreign Key (TABLE.id)            |
| One-to-one link               | Not Null, Unique, Foreign Key (TABLE.id)    |
| With range                    | Not Null, Min: X, Max: Y                    |
| With values                   | Not Null, Values: A, B, C                   |
| Email                         | Not Null, Format: Email                     |
| Unique email                  | Not Null, Unique, Format: Email             |
| Optional phone number         | Optional, Format: Phone                     |

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
