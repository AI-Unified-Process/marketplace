<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Layer of vaadin-e2e-test

The row of the layer catalog this skill describes. `/stack` finds this file with a glob for
`**/*/references/layer.md`, so an installed layer skill is known without a row in `aiup-core`: it reads the Detect
column to recognise the technology in an existing project and the Tests run column to decide the integration
layer. Keep this row and the Plugins table of the layer catalog in `aiup-core` in step;
`scripts/check-layer-catalog.sh` checks both.

| Plugin | Layer | Skill | Test skill | Tests run | Detect in an existing project |
|--------|-------|-------|------------|-----------|-------------------------------|
| `aiup-vaadin` | E2E | – | `vaadin-e2e-test` | running application | `org.vaadin.addons:dramafinder` or `com.microsoft.playwright:playwright` with a Vaadin UI |
