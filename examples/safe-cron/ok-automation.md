# Inbox digest
timezone: Asia/Singapore
idempotency: skip if already succeeded for digest/YYYY-MM-DD
kill switch: max runs 1 per day; stop on STOP CRON
on-failure: do not retry a send; notify instead; fail closed
ask-first: drafts only — never send mail
