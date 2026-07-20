# Automate Test Case TC-001 (Order Fulfillment)

## Problem/Feature Description

The logistics team has documented an end-to-end test case for their Vaadin application: **TC-001 Order Fulfillment**, in `docs/test_cases/TC-001-order-fulfillment.md`. The test case spans two use cases — a clerk creates an order on the Orders view (UC-010) and a warehouse operator ships it on the Shipping view (UC-011) — and finishes with cross-cutting validations on the order count and the final order status.

Your task is to automate this test case as a Playwright end-to-end test. The test case document is the authority on what to test and in which order: its Flow table defines the steps, its Test Data column defines the literal values to use, and its Validation section defines the final expectations. The linked use case specifications in `docs/use_cases/` define the views, field labels, buttons, and messages each step interacts with.

Use the Drama Finder element library — the API reference is provided in `references/dramafinder-api.md`. The application runs on a locally started Spring Boot server (the port is injected at test runtime); the customer and product referenced in the test case's preconditions are pre-loaded by Flyway test migration `V900__test_data.sql`. You do not have a running application — write the test code only.

## Output Specification

Produce a single Java test file:

```
src/test/java/com/example/app/e2e/OrderFulfillmentE2EIT.java
```

The file must contain one complete, runnable Playwright test class that executes the whole TC-001 test case — all four Flow steps in order, followed by the two Validation checks — and cleans up the data the test created. The test must be executable with `./mvnw verify -Pit`.

Do NOT include a `pom.xml` or any build file — the test class only.
