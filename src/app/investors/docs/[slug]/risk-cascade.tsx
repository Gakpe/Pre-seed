"use client";

import { useState } from "react";
import { AXIS_CAPTION, RISK_LEVELS, type RiskLevel } from "@/lib/risk-levels";
import type { Locale } from "@/lib/i18n";

// Décalage horizontal d'un niveau au suivant. C'est le signal visuel principal
// de la page : la cascade doit se lire sans lire le texte.
const STEP = 36;

// Libellés propres au composant (les données de risque vivent dans risk-levels).
// Le chapô de la fiche vit ici et non en base (08/10/2026) : la base est la
// production, un texte modifié y part en ligne aussitôt. Celui de la base
// reste en place, simplement plus affiché.
const copy = {
  fr: {
    lead: [
      "Tout repose sur notre capacité à structurer des stratégies : des produits financiers qui diversifient le risque et s'adaptent aux réalités économiques et conjoncturelles de chaque région. Cette structuration, nous la portons dans une infrastructure technologique que notre plateforme rend liquide : c'est là que se trouve notre edge.",
      "Chaque structuration a donc sa propre cascade de gestion du risque. Ci-dessous, celle de l'opportunité Kupanda, qui sera adaptée à chacune de nos stratégies.",
    ],
    colLevel: "Niveau",
    colTrigger: "Déclencheur",
    colProtection: "Protection",
    axisTop: "Sous-jacent",
    axisSide: "Niveaux de risque couverts",
    axisBottom: "Émetteur",
    levelWord: "Niveau",
  },
  en: {
    lead: [
      "Everything rests on our ability to structure strategies: financial products that diversify risk and adapt to the economic and cyclical realities of each region. We carry this structuring in a technology infrastructure that our platform makes liquid: that is where our edge lies.",
      "Each structure therefore has its own risk management cascade. Below is the one for the Kupanda opportunity, which will be adapted to each of our strategies.",
    ],
    colLevel: "Level",
    colTrigger: "Trigger",
    colProtection: "Protection",
    axisTop: "Underlying",
    axisSide: "Risk levels covered",
    axisBottom: "Issuer",
    levelWord: "Level",
  },
} as const;

export function RiskCascade({ locale }: { locale: Locale }) {
  const c = copy[locale];
  // Ligne survolée ou focalisée, met les autres en retrait.
  const [active, setActive] = useState<number | null>(null);

  // Une ligne s'efface quand une autre est mise en avant.
  function dim(i: number): boolean {
    return active !== null && active !== i;
  }

  return (
    <section className="mt-8">
      <div className="max-w-3xl space-y-4 text-[15px] leading-[1.8] text-neutral-700">
        {c.lead.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <p className="mt-10 text-xs leading-5 text-neutral-400">{AXIS_CAPTION[locale]}</p>

      {/* en-têtes de colonnes, filets et point terminal */}
      <div className="mt-6 hidden lg:flex lg:pl-14">
        <ColumnHead label={c.colLevel} className="w-[30%]" />
        <ColumnHead label={c.colTrigger} className="w-[28%]" />
        <ColumnHead label={c.colProtection} className="w-[42%]" />
      </div>

      <div className="mt-4 flex">
        <VerticalAxis locale={locale} />

        <div className="relative flex-1">
          {RISK_LEVELS.map((level, i) => (
            <div key={level.id}>
              <Row
                level={level}
                index={i}
                locale={locale}
                dimmed={dim(i)}
                focused={active === i}
                onEnter={() => setActive(i)}
                onLeave={() => setActive(null)}
              />
              {i < RISK_LEVELS.length - 1 && (
                <div
                  aria-hidden
                  className="hidden h-5 rounded-bl-lg border-b border-l border-risk-border lg:block"
                  style={{ marginLeft: i * STEP + 16, width: STEP }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Les notes des exposants posés sur les protections. */}
      <ol className="mt-10 space-y-1 border-t border-risk-border pt-4 text-[11px] leading-5 text-neutral-600">
        {RISK_LEVELS.filter((l) => l.footnote).map((l, n) => (
          <li key={l.id}>
            {n + 1}) {l.footnote?.[locale]}
          </li>
        ))}
      </ol>
    </section>
  );
}

function ColumnHead({ label, className }: { label: string; className: string }) {
  return (
    <div className={`${className} pr-6`}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-risk-critical">
          {label}
        </span>
        <span className="h-px flex-1 bg-risk-rule/40" />
        <span className="h-1 w-1 rounded-full bg-risk-rule" />
      </div>
    </div>
  );
}

// Flèche verticale du sous-jacent vers l'émetteur, avec le label pivoté.
function VerticalAxis({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <div className="relative hidden w-14 shrink-0 lg:block" aria-hidden>
      <span className="absolute left-0 top-0 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
        {c.axisTop}
      </span>
      <div className="absolute bottom-8 left-[6px] top-8 w-px bg-risk-border" />
      <svg
        className="absolute bottom-5 left-[2px]"
        width="9"
        height="8"
        viewBox="0 0 9 8"
        fill="none"
      >
        <path d="M1 1l3.5 5L8 1" stroke="var(--risk-border)" strokeWidth="1.2" />
      </svg>
      <span
        className="absolute left-4 top-1/2 origin-center -translate-y-1/2 rotate-180 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400"
        style={{ writingMode: "vertical-rl" }}
      >
        {c.axisSide}
      </span>
      <span className="absolute bottom-0 left-0 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
        {c.axisBottom}
      </span>
    </div>
  );
}

type RowProps = {
  level: RiskLevel;
  index: number;
  locale: Locale;
  dimmed: boolean;
  focused: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

function Row({
  level,
  index,
  locale,
  dimmed,
  focused,
  onEnter,
  onLeave,
}: RowProps) {
  const c = copy[locale];
  // Le niveau 4 est le seul en orange plein : c'est notre propre bilan qui
  // absorbe, cela doit se voir. Les niveaux 1 à 3 ne se distinguent pas entre eux.
  const critical = level.index === 4;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative rounded-lg border p-4 pl-6 transition-all duration-150 lg:pl-3 lg:flex lg:p-3 ${
        focused
          ? "border-[1.5px] border-risk-critical bg-risk-surface"
          : "border-transparent"
      } ${dimmed ? "opacity-55" : "opacity-100"}`}
    >
      {/* En mobile, le décalage horizontal est remplacé par un rail dont
          l'épaisseur augmente à chaque niveau. */}
      <span
        aria-hidden
        style={{ width: 2 + index * 2 }}
        className="absolute bottom-2 left-0 top-2 rounded bg-risk-border lg:hidden"
      />

      {/* colonne 1, le niveau, décalé d'un cran par rapport au précédent */}
      <div className="lg:w-[30%] lg:pr-6">
        <div
          style={{ "--indent": `${index * STEP}px` } as React.CSSProperties}
          className={`rounded-md px-4 py-3 lg:ml-[var(--indent)] ${
            critical ? "bg-risk-critical text-white" : "bg-risk-ink text-white"
          }`}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] opacity-70">
            {c.levelWord} {level.index}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug">
            {level.name[locale]}
          </p>
        </div>
      </div>

      {/* colonne 2, le déclencheur */}
      <div className="mt-4 lg:mt-0 lg:w-[28%] lg:pr-6">
        <p className="text-[13px] leading-[1.6] text-neutral-700 lg:hyphens-auto lg:text-justify">
          <strong className="font-semibold text-foreground">
            {level.trigger.lead[locale]}
          </strong>{" "}
          {level.trigger.body[locale]}
        </p>
      </div>

      {/* colonne 3, la protection */}
      <div className="mt-4 lg:mt-0 lg:w-[42%]">
        <div className="rounded-md border border-risk-border bg-white/60">
          <p className="rounded-t-md bg-risk-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-risk-ink">
            {level.protection.name[locale]}
            {level.footnote && (
              <sup className="ml-1 font-normal tracking-normal opacity-60">
                {level.index}
              </sup>
            )}
          </p>
          <div className="px-4 py-3">
            <p className="text-[13px] leading-[1.6] text-neutral-700 lg:hyphens-auto lg:text-justify">
              {level.protection.body[locale]}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
