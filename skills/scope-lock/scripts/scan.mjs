#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const root = resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const askedPath = join(root, "asked.txt");
const changedPath = join(root, "changed.txt");
if (!existsSync(askedPath) || !existsSync(changedPath)) {
  console.error("need asked.txt and changed.txt");
  process.exit(2);
}
const asked = readFileSync(askedPath, "utf8").toLowerCase();
const changed = readFileSync(changedPath, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const CREEP = [
  { id: "auth", re: /auth|oauth|login|signup|clerk|next-auth/i },
  { id: "db", re: /prisma|drizzle|mongodb|postgres|supabase|neon/i },
  { id: "billing", re: /stripe|billing|checkout|subscription/i },
  { id: "rewrite", re: /rewrite|migrate to|new stack|monorepo/i },
  { id: "theme", re: /dark mode|dark-mode|theme provider|redesign/i },
];
const extra = [];
for (const path of changed) {
  for (const c of CREEP) {
    if (c.re.test(path) && !c.re.test(asked)) extra.push({ path, id: c.id, why: `${c.id} not in asked.txt` });
  }
}
if (jsonMode) process.stdout.write(JSON.stringify({ extra }, null, 2) + "\n");
else {
  console.log("## Scope lock");
  console.log(`- Asked: ${asked.trim().slice(0, 80)}`);
  console.log(`- Status: ${extra.length ? "CREEP" : "PASS"}`);
  for (const e of extra) console.log(`- [${e.id}] ${e.path}  ${e.why}`);
}
process.exit(extra.length ? 1 : 0);
