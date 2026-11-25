// Synchronise la cap table interactive entre la base et une copie de travail locale.
//
// Le HTML de la cap table (moteur, textes, hypothèses) n'est pas dans le dépôt, qui est public :
// il vit dans app_settings, clé `captable_html`. On le modifie dans `.private/captable.html`
// (ignoré par git ; `next dev` le sert en priorité), puis on le publie.
//
//   node scripts/captable.mjs pull     base → .private/captable.html
//   node scripts/captable.mjs push     .private/captable.html → base (en ligne aussitôt)
//   node scripts/captable.mjs status   compare les deux, sans rien écrire
//
// La base est la production : `push` met la fiche à jour pour toutes les personnes qui y ont accès.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const REF = "nuzklwegigoykemeznzw"; // projet Pre-seed, le seul autorisé (AGENTS.md)
const KEY = "captable_html";
const root = path.resolve(import.meta.dirname, "..");
const local = path.join(root, ".private", "captable.html");

const env = Object.fromEntries(
  readFileSync(path.join(root, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")])
);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
if (!url?.includes(REF)) throw new Error("Ce script n'écrit que dans le projet Pre-seed : arrêt.");
const headers = {
  apikey: env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};
const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 12);

async function remote() {
  const res = await fetch(`${url}/rest/v1/app_settings?key=eq.${KEY}&select=value,updated_at`, { headers });
  if (!res.ok) throw new Error(`lecture : ${res.status}`);
  const [row] = await res.json();
  return row ? { html: row.value?.html ?? "", updatedAt: row.updated_at } : null;
}

const cmd = process.argv[2];
const inBase = await remote();
const onDisk = existsSync(local) ? readFileSync(local, "utf8") : null;

if (cmd === "status") {
  console.log("base  :", inBase ? `${inBase.html.length} caractères, ${sha(inBase.html)}, du ${inBase.updatedAt}` : "absente");
  console.log("local :", onDisk === null ? "absent" : `${onDisk.length} caractères, ${sha(onDisk)}`);
  console.log(inBase && onDisk !== null && inBase.html === onDisk ? "identiques" : "différents");
} else if (cmd === "pull") {
  if (!inBase) throw new Error("Rien en base.");
  mkdirSync(path.dirname(local), { recursive: true });
  writeFileSync(local, inBase.html);
  console.log(`écrit : .private/captable.html (${inBase.html.length} caractères, ${sha(inBase.html)})`);
} else if (cmd === "push") {
  if (onDisk === null) throw new Error("Pas de copie locale : .private/captable.html");
  if (!onDisk.includes("<!doctype html>") || !onDisk.includes("interne:début")) {
    throw new Error("Le fichier local ne ressemble pas à la cap table : rien écrit.");
  }
  const res = await fetch(`${url}/rest/v1/app_settings?on_conflict=key`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key: KEY, value: { html: onDisk }, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`écriture : ${res.status} ${await res.text()}`);
  console.log(
    `publié : ${onDisk.length} caractères, ${sha(onDisk)}${inBase ? ` (remplace ${sha(inBase.html)})` : " (première publication)"}`
  );
} else {
  console.log("usage : node scripts/captable.mjs pull | push | status");
  process.exit(1);
}
