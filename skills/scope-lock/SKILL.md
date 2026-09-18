---
name: scope-lock
description: Block vibe-coding scope creep. The diff may only touch what the user asked. Use when the agent adds auth, a database, extra pages, refactors, or dark mode without being asked. Triggers: scope lock, stay on the ticket, don't expand, too much, I only asked for.
license: MIT
metadata:
  author: Jaysi88
  version: "1.0.0"
  repo: https://github.com/Jaysi88/agent-contract
  audience: vibe-coding, agents
---

# Scope lock

A gift feature is still a bug if they did not ask.

## Procedure

1. Write `asked.txt` — one sentence, their words.
2. Write `changed.txt` — one path per line you touched (or will touch).
3. Scan:

```bash
node skills/scope-lock/scripts/scan.mjs .
```

Extra paths matching auth, db, billing, rewrite, new app shells → **BLOCK**.

## Allowed without asking

Bugfix in the same file. Tests for the asked change. Lint that the asked change requires.

## Do not

- "While I was here I added login"
- Scaffold a new stack when they asked to change copy
