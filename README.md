# Agent Contract

**The constitution every agent, Grok bot, automation, vibe coder, and personal assistant must keep.**

Not a prompt pack. Five installable [Agent Skills](https://agentskills.io/specification) with scanners. If the agent cannot pass the scanner, it does not get to say “done.”

```bash
npx skills add Jaysi88/agent-contract
```

Then say **ask first**, **tool receipts**, **safe cron**, **scope lock**, or **source cite**.

## Use cases (when a stranger actually needs this)

**Personal assistant** — “Email the investor list.” The bot drafts. It does **not** hit send until you type YES this turn (`ask-first`). After send, it must paste a message id (`tool-receipts`). If it says “you have a meeting at 3,” that line needs `[source: calendar — evt …]` from a tool call this turn (`source-cite`). Memory is not a calendar.

**Grok bot** — A public bot that can post, email, or book. Same gates: no irreversible action without yes, no “I posted it” without a Buffer/X/GitHub id, no invented inbox.

**Automation / Grok Automations** — “Every morning, summarize mail and reply.” Without timezone, a lock, a max-runs kill switch, and fail-closed, it double-sends and never stops (`safe-cron`). Drafts only unless ask-first is in the prompt.

**Vibe coding** — “Change the hero button to Start.” The agent adds login, Prisma, and dark mode. `scope-lock` diffs `asked.txt` vs `changed.txt` and blocks the extra product.

**Agents (any platform)** — Claude Code, Cursor, Codex, Copilot, Gemini, Grok. Install once. The agent follows the matching `SKILL.md` when those triggers fire.

## Why this exists

Ghost Check catches phantom **code**. This pack catches phantom **behavior**:

| Audience | Skill | The lie |
| --- | --- | --- |
| Personal assistant / Grok bot | **ask-first** | “I sent it.” You never said yes this turn. |
| Agents / Grok bot | **tool-receipts** | “I emailed them / posted / created the event.” No id. |
| Automation | **safe-cron** | A repeating job with no timezone, no lock, no kill switch. |
| Vibe coding | **scope-lock** | You asked for a button. It added auth, a database, and dark mode. |
| Personal assistant | **source-cite** | “You have a meeting at 3.” It did not read the calendar. |

## The five

### 1/ Ask First — personal assistant, Grok bot

Irreversible actions (send, post, pay, delete, invite, publish) need an explicit **yes this turn**. Yesterday’s “sure” does not count.

```bash
node skills/ask-first/scripts/scan.mjs examples/ask-first/bad-send.md   # BLOCK
node skills/ask-first/scripts/scan.mjs examples/ask-first/ok-send.md    # PASS
```

### 2/ Tool Receipts — agents, Grok bot

A tool that was “run” without an id, status, and timestamp did not run. Paste the receipt or do not claim it.

```bash
node skills/tool-receipts/scripts/scan.mjs examples/tool-receipts/fake.json  # BLOCK
node skills/tool-receipts/scripts/scan.mjs examples/tool-receipts/ok.json    # PASS
```

### 3/ Safe Cron — automation, Grok Automations

Repeating jobs fail closed. Timezone, idempotency key, max runs, and an on-failure path are required or the job does not ship.

```bash
node skills/safe-cron/scripts/scan.mjs examples/safe-cron/bad-automation.md  # HOLES
node skills/safe-cron/scripts/scan.mjs examples/safe-cron/ok-automation.md   # PASS
```

### 4/ Scope Lock — vibe coding

The diff may only touch what the user asked. Extra product (auth, DB, rewrite, new pages) is a block, not a gift.

```bash
node skills/scope-lock/scripts/scan.mjs examples/scope-lock     # CREEP
node skills/scope-lock/scripts/scan.mjs examples/scope-lock-ok  # PASS
```

### 5/ Source Cite — personal assistant, Grok

Facts about the user’s mail, calendar, files, or the live world need a source line from a tool result this turn. Memory is not a source.

```bash
node skills/source-cite/scripts/scan.mjs examples/source-cite/unsourced.md  # UNSOURCED
node skills/source-cite/scripts/scan.mjs examples/source-cite/ok.md         # PASS
```

## How it fits the rest of the pack

- Claims about **code** → [ghost-check](https://github.com/Jaysi88/ghost-check)
- Claims about **HTTP APIs** → [api-alive](https://github.com/Jaysi88/api-alive)
- Claims about **git** → [no-secrets](https://github.com/Jaysi88/no-secrets) + [merge-receipts](https://github.com/Jaysi88/merge-receipts)
- Claims about **copy** → [deslop](https://github.com/Jaysi88/deslop)
- Claims about **behavior** → this repo

## License

[MIT](./LICENSE) © Jay Si Thu Tun ([Jaysi88](https://github.com/Jaysi88))
