#!/usr/bin/env node
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const target = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const IRREV =
  /\b(send(?:ing)?|email(?:ed|ing)?|tweet(?:ed|ing)?|post(?:ed|ing)?\b|publish(?:ed|ing)?|pay(?:ing|ment)|transfer(?:red)?|delete(?:d)?|drop table|invite(?:d)?|share now|buy|booked|wire|charge)\b/i;
const YES = /\b(yes(?:\s*,?\s*do(?:\s+it)?(?:\s+now)?)?|confirmed|user confirmed|do it now)\b/i;

function files(p) {
  if (!existsSync(p)) return [];
  if (statSync(p).isFile()) return [p];
  return readdirSync(p, { withFileTypes: true }).flatMap((e) => {
    const q = join(p, e.name);
    if (e.isDirectory()) return files(q);
    if (/\.(md|txt|json)$/i.test(e.name)) return [q];
    return [];
  });
}

const hits = [];
for (const file of files(target)) {
  const body = readFileSync(file, "utf8");
  const confirmed = YES.test(body);
  body.split("\n").forEach((line, i) => {
    if (IRREV.test(line) && !confirmed) {
      hits.push({ file, line: i + 1, claim: line.trim().slice(0, 100), why: "irreversible verb without YES this turn" });
    }
  });
}

if (jsonMode) process.stdout.write(JSON.stringify({ hits }, null, 2) + "\n");
else {
  console.log("## Ask first");
  console.log(`- Status: ${hits.length ? "BLOCK" : "PASS"}`);
  for (const h of hits) console.log(`- ${h.file}:${h.line}  ${h.claim}\n  ${h.why}`);
}
process.exit(hits.length ? 1 : 0);
