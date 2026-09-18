#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const file = resolve(args.find((a) => !a.startsWith("--")) ?? "receipts.json");
const NEED = ["tool", "id", "status", "at", "excerpt"];
const FAKE = /^(msg_?123|evt_?abc|id_?1|todo|xxx|changeme)$/i;

if (!existsSync(file)) {
  console.error("missing receipt file");
  process.exit(2);
}
let data;
try { data = JSON.parse(readFileSync(file, "utf8")); }
catch { console.error("not JSON"); process.exit(2); }

const rows = Array.isArray(data) ? data : [data];
const holes = [];
rows.forEach((row, i) => {
  for (const k of NEED) {
    if (!row[k] || String(row[k]).trim() === "") holes.push({ i, why: `missing ${k}` });
  }
  if (row.id && FAKE.test(String(row.id))) holes.push({ i, why: `fake-looking id: ${row.id}` });
  if (row.at && Number.isNaN(Date.parse(row.at))) holes.push({ i, why: "at is not an ISO date" });
  if (row.status && /probably|later|sure|okish/i.test(String(row.status))) {
    holes.push({ i, why: "status is a vibe, not a code" });
  }
});

if (jsonMode) process.stdout.write(JSON.stringify({ holes }, null, 2) + "\n");
else {
  console.log("## Tool receipts");
  console.log(`- Status: ${holes.length ? "BLOCK" : "PASS"}`);
  console.log(`- Receipts: ${rows.length}`);
  for (const h of holes) console.log(`- [${h.i}] ${h.why}`);
}
process.exit(holes.length ? 1 : 0);
