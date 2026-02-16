---
name: requirements
description: >
  Gathers, organizes, and documents software requirements into structured
  catalogs with functional requirements (user stories), non-functional
  requirements (measurable quality attributes), and constraints. Use when
  the user asks to "write requirements", "create a PRD", "gather requirements",
  "document feature specs", "write user stories", "define NFRs", "list
  constraints", or mentions requirements catalog, requirements analysis,
  product requirements document, or feature specification.
---

# Requirements

## Instructions

Create or update the requirements catalog at `docs/requirements.md` based on `docs/vision.md`.
The document contains functional requirements, non-functional requirements, and constraints organized as Markdown tables.

## DO NOT

- Mix requirement types in a single table
- Skip the user story format for functional requirements
- Use duplicate IDs across requirement types
- Leave the Status column empty

## Requirement Types

### Functional Requirements (FR)

Define what the system should do. Always use the user story format:

**Format:** As a [role], I want [goal] so that [benefit].

| ID     | Title        | User Story                                                                                | Priority | Status |
|--------|--------------|-------------------------------------------------------------------------------------------|----------|--------|
| FR-001 | Create Task  | As a project manager, I want to create tasks so that I can track work items.              | High     | Open   |
| FR-002 | Assign Task  | As a project manager, I want to assign tasks to team members so that work is distributed. | High     | Open   |
| FR-003 | Filter Tasks | As a team member, I want to filter tasks by status so that I can focus on relevant items. | Medium   | Open   |

### Non-Functional Requirements (NFR)

Define quality attributes. Must be measurable.

| ID      | Title            | Requirement                                                   | Category     | Priority | Status |
|---------|------------------|---------------------------------------------------------------|--------------|----------|--------|
| NFR-001 | Response Time    | All page loads must complete within 2 seconds.                | Performance  | High     | Open   |
| NFR-002 | Availability     | System must maintain 99.9% uptime during business hours.      | Availability | High     | Open   |
| NFR-003 | Concurrent Users | System must support 100 concurrent users without degradation. | Scalability  | Medium   | Open   |
| NFR-004 | Data Encryption  | All data in transit must use TLS 1.3 encryption.              | Security     | High     | Open   |

### Constraints (C)

Define limitations and boundaries imposed on the solution.

| ID    | Title             | Constraint                                                       | Category  | Priority | Status |
|-------|-------------------|------------------------------------------------------------------|-----------|----------|--------|
| C-001 | Runtime Platform  | Backend must run on Java 21 LTS.                                 | Technical | High     | Open   |
| C-002 | Database Platform | System must use PostgreSQL 16.                                   | Technical | High     | Open   |
| C-003 | Browser Support   | UI must support Chrome, Firefox, and Safari (latest 2 versions). | Technical | High     | Open   |
| C-004 | Budget Limit      | Total development cost must not exceed $50,000.                  | Business  | High     | Open   |
| C-005 | Deadline          | System must be production-ready by Q2 2025.                      | Schedule  | High     | Open   |

## ID Prefixes Reference

| Prefix | Type                       | Example |
|--------|----------------------------|---------|
| FR     | Functional Requirement     | FR-001  |
| NFR    | Non-Functional Requirement | NFR-001 |
| C      | Constraint                 | C-001   |

## Priority Reference

| Priority | Description                                         |
|----------|-----------------------------------------------------|
| High     | Must have. Core functionality or critical quality.  |
| Medium   | Should have. Important but system works without it. |
| Low      | Nice to have. Can be deferred to future releases.   |

## Status Reference

| Status      | Description                                    |
|-------------|------------------------------------------------|
| Open        | Requirement defined but not yet implemented.   |
| In Progress | Currently being implemented.                   |
| Implemented | Implementation complete, pending verification. |
| Verified    | Tested and confirmed working.                  |
| Deferred    | Postponed to a future release.                 |
| Rejected    | Removed from scope.                            |

## NFR Categories Reference

| Category        | Description                                   |
|-----------------|-----------------------------------------------|
| Performance     | Speed, throughput, response time              |
| Scalability     | Ability to handle growth                      |
| Availability    | Uptime, fault tolerance                       |
| Security        | Authentication, authorization, encryption     |
| Usability       | User experience, accessibility                |
| Maintainability | Code quality, documentation, modularity       |
| Portability     | Platform independence, deployment flexibility |

## Constraint Categories Reference

| Category    | Description                                   |
|-------------|-----------------------------------------------|
| Technical   | Technology stack, platforms, integrations     |
| Business    | Budget, resources, organizational policies    |
| Schedule    | Deadlines, milestones, time constraints       |
| Regulatory  | Legal, compliance, industry standards         |
| Operational | Deployment, maintenance, support requirements |

## Requirement Quality Checks

Every requirement must pass these checks before finalizing:

| Check       | Rule                                 | Bad Example                          | Good Example                  |
|-------------|--------------------------------------|--------------------------------------|-------------------------------|
| Measurable  | NFRs must have a number or threshold | "System should be fast"              | "Pages load within 2 seconds" |
| Singular    | One requirement per row              | "System must log in and export data" | Split into FR-001 and FR-002  |
| Unambiguous | No subjective terms                  | "User-friendly interface"            | "WCAG 2.1 AA compliant"       |
| Testable    | Can write a pass/fail test           | "System is reliable"                 | "99.9% uptime over 30 days"   |
| Unique IDs  | No duplicate IDs across all tables   | Two FR-001 entries                   | Each ID used exactly once     |

## Error Recovery

- **Incomplete source document**: List what is missing (roles, NFR categories, constraints) and ask the user to clarify before proceeding
- **Ambiguous requirement from user**: Rewrite it as a measurable requirement and ask the user to confirm the threshold
- **Conflicting requirements**: Flag the conflict explicitly (e.g., "FR-003 requires real-time sync but C-002 limits to batch processing") and ask the user to resolve
- **Missing stakeholder roles**: Default to generic roles (User, Admin, System) and note them for user review

## Workflow

1. Read the vision document or project brief
2. Use TodoWrite to create tasks for each requirement type
3. Write the document header
4. For functional requirements:
    - Identify user roles
    - Define user stories with clear goals and benefits
    - Assign priorities based on business value
5. For non-functional requirements:
    - Define measurable quality attributes
    - Categorize by NFR type
    - Ensure requirements are testable
6. For constraints:
    - Document technical and business limitations
    - Categorize by constraint type
7. Validate: run every requirement against the quality checks table above
    - No duplicate IDs across all tables
    - All Status columns filled
    - All user stories follow "As a [role], I want [goal] so that [benefit]"
    - All NFRs contain a measurable threshold
8. Mark todos complete