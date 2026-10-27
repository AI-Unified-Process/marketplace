<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Transition

The AI Unified Process names four phases, but until #45 no skill belonged to Transition. The artifacts it needs
already existed: use case specifications, test cases, the derived requirement status, and the `**Status:**` line of
every use case. Transition adds three skills that read them.

- **Three skills, not one `/transition`.** The user guide, the acceptance protocol, and the release notes have
  different inputs, outputs, readers, and trigger words. One skill with modes would need a description that covers
  all three within the 1024-character limit and would trigger worse on each; every other core skill owns one
  artifact. Names are full-word nouns like the rest of the core: `/user-guide`, `/acceptance-protocol`,
  `/release-notes`.
- **`Done` finally has an owner.** `Done` means "implemented, tested, and accepted" (#32 made `Tested` already enough
  for `Verified`, leaving `Done` as the manual step after acceptance), yet no skill set it. `/acceptance-protocol
  close` does, as the end of an acceptance round: a use case at `Tested` whose rows all passed and that no blocking
  question holds (`OQ_BLOCKING`) is proposed, and set after the user confirms. A failed row is either a defect or a
  change request; like the coverage agent's drift, the skill names both fixes and lets the stakeholder decide.
  The protocol is a file per round in `docs/acceptance/` because acceptance is a record of what people observed on a
  date, not a property of the specification; it keeps no ids of its own, so the lint needs no new grammar.
- **A use case without a test case still gets a section** (main success scenario, each alternative flow, each rule),
  because otherwise it could never reach `Done`.
- **The user guide is derived and anchored.** Each section it writes carries `<!-- UC-XXX -->`, so a re-run finds and
  rewrites it, and the team's own sections (login, screenshots, support hints) survive. It covers `Tested` and `Done`
  by default because the guide describes what users get; `all` adds `Approved` and `Implemented` for training ahead of
  a release. It never names screens, buttons, or menu paths the specification does not, because the specification is
  written at the business level and a guessed label is worse than none.
- **Hashes in the anchor tell a hand edit from a specification change** (#57). The guide is written by an agent in
  its own words, so a section rewritten from an unchanged specification never matches the old one word for word;
  comparing the guide with a fresh rewrite flagged every section as edited by hand, and a changed specification looked
  the same as a hand edit. The anchor therefore records `spec=` (the use case without its `**Status:**` line, so
  acceptance is no change) and `text=` (the section as written), stamped by `scripts/guide_anchor.py`, never by the
  agent. A section with neither changed stays byte for byte, so a re-run's diff shows only real changes; a changed
  specification is rewritten without asking; only a hand edit asks, and when no one can answer it is kept and reported
  with both ways out — the same rule as drift in the coverage agent. Comparing with a rewrite from the previous
  specification (`git show`) was rejected for the same reason as comparing with a fresh one, and a `spec=` hash alone
  cannot see a hand edit.
- **The plan waits for a yes when someone can answer.** A new guide or a changed set of chapters is shown first and
  written after the confirmation; when no one can answer (a pipeline, a host without a way to ask, a confirmation in
  advance), the plan is written as shown and opens the report — the rule `/entity-model` already follows for its
  clarifying questions.
- **Release notes from the specifications, not the commits.** The maintainers' `scripts/release-notes.sh` turns commit
  subjects into release notes for developers; business readers want what they can do now. A use case that reached
  `Done` since the baseline tag is new; one `Done` at both points whose scenario, flows, rules, or postconditions
  differ is changed; one that became `Obsolete` is removed. Use cases are matched by id, not path, so a move into a
  module folder is no change. Git is used only to read the specifications at the baseline.
- **The Studio runs none of them** (`LEFT_OUT`): acceptance needs people, release notes need a Git baseline the
  Studio's subject id cannot express, and the user guide is a release step rather than a result of a specification
  change.
- The templates (`chapter.md`, `protocol.md`, `release.md`) are copied into the user's project, so they carry no
  copyright header, and `protocol.md` is a project template for the link check, since its links resolve only in
  `docs/acceptance/`.
