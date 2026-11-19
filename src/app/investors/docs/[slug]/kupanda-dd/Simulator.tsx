"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ISSUES, maxBondsOf, simulate, type Issue } from "@/lib/kupanda-client";

// Onglet « La simulation » de la due diligence. On choisit l'émission
// (Kupanda 2 par défaut, celle qui recueille les engagements), puis un curseur
// et des boutons fixent le nombre d'obligations ; tout le reste suit : le
// montant reçu s'anime jusqu'à sa nouvelle valeur, la part de l'émission se
// remplit après ce qui est déjà engagé, les trois flux (versement, coupon,
// échéance) se relisent sur la frise. Nominal, minimum, seuil, coupon, paliers
// et plafond sont ceux de l'émission choisie (src/lib/kupanda-client.ts).
//
// Les textes sont ceux de la dataroom Kupanda du front ; seul le coupon y est
// devenu un paramètre (`{coupon}`), Kupanda 2 étant à 18 %. Le bouton
// « Commit » du front n'est pas repris : le portail garde son propre parcours
// d'intérêt.
//
// Les barres de la frise gardent leurs proportions (les flux sont tous
// proportionnels au capital) : c'est le chiffre qui bouge, pas la forme.

const copy = {
  fr: {
    lead: "Coupon annuel de {coupon}, versé en deux fois, à 6 mois et à l'échéance ; frais de transaction de {fees} prélevés à la souscription.",
    youInvest: "Vous souscrivez",
    bonds: { one: "{n} obligation de {face}", other: "{n} obligations de {face}" },
    less: "Une obligation de moins",
    more: "Une obligation de plus",
    slider: "Nombre d'obligations",
    share: "Votre part de {issue}",
    shareOf: "sur {size}",
    issuePick: "L'émission simulée",
    committedLabel: "Déjà engagés",
    youLabel: "Vous",
    leftLabel: "Reste",
    netShort: "net",
    grossShort: "brut",
    payTitle: "Souscrire en monnaie fiat ou en monnaie digitale",
    payFiat: "Fiat",
    payFiatList: "euro, dollar, par virement",
    payDigital: "Digitale",
    payDigitalList: "XLM, stablecoins (USDC, USDT), ETH",
    youGet: "Vous recevez sur 12 mois",
    gain: "soit {gain} nets, après {fees} de frais",
    net: "de rendement net",
    rotation: "Votre capital tourne environ trois fois dans l'année : il finance le fonds de roulement de contrats publics, un cycle après l'autre.",
    flows: "Les trois flux",
    moments: ["À la souscription", "6e mois", "12e mois, l'échéance"],
    momentNotes: ["Capital et frais", "Premier coupon", "Second coupon et principal"],
    alt: "Trois flux : un versement à la souscription, un coupon au sixième mois, le second coupon et le principal au douzième mois.",
    note: "Simulation indicative, sans engagement contractuel ni conseil en investissement. Rendements présentés avant impôts. Le capital est engagé à la souscription et appelé une fois le seuil de {threshold} atteint ; le coupon de {coupon} est le taux minimal garanti par la documentation d'émission ; le rendement net rapporte le gain après frais au capital déployé.",
  },
  en: {
    lead: "{coupon} annual coupon, paid in two instalments, at 6 months and at maturity; {fees} transaction fees charged at subscription.",
    youInvest: "You subscribe",
    bonds: { one: "{n} bond of {face}", other: "{n} bonds of {face}" },
    less: "One bond fewer",
    more: "One bond more",
    slider: "Number of bonds",
    share: "Your share of {issue}",
    shareOf: "of {size}",
    issuePick: "Issuance simulated",
    committedLabel: "Already committed",
    youLabel: "You",
    leftLabel: "Left",
    netShort: "net",
    grossShort: "gross",
    payTitle: "Subscribe in fiat or in digital currency",
    payFiat: "Fiat",
    payFiatList: "euro, dollar, by bank transfer",
    payDigital: "Digital",
    payDigitalList: "XLM, stablecoins (USDC, USDT), ETH",
    youGet: "You receive over 12 months",
    gain: "i.e. {gain} net, after {fees} in fees",
    net: "net return",
    rotation: "Your capital turns over about three times in the year, financing the working capital of public contracts, one cycle after another.",
    flows: "The three flows",
    moments: ["At subscription", "Month 6", "Month 12, maturity"],
    momentNotes: ["Capital and fees", "First coupon", "Second coupon and principal"],
    alt: "Three flows: a payment at subscription, a coupon in month six, the second coupon and the principal in month twelve.",
    note: "Indicative simulation, neither a contractual commitment nor investment advice. Returns shown before tax. Capital is committed at subscription and called once the {threshold} threshold is reached; the {coupon} coupon is the minimum rate guaranteed by the issuance documentation; the net return relates the gain after fees to the capital deployed.",
  },
} as const;

const fill = (tpl: string, vars: Record<string, string | number>): string =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

function money(n: number, locale: Locale): string {
  const grouped = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, locale === "fr" ? " " : ",");
  return locale === "fr" ? `${grouped} €` : `€${grouped}`;
}

/** La taille d'une émission : « 10 M€ », en anglais « €10M ». */
function millions(n: number, locale: Locale): string {
  const v = String(Math.round(n / 1e5) / 10).replace(".", locale === "fr" ? "," : ".");
  return locale === "fr" ? `${v} M€` : `€${v}M`;
}

function percent(x: number, locale: Locale, digits = 1): string {
  const v = (Math.round(x * 100 * 10 ** digits) / 10 ** digits).toString();
  return locale === "fr" ? `${v.replace(".", ",")} %` : `${v}%`;
}

// Fait courir un nombre jusqu'à sa cible, en un peu plus d'une demi-seconde.
function useCountUp(target: number, motion: boolean): number {
  const [value, setValue] = useState(target);
  const shown = useRef(target);
  useEffect(() => {
    if (!motion) {
      shown.current = target;
      return;
    }
    const from = shown.current;
    const start = performance.now();
    const duration = 600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      shown.current = Math.round(from + (target - from) * eased);
      setValue(shown.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, motion]);
  // Sans animation, la cible s'affiche telle quelle.
  return motion ? value : target;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

const clamp = (n: number, it: Issue): number => Math.min(maxBondsOf(it), Math.max(it.minBonds, Math.round(n)));

export function Simulator({
  locale,
  k1Closed,
}: {
  locale: Locale;
  /** Kupanda 1 est close : la simulation ne porte plus que sur Kupanda 2. */
  k1Closed: boolean;
}) {
  const c = copy[locale];
  const motion = !useReducedMotion();
  const issues = k1Closed ? ISSUES.filter((it) => it.id !== "k1") : ISSUES;
  const [issueId, setIssueId] = useState<Issue["id"]>(issues[0].id);
  const issue = issues.find((it) => it.id === issueId) ?? issues[0];
  const maxBonds = maxBondsOf(issue);
  const [bonds, setBonds] = useState<number>(issue.defaultBonds);
  const sim = simulate(issue, bonds);
  const share = sim.capital / issue.size;
  const left = issue.size - issue.committed - sim.capital;

  const received = useCountUp(sim.received, motion);
  const gain = useCountUp(sim.gain, motion);
  const paid = useCountUp(sim.paid, motion);
  const mid = useCountUp(sim.couponMid, motion);
  const end = useCountUp(sim.couponEnd + sim.capital, motion);

  const set = (n: number) => setBonds(clamp(n, issue));
  // Changer d'émission garde le montant (3 obligations de 10 000 € = 1 de
  // 30 000 €), dans les bornes de la nouvelle.
  const pickIssue = (to: Issue) => {
    setIssueId(to.id);
    setBonds(clamp((bonds * issue.faceValue) / to.faceValue, to));
  };
  const bondsLabel = fill(bonds > 1 ? c.bonds.other : c.bonds.one, { n: bonds, face: money(issue.faceValue, locale) });

  // Frise des flux : un versement vers le bas, deux rentrées vers le haut,
  // hauteurs proportionnelles au plus grand flux (l'échéance).
  const W = 720;
  const base = 124;
  const maxFlow = sim.couponEnd + sim.capital;
  const h = (v: number) => Math.max(4, (v / maxFlow) * 88);
  const bars = [
    { x: 120, up: false, v: sim.paid, label: money(paid, locale) },
    { x: 360, up: true, v: sim.couponMid, label: money(mid, locale) },
    { x: 600, up: true, v: sim.couponEnd + sim.capital, label: money(end, locale) },
  ];

  return (
    <div>
      {/* L'émission simulée : chacune avec son rendement net, son brut et son calendrier. */}
      <div role="radiogroup" aria-label={c.issuePick} className="grid gap-3 sm:grid-cols-2">
        {issues.map((it) => {
          const on = it.id === issue.id;
          return (
            <button
              key={it.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => pickIssue(it)}
              className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${
                on ? "border-brand/40 bg-brand/10" : "border-foreground/10 bg-white/60 hover:border-foreground/30"
              }`}
            >
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-foreground">{it.name}</span>
                <span className="mt-1 block text-sm leading-5 text-neutral-600">{it.note[locale]}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block whitespace-nowrap">
                  <span className="text-xl font-semibold tracking-tight tabular-nums text-marsala">
                    {percent(it.couponRate - it.feeRate, locale)}
                  </span>
                  <span className="ml-1.5 text-sm text-neutral-600">{c.netShort}</span>
                </span>
                <span className="block whitespace-nowrap text-sm text-neutral-600">
                  {percent(it.couponRate, locale, 0)} {c.grossShort}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {issue.hint && <p className="mt-3 text-sm leading-6 text-neutral-700">{issue.hint[locale]}</p>}

      <p className="mt-6 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">
        {fill(c.lead, { coupon: percent(issue.couponRate, locale, 0), fees: percent(issue.feeRate, locale) })}
      </p>

      {/* Les moyens de souscription : monnaie fiat ou monnaie digitale. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="font-semibold text-foreground">{c.payTitle}</span>
        {[
          [c.payFiat, c.payFiatList],
          [c.payDigital, c.payDigitalList],
        ].map(([tag, list]) => (
          <span key={tag} className="flex items-center gap-2 text-neutral-600">
            <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 text-xs font-semibold text-foreground">{tag}</span>
            {list}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Ce que vous souscrivez : le réglage. */}
        <div className="rounded-xl border border-foreground/10 bg-white/60 px-6 py-6">
          <p className="text-sm font-semibold text-foreground">{c.youInvest}</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-4xl font-semibold tracking-tight tabular-nums text-marsala">{money(sim.capital, locale)}</p>
            <div className="flex shrink-0 gap-1.5">
              <StepButton label={c.less} onClick={() => set(bonds - 1)} disabled={bonds <= issue.minBonds}>
                <path d="M5 12h14" />
              </StepButton>
              <StepButton label={c.more} onClick={() => set(bonds + 1)} disabled={bonds >= maxBonds}>
                <path d="M12 5v14M5 12h14" />
              </StepButton>
            </div>
          </div>
          <p className="mt-1 text-sm text-neutral-600">{bondsLabel}</p>

          <input
            type="range"
            min={issue.minBonds}
            max={maxBonds}
            step={1}
            value={bonds}
            onChange={(e) => set(Number(e.target.value))}
            aria-label={c.slider}
            aria-valuetext={money(sim.capital, locale)}
            className="mt-5 block h-1.5 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 accent-marsala"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {issue.presets.map((n) => {
              const on = bonds === n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set(n)}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm tabular-nums transition-colors ${
                    on
                      ? "border-brand/30 bg-brand/10 font-semibold text-marsala"
                      : "border-foreground/15 bg-white/70 text-neutral-700 hover:border-foreground/35"
                  }`}
                >
                  {money(n * issue.faceValue, locale)}
                </button>
              );
            })}
          </div>

          {/* Votre part de l'émission, après ce qui est déjà engagé : deux
              segments, le second se remplit avec le curseur. */}
          <div className="mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-semibold text-foreground">{fill(c.share, { issue: issue.name })}</p>
              <p className="whitespace-nowrap text-sm tabular-nums text-neutral-600">
                <span className="font-semibold text-marsala">{percent(share, locale, share < 0.1 ? 1 : 0)}</span>{" "}
                {fill(c.shareOf, { size: millions(issue.size, locale) })}
              </p>
            </div>
            <div className="mt-2 flex h-2 w-full gap-px overflow-hidden rounded-full bg-foreground/10" role="presentation">
              <div className="h-full bg-marsala" style={{ width: `${(issue.committed / issue.size) * 100}%` }} />
              <div
                className="h-full bg-brand"
                style={{ width: `${Math.max(1.2, share * 100)}%`, transition: motion ? "width 500ms cubic-bezier(0.22, 0.61, 0.36, 1)" : "none" }}
              />
            </div>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <i aria-hidden className="h-2 w-2 rounded-sm bg-marsala" />
                {c.committedLabel} {millions(issue.committed, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i aria-hidden className="h-2 w-2 rounded-sm bg-brand" />
                {c.youLabel} {money(sim.capital, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i aria-hidden className="h-2 w-2 rounded-sm bg-foreground/15" />
                {c.leftLabel} {money(left, locale)}
              </span>
            </p>
          </div>
        </div>

        {/* Ce que vous recevez : le chiffre qui court. */}
        <div className="flex flex-col justify-between rounded-xl border border-foreground/10 bg-white/60 px-6 py-6">
          <div>
            <p className="text-sm font-semibold text-foreground">{c.youGet}</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums text-marsala">{money(received, locale)}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              {fill(c.gain, { gain: `+ ${money(gain, locale)}`, fees: money(sim.fees, locale) })}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-4 border-t border-foreground/10 pt-5">
            <p className="whitespace-nowrap text-3xl font-semibold tracking-tight tabular-nums text-marsala">{percent(sim.netYield, locale)}</p>
            <p className="text-sm leading-5 text-neutral-600">
              {c.net}
              <br />
              {c.rotation}
            </p>
          </div>
        </div>
      </div>

      {/* Les trois flux sur la frise. Les chiffres courent avec le curseur. */}
      <h3 className="mt-8 text-sm font-semibold text-foreground">{c.flows}</h3>
      <svg viewBox={`0 0 ${W} 250`} className="mx-auto mt-2 block w-full max-w-3xl" role="img" aria-label={c.alt}>
        <line x1={24} x2={W - 24} y1={base} y2={base} stroke="#2c1716" strokeOpacity={0.18} strokeWidth={1} />
        {bars.map((b, i) => {
          const hh = h(b.v);
          const y = b.up ? base - hh : base;
          return (
            <g key={i}>
              <rect
                x={b.x - 22}
                y={y}
                width={44}
                height={hh}
                rx={4}
                fill={b.up ? "#f26404" : "#2c1716"}
                fillOpacity={b.up ? 0.9 : 0.55}
              />
              <text
                x={b.x}
                y={b.up ? y - 10 : y + hh + 22}
                textAnchor="middle"
                fontSize={17}
                fontWeight={600}
                fill="#2c1716"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {b.up ? "+" : "−"}
                {" "}
                {b.label}
              </text>
              <text x={b.x} y={b.up ? base + 22 : base - 12} textAnchor="middle" fontSize={14} fontWeight={600} fill="#2c1716">
                {c.moments[i]}
              </text>
              <text x={b.x} y={b.up ? base + 40 : base - 30} textAnchor="middle" fontSize={13} fill="#525252">
                {c.momentNotes[i]}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-4 text-sm leading-6 text-neutral-600">
        {fill(c.note, { threshold: money(issue.threshold, locale), coupon: percent(issue.couponRate, locale, 0) })}
      </p>
    </div>
  );
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-foreground/15 bg-white/80 text-foreground transition-colors hover:border-foreground/40 disabled:cursor-default disabled:opacity-40"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
