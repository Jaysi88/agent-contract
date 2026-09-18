---
name: safe-cron
description: Require timezone, idempotency, max runs, and a failure path before shipping a repeating job or Grok Automation. Use when scheduling, cron, every morning, on email, or automations. Triggers: safe cron, automation, scheduled, don't double-send, kill switch.
license: MIT
metadata:
  author: Jaysi88
  version: "1.0.0"
  repo: https://github.com/Jaysi88/agent-contract
  audience: automation, grok-bot
---

# Safe cron

A repeating job without a lock will email twice. A job without a kill switch will email forever.

## Required in the automation prompt

| Gate | Example |
| --- | --- |
| timezone | `Asia/Singapore` (IANA). Never "morning." |
| idempotency | skip if the same `key` already succeeded today |
| max runs | stop after N, or on the phrase `STOP CRON` |
| on-failure | do **not** retry a send; notify instead |
| ask-first | irreversible actions still need a human path |

## Procedure

```bash
node skills/safe-cron/scripts/scan.mjs automation.md
```

Status **HOLES** → do not create the automation.

## Do not

- "Every hour, summarize inbox and reply"
- Retry sends on timeout
- Assume the host timezone
