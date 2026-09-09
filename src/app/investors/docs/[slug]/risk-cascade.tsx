"use client";

import { useRef, useState } from "react";
import { AXIS_CAPTION, RISK_LEVELS, type RiskLevel } from "@/lib/risk-levels";

// Décalage horizontal d'un niveau au suivant. C'est le signal visuel principal
// de la page : la cascade doit se lire sans lire le texte.
const STEP = 36;
const TOKEN = 14;

type Token = { index: number; x: number; y: number };

export function RiskCascade() {
  // Ligne survolée ou focalisée — met les autres en retrait.
  const [active, setActive] = useState<number | null>(null);
  // Niveau où la perte simulée a été absorbée.
  const [absorbed, setAbsorbed] = useState<number | null>(null);
  const [token, setToken] = useState<Token | null>(null);

  const boxRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Position mesurée au clic : pas d'effet, pas de state posé au montage.
  function simulate(i: number) {
    const row = rowRefs.current[i];
    const box = boxRef.current;
    setAbsorbed(i);
    if (row && box) {
      setToken({
        index: i,
        x: i * STEP,
        y: row.offsetTop + 28,
      });
    }
  }

  function reset() {
    setAbsorbed(null);
    setToken(null);
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = e.key === "ArrowDown" ? i + 1 : i - 1;
      rowRefs.current[next]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      simulate(i);
    }
  }

  // Une ligne s'efface si une autre est mise en avant, ou si la perte simulée
  // s'est arrêtée avant elle — montrer qu'elle n'a jamais été sollicitée.
  function dim(i: number): boolean {
    if (absorbed !== null) return i > absorbed;
    return active !== null && active !== i;
  }

  return (
    <section className="mt-10">
      <p className="text-xs leading-5 text-neutral-400">{AXIS_CAPTION}</p>

      {/* en-têtes de colonnes, filets et point terminal */}
      <div className="mt-6 hidden lg:flex lg:pl-14">
        <ColumnHead label="Niveau" className="w-[30%]" />
        <ColumnHead label="Déclencheur" className="w-[28%]" />
        <ColumnHead label="Protection" className="w-[42%]" />
      </div>

      <div className="mt-4 flex">
        <VerticalAxis />

        <div ref={boxRef} className="relative flex-1">
          {/* jeton : apparaît en haut de la cascade et descend au niveau visé */}
          {token && (
            <>
              <span
                key={`d${token.index}`}
                aria-hidden
                className="token-drop absolute left-0 top-0 z-20 hidden rounded-full bg-risk-critical shadow-md lg:block"
                style={
                  {
                    width: TOKEN,
                    height: TOKEN,
                    "--token-x": `${token.x}px`,
                    "--token-y": `${token.y}px`,
                  } as React.CSSProperties
                }
              />
              {/* en mobile le jeton descend le long du rail, sans décalage */}
              <span
                key={`m${token.index}`}
                aria-hidden
                className="token-drop absolute -left-1 top-0 z-20 rounded-full bg-risk-critical shadow-md lg:hidden"
                style={
                  {
                    width: TOKEN,
                    height: TOKEN,
                    "--token-x": "0px",
                    "--token-y": `${token.y}px`,
                  } as React.CSSProperties
                }
              />
            </>
          )}

          {RISK_LEVELS.map((level, i) => (
            <div key={level.id}>
              <Row
                level={level}
                index={i}
                dimmed={dim(i)}
                highlighted={absorbed === i}
                focused={active === i}
                onSimulate={() => simulate(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                onEnter={() => setActive(i)}
                onLeave={() => setActive(null)}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
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

      {absorbed !== null && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={reset}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:border-neutral-400"
          >
            Réinitialiser
          </button>
        </div>
      )}

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
function VerticalAxis() {
  return (
    <div className="relative hidden w-14 shrink-0 lg:block" aria-hidden>
      <span className="absolute left-0 top-0 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
        Sous-jacent
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
        Niveaux de risque couverts
      </span>
      <span className="absolute bottom-0 left-0 text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
        Émetteur
      </span>
    </div>
  );
}

type RowProps = {
  level: RiskLevel;
  index: number;
  dimmed: boolean;
  highlighted: boolean;
  focused: boolean;
  onSimulate: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onEnter: () => void;
  onLeave: () => void;
  ref: (el: HTMLDivElement | null) => void;
};

function Row({
  level,
  index,
  dimmed,
  highlighted,
  focused,
  onSimulate,
  onKeyDown,
  onEnter,
  onLeave,
  ref,
}: RowProps) {
  // Le niveau 4 est le seul en orange plein : c'est notre propre bilan qui
  // absorbe, cela doit se voir. Les niveaux 1 à 3 ne se distinguent pas entre eux.
  const critical = level.index === 4;

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Niveau ${level.index} — ${level.name}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onKeyDown={onKeyDown}
      className={`relative rounded-lg border p-4 pl-6 transition-all duration-150 lg:pl-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-risk-critical focus-visible:ring-offset-2 lg:flex lg:p-3 ${
        focused || highlighted
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

      {/* colonne 1 — le niveau, décalé d'un cran par rapport au précédent */}
      <div className="lg:w-[30%] lg:pr-6">
        <div
          style={{ "--indent": `${index * STEP}px` } as React.CSSProperties}
          className={`rounded-md px-4 py-3 lg:ml-[var(--indent)] ${
            critical ? "bg-risk-critical text-white" : "bg-risk-ink text-white"
          }`}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] opacity-70">
            Niveau {level.index}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug">{level.name}</p>
        </div>
      </div>

      {/* colonne 2 — le déclencheur */}
      <div className="mt-4 lg:mt-0 lg:w-[28%] lg:pr-6">
        <p className="text-[13px] leading-[1.6] text-neutral-700 lg:hyphens-auto lg:text-justify">
          <strong className="font-semibold text-foreground">
            {level.trigger.lead}
          </strong>{" "}
          {level.trigger.body}
        </p>
      </div>

      {/* colonne 3 — la protection */}
      <div className="mt-4 lg:mt-0 lg:w-[42%]">
        <div
          className={`rounded-md border transition-colors ${
            highlighted
              ? "border-risk-ok bg-white"
              : "border-risk-border bg-white/60"
          }`}
        >
          <p className="rounded-t-md bg-risk-soft px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-risk-ink">
            {level.protection.name}
            {level.footnote && (
              <sup className="ml-1 font-normal tracking-normal opacity-60">
                {level.index}
              </sup>
            )}
          </p>
          <div className="px-4 py-3">
            <p className="text-[13px] leading-[1.6] text-neutral-700 lg:hyphens-auto lg:text-justify">
              {level.protection.body}
            </p>
            {level.status && (
              <p className="mt-2 text-[12px] text-neutral-500">
                <span className="font-medium">Statut.</span> {level.status}
              </p>
            )}

            <div aria-live="polite">
              {highlighted && (
                <p className="mt-3 rounded bg-risk-ok/10 px-2.5 py-1.5 text-[12px] font-medium text-risk-ok">
                  Absorbé à ce niveau — impact investisseur : aucun
                </p>
              )}
            </div>

            {!highlighted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulate();
                }}
                className="mt-3 text-[11px] text-neutral-400 underline-offset-2 transition-colors hover:text-risk-critical hover:underline"
              >
                Simuler ce scénario
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
