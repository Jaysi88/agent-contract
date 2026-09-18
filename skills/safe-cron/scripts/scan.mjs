#!/usr/bin/env node
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const target = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const GATES = [
  { id: "timezone", re: /\b(?:timezone|tz)\s*[:=]\s*[A-Za-z]+\/[A-Za-z_]+|[A-Z][a-z]+\/[A-Za-z_]+/ },
  { id: "idempotency", re: /idempotenc|skip if already|already (?:ran|sent|succeeded)|dedup|lock key/i },
  { id: "kill", re: /kill switch|max runs?|STOP CRON|stop after/i },
  { id: "on-failure", re: /on[- ]fail|do not retry|notify instead|fail closed/i },
];

function files(p) {
  if (!existsSync(p)) return [];
  if (statSync(p).isFile()) return [p];
  return readdirSync(p, { withFileTypes: true }).flatMap((e) => {
    const q = join(p, e.name);
    return e.isDirectory() ? files(q) : /\.(md|txt)$/i.test(e.name) ? [q] : [];
  });
}

const holes = [];
for (const file of files(target)) {
  const body = readFileSync(file, "utf8");
  for (const g of GATES) {
    if (!g.re.test(body)) holes.push({ file, id: g.id, why: `missing ${g.id}` });
  }
}

if (jsonMode) process.stdout.write(JSON.stringify({ holes }, null, 2) + "\n");
else {
  console.log("## Safe cron");
  console.log(`- Status: ${holes.length ? "HOLES" : "PASS"}`);
  for (const h of holes) console.log(`- [${h.id}] ${h.file}  ${h.why}`);
}
process.exit(holes.length ? 1 : 0);
