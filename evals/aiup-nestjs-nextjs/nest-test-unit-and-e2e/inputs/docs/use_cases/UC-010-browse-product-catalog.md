# UC-010 — Browse Product Catalog

**Actor:** Shopper

**Preconditions:** The catalogue contains at least one product.

## Main success scenario

1. The shopper opens the product catalogue.
2. The system lists the products available to buy, showing each product's name, category, and
   price.
3. The shopper can read the list without taking any further action.

## Alternative flows

**A1 — Narrow by category.** The shopper chooses a category. The system lists only the available
products in that category. Choosing "All" restores the unfiltered list.

## Postconditions

No data is changed — this use case is read-only.

## Business rules

- **BR-010:** A product that is out of stock is never shown in the catalogue, whether or not a
  category filter is applied.
