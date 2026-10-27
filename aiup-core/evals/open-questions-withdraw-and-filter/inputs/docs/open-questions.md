# Open Questions

Questions about the specification that the specification does not answer yet. A question is `Resolved` only when
the answer is in the specification itself; **Resolved in** names where. Resolved and withdrawn questions stay as
history.

## OQ-001: May a workshop be created without a capacity?

**Element:** UC-001 step 3
**Raised by:** /use-case-implement, 2026-09-28
**Blocking:** Yes
**Status:** Resolved

**Answer:** No; every workshop has a capacity of at least one.
**Answered by:** M. Keller, 2026-09-29
**Resolved in:** Entity: WORKSHOP.capacity

## OQ-002: Does the registration deadline count calendar hours or business hours?

**Element:** UC-002 BR-002
**Raised by:** M. Keller, 2026-10-03
**Blocking:** Yes
**Status:** Open

The partner portal closes registration at noon of the last business day before a workshop. BR-002 says 24 hours.
Readings: (a) 24 calendar hours before the start; (b) noon of the last business day before the start.

## OQ-003: Do the 255 characters of an email include the domain part?

**Element:** NFR-001
**Raised by:** /use-case-test, 2026-10-08
**Blocking:** Yes
**Status:** Answered

NFR-001 limits an email to 255 characters. The mail server of the training company rejects local parts longer than
64 characters. Readings: (a) the whole address; (b) the local part only.

**Answer:** The whole address, local part and domain together.
**Answered by:** P. Meier, 2026-10-12

## OQ-004: Must a participant enter a company name?

**Element:** UC-002 step 3
**Raised by:** /use-case-implement, 2026-10-14
**Blocking:** No
**Status:** Open
**Assumed:** No company name; step 3 asks for name and email only.

The invoices of the partner portal show a company. Step 3 asks for name and email only.

## OQ-005: Does the participant list show cancelled registrations?

**Element:** UC-003 step 2
**Raised by:** M. Keller, 2026-10-15
**Blocking:** Yes
**Status:** Open

Step 2 lists the participants. The partner portal lets a participant cancel; UC-003 does not say whether a cancelled
registration still appears, struck through, or not at all.

## OQ-006: Are the 24 hours of A2 calendar hours or business hours?

**Element:** UC-002 A2
**Raised by:** /use-case-test, 2026-10-20
**Blocking:** Yes
**Status:** Open

A2 closes registration when the workshop starts in less than 24 hours. The test cannot tell whether the 24 hours are
calendar hours counted back from the start time or a business-day rule like the partner portal's.

