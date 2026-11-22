# ADR-002: The session token is kept in localStorage

**Status:** Accepted
**Date:** 2026-09-12
**Requirements:** C-002

## Context

C-002 makes the front end a single-page application. The SPA needs the session token on every API call after the
organizer signs in.

## Decision

The API returns a bearer token after sign-in. The SPA keeps it in `localStorage` and sends it in the
`Authorization` header.

## Consequences

- The token survives a reload of the page.
- Any script on the page can read the token.
- **Alternatives considered:** a cookie set by the API (rejected at the time: the team had no CSRF protection yet).
