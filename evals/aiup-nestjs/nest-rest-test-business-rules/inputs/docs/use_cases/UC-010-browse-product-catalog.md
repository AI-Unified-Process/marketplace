# Use Case: Browse Product Catalog

## Overview

**Use Case ID:** UC-010  
**Use Case Name:** Browse Product Catalog  
**Primary Actor:** Shopper  
**Goal:** See which products can be bought  
**Trigger:** The shopper opens the product catalogue  
**Status:** Implemented  

**Requirements:** [FR-010](../requirements.md)

## Preconditions

- The catalogue contains the available product "Hammer" (category tools, price 12.5), the available product "Paint"
  (category decor, price 8), and the out-of-stock product "Discontinued Widget" (category tools, price 3)

## Main Success Scenario

1. The shopper opens the product catalogue.
2. The system lists the products available to buy, showing each product's name, category, and price.

## Alternative Flows

### A1: Narrow by Category

**Trigger:** The shopper chooses a category (step 2)  
**Flow:**

1. The system lists only the available products in that category.
2. Use case ends.

## Postconditions

### Success Postconditions

- No data is changed

## Business Rules

### BR-010: Out of Stock

A product that is out of stock is never shown in the catalogue, whether or not a category filter is applied.
