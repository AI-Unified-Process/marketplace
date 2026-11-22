# Build the client layer of "Pay Deposit" (UC-007)

## Problem Description

A hotel team builds a Spring Boot 4.0 REST service with jOOQ in one flat Maven module (package
`com.example.hotel`). `docs/architecture/stack.md` records the layers and the external systems the use cases call.
UC-007 charges a deposit to the guest's card at the payment provider, whose OpenAPI contract the provider supplied
as `docs/api/external/payment-provider.yaml`. The booking record already exists; the service layer of UC-007 is not
written yet.

The use case is specified at `docs/use_cases/UC-007-pay-deposit.md`. Nobody is available to answer questions in this
session: decide what the skill lets you decide, and report the rest.

## Output Specification

Run `/spring-client UC-007`: build the client layer only. Do not write the service, a controller, or tests. End with
the Handover block for the next layer.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
