"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ACTORS,
  USE_CASES,
  DD_DOCS,
  FLOWS,
  PROTECTION_EXTRA,
  type DdItem,
} from "@/lib/kupanda-dd";
import { RISK_LEVELS } from "@/lib/risk-levels";
import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "../section-title";
import { FlowScene, type Layout } from "./FlowScene";
import { RiskScene } from "./RiskScene";

// Fiche « Due diligence Kupanda » (brouillon) : de quoi instruire l'opération,
// des souscripteurs aux PME zambiennes. Deux schémas cliquables, le chemin du
// capital et la cascade de protections, ouvrent chacun leur panneau de détail :
// colonne collante à droite au large, feuille montant du bas au téléphone
// (classes dd-* dans globals.css). Puis les documents, consultables ou à
// demander, et les questions fréquentes selon le profil.
//
// Le contenu vit dans src/lib/kupanda-dd.ts ; les protections reprennent la
// cascade validée de src/lib/risk-levels.ts.

const copy = {
  fr: {
    lead: "Kupanda est une stratégie qui se décline en émissions successives, sur les mêmes termes : Kupanda 1, 2 M€, est en cours, et Kupanda 2, 10 M€, arrive. Des investisseurs du monde entier souscrivent une obligation émise à Paris ; l'argent part principalement en Zambie, et pour une partie au Kenya, où Africa Rise finance des PME titulaires de marchés publics signés, puis revient avec le coupon.",
    facts: [
      { value: "2 M€", label: "Kupanda 1, l'émission en cours" },
      { value: "20 %", label: "Coupon annuel" },
      { value: "12 mois", label: "In fine, sans remboursement anticipé" },
      { value: "3 à 5 mois", label: "Par cycle de financement" },
      { value: "0 défaut", label: "Sur 10 M€ déployés" },
    ],
    headline: [
      { value: "20 %", label: "Rendement brut par an" },
      { value: "16,5 %", label: "Rendement net par an" },
      { value: "12 mois", label: "Maturité, in fine" },
    ],
    tabsLabel: "Vues de l'opération",
    tabFlow: "Le flux de l'opération",
    tabRisk: "La gestion du risque",
    tabFlowShort: "Le flux",
    tabRiskShort: "Le risque",
    hintFlow: "Cliquez sur une étape, un acteur ou un flux pour en ouvrir le détail.",
    steps: "Les étapes",
    hintRisk: "Cliquez sur une protection pour voir ce qu'elle couvre, à quelle hauteur, et sur quel document.",
    stepsRisk: "Les étages",
    socleKicker: "Socle",
    socleTitle: "Le socle juridique",
    socleTag: "Ce qui protège les obligataires quoi qu'il arrive",
    s2: "La sécurité, étage par étage",
    s2Lead: "Chaque niveau de risque a sa protection. Ce qu'une protection n'absorbe pas descend à la suivante : le rendement des investisseurs n'est touché qu'une fois les quatre épuisées.",
    s2Hint: "Cliquez sur un niveau pour voir ce qu'il couvre, à quelle hauteur, et sur quel document.",
    socle: [
      { title: "Une obligation directe", body: "Minah SAS doit intérêts et principal, quelle que soit la performance des actifs sous-jacents." },
      { title: "La masse des obligataires", body: "Représentée par Julca, elle agit au nom de tous les porteurs, sans action individuelle." },
    ],
    gaugeTitle: "Jusqu'où la structure tient",
    gaugeCaption: "Pertes cumulées sur les financements, sur 12 mois.",
    gaugeMarks: [
      { v: 4.6, value: "< 5 %", label: "Historique" },
      { v: 15, value: "15 %", label: "Scénario central" },
      { v: 30, value: "30 %", label: "Point mort, 6,5 × l'historique" },
    ],
    gaugeAbsorbed: "Absorbé par les protections",
    gaugeBeyond: "Perte partielle de performance, sans perte de capital",
    s3: "Les documents",
    s3Lead: "Les fiches de la data room s'ouvrent directement. Les autres documents sont envoyés sur demande : l'équipe la reçoit et revient vers vous.",
    inDataroom: "Dans la data room",
    onRequest: "Sur demande",
    // Panneau
    kicker: { actor: "Acteur", flow: "Flux", protection: "Protection", usecase: "Cas d'usage" },
    cases: "Les cas d'usage",
    series: [
      { name: "Kupanda 1", amount: "2 M€", status: "En cours", body: "L'émission en cours, détaillée sur cette page." },
      { name: "Kupanda 2", amount: "10 M€", status: "En préparation", body: "Mêmes termes, même structure, même partenaire. Premier closing prévu en janvier 2027." },
    ],
    seriesLabel: "Une stratégie, des émissions successives",
    level: "Niveau",
    trigger: "Déclencheur",
    docs: "Documents",
    keyFacts: "Repères",
    issues: "Les enjeux",
    empty: "Cliquez sur un bloc ou sur une flèche : son détail s'affiche ici.",
    emptyRisk: "Cliquez sur un niveau : sa protection et sa hauteur s'affichent ici.",
    prev: "Précédent",
    next: "Suivant",
    close: "Fermer",
    open: "Ouvrir",
    locked: "Niveau 2",
    request: "Demander",
    sending: "Envoi…",
    requested: "Demandé",
    retry: "Réessayer",
    toFill: "à renseigner",
    returnRail: "Retour aux souscripteurs",
  },
  en: {
    lead: "Kupanda is a strategy rolled out in successive issuances, on the same terms: Kupanda 1, €2M, is live, and Kupanda 2, €10M, is coming. Investors from around the world subscribe to a bond issued in Paris; the money goes mainly to Zambia, with part going to Kenya, where Africa Rise finances SMEs holding signed public contracts, then comes back with the coupon.",
    facts: [
      { value: "€2M", label: "Kupanda 1, the live issuance" },
      { value: "20%", label: "Annual coupon" },
      { value: "12 months", label: "Bullet, no early redemption" },
      { value: "3 to 5 months", label: "Per financing cycle" },
      { value: "0 default", label: "On €10M deployed" },
    ],
    headline: [
      { value: "20%", label: "Gross annual return" },
      { value: "16.5%", label: "Net annual return" },
      { value: "12 months", label: "Bullet maturity" },
    ],
    tabsLabel: "Views of the deal",
    tabFlow: "How the deal flows",
    tabRisk: "Risk management",
    tabFlowShort: "The flow",
    tabRiskShort: "The risk",
    hintFlow: "Click a step, an actor or a flow to open its detail.",
    steps: "Steps",
    hintRisk: "Click a protection to see what it covers, up to what amount, and on which document.",
    stepsRisk: "The layers",
    socleKicker: "Foundation",
    socleTitle: "The legal foundation",
    socleTag: "What protects bondholders whatever happens",
    s2: "Security, layer by layer",
    s2Lead: "Each level of risk has its protection. What one protection does not absorb passes to the next: investors' return is only affected once all four are exhausted.",
    s2Hint: "Click a level to see what it covers, up to what amount, and on which document.",
    socle: [
      { title: "A direct obligation", body: "Minah SAS owes interest and principal, whatever the performance of the underlying assets." },
      { title: "The bondholder body", body: "Represented by Julca, it acts on behalf of all holders, with no individual action." },
    ],
    gaugeTitle: "How far the structure holds",
    gaugeCaption: "Cumulative losses on the financings, over 12 months.",
    gaugeMarks: [
      { v: 4.6, value: "< 5%", label: "Historical" },
      { v: 15, value: "15%", label: "Base case" },
      { v: 30, value: "30%", label: "Breakeven, 6.5× historical" },
    ],
    gaugeAbsorbed: "Absorbed by the protections",
    gaugeBeyond: "Partial loss of return, no loss of capital",
    s3: "Documents",
    s3Lead: "Data room pages open directly. Other documents are sent on request: the team receives it and gets back to you.",
    inDataroom: "In the data room",
    onRequest: "On request",
    kicker: { actor: "Actor", flow: "Flow", protection: "Protection", usecase: "Use case" },
    cases: "Use cases",
    series: [
      { name: "Kupanda 1", amount: "€2M", status: "Live", body: "The live issuance, detailed on this page." },
      { name: "Kupanda 2", amount: "€10M", status: "In preparation", body: "Same terms, same structure, same partner. First closing planned for January 2027." },
    ],
    seriesLabel: "One strategy, successive issuances",
    level: "Level",
    trigger: "Trigger",
    docs: "Documents",
    keyFacts: "Key facts",
    issues: "What matters",
    empty: "Click a block or an arrow: its detail shows here.",
    emptyRisk: "Click a level: its protection and how far it covers show here.",
    prev: "Previous",
    next: "Next",
    close: "Close",
    open: "Open",
    locked: "Level 2",
    request: "Request",
    sending: "Sending…",
    requested: "Requested",
    retry: "Retry",
    toFill: "to be filled in",
    returnRail: "Back to subscribers",
  },
} as const;

type Copy = (typeof copy)[Locale];

// Un élément sélectionnable, mis à plat dans la langue de la page.
type Detail = {
  id: string;
  kicker: string;
  title: string;
  tag: string;
  facts: { label: string; value: string | null }[];
  points: string[];
  docs: string[];
  /** Cas d'usage liés, ouvrables depuis le panneau. */
  cases?: { id: string; title: string; tag: string }[];
};

function fromItem(item: DdItem, locale: Locale, c: Copy): Detail {
  return {
    id: item.id,
    kicker: c.kicker[item.kind],
    title: item.title[locale],
    tag: item.tag[locale],
    facts: item.facts.map((f) => ({ label: f.label[locale], value: f.value?.[locale] ?? null })),
    points: item.points.map((p) => p[locale]),
    docs: item.docs,
  };
}

// Ordre de lecture du schéma, pour Précédent / Suivant : chaque acteur suivi
// du flux qui en part.
// Les cas d'usage se glissent après les PME dans la navigation, sans numéro.
const CASE_IDS = USE_CASES.map((u) => u.id);

const FLOW_ORDER = [
  "souscripteurs",
  "souscription",
  "minah",
  "deploiement",
  "africa-rise",
  "financement",
  "pme",
  "reglement",
  "etat",
  "retour",
];

// Les étapes du flux, en quatre groupes ; un clic zoome sur le groupe.
const FLOW_GROUPS: { id: string; label: { fr: string; en: string }; steps: string[] }[] = [
  { id: "emission", label: { fr: "L'émission", en: "The issuance" }, steps: ["souscripteurs", "souscription", "minah"] },
  { id: "partenaire", label: { fr: "La stratégie partenaire", en: "The partner strategy" }, steps: ["deploiement", "africa-rise"] },
  { id: "sous-jacents", label: { fr: "Les sous-jacents", en: "The underlyings" }, steps: ["financement", "pme", "uc-infrastructure", "uc-energie", "reglement", "etat"] },
  { id: "retour", label: { fr: "Le retour", en: "The return" }, steps: ["retour"] },
];

const RISK_GROUPS: typeof FLOW_GROUPS = [
  { id: "protections", label: { fr: "Les protections", en: "The protections" }, steps: RISK_LEVELS.map((l) => l.id) },
  { id: "socle", label: { fr: "Le socle", en: "The foundation" }, steps: ["socle"] },
];

/** Largeur du panneau de détail au large, en pixels (voir .dd-drawer). */
const DRAWER_W = 460;

type RequestState = "sending" | "sent" | "error";

export function KupandaDueDiligence({
  locale,
  openSlugs,
  demo = false,
}: {
  locale: Locale;
  /** Fiches de la data room que la personne peut ouvrir. */
  openSlugs: string[];
  demo?: boolean;
}) {
  const c = copy[locale];
  const [tab, setTab] = useState<Tab>("flux");
  const [selected, setSelectedState] = useState<string | null>(null);
  // Le dernier élément ouvert reste affiché pendant que le panneau se referme.
  const [lastSel, setLastSel] = useState<string | null>(null);
  const setSelected = (id: string | null) => {
    setSelectedState(id);
    if (id) setLastSel(id);
  };
  const [requests, setRequests] = useState<Record<string, RequestState>>({});
  // Portrait au téléphone, paysage au-delà ; le panneau devient une feuille
  // sous 1024 px.
  const tall = useMedia("(max-width: 767px)");
  const large = useMedia("(min-width: 1024px)");
  const motion = !useMedia("(prefers-reduced-motion: reduce)");
  const layout: Layout = tall ? "tall" : "wide";

  const caseRefs = USE_CASES.map((u) => ({ id: u.id, title: u.title[locale], tag: u.tag[locale] }));
  const flowDetails = new Map<string, Detail>(
    [...ACTORS, ...FLOWS, ...USE_CASES].map((it) => [
      it.id,
      it.id === "pme" ? { ...fromItem(it, locale, c), cases: caseRefs } : fromItem(it, locale, c),
    ])
  );
  const riskDetails = new Map<string, Detail>(
    RISK_LEVELS.map((l) => {
      const extra = PROTECTION_EXTRA[l.id];
      return [
        l.id,
        {
          id: l.id,
          kicker: `${c.level} ${l.index}`,
          title: l.name[locale],
          tag: l.protection.name[locale],
          facts: (extra?.cover ?? []).map((f) => ({
            label: f.label[locale],
            value: f.value?.[locale] ?? null,
          })),
          points: [
            `${l.trigger.lead[locale]} ${l.trigger.body[locale]}`,
            l.protection.body[locale],
          ],
          docs: extra?.docs ?? [],
        },
      ];
    })
  );
  riskDetails.set("socle", {
    id: "socle",
    kicker: c.socleKicker,
    title: c.socleTitle,
    tag: c.socleTag,
    facts: [],
    points: c.socle.map((s) => `${s.title} : ${s.body}`),
    docs: ["notice", "masse", "kbis"],
  });
  const riskOrder = [...RISK_LEVELS.map((l) => l.id), "socle"];

  const details = tab === "flux" ? flowDetails : riskDetails;
  const groups = tab === "flux" ? FLOW_GROUPS : RISK_GROUPS;
  const groupOf = (id: string | null) => (id ? (groups.find((g) => g.steps.includes(id)) ?? null) : null);
  // Numérotation des étapes, et ordre de navigation (cas d'usage compris).
  const order = tab === "flux" ? FLOW_ORDER : riskOrder;
  const navOrder =
    tab === "flux" ? FLOW_ORDER.flatMap((id) => (id === "pme" ? [id, ...CASE_IDS] : [id])) : riskOrder;
  const detail = selected ? (details.get(selected) ?? null) : null;
  const shown = detail ?? (lastSel ? (details.get(lastSel) ?? null) : null);
  const open = detail !== null;

  // Libellés des flux et chiffres des acteurs, pour la scène.
  const labels: Record<string, string> = Object.fromEntries([
    ...FLOWS.map((f) => [f.id, f.label[locale]]),
    ...FLOWS.map((f) => [`${f.id}Aria`, `${f.title[locale]}, ${f.label[locale]}`]),
    ...ACTORS.map((a) => [`${a.id === "africa-rise" ? "africaRise" : a.id}Fig`, a.figure[locale]]),
  ]);

  // Échap referme le panneau, comme la croix.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedState(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Une demande de document part comme une question : elle alerte l'équipe
  // (Yao et email). En démo, rien ne part.
  const requestDoc = useCallback(
    async (id: string) => {
      const doc = DD_DOCS.find((d) => d.id === id);
      if (!doc) return;
      setRequests((r) => ({ ...r, [id]: "sending" }));
      if (demo) {
        setRequests((r) => ({ ...r, [id]: "sent" }));
        return;
      }
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: [`Demande de document (due diligence Kupanda) : ${doc.title.fr}`],
        }),
      }).catch(() => null);
      setRequests((r) => ({ ...r, [id]: res?.ok ? "sent" : "error" }));
    },
    [demo]
  );

  const docCtx = { locale, c, openSlugs, requests, requestDoc };
  const toggle = (id: string) => setSelected(selected === id ? null : id);

  return (
    <div className="mt-6">
      {/* Le chapô à gauche, les trois chiffres de l'obligation à droite. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.lead}</p>
        <dl className="grid grid-cols-3 border-y border-foreground/10 lg:min-w-[30rem]">
          {c.headline.map((f, i) => (
            <div key={f.label} className={`py-4 ${i ? "border-l border-foreground/10 pl-5" : ""}`}>
              <dd className="whitespace-nowrap text-3xl font-semibold tracking-tight tabular-nums text-marsala">{f.value}</dd>
              <dt className="mt-1 text-sm leading-5 text-neutral-600">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Kupanda 1, puis Kupanda 2 : la même stratégie, émission après émission. */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-foreground">{c.seriesLabel}</p>
        <div className="mt-2 grid border-y border-foreground/10 sm:grid-cols-2 sm:divide-x sm:divide-foreground/10">
          {c.series.map((it, i) => (
            <div key={it.name} className="flex items-baseline gap-4 py-4 max-sm:border-t max-sm:border-foreground/10 max-sm:first:border-t-0 sm:px-5 sm:first:pl-0">
              <span className="text-2xl font-semibold tracking-tight tabular-nums text-marsala">{it.amount}</span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{it.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      i === 0 ? "bg-brand/10 text-marsala" : "bg-neutral-200/70 text-neutral-700"
                    }`}
                  >
                    {it.status}
                  </span>
                </span>
                <span className="mt-0.5 block text-sm leading-5 text-neutral-600">{it.body}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Les deux onglets de la scène */}
      <div role="tablist" aria-label={c.tabsLabel} className="mt-6 flex gap-1 border-b border-foreground/10">
        {(["flux", "risque"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => {
              setTab(t);
              setSelectedState(null);
              setLastSel(null);
            }}
            className={`-mb-px cursor-pointer rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t ? "border-brand text-foreground" : "border-transparent text-neutral-600 hover:text-foreground"
            }`}
          >
            <span className="max-sm:hidden">{t === "flux" ? c.tabFlow : c.tabRisk}</span>
            <span className="sm:hidden">{t === "flux" ? c.tabFlowShort : c.tabRiskShort}</span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-neutral-600 md:hidden">{tab === "flux" ? c.hintFlow : c.hintRisk}</p>

      {/* La scène : elle tient dans l'écran ; au large, le panneau glisse
          depuis la droite et la scène se resserre à côté. */}
      <div
        role="tabpanel"
        className="relative mt-4 overflow-hidden rounded-xl border border-foreground/10 bg-[radial-gradient(ellipse_at_60%_35%,#fffdfa_0%,#f7f3ec_70%)] md:grid md:h-[min(780px,calc(100dvh-10.5rem))] md:min-h-[520px] md:grid-cols-[236px_minmax(0,1fr)]"
      >
        {/* Les étapes : un clic met en lumière la partie du schéma. */}
        <Steps
          title={tab === "flux" ? c.steps : c.stepsRisk}
          groups={groups.map((g) => ({
            id: g.id,
            label: g.label[locale],
            items: g.steps.map((id) => ({
              id,
              n: order.indexOf(id) + 1,
              label:
                tab === "flux" || id === "socle" ? (details.get(id)?.title ?? id) : (details.get(id)?.tag ?? id),
            })),
          }))}
          selected={selected}
          onSelect={toggle}
        />
        <div className="relative max-md:aspect-[2/3]">
          {/* Un clic dans le vide referme le détail et revient à la vue
              d'ensemble ; les éléments cliquables ont role="button". */}
          <div
            className="absolute inset-0"
            onClick={(e) => {
              if (!(e.target as Element).closest('[role="button"]')) setSelected(null);
            }}
          >
            {tab === "flux" ? (
              <FlowScene
                key={layout}
                locale={locale}
                layout={layout}
                selected={selected}
                onSelect={toggle}
                labels={labels}
                motion={motion}
                focus={large ? (groupOf(selected)?.id ?? null) : null}
                cover={open && large ? DRAWER_W : 0}
              />
            ) : (
              <RiskScene
                key={layout}
                locale={locale}
                layout={layout}
                selected={large ? selected : null}
                onSelect={toggle}
                motion={motion}
                cover={open && large ? DRAWER_W : 0}
              />
            )}
          </div>
          <p
            className={`pointer-events-none absolute right-4 top-4 rounded-lg border border-foreground/10 bg-white/80 px-3 py-1.5 text-xs text-neutral-600 backdrop-blur transition-opacity duration-300 max-md:hidden ${
              open ? "opacity-0" : "opacity-100"
            }`}
          >
            {tab === "flux" ? c.hintFlow : c.hintRisk}
          </p>
        </div>
        <DetailPanel
          shown={shown}
          group={groupOf(shown?.id ?? null)?.label[locale] ?? null}
          open={open}
          order={navOrder}
          numbered={order}
          onSelect={setSelected}
          docCtx={docCtx}
          sheet={!large}
        />
      </div>

      {/* Sous la scène : les chiffres clés, ou la jauge des pertes. */}
      {tab === "flux" ? (
        <dl className="mt-6 grid grid-cols-2 border-y border-foreground/10 lg:grid-cols-5 lg:divide-x lg:divide-foreground/10">
          {c.facts.map((f, i) => (
            <div
              key={f.label}
              className={`px-1 py-4 max-lg:border-foreground/10 max-lg:[&:nth-child(n+3)]:border-t lg:px-5 lg:first:pl-0 ${
                i === c.facts.length - 1 ? "max-lg:col-span-2" : ""
              } ${i % 2 === 1 ? "max-lg:pl-4" : ""}`}
            >
              <dd className="text-xl font-semibold tracking-tight tabular-nums text-marsala">{f.value}</dd>
              <dt className="mt-0.5 text-sm leading-5 text-neutral-600">{f.label}</dt>
            </div>
          ))}
        </dl>
      ) : (
        <LossGauge c={c} />
      )}

      {/* 01, les documents */}
      <section className="mt-16">
        <SectionTitle n="01">{c.s3}</SectionTitle>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.s3Lead}</p>
        <div className="mt-6 grid gap-x-10 gap-y-8 lg:grid-cols-2">
          {[
            { title: c.inDataroom, docs: DD_DOCS.filter((d) => d.kind.type === "dataroom") },
            { title: c.onRequest, docs: DD_DOCS.filter((d) => d.kind.type === "request") },
          ].map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
              <ul className="mt-2 divide-y divide-foreground/10 border-y border-foreground/10">
                {group.docs.map((d) => (
                  <DocRow key={d.id} id={d.id} ctx={docCtx} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 02, les questions */}

    </div>
  );
}

type Tab = "flux" | "risque";

// Colonne des étapes, à gauche de la scène ; au téléphone, une rangée qui
// défile au-dessus.
function Steps({
  title,
  groups,
  selected,
  onSelect,
}: {
  title: string;
  groups: { id: string; label: string; items: { id: string; n: number; label: string }[] }[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <nav aria-label={title} className="border-foreground/10 max-md:border-b md:overflow-y-auto md:border-r md:bg-white/40">
      <h3 className="px-4 pt-4 text-sm font-semibold text-foreground max-md:sr-only">{title}</h3>
      <div className="flex gap-4 overflow-x-auto px-3 py-3 md:block md:space-y-4 md:px-2 md:pt-3 md:pb-4">
        {groups.map((g) => {
          const active = g.items.some((it) => it.id === selected);
          return (
            <div key={g.id} className="shrink-0">
              <p
                className={`mb-1 px-2 text-xs font-medium transition-colors ${
                  active ? "text-marsala" : "text-neutral-600"
                }`}
              >
                {g.label}
              </p>
              <ol
                className={`relative flex gap-1.5 rounded-lg md:block md:space-y-0.5 md:border-l-2 md:pl-1 md:transition-colors ${
                  active ? "md:border-brand/60" : "md:border-foreground/10"
                }`}
              >
                {g.items.map((it) => {
                  const on = selected === it.id;
                  return (
                    <li key={it.id} className="shrink-0">
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => onSelect(it.id)}
                        className={`flex w-full cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-lg px-2 py-1.5 text-left text-sm transition-colors max-md:border md:whitespace-normal ${
                          on
                            ? "bg-brand/10 font-semibold text-marsala max-md:border-brand/30"
                            : "text-neutral-700 hover:bg-foreground/[0.04] hover:text-foreground max-md:border-foreground/10 max-md:bg-white/60"
                        }`}
                      >
                        {it.n ? (
                          <span
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px] font-semibold transition-colors ${
                              on ? "bg-marsala text-white" : "bg-background text-marsala ring-1 ring-brand/25"
                            }`}
                          >
                            {it.n}
                          </span>
                        ) : (
                          // Sous-étape sans numéro : un cas d'usage des PME.
                          <span aria-hidden className="ml-4 grid h-6 w-3 shrink-0 place-items-center">
                            <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-marsala" : "bg-brand/40"}`} />
                          </span>
                        )}
                        <span className="leading-snug">{it.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// Suit une media query, sans rendu côté serveur différent du premier rendu
// client : faux d'abord, puis la vraie valeur.
function useMedia(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}


// Jauge des pertes cumulées : jusqu'au point mort, tout est absorbé.
function LossGauge({ c }: { c: Copy }) {
  const MAX = 40;
  const pct = (v: number) => `${(v / MAX) * 100}%`;
  return (
    <div className="mt-10">
      <h3 className="text-sm font-semibold text-foreground">{c.gaugeTitle}</h3>
      <p className="mt-1 text-sm text-neutral-600">{c.gaugeCaption}</p>
      <div className="relative mt-14 mb-20">
        <div className="relative h-3 overflow-hidden rounded-full bg-foreground/[0.06]">
          <div className="absolute inset-y-0 left-0 bg-brand/25" style={{ width: pct(30) }} />
          <div
            className="absolute inset-y-0 right-0"
            style={{
              left: pct(30),
              backgroundImage:
                "repeating-linear-gradient(135deg, rgb(43 26 22 / 0.22) 0 2px, transparent 2px 7px)",
            }}
          />
        </div>
        {c.gaugeMarks.map((m, i) => {
          const above = i === 1;
          return (
            <div
              key={m.label}
              className="absolute top-1/2 -translate-x-1/2"
              style={{ left: pct(m.v) }}
            >
              <span className="absolute left-1/2 h-7 w-px -translate-x-1/2 bg-foreground/45" style={{ top: -14 }} />
              <span
                className={`absolute left-1/2 w-44 -translate-x-1/2 text-center ${above ? "bottom-5" : "top-5"}`}
              >
                <span className="block text-sm font-semibold tabular-nums text-marsala">{m.value}</span>
                <span className="block text-xs leading-4 text-neutral-600">{m.label}</span>
              </span>
            </div>
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-600">
        <li className="flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-5 rounded-sm bg-brand/25" />
          {c.gaugeAbsorbed}
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2.5 w-5 rounded-sm"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgb(43 26 22 / 0.3) 0 2px, transparent 2px 6px)",
            }}
          />
          {c.gaugeBeyond}
        </li>
      </ul>
    </div>
  );
}

// --- Le panneau de détail ---------------------------------------------------------

type DocCtx = {
  locale: Locale;
  c: Copy;
  openSlugs: string[];
  requests: Record<string, RequestState>;
  requestDoc: (id: string) => void;
};

function DetailPanel({
  shown,
  group,
  open,
  order,
  numbered,
  onSelect,
  docCtx,
  sheet,
}: {
  /** Le détail affiché, le dernier ouvert pendant la fermeture. */
  shown: Detail | null;
  /** Groupe de l'étape, en tête du panneau. */
  group: string | null;
  open: boolean;
  order: string[];
  /** Étapes numérotées, pour le compteur. */
  numbered: string[];
  onSelect: (id: string | null) => void;
  docCtx: DocCtx;
  /** Feuille du bas (sous 1024 px) : rendue à la racine de la page, pour
      passer devant la bulle de questions et la barre du haut. */
  sheet: boolean;
}) {
  const { c } = docCtx;
  const i = shown ? order.indexOf(shown.id) : -1;
  const go = (step: number) => onSelect(order[(i + step + order.length) % order.length]);

  const panel = (
    <>
      {/* Fond de la feuille, au téléphone seulement : un toucher le referme. */}
      <div
        aria-hidden
        data-open={open}
        onClick={() => onSelect(null)}
        className="dd-backdrop fixed inset-0 z-[59] bg-foreground/20"
      />
      <aside
        data-open={open}
        aria-hidden={!open}
        aria-label={shown?.title}
        className="dd-drawer bg-[#fbfaf7]"
      >
        {shown && (
          <div key={shown.id}>
            {/* En-tête orangé, navigation et fermeture */}
            <div className="sticky top-0 z-10 rounded-t-xl border-b border-foreground/10 bg-[#fdf3ea] px-5 pt-4 pb-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-marsala">
                  {group ? `${group} · ` : ""}
                  {shown.kicker}
                  {numbered.includes(shown.id) && (
                    <span className="ml-2 font-normal text-neutral-600 tabular-nums">
                      {numbered.indexOf(shown.id) + 1} / {numbered.length}
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-1">
                  <IconButton label={c.prev} onClick={() => go(-1)}>
                    <path d="M15 18l-6-6 6-6" />
                  </IconButton>
                  <IconButton label={c.next} onClick={() => go(1)}>
                    <path d="M9 18l6-6-6-6" />
                  </IconButton>
                  <IconButton label={c.close} onClick={() => onSelect(null)}>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </IconButton>
                </div>
              </div>
              <h3 className="dd-stagger mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground">
                <span className="block">{shown.title}</span>
              </h3>
              <p className="mt-0.5 text-sm leading-5 text-neutral-600">{shown.tag}</p>
            </div>

            <div className="dd-stagger space-y-6 px-5 pt-5 pb-6">
              {shown.facts.length > 0 && (
                <dl className="divide-y divide-foreground/10 border-y border-foreground/10">
                  {shown.facts.map((f) => (
                    <div key={f.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-baseline gap-4 py-2.5">
                      <dt className="text-sm leading-5 text-neutral-600">{f.label}</dt>
                      <dd className="text-sm font-semibold leading-5 tabular-nums text-foreground">
                        {f.value ?? <Placeholder>{c.toFill}</Placeholder>}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {shown.points.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{c.issues}</h4>
                  <ul className="mt-2.5 space-y-2.5">
                    {shown.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm leading-6 text-neutral-700">
                        <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-marsala" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {shown.cases && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{c.cases}</h4>
                  <ul className="mt-2 divide-y divide-foreground/10 border-y border-foreground/10">
                    {shown.cases.map((uc) => (
                      <li key={uc.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(uc.id)}
                          className="group flex w-full cursor-pointer items-center justify-between gap-4 py-2.5 text-left"
                        >
                          <span>
                            <span className="block text-sm font-semibold text-foreground">{uc.title}</span>
                            <span className="block text-sm leading-5 text-neutral-600">{uc.tag}</span>
                          </span>
                          <span aria-hidden className="text-marsala transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {shown.docs.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{c.docs}</h4>
                  <ul className="mt-2 divide-y divide-foreground/10 border-y border-foreground/10">
                    {shown.docs.map((id) => (
                      <DocRow key={id} id={id} ctx={docCtx} compact />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
  return sheet && typeof document !== "undefined" ? createPortal(panel, document.body) : panel;
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-neutral-600 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}

// Un document : ouvert dans la data room, verrouillé, ou à demander.
function DocRow({ id, ctx, compact = false }: { id: string; ctx: DocCtx; compact?: boolean }) {
  const { locale, c, openSlugs, requests, requestDoc } = ctx;
  const doc = DD_DOCS.find((d) => d.id === id);
  if (!doc) return null;
  const state = requests[id];

  let action: React.ReactNode;
  if (doc.kind.type === "dataroom") {
    action = openSlugs.includes(doc.kind.slug) ? (
      <a
        href={`/investors/docs/${doc.kind.slug}`}
        className="whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium text-marsala underline decoration-marsala/30 underline-offset-4 hover:decoration-marsala"
      >
        {c.open} →
      </a>
    ) : (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-neutral-200/70 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        {c.locked}
      </span>
    );
  } else if (state === "sent") {
    action = (
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-marsala">
        <span aria-hidden>✓</span> {c.requested}
      </span>
    );
  } else {
    action = (
      <button
        type="button"
        disabled={state === "sending"}
        onClick={() => requestDoc(id)}
        className="cursor-pointer whitespace-nowrap rounded-lg border border-foreground/15 bg-white/70 px-2.5 py-1 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 disabled:cursor-wait disabled:opacity-60"
      >
        {state === "sending" ? c.sending : state === "error" ? c.retry : c.request}
      </button>
    );
  }

  return (
    <li className={`flex items-center justify-between gap-4 ${compact ? "py-2.5" : "py-3"}`}>
      <span className="flex min-w-0 items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
        </svg>
        <span className="text-sm leading-5 text-neutral-800">{doc.title[locale]}</span>
      </span>
      {action}
    </li>
  );
}

// Montant ou précision à renseigner, absent de nos données : surligné.
function Placeholder({ children }: { children: React.ReactNode }) {
  return <mark className="whitespace-nowrap rounded-sm bg-yellow-200 px-1 text-foreground">{children}</mark>;
}
