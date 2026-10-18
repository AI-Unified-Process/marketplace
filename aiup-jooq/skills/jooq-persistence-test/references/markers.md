<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of jooq-persistence-test

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`), exactly as they appear there.

| Layer       | Skill                 | Kind | Marker to grep for                                                                                              |
|-------------|-----------------------|------|-----------------------------------------------------------------------------------------------------------------|
| Persistence | jooq-persistence-test | Test | `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-YYY"}, requirements = {"NFR-XXX"})` on every repository test method           |
| Persistence | jooq-persistence-test | Name | `UC<id><Name>RepositoryTest`, e.g. `UC001RegisterPersonRepositoryTest`; test data in `src/test/resources/db/testdata/R__uc<id>_<slug>.sql` |
