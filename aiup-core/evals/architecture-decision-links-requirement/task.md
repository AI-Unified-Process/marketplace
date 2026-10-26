# Architecture Decisions for the Workshop Registration

## Problem/Feature Description

A training company specifies its workshop registration with the AI Unified Process. The requirements are in
`docs/requirements.md`, and the team records its architecture decisions under `docs/architecture/decisions/`.

The lead developer, R. Keller, sends this message after the security review:

> Please record two decisions we took today:
>
> 1. We moved the session from localStorage to an HttpOnly cookie that the API sets at sign-in. The SPA no longer
>    sees the token at all; we added CSRF protection with a double-submit token.
> 2. We decided to put Kafka between the registration service and the mailing service, because we like
>    event-driven architectures.

## Output Specification

Record what can be recorded under `docs/architecture/decisions/`. Today is 2026-10-27. R. Keller has confirmed both
decisions as taken; nobody can answer follow-up questions in this session.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
