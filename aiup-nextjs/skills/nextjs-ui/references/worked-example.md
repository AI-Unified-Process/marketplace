<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Worked example: products

The UI layer of UC-010 "Browse Product Catalog": a list with a category filter and an empty state.

## No route indirection

Where the detection found **no route indirection**, the route file holds the page:

```tsx
// src/app/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '../../types/product';

/** UC-010: Browse Product Catalog */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    fetch(`/api/products${query}`)
      .then((res) => {
        if (!res.ok) throw new Error(`GET /api/products answered ${res.status}`);
        return res.json();
      })
      .then(setProducts)
      // UC-010 A2: the message as the specification states it
      .catch(() => setErrorMessage('The product catalog is currently unavailable.'));
  }, [category]);

  return (
    <main>
      <h1>Products</h1>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <label htmlFor="category">Category</label>
      <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="tools">Tools</option>
      </select>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} — {product.price}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

In this example the specification of UC-010 states both messages: alternative flow A1 "No Products" says *No products
found.*, and A2 "Catalog Unavailable" says *The product catalog is currently unavailable.* A message the specification
does not state is a gap, not a choice: write none of your own.

## Route indirection

Where the detection found **route indirection**, the route file is a thin wrapper and the body above lives in the view
component, which also carries the `/** UC-010: … */` comment:

```tsx
// src/app/products/page.tsx
'use client';
import { ProductsPage } from '../../views/ProductsPage';

export default function Page() {
  return <ProductsPage />;
}
```

## A page that reads the URL

`useSearchParams` must sit under a `<Suspense>` boundary in the route file, or static generation fails at build time
with an error that names the hook but not the fix:

```tsx
// src/app/products/page.tsx
'use client';
import { Suspense } from 'react';
import { ProductsPage } from '../../views/ProductsPage';

export default function Page() {
  return (
    <Suspense>
      <ProductsPage />
    </Suspense>
  );
}
```
