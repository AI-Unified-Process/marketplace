<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Requirements Reference

## ID Prefixes

| Prefix | Type                       | Example |
|--------|----------------------------|---------|
| FR     | Functional Requirement     | FR-001  |
| NFR    | Non-Functional Requirement | NFR-001 |
| C      | Constraint                 | C-001   |

## Priority

| Priority | Description                                         |
|----------|-----------------------------------------------------|
| High     | Must have. Core functionality or critical quality.  |
| Medium   | Should have. Important but system works without it. |
| Low      | Nice to have. Can be deferred to future releases.   |

## Status

| Status      | Description                                    |
|-------------|------------------------------------------------|
| Open        | Requirement defined but not yet implemented.   |
| In Progress | Currently being implemented.                   |
| Implemented | Implementation complete, pending verification. |
| Verified    | Tested and confirmed working.                  |
| Deferred    | Postponed to a future release.                 |
| Rejected    | Removed from scope.                            |

Deferred and Rejected are scope decisions and are set by hand. Open, In Progress, Implemented, and Verified are
progress, and progress follows the use cases that list the requirement in their `**Requirements:**` line:

| Requirement status | When                                                                      |
|--------------------|---------------------------------------------------------------------------|
| Open               | No linking use case is Implemented yet (all Draft, Reviewed, or Approved) |
| In Progress        | Some linking use cases are Implemented or beyond, others are not          |
| Implemented        | Every linking use case is Implemented, Tested, or Done                    |
| Verified           | Every linking use case is Tested or Done                                  |

Obsolete use cases do not count. A requirement no use case links keeps its status by hand. `/spec-review` reports a
progress status that its use cases contradict as `REQ_STATUS_DRIFT`, and its `--trace` matrix shows the status the
use cases make it.

## NFR Categories

| Category        | Description                                   |
|-----------------|-----------------------------------------------|
| Performance     | Speed, throughput, response time              |
| Scalability     | Ability to handle growth                      |
| Availability    | Uptime, fault tolerance                       |
| Security        | Authentication, authorization, encryption     |
| Usability       | User experience, accessibility                |
| Maintainability | Code quality, documentation, modularity       |
| Portability     | Platform independence, deployment flexibility |

## Constraint Categories

| Category    | Description                                   |
|-------------|-----------------------------------------------|
| Technical   | Technology stack, platforms, integrations     |
| Business    | Budget, resources, organizational policies    |
| Schedule    | Deadlines, milestones, time constraints       |
| Regulatory  | Legal, compliance, industry standards         |
| Operational | Deployment, maintenance, support requirements |
