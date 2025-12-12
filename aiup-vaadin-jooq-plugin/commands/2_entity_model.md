Create an entity model (docs/entity_model.md) based on docs/requirements.md.

WORKFLOW - Follow these steps IN ORDER:

1. Read docs/requirements.md completely
2. Use TodoWrite to create a task for EACH entity you identify (e.g., "Create ROOM_TYPE table", "Create GUEST table")
3. Create the document starting with "# Entity Model"
4. Add "## Entity Relationship Diagram" with a Mermaid erDiagram (entities and relationships only, NO attributes in
   diagram):
   ```
   ROOM_TYPE ||--o{ ROOM : "categorizes"
   GUEST ||--o{ RESERVATION : "makes"
   ```
5. For EACH entity in your todo list:
    - Add a ### heading with entity name
    - Write ONE sentence describing it
    - Create an attribute table with these EXACT columns:
      | Attribute | Description | Data Type | Length/Precision | Validation Rules |
    - If multi-column constraints exist, add "**Constraints:**" line after table
    - Mark the todo as complete ONLY after the table is written
6. After ALL entities are done, verify every entity from step 2 has a table

VALIDATION RULES (never leave empty):

- id columns: "Primary Key, Sequence"
- Required fields: "Not Null"
- Unique fields: "Not Null, Unique"
- Foreign keys: "Not Null, Foreign Key (ENTITY.id)"
- Nullable fields with no rules: "Optional"
- Add Min/Max, allowed Values, Format as appropriate

PRIMARY KEYS: Use Long (19 digits) with Sequence by default.

EXAMPLE TABLE:

### ROOM_TYPE

Defines categories of rooms with shared characteristics.

| Attribute   | Description              | Data Type | Length/Precision | Validation Rules          |
|-------------|--------------------------|-----------|------------------|---------------------------|
| id          | Unique identifier        | Long      | 19               | Primary Key, Sequence     |
| name        | Name of the room type    | String    | 50               | Not Null, Unique          |
| description | Detailed description     | String    | 500              | Optional                  |
| capacity    | Maximum number of guests | Integer   | 10               | Not Null, Min: 1, Max: 10 |
| price       | Price per night in CHF   | Decimal   | 10,2             | Not Null, Min: 0          |