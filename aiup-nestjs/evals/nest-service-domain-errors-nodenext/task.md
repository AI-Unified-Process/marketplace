# Build the service layer of "Register Guest" (UC-001)

## Problem Description

A hotel team builds a NestJS application with Drizzle in `apps/api`. `docs/architecture/stack.md` records the layers. The
persistence layer of UC-001 is done, and it handed over:

```text
Handover from drizzle-persistence (UC-001)
- GuestsRepository — apps/api/src/guests/guests.repository.ts
  - findByEmail(email: string): Promise<GuestRow | undefined>
  - insert(values: NewGuest, tx?: DbExecutor): Promise<GuestRow>
- Violations: insert raises 23505 on guest_email_uk
```

The specification is at `docs/use_cases/UC-001-register-guest.md`.

## Output Specification

Run `/nest-service UC-001`: build the service layer of UC-001 only. There is no database here, so the build is the only
check you can run.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
