# Update the Project Tracker Use Case Diagram

## Problem/Feature Description

The Project Tracker team has been maintaining a living requirements catalog and a corresponding use case diagram. Last week, the compliance department requested that an "Auditor" role be added to the system, giving auditors read-only access to a full change log and the ability to export it. The product manager has already updated `docs/requirements.md` to include the new functional requirements (FR-004 and FR-005) covering the Auditor's needs.

The existing use case diagram at `docs/use_cases.puml` was authored before the Auditor role existed — it covers only the Project Manager and Team Member actors (UC-001 through UC-003). The diagram now needs to be brought up to date to reflect the full set of requirements. The goal is to extend the existing diagram so that the new requirements are represented, while keeping the existing use cases intact and consistent.

## Output Specification

Update the file `docs/use_cases.puml` so that it reflects all functional requirements in `docs/requirements.md`. The updated diagram should be written as a valid PlantUML file.

Do not delete or renumber any existing use cases. New use cases should continue the existing UC identifier sequence without gaps or duplicates.
