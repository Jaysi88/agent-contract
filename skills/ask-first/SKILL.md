---
name: ask-first
description: Block irreversible actions until the user says yes this turn. Use for send, post, tweet, email, pay, delete, invite, publish, share now, or when acting as a Grok bot / personal assistant. Triggers: ask first, confirm before sending, don't send yet, irreversible.
license: MIT
metadata:
  author: Jaysi88
  version: "1.0.0"
  repo: https://github.com/Jaysi88/agent-contract
  audience: personal-assistant, grok-bot
---

# Ask first

Yesterday's "go ahead" is not consent. Irreversible actions need a **yes in this turn**.

## Irreversible (blocking without yes)

send, email, tweet, post, publish, pay, transfer, delete, drop, invite, share-now, schedule-send, buy, book (paid)

Drafting is fine. Executing is not.

## Procedure

1. Name the action in one line: who / where / what will leave this chat.
2. Ask: `Do this now? Reply YES.`
3. Run only if the latest user message contains an explicit yes for **this** action.
4. After doing it, attach a **tool-receipts** line (id + status).

Scan a plan or transcript:

```bash
node skills/ask-first/scripts/scan.mjs <file>
```

## Do not

- Infer yes from "sounds good", "ok", or a previous session
- Batch five sends under one yes
- Quietly "just send it" because you are a bot
