# Use Case Specification: Place Order

## Problem Description

The ShopStream e-commerce platform has reached a milestone where the checkout flow has been designed and approved at a high level, but the detailed behavioral specification for the core use case has not yet been written. Without a precise, structured specification, the development team lacks the shared understanding they need to implement and test the checkout consistently across front-end, back-end, and QA.

The product team has already produced a requirements catalog (`docs/requirements.md`) and a use case diagram (`docs/use_cases.puml`) that identify the actors, use cases, and high-level system goals. What is missing is the full use case specification for the primary checkout interaction: **UC-001 Place Order**. This use case covers everything from a customer reviewing their cart through entering an address, selecting a shipping method, providing payment details, and receiving an order confirmation — including the various things that can go wrong along the way, such as a declined payment or an item becoming unavailable during checkout.

Write the complete use case specification for UC-001 Place Order. The specification should follow the established use case template structure and describe the end-to-end interaction in clear business terms, capturing all relevant flows and post-conditions to give the engineering team everything they need to implement and test the feature.

## Output Specification

Create the file `docs/use_cases/UC-001-place-order.md` containing the full specification.

The input files you need are:

- `docs/requirements.md` — the requirements catalog
- `docs/use_cases.puml` — the use case diagram

Do not create any other use case files; this task covers UC-001 only.
