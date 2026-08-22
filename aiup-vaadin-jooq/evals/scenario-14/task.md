# Check the Coverage of the Cancel Order Use Case

## Problem Description

The team at an online shop has implemented and tested the "Cancel Order" use case. Its specification
is at `docs/use-cases/UC-020-cancel-order.md` and its status line already claims `Implemented`.

Before accepting the use case as done, they want to know whether the code and the tests really cover
the specification: which main success scenario steps, alternative flows, business rules,
preconditions, and postconditions have something behind them, which are still open, and whether any
code or test has drifted away from what the specification describes.

The Vaadin view is at `src/main/java/com/example/shop/view/OrderListView.java`, the data access layer
at `src/main/java/com/example/shop/order/OrderRepository.java`, and the existing test class at
`src/test/java/com/example/shop/view/UC020CancelOrderTest.java`.

Run the coverage check for UC-020, covering both the implementation and the tests.

## Output Specification

Produce a written report only. Do **not** modify, create, or delete any file — not the code, not the
tests, and not the specification's `**Status:**` line.

The report must contain:

1. A coverage matrix with one row per coverage unit derived from the specification — every numbered
   main success scenario step, every alternative flow, every business rule, every precondition, and
   every postcondition — showing for each the evidence in the implementation and in the tests, or
   `—` where there is none.
2. A section listing the gaps, each naming where the missing behaviour or the missing test belongs
   and which skill closes it.
3. A section listing drift: code or tests that the specification no longer describes.
4. A justified suggestion for the specification's next `**Status:**` value, as a suggestion only.
