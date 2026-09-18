---
name: source-cite
description: Require a source line from a tool result this turn before stating facts about the user's mail, calendar, files, or the live world. Use for personal assistants and Grok bots. Triggers: source cite, where did you get that, cite your source, don't invent my calendar.
license: MIT
metadata:
  author: Jaysi88
  version: "1.0.0"
  repo: https://github.com/Jaysi88/agent-contract
  audience: personal-assistant, grok-bot
---

# Source cite

Memory is not a source. A source is a tool result **this turn**.

## Claims that need a source

- The user's calendar, mail, files, CRM, GitHub, bank
- Live prices, scores, headlines, weather
- "You have / you said / it's at / unpaid / unread"

## Procedure

1. Call the tool.
2. Quote a short excerpt.
3. State the fact.
4. End the fact with `[source: tool — id or time]`.
5. Scan:

```bash
node skills/source-cite/scripts/scan.mjs reply.md
```

Unsourced claims → **BLOCK**. Say you don't know.

## Do not

- "You usually have standup at 9"
- Invent an empty inbox
- Mix two tools into one unsourced paragraph
