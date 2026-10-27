# ADR-004: Members and librarians sign in through the city SSO with OpenID Connect

**Status:** Proposed
**Date:** 2026-10-05
**Requirements:** C-002

## Context

C-002 requires the city's single sign-on. The city offers OpenID Connect with the authorization code flow.

## Decision

The application is an OpenID Connect client of the city SSO and maps the SSO groups `library-staff` and
`library-member` to the roles LIBRARIAN and MEMBER.

## Consequences

- No passwords are stored in the library system.
- Sign-in depends on the availability of the city SSO.
- **Alternatives considered:** local accounts (ruled out by C-002).
