# Lending Counter Decision for the City Library

## Problem/Feature Description

A city library builds its new lending and catalog system with the AI Unified Process. The requirements are in
`docs/requirements.md`, and the team records its architecture decisions under `docs/architecture/decisions/`.

The lead developer, T. Huber, sends this message:

> Please write an ADR for a decision we took in today's team meeting: the service keeps the current loans of a member
> in an in-memory Caffeine cache for five minutes, evicted on every lend and return. At the counter the lend screen
> has to open instantly when the librarian scans the member card, and with the cache it does. It's for FR-002, so you
> can link that.

## Output Specification

Record what can be recorded under `docs/architecture/decisions/`. Today is 2026-10-27. T. Huber has confirmed the
decision as taken; nobody can answer follow-up questions in this session.

This session's conversation is not kept. Append every message you write to the user, word for word and in order, to
`session-log.md` in the root of the working directory; that log is not part of the project.
