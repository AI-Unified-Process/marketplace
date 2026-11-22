# Requirements Catalog — Project Tracker

## Functional Requirements

| ID     | Description                                                                                               | Priority | Status   |
|--------|-----------------------------------------------------------------------------------------------------------|----------|----------|
| FR-001 | As a Project Manager, I want to create a new project with a name, description, and deadline so that the team knows what they are working towards. | High     | Approved |
| FR-002 | As a Project Manager, I want to assign team members to a project so that responsibilities are clearly defined. | High     | Approved |
| FR-003 | As a Team Member, I want to update the status of my assigned tasks so that the project manager can track progress. | High     | Approved |
| FR-004 | As an Auditor, I want to view a complete audit log of all changes made to any project so that I can verify compliance with company policy. | High     | Approved |
| FR-005 | As an Auditor, I want to export the audit log for a given date range as a CSV file so that I can submit it for external review. | Medium   | Approved |

## Non-Functional Requirements

| ID      | Description                                                               | Priority | Status   |
|---------|---------------------------------------------------------------------------|----------|----------|
| NFR-001 | The system must load the project dashboard in under 2 seconds for up to 200 concurrent users. | High | Approved |
| NFR-002 | All data must be backed up daily and recoverable within 4 hours of a failure. | High | Approved |

## Constraints

| ID    | Description                                                                 | Status   |
|-------|-----------------------------------------------------------------------------|----------|
| C-001 | The system must be deployable on-premises without requiring a cloud provider. | Approved |
| C-002 | All audit log exports must be retained for a minimum of 7 years.            | Approved |
