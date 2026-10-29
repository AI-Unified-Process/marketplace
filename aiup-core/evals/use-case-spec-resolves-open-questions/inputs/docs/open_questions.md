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
**Status:** Answered

The partner portal closes registration at noon of the last business day before a workshop. BR-002 says 24 hours.
Readings: (a) 24 calendar hours before the start; (b) noon of the last business day before the start.

**Answer:** Registration closes at 12:00 on the last business day (Monday to Friday) before the workshop starts.
**Answered by:** P. Meier, 2026-10-20

## OQ-003: Does a participant who is already registered get the confirmation again?

**Element:** UC-002 A3
**Raised by:** /use-case-test, 2026-10-21
**Blocking:** No
**Status:** Open

A3 shows a message but says nothing about the confirmation. Readings: (a) no confirmation; (b) the confirmation is
sent again.
