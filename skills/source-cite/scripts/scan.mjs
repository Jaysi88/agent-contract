#!/usr/bin/env node
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const target = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const CLAIM =
  /\b(you have|you said|your (?:calendar|inbox|email|meeting|flight|balance)|unread|unpaid|it's at|meeting at|price is|currently)\b/i;
const SOURCE = /\[source:\s*[^\]]+\]/i;

function files(p) {
  if (!existsSync(p)) return [];
  if (statSync(p).isFile()) return [p];
  return readdirSync(p, { withFileTypes: true }).flatMap((e) => {
    const q = join(p, e.name);
    return e.isDirectory() ? files(q) : /\.(md|txt)$/i.test(e.name) ? [q] : [];
  });
}

const hits = [];
for (const file of files(target)) {
  const body = readFileSync(file, "utf8");
  body.split("\n").forEach((line, i) => {
    if (CLAIM.test(line) && !SOURCE.test(line)) {
      hits.push({ file, line: i + 1, claim: line.trim().slice(0, 120) });
    }
  });
}

if (jsonMode) process.stdout.write(JSON.stringify({ hits }, null, 2) + "\n");
else {
  console.log("## Source cite");
  console.log(`- Status: ${hits.length ? "UNSOURCED" : "PASS"}`);
  for (const h of hits) console.log(`- ${h.file}:${h.line}  ${h.claim}`);
}
process.exit(hits.length ? 1 : 0);
