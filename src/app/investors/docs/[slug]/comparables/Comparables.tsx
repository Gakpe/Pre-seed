"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { AXES, GROUPS, MINAH_POSITION, type Group, type GroupId, type Player } from "@/lib/comparables";

// Matrice des comparables : deux axes, trois groupes, Minah seule dans le
// quadrant on-chain Afrique. Survoler un groupe (dans la matrice ou dans la
// colonne de droite) le met en avant et déplie ses caractéristiques ; les deux
// autres s'estompent. Au toucher, un clic fait la même chose.

const copy = {
  fr: { hint: "Choisissez un groupe, ou survolez-le dans la matrice.", all: "Tous les groupes", traits: "Ce qui les caractérise", gaps: "Ce qui leur manque", players: "Acteurs", minahTraits: "Ce que Minah combine", size: "Taille indicative" },
  en: { hint: "Pick a group, or hover it in the matrix.", all: "All groups", traits: "What characterises them", gaps: "What they lack", players: "Players", minahTraits: "What Minah combines", size: "Indicative size" },
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
        style={{ borderColor: on ? GROUP_COLOR[g.id] : "#E27B30", width: "40%", minHeight: "34%" }}
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

  return (
    <div className="mt-8">
      {/* ── Onglets : un par groupe, au-dessus de la matrice ─────────────── */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* ── La matrice, pleine largeur ───────────────────────────────────── */}
      <div className="relative mt-4 aspect-[2/1] rounded-xl border border-foreground/10 bg-white/60">
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-medium text-neutral-500">{AXES.top[l]}</span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-neutral-500">{AXES.bottom[l]}</span>
        <span className="absolute top-1/2 left-2 whitespace-nowrap text-xs font-medium text-neutral-500" style={{ transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "left center", left: 18 }}>{AXES.left[l]}</span>
        <span className="absolute top-1/2 whitespace-nowrap text-xs font-medium text-neutral-500" style={{ transform: "translateY(-50%) rotate(90deg)", transformOrigin: "right center", right: 18 }}>{AXES.right[l]}</span>
        <div className="absolute top-8 bottom-8 left-1/2 w-px bg-foreground/15" />
        <div className="absolute left-10 right-10 top-1/2 h-px bg-foreground/15" />

        {GROUPS.map(cluster)}

        {/* Minah, seule en haut à droite */}
        <div className="absolute top-[14%] right-[14%] flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Minah" className="h-9 w-auto" />
          <span className="rounded-lg bg-brand/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-marsala">on-chain · {AXES.right[l]}</span>
        </div>
      </div>

      {/* ── Sous la matrice : le positionnement, puis les trois groupes ─── */}
      <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_3fr]">
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

        <div className="space-y-4">
          {GROUPS.map((g) => {
            const on = shown === g.id;
            return (
              <div
                key={g.id}
                onMouseEnter={() => setActive(g.id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setPinned((p) => (p === g.id ? null : g.id))}
                className={`cursor-pointer rounded-xl border-2 border-dashed bg-white/50 px-5 py-4 transition-all duration-300 ${dim(g.id)} ${on ? "shadow-md" : ""}`}
                style={{ borderColor: on ? GROUP_COLOR[g.id] : "#E6E1D4" }}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-dashed font-mono text-sm font-semibold" style={{ borderColor: GROUP_COLOR[g.id], color: GROUP_COLOR[g.id] }}>{g.id}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{g.title[l]}</h3>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">{g.summary[l]}</p>
                  </div>
                </div>
                <div className={`grid transition-all duration-300 ${on ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-xs font-semibold text-neutral-600">{t.traits}</div>
                        <ul className="mt-1.5 space-y-1 text-sm leading-6 text-neutral-700">{g.traits.map((x) => <li key={x.fr}>{x[l]}</li>)}</ul>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-600">{t.gaps}</div>
                        <ul className="mt-1.5 space-y-1 text-sm leading-6 text-neutral-700">{g.gaps.map((x) => <li key={x.fr}>{x[l]}</li>)}</ul>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-neutral-600">
                      <span className="font-semibold">{t.players} : </span>
                      {g.players.map((p) => p.name + (p.note ? ` (${p.note[l]})` : "")).join(", ")}
                      {g.size && <> · {t.size} {g.size[l]}</>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
