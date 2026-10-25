<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# R__uc010_browse_product_catalog.sql

The SQL script `R__uc010_browse_product_catalog.sql`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `R__uc010_browse_product_catalog.sql`.

```sql
-- Test data for UC-010 Browse Product Catalog.
-- Every file under db/testdata loads for every test, so the tables hold other use cases' rows too. These rows own
-- the ids 1001-1099 and the category prefix "UC010", so the tests can scope their assertions to them.

INSERT INTO product (id, name, category, price, in_stock)
VALUES (1001, 'Desk Lamp', 'UC010 Lighting', 39.90, TRUE),
       (1002, 'Floor Lamp', 'UC010 Lighting', 89.00, FALSE),
       (1003, 'Notebook', 'UC010 Office', 4.50, TRUE),
       (1004, 'Office Chair', 'UC010 Office', 249.00, TRUE),
       (1005, 'Standing Desk', 'UC010 Desks', 499.00, FALSE);
```
