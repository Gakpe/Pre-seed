"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { SIM, simulate } from "@/lib/kupanda-client";

// Onglet « La simulation » de la due diligence, version souscripteurs. Un
// curseur et des boutons fixent le nombre d'obligations ; tout le reste suit :
// le montant reçu s'anime jusqu'à sa nouvelle valeur, la part de l'émission
// se remplit, les trois flux (versement, coupon, échéance) se relisent sur la
// frise. Les chiffres sont ceux de la term sheet (src/lib/kupanda-client.ts).
//
// Les barres de la frise gardent leurs proportions (les flux sont tous
// proportionnels au capital) : c'est le chiffre qui bouge, pas la forme.

const copy = {
  fr: {
    lead: "Coupon annuel de 20 %, versé en deux fois, à 6 mois et à l'échéance ; frais de transaction de 3,5 % prélevés à la souscription.",
    youInvest: "Vous souscrivez",
    bonds: (n: number) => `${n} obligation${n > 1 ? "s" : ""} de 10 000 €`,
    less: "Une obligation de moins",
    more: "Une obligation de plus",
    slider: "Nombre d'obligations",
    share: "Votre part de Kupanda 1",
    shareOf: "sur 2 M€",
    youGet: "Vous recevez sur 12 mois",
    gain: (g: string, f: string) => `soit ${g} nets, après ${f} de frais`,
    net: "de rendement net",
    rotation: "Votre capital tourne environ trois fois dans l'année, un contrat public après l'autre.",
    flows: "Les trois flux",
    moments: ["À la souscription", "6e mois", "12e mois, l'échéance"],
    momentNotes: ["Capital et frais", "Premier coupon", "Second coupon et principal"],
    alt: "Trois flux : un versement à la souscription, un coupon au sixième mois, le second coupon et le principal au douzième mois.",
    note: "Simulation indicative, sans engagement contractuel ni conseil en investissement. Rendements présentés avant impôts. Le capital est engagé à la souscription et appelé une fois le seuil de 200 000 € atteint ; le coupon de 20 % est le taux minimal garanti par la documentation d'émission ; le rendement net rapporte le gain après frais au capital déployé.",
  },
  en: {
    lead: "20% annual coupon, paid in two instalments, at 6 months and at maturity; 3.5% transaction fees charged at subscription.",
    youInvest: "You subscribe",
    bonds: (n: number) => `${n} bond${n > 1 ? "s" : ""} of €10,000`,
    less: "One bond fewer",
    more: "One bond more",
    slider: "Number of bonds",
    share: "Your share of Kupanda 1",
    shareOf: "of €2M",
    youGet: "You receive over 12 months",
    gain: (g: string, f: string) => `i.e. ${g} net, after ${f} in fees`,
    net: "net return",
    rotation: "Your capital turns over about three times in the year, one public contract after another.",
    flows: "The three flows",
    moments: ["At subscription", "Month 6", "Month 12, maturity"],
    momentNotes: ["Capital and fees", "First coupon", "Second coupon and principal"],
    alt: "Three flows: a payment at subscription, a coupon in month six, the second coupon and the principal in month twelve.",
    note: "Indicative simulation, neither a contractual commitment nor investment advice. Returns shown before tax. Capital is committed at subscription and called once the €200,000 threshold is reached; the 20% coupon is the minimum rate guaranteed by the issuance documentation; the net return relates the gain after fees to the capital deployed.",
  },
} as const;

function money(n: number, locale: Locale): string {
  const grouped = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, locale === "fr" ? " " : ",");
  return locale === "fr" ? `${grouped} €` : `€${grouped}`;
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

export function Simulator({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const motion = !useReducedMotion();
  const [bonds, setBonds] = useState<number>(SIM.minBonds);
  const sim = simulate(bonds);
  const share = bonds / SIM.maxBonds;

  const received = useCountUp(sim.received, motion);
  const gain = useCountUp(sim.gain, motion);
  const paid = useCountUp(sim.paid, motion);
  const mid = useCountUp(sim.couponMid, motion);
  const end = useCountUp(sim.couponEnd + sim.capital, motion);

  const set = (n: number) => setBonds(Math.min(SIM.maxBonds, Math.max(SIM.minBonds, Math.round(n))));

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
      <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.lead}</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Ce que vous souscrivez : le réglage. */}
        <div className="rounded-xl border border-foreground/10 bg-white/60 px-6 py-6">
          <p className="text-sm font-semibold text-foreground">{c.youInvest}</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-4xl font-semibold tracking-tight tabular-nums text-marsala">{money(sim.capital, locale)}</p>
            <div className="flex shrink-0 gap-1.5">
              <StepButton label={c.less} onClick={() => set(bonds - 1)} disabled={bonds <= SIM.minBonds}>
                <path d="M5 12h14" />
              </StepButton>
              <StepButton label={c.more} onClick={() => set(bonds + 1)} disabled={bonds >= SIM.maxBonds}>
                <path d="M12 5v14M5 12h14" />
              </StepButton>
            </div>
          </div>
          <p className="mt-1 text-sm text-neutral-600">{c.bonds(bonds)}</p>

          <input
            type="range"
            min={SIM.minBonds}
            max={SIM.maxBonds}
            step={1}
            value={bonds}
            onChange={(e) => set(Number(e.target.value))}
            aria-label={c.slider}
            aria-valuetext={money(sim.capital, locale)}
            className="mt-5 block h-1.5 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 accent-marsala"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {SIM.presets.map((n) => {
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
                  {money(n * SIM.faceValue, locale)}
                </button>
              );
            })}
          </div>

          {/* Votre part de l'émission : la jauge se remplit avec le curseur. */}
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-semibold text-foreground">{c.share}</p>
              <p className="text-sm tabular-nums text-neutral-600">
                <span className="font-semibold text-marsala">{percent(share, locale, share < 0.1 ? 1 : 0)}</span> {c.shareOf}
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-foreground/10" role="presentation">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${Math.max(1.5, share * 100)}%`, transition: motion ? "width 500ms cubic-bezier(0.22, 0.61, 0.36, 1)" : "none" }}
              />
            </div>
          </div>
        </div>

        {/* Ce que vous recevez : le chiffre qui court. */}
        <div className="flex flex-col justify-between rounded-xl border border-foreground/10 bg-white/60 px-6 py-6">
          <div>
            <p className="text-sm font-semibold text-foreground">{c.youGet}</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums text-marsala">{money(received, locale)}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-700">{c.gain(`+ ${money(gain, locale)}`, money(sim.fees, locale))}</p>
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
                {" "}
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

      <p className="mt-4 text-sm leading-6 text-neutral-600">{c.note}</p>
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
