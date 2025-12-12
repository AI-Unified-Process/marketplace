Create an entity model (docs/entity_model.md) based on docs/requirements.md.

DO NOT:
- Add attributes/columns to the Mermaid diagram
- Write prose descriptions like "Key attributes: name, email..."
- Create a "Relationships" table
- Skip the attribute tables

REQUIRED FORMAT FOR EACH ENTITY - Copy this structure exactly:

### ROOM_TYPE

Defines categories of rooms with shared characteristics.

| Attribute   | Description              | Data Type | Length/Precision | Validation Rules          |
|-------------|--------------------------|-----------|------------------|---------------------------|
| id          | Unique identifier        | Long      | 19               | Primary Key, Sequence     |
| name        | Name of the room type    | String    | 50               | Not Null, Unique          |
| description | Detailed description     | String    | 500              | Optional                  |
| capacity    | Maximum number of guests | Integer   | 10               | Not Null, Min: 1, Max: 10 |
| price       | Price per night in CHF   | Decimal   | 10,2             | Not Null, Min: 0          |

WORKFLOW:

1. Read docs/requirements.md
2. Use TodoWrite to list each entity (e.g., "Create ROOM_TYPE attribute table")
3. Write "# Entity Model"
4. Write "## Entity Relationship Diagram" with a simple Mermaid erDiagram:
   ```mermaid
   erDiagram
       ROOM_TYPE ||--o{ ROOM : "categorizes"
       GUEST ||--o{ RESERVATION : "makes"
   ```
   (NO attributes in the diagram - relationships only)
5. For EACH entity, write:
   - ### ENTITY_NAME
   - One sentence description
   - Attribute table (5 columns as shown above)
   - Mark todo complete
6. Verify every entity has an attribute table

VALIDATION RULES for the last column:
- id: "Primary Key, Sequence"
- Required: "Not Null"
- Unique: "Not Null, Unique"
- Foreign key: "Not Null, Foreign Key (TABLE.id)"
- Nullable: "Optional"