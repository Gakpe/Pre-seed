"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { AXES, GROUPS, MINAH_POSITION, type Group, type GroupId, type Player } from "@/lib/comparables";

// Matrice des comparables : deux axes, trois groupes, Minah seule dans le
// quadrant on-chain Afrique. Survoler un groupe (dans la matrice ou dans la
// colonne de droite) le met en avant et déplie ses caractéristiques ; les deux
// autres s'estompent. Au toucher, un clic fait la même chose.

const copy = {
  fr: { hint: "Cliquez un groupe pour lire ce qui le caractérise.", all: "Tous les groupes", close: "Fermer", traits: "Ce qui les caractérise", gaps: "Ce qui leur manque", players: "Acteurs", minahTraits: "Ce que Minah combine", size: "Taille indicative" },
  en: { hint: "Click a group to read what characterises it.", all: "All groups", close: "Close", traits: "What characterises them", gaps: "What they lack", players: "Players", minahTraits: "What Minah combines", size: "Indicative size" },
};

const GROUP_COLOR: Record<GroupId, string> = { A: "#8A2620", B: "#E27B30", C: "#C9A227" };

function Logo({ p }: { p: Player }) {
  const [broken, setBroken] = useState(false);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-foreground/10 bg-white/80 px-2 py-1 text-xs font-medium text-foreground">
      {p.logo && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.logo} alt="" onError={() => setBroken(true)} className="h-4 w-4 object-contain" />
      ) : null}
      {p.name}
    </span>
  );
}

export function Comparables({ locale }: { locale: Locale }) {
  const l = locale === "en" ? "en" : "fr";
  const t = copy[l];
  const [active, setActive] = useState<GroupId | null>(null);
  const [pinned, setPinned] = useState<GroupId | null>(null);
  const shown = active ?? pinned;
  const dim = (id: GroupId) => (shown !== null && shown !== id ? "opacity-35" : "opacity-100");

  const cluster = (g: Group) => {
    const on = shown === g.id;
    return (
      <div
        key={g.id}
        onMouseEnter={() => setActive(g.id)}
        onMouseLeave={() => setActive(null)}
        onClick={() => setPinned((p) => (p === g.id ? null : g.id))}
        className={`absolute cursor-pointer rounded-[48%] border-2 border-dashed p-5 transition-all duration-300 ${dim(g.id)} ${
          g.quadrant.onChain ? "top-[8%]" : "bottom-[8%]"
        } ${g.quadrant.africa ? "right-[6%]" : "left-[6%]"} ${on ? "bg-white/70 shadow-lg" : "bg-white/30"}`}
        style={{ borderColor: on ? GROUP_COLOR[g.id] : "#E27B30", width: "42%", minHeight: "36%" }}
      >
        <span
          className="absolute -top-3 -left-3 grid h-9 w-9 place-items-center rounded-full border-2 border-dashed bg-background font-mono text-sm font-semibold"
          style={{ borderColor: GROUP_COLOR[g.id], color: GROUP_COLOR[g.id] }}
        >
          {g.id}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {g.players.map((p) => <Logo key={p.name} p={p} />)}
        </div>
        {g.size && <div className="mt-3 text-sm italic text-neutral-600">{g.size[l]}</div>}
      </div>
    );
  };

  const detail = pinned ? GROUPS.find((g) => g.id === pinned)! : null;

  return (
    <div className="mt-8">
      {/* ── Onglets, compacts, au-dessus de la matrice ───────────────────── */}
      <div className="flex flex-wrap items-center gap-2 lg:-ml-6">
        <button
          type="button"
          onClick={() => setPinned(null)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${pinned === null ? "border-foreground bg-foreground text-background" : "border-foreground/15 text-neutral-600 hover:border-foreground/40"}`}
        >
          {t.all}
        </button>
        {GROUPS.map((g) => {
          const on = pinned === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setPinned(on ? null : g.id)}
              onMouseEnter={() => setActive(g.id)}
              onMouseLeave={() => setActive(null)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${on ? "bg-white shadow-sm" : "border-foreground/15 text-neutral-600 hover:border-foreground/40"}`}
              style={on ? { borderColor: GROUP_COLOR[g.id], color: GROUP_COLOR[g.id] } : undefined}
            >
              <span className="grid h-5 w-5 place-items-center rounded-full border border-dashed font-mono text-[11px] font-semibold" style={{ borderColor: GROUP_COLOR[g.id], color: GROUP_COLOR[g.id] }}>{g.id}</span>
              {g.title[l]}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-neutral-500">{t.hint}</span>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[5fr_3fr]">
        {/* ── La matrice, large, qui déborde un peu à gauche ─────────────── */}
        <div className="relative aspect-[4/3] rounded-xl border border-foreground/10 bg-white/60 lg:-ml-6">
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-medium text-neutral-500">{AXES.top[l]}</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-neutral-500">{AXES.bottom[l]}</span>
          <span className="absolute top-1/2 whitespace-nowrap text-xs font-medium text-neutral-500" style={{ transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "left center", left: 16 }}>{AXES.left[l]}</span>
          <span className="absolute top-1/2 whitespace-nowrap text-xs font-medium text-neutral-500" style={{ transform: "translateY(-50%) rotate(90deg)", transformOrigin: "right center", right: 16 }}>{AXES.right[l]}</span>
          <div className="absolute top-8 bottom-8 left-1/2 w-px bg-foreground/15" />
          <div className="absolute left-9 right-9 top-1/2 h-px bg-foreground/15" />

          {GROUPS.map(cluster)}

          <div className="absolute top-[12%] right-[12%] flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt="Minah" className="h-10 w-auto" />
            <span className="rounded-lg bg-brand/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-marsala">on-chain · {AXES.right[l]}</span>
          </div>
        </div>

        {/* ── À droite : le positionnement, et le détail du groupe choisi ── */}
        <div className="space-y-4">
          <div className="rounded-xl bg-foreground px-6 py-6 text-background">
            <h2 className="text-sm font-semibold text-brand">{MINAH_POSITION.title[l]}</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-background/85">
              {MINAH_POSITION.lines.map((line, i) => <li key={i}>{line[l]}</li>)}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {MINAH_POSITION.traits.map((tr) => (
                <span key={tr.fr} className="rounded-md border border-background/20 px-2 py-1 text-xs text-background">{tr[l]}</span>
              ))}
            </div>
          </div>

          {detail ? (
            // key sur le groupe : l'entrée par la gauche rejoue à chaque choix.
            <div key={detail.id} className="slide-in-left rounded-xl border-2 border-dashed bg-white/60 px-5 py-4" style={{ borderColor: GROUP_COLOR[detail.id] }}>
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-dashed font-mono text-sm font-semibold" style={{ borderColor: GROUP_COLOR[detail.id], color: GROUP_COLOR[detail.id] }}>{detail.id}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold">{detail.title[l]}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-700">{detail.summary[l]}</p>
                </div>
                <button type="button" onClick={() => setPinned(null)} className="shrink-0 text-xs text-neutral-500 hover:underline">{t.close}</button>
              </div>
              <div className="mt-4 grid gap-4">
                <div>
                  <div className="text-xs font-semibold text-neutral-600">{t.traits}</div>
                  <ul className="mt-1.5 space-y-1 text-sm leading-6 text-neutral-700">{detail.traits.map((x) => <li key={x.fr}>{x[l]}</li>)}</ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-600">{t.gaps}</div>
                  <ul className="mt-1.5 space-y-1 text-sm leading-6 text-neutral-700">{detail.gaps.map((x) => <li key={x.fr}>{x[l]}</li>)}</ul>
                </div>
                <div className="text-xs text-neutral-600">
                  <span className="font-semibold">{t.players} : </span>
                  {detail.players.map((p) => p.name + (p.note ? ` (${p.note[l]})` : "")).join(", ")}
                  {detail.size && <> · {t.size} {detail.size[l]}</>}
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-foreground/15 px-5 py-6 text-center text-sm text-neutral-500">{t.hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
