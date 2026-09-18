---
name: tool-receipts
description: Require a tool receipt (id, status, timestamp, excerpt) before claiming email sent, calendar created, tweet posted, GitHub issue opened, or a fetch succeeded. Use for Grok bots, agents, and automations. Triggers: tool receipts, prove you sent it, receipt, did the tool run.
license: MIT
metadata:
  author: Jaysi88
  version: "1.0.0"
  repo: https://github.com/Jaysi88/agent-contract
  audience: agents, grok-bot
---

# Tool receipts

"I sent it" is not a receipt. A receipt is an id the other system would recognize.

## Required fields

| Field | Passes when |
| --- | --- |
| tool | real tool name (`gmail.send`, `buffer.create_post`, `fetch`, ...) |
| id | non-empty id from that system |
| status | `ok` / `sent` / HTTP code — not `probably` |
| at | ISO timestamp from this turn |
| excerpt | one-line tail of the real response (no secret values) |

## Procedure

1. Run the tool.
2. Write a receipt JSON (or the same fields in chat).
3. Scan:

```bash
node skills/tool-receipts/scripts/scan.mjs receipts.json
```

4. If scan fails, you did not do the thing. Say so.

## Do not

- Invent an id (`msg_123`, `evt_abc`)
- Cite a previous session
- Collapse five tool calls into one vibes line
