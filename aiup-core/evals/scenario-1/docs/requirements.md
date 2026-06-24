# Requirements Catalog — LearnPath Online Course Enrollment Platform

## Functional Requirements (FR)

| ID     | Requirement                                                                                                                          | Priority | Status   |
|--------|--------------------------------------------------------------------------------------------------------------------------------------|----------|----------|
| FR-001 | As a prospective student, I want to register an account with my email address so that I can access courses and track my progress.    | High     | Approved |
| FR-002 | As a student, I want to browse the course catalog and view course details including title, description, and price so that I can make informed enrollment decisions. | High | Approved |
| FR-003 | As a student, I want to enroll in a course by choosing a start date and end date so that I can plan my learning schedule.            | High     | Approved |
| FR-004 | As a student, I want to view my active enrollments and their current status so that I can track which courses I am taking.           | High     | Approved |
| FR-005 | As an instructor, I want to create a course with a title, description, and price so that students can discover and enroll in it.    | High     | Approved |
| FR-006 | As an instructor, I want to set a maximum enrollment capacity for my course so that class sizes remain manageable.                  | Medium   | Approved |
| FR-007 | As an administrator, I want to deactivate a student account so that suspended users cannot access the platform.                      | Medium   | Approved |

## Non-Functional Requirements (NFR)

| ID      | Requirement                                                                        | Category        | Priority | Status   |
|---------|------------------------------------------------------------------------------------|-----------------|----------|----------|
| NFR-001 | The platform must respond to all course search queries within 2 seconds.           | Performance     | High     | Approved |
| NFR-002 | The system must be available 99.9% of the time during business hours.              | Availability    | High     | Approved |
| NFR-003 | All student personal data must be encrypted at rest using AES-256.                 | Security        | High     | Approved |
| NFR-004 | The platform must support at least 500 concurrent active users without degradation. | Scalability     | Medium   | Approved |

## Constraints

| ID    | Constraint                                                                                     | Status   |
|-------|-----------------------------------------------------------------------------------------------|----------|
| C-001 | The platform must use only open-source libraries with MIT or Apache 2.0 licenses.             | Approved |
| C-002 | Course prices must be stored and displayed in USD with two decimal places.                     | Approved |
| C-003 | A student's enrollment end date must be strictly after their enrollment start date.             | Approved |
| C-004 | Enrollment status must be one of: Pending, Active, Completed, or Cancelled.                   | Approved |
| C-005 | The maximum number of students allowed in a single course section must be between 1 and 200.  | Approved |
