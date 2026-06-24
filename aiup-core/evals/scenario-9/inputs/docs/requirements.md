# Requirements: User Account System

## Functional Requirements

| ID     | Requirement                                                                                                            | Status |
|--------|------------------------------------------------------------------------------------------------------------------------|--------|
| FR-001 | As a visitor, I want to register an account with my email and password so that I can access the platform.             | Draft  |
| FR-002 | As a visitor, I want my email address to be verified after registration so that the system confirms my identity.      | Draft  |
| FR-003 | As a visitor, I want to log in with my email and password so that I can access my account.                            | Draft  |
| FR-004 | As a visitor, I want to receive a verification email after registering so that I can activate my account.             | Draft  |
| FR-005 | As a registered user, I want my account to be locked after 5 failed login attempts so that my account is protected.  | Draft  |
| FR-006 | As a visitor, I want to confirm my password during registration so that I do not make a typo.                         | Draft  |
| FR-007 | As a registered user, I want a session to be created when I log in so that I remain authenticated while browsing.    | Draft  |

## Non-Functional Requirements

| ID      | Requirement                                                                    | Status |
|---------|--------------------------------------------------------------------------------|--------|
| NFR-001 | Passwords must be stored using a one-way hashing algorithm (e.g., bcrypt).    | Draft  |
| NFR-002 | Session tokens (JWT) must expire after 24 hours.                               | Draft  |
| NFR-003 | Email verification links must expire after 48 hours.                           | Draft  |
| NFR-004 | Login page must load within 2 seconds under normal traffic.                    | Draft  |
| NFR-005 | Registration endpoint must respond within 3 seconds for 95% of requests.      | Draft  |

## Constraints

| ID    | Constraint                                                                              | Status |
|-------|-----------------------------------------------------------------------------------------|--------|
| C-001 | The system must send transactional emails via an SMTP-compatible email service.         | Draft  |
| C-002 | Passwords must be a minimum of 8 characters and include at least one digit.            | Draft  |
| C-003 | Email addresses must conform to RFC 5322 format and be unique across all accounts.     | Draft  |
| C-004 | Account data must be persisted in a relational database (SQL).                          | Draft  |
