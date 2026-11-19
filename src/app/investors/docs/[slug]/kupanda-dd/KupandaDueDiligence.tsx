"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ACTORS,
  USE_CASES,
  FLOWS,
  PROTECTION_EXTRA,
  type DdItem,
} from "@/lib/kupanda-dd";
import type { KupandaDoc } from "@/lib/kupanda-documents";
import { RISK_LEVELS } from "@/lib/risk-levels";
import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "../section-title";
import { K1_CLOSURE, SCENARIOS } from "@/lib/kupanda-client";
import { FlowScene, type Layout } from "./FlowScene";
import { RiskScene } from "./RiskScene";
import { Simulator } from "./Simulator";
import { Markets } from "./Markets";
import { RotationChart } from "./RotationChart";

// Fiche « Due diligence Kupanda » (niveau 2 de la data room, publiée le
// 19/11/2026) : de quoi instruire l'opération,
// des souscripteurs aux PME zambiennes, pour Kupanda 1 et Kupanda 2. Deux
// schémas cliquables, le chemin du capital et la cascade de protections,
// ouvrent chacun leur panneau de détail : tiroir à droite au large, feuille
// montant du bas en dessous (classes dd-* dans globals.css). Deux autres
// onglets : la simulation, sur les deux émissions, et « où va l'argent ». Sous
// la cascade de risque, la rotation du capital sur 12 mois puis les scénarios
// « que se passe-t-il si… ». Enfin les documents, par niveau, sur DocSend.
//
// Mise à jour du 19/11/2026 : la fiche rattrape la dataroom Kupanda du front
// (minah.io/dataroom/kupanda), texte pour texte. Le portail garde son modèle
// d'accès : pas de visite guidée, d'onglet d'intérêt ni de rendez-vous ici.
// Retirés à la demande de Julien, à ne pas remettre : la jauge des pertes, le
// Q&A par profil et celui du family office, la mention « document de
// synthèse », la ligne « rotation sur 12 mois » de l'ancienne présentation, le
// logo ZESCO sur la carte, les bandes orange des groupes d'étapes, le BTC.
//
// Le contenu vit dans src/lib/kupanda-dd.ts et src/lib/kupanda-client.ts ; les
// protections reprennent la cascade validée de src/lib/risk-levels.ts ; les
// documents arrivent du serveur (src/lib/kupanda-documents.ts), déjà filtrés
// selon le niveau de la personne.

// Textes du front. Trois écarts : le coupon de Kupanda 2 à 18 % (premier grand
// chiffre et deuxième repère, dans les mots de la salle Silver Birch), et les
// libellés de la section documents, le portail n'ayant pas d'accord de
// confidentialité à signer en ligne.
const copy = {
  fr: {
    lead: "Kupanda est une stratégie qui se décline en émissions successives, sur les mêmes termes : Kupanda 1, 2 M€, est ouverte jusqu'au 1er décembre 2026, et Kupanda 2, 10 M€, recueille ses premiers engagements. Des investisseurs du monde entier souscrivent une obligation émise à Paris ; l'argent part principalement en Zambie, et pour une partie au Kenya, où Africa Rise finance des PME titulaires de marchés publics signés, puis revient avec le coupon.",
    facts: [
      { value: "10 M€", label: "Kupanda 2, à souscrire" },
      { value: "18 %", label: "Coupon annuel de Kupanda 2" },
      { value: "12 mois", label: "In fine, sans remboursement anticipé" },
      { value: "3 à 5 mois", label: "Par cycle de financement" },
      { value: "0 défaut", label: "Sur 10 M€ déployés" },
    ],
    linkSoon: "Lien à venir",
    tabSim: "La simulation",
    tabSimShort: "Simulation",
    tabMarkets: "Où va l'argent",
    tabMarketsShort: "Pays",
    scenarios: "Que se passe-t-il si…",
    headline: [
      { value: "18 %", label: "Rendement brut par an, Kupanda 2", hint: "20 % pour Kupanda 1" },
      { value: "14,5 %", label: "Rendement net par an, Kupanda 2", hint: "16,5 % pour Kupanda 1" },
      { value: "12 mois", label: "Maturité, in fine", hint: "Coupon semestriel : la moitié à 6 mois" },
    ],
    tabsLabel: "Vues de l'opération",
    tabFlow: "Le flux de l'opération",
    tabRisk: "La gestion du risque",
    tabFlowShort: "Flux",
    tabRiskShort: "Risque",
    hintFlow: "Cliquez sur une étape, un acteur ou un flux pour en ouvrir le détail.",
    steps: "Les étapes",
    hintRisk: "Cliquez sur une protection pour voir ce qu'elle couvre, à quelle hauteur, et sur quel document.",
    stepsRisk: "Les étages",
    socleKicker: "Socle",
    scopeLabel: "Niveau de protection",
    socleTitle: "Le socle juridique",
    socleTag: "Ce qui protège les obligataires quoi qu'il arrive",
    socle: [
      { title: "Une obligation directe", body: "Minah SAS doit intérêts et principal, quelle que soit la performance des actifs sous-jacents." },
      { title: "La masse des obligataires", body: "Représentée par Julca, elle agit au nom de tous les porteurs, sans action individuelle." },
    ],
    kicker: { actor: "Acteur", flow: "Flux", protection: "Protection", usecase: "Exemple" },
    cases: "Deux exemples parmi d'autres",
    moreCases: "Deux exemples parmi d'autres : Africa Rise finance de nombreuses PME du même type. Pour chacune, le fonds de roulement d'un contrat public de plusieurs années, par cycles assurés de 3 à 5 mois.",
    series: [
      { name: "Kupanda 1", amount: "2 M€", status: "En cours", body: "Ouverte jusqu'au 1er décembre 2026" },
      { name: "Kupanda 2", amount: "10 M€", status: "Engagements ouverts", body: "Premier closing en janvier 2027" },
    ],
    seriesLabel: "Une stratégie, deux émissions",
    dealTitle: "Au cœur de l'opération",
    level: "Niveau",
    docs: "Documents",
    keyFacts: "Repères",
    issues: "Les enjeux",
    prev: "Précédent",
    next: "Suivant",
    close: "Fermer",
    open: "Ouvrir",
    locked: "Niveau 2",
    toFill: "à renseigner",
    s3: "Documents",
    docsLead: "Les documents s'ouvrent sur DocSend, dans un nouvel onglet. Les documents confidentiels s'ouvrent au niveau 2 de la data room.",
    level1: "Dès l'invitation",
    level2: "Confidentiels",
    level2Note: "Ces documents sont réservés au niveau 2 de la data room.",
  },
  en: {
    lead: "Kupanda is a strategy rolled out in successive issuances, on the same terms: Kupanda 1, €2M, is open until 1 December 2026, and Kupanda 2, €10M, is gathering its first commitments. Investors from around the world subscribe to a bond issued in Paris; the money goes mainly to Zambia, with part going to Kenya, where Africa Rise finances SMEs holding signed public contracts, then comes back with the coupon.",
    facts: [
      { value: "€10M", label: "Kupanda 2, open to subscribe" },
      { value: "18%", label: "Kupanda 2's annual coupon" },
      { value: "12 months", label: "Bullet, no early redemption" },
      { value: "3 to 5 months", label: "Per financing cycle" },
      { value: "0 default", label: "On €10M deployed" },
    ],
    linkSoon: "Link coming",
    tabSim: "Simulation",
    tabSimShort: "Simulation",
    tabMarkets: "Where the money goes",
    tabMarketsShort: "Countries",
    scenarios: "What happens if…",
    headline: [
      { value: "18%", label: "Gross annual return, Kupanda 2", hint: "20% for Kupanda 1" },
      { value: "14.5%", label: "Net annual return, Kupanda 2", hint: "16.5% for Kupanda 1" },
      { value: "12 months", label: "Bullet maturity", hint: "Semi-annual coupon: half at month 6" },
    ],
    tabsLabel: "Views of the deal",
    tabFlow: "How the deal flows",
    tabRisk: "Risk management",
    tabFlowShort: "Flow",
    tabRiskShort: "Risk",
    hintFlow: "Click a step, an actor or a flow to open its detail.",
    steps: "Steps",
    hintRisk: "Click a protection to see what it covers, up to what amount, and on which document.",
    stepsRisk: "The layers",
    socleKicker: "Foundation",
    scopeLabel: "Protection level",
    socleTitle: "The legal foundation",
    socleTag: "What protects bondholders whatever happens",
    socle: [
      { title: "A direct obligation", body: "Minah SAS owes interest and principal, whatever the performance of the underlying assets." },
      { title: "The bondholder body", body: "Represented by Julca, it acts on behalf of all holders, with no individual action." },
    ],
    kicker: { actor: "Actor", flow: "Flow", protection: "Protection", usecase: "Example" },
    cases: "Two examples among many",
    moreCases: "Two examples among many: Africa Rise finances many SMEs of the same kind. For each, the working capital of a multi-year public contract, in insured 3 to 5 month cycles.",
    series: [
      { name: "Kupanda 1", amount: "€2M", status: "Live", body: "Open until 1 December 2026" },
      { name: "Kupanda 2", amount: "€10M", status: "Commitments open", body: "First closing in January 2027" },
    ],
    seriesLabel: "One strategy, two issuances",
    dealTitle: "Inside the deal",
    level: "Level",
    docs: "Documents",
    keyFacts: "Key facts",
    issues: "What matters",
    prev: "Previous",
    next: "Next",
    close: "Close",
    open: "Open",
    locked: "Level 2",
    toFill: "to be filled in",
    s3: "Documents",
    docsLead: "Documents open on DocSend, in a new tab. Confidential documents open at level 2 of the data room.",
    level1: "From your invitation",
    level2: "Confidential",
    level2Note: "These documents are reserved for level 2 of the data room.",
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

function fromItem(item: DdItem, locale: Locale, c: Copy, k1Closed: boolean): Detail {
  // Kupanda 1 close : le panneau de Minah SAS le dit à la place de la date limite.
  const label = (l: string) => (k1Closed && l === K1_CLOSURE.minahLabel.open[locale] ? K1_CLOSURE.minahLabel.closed[locale] : l);
  return {
    id: item.id,
    kicker: c.kicker[item.kind],
    title: item.title[locale],
    tag: item.tag[locale],
    facts: item.facts.map((f) => ({ label: label(f.label[locale]), value: f.value?.[locale] ?? null })),
    points: item.points.map((p) => p[locale]),
    docs: item.docs,
  };
}

// Ordre de lecture du schéma, pour Précédent / Suivant : chaque acteur suivi
// du flux qui en part.
// Les deux exemples de PME se glissent après elles dans la navigation, sans numéro.
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

// « […] » entre les deux exemples de PME : il y en a beaucoup d'autres du même
// type. Ni étape ni panneau, une bulle au survol.
const MORE = "more-cases";

// Les étapes du flux, en quatre groupes ; un clic zoome sur le groupe.
const FLOW_GROUPS: { id: string; label: { fr: string; en: string }; steps: string[] }[] = [
  { id: "emission", label: { fr: "L'émission", en: "The issuance" }, steps: ["souscripteurs", "souscription", "minah"] },
  { id: "partenaire", label: { fr: "La stratégie partenaire", en: "The partner strategy" }, steps: ["deploiement", "africa-rise"] },
  { id: "sous-jacents", label: { fr: "Les sous-jacents", en: "The underlyings" }, steps: ["financement", "pme", "uc-infrastructure", MORE, "uc-energie", "reglement", "etat"] },
  { id: "retour", label: { fr: "Le retour", en: "The return" }, steps: ["retour"] },
];

const RISK_GROUPS: typeof FLOW_GROUPS = [
  { id: "protections", label: { fr: "Les protections", en: "The protections" }, steps: RISK_LEVELS.map((l) => l.id) },
  { id: "socle", label: { fr: "Le socle", en: "The foundation" }, steps: ["socle"] },
];

/** Largeur du panneau de détail au large, en pixels (voir .dd-drawer). */
const DRAWER_W = 460;

export function KupandaDueDiligence({
  locale,
  documents,
  level2,
  k1Closed,
}: {
  locale: Locale;
  /** Les documents, liens de niveau 2 déjà retirés pour qui n'y a pas droit. */
  documents: KupandaDoc[];
  /** La personne a le niveau 2 de la data room. */
  level2: boolean;
  /** Kupanda 1 est close (à partir du 2 décembre 2026) : calculé côté serveur. */
  k1Closed: boolean;
}) {
  const c = copy[locale];
  const lead = k1Closed ? c.lead.replace(K1_CLOSURE.lead.open[locale], K1_CLOSURE.lead.closed[locale]) : c.lead;
  const series = c.series.map((it, i) => ({
    ...it,
    // la première carte est Kupanda 1 : en cours (pastille verte), puis close
    tone: i === 0 ? (k1Closed ? "closed" : "live") : "open",
    status: i === 0 && k1Closed ? K1_CLOSURE.seriesStatus.closed[locale] : it.status,
    body: i === 0 && k1Closed ? K1_CLOSURE.seriesBody.closed[locale] : it.body,
  }));
  const hintRisk = c.hintRisk;
  const tabs: Tab[] = ["flux", "risque", "simulation", "pays"];
  const tabLabel = (t: Tab, short: boolean) =>
    t === "flux"
      ? short ? c.tabFlowShort : c.tabFlow
      : t === "risque"
        ? short ? c.tabRiskShort : c.tabRisk
        : t === "simulation"
          ? short ? c.tabSimShort : c.tabSim
          : short ? c.tabMarketsShort : c.tabMarkets;
  const [tab, setTab] = useState<Tab>("flux");
  const [selected, setSelectedState] = useState<string | null>(null);
  // Le dernier élément ouvert reste affiché pendant que le panneau se referme.
  const [lastSel, setLastSel] = useState<string | null>(null);
  const setSelected = (id: string | null) => {
    setSelectedState(id);
    if (id) setLastSel(id);
  };
  // Portrait au téléphone, paysage au-delà ; le panneau devient une feuille
  // sous 1024 px.
  const tall = useMedia("(max-width: 1023px)");
  // Le panneau en tiroir à droite ne laisse assez de carte qu'à partir de
  // 1280 px ; en dessous, c'est la feuille du bas.
  const large = useMedia("(min-width: 1280px)");
  const motion = !useMedia("(prefers-reduced-motion: reduce)");
  const layout: Layout = tall ? "tall" : "wide";

  const caseRefs = USE_CASES.map((u) => ({ id: u.id, title: u.title[locale], tag: u.tag[locale] }));
  const flowDetails = new Map<string, Detail>(
    [...ACTORS, ...FLOWS, ...USE_CASES].map((it) => {
      const d = fromItem(it, locale, c, k1Closed);
      return [it.id, it.id === "pme" ? { ...d, cases: caseRefs } : d];
    })
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
          facts: [
            ...(extra ? [{ label: c.scopeLabel, value: extra.scope[locale] }] : []),
            ...(extra?.cover ?? []).map((f) => ({
              label: f.label[locale],
              // la garantie d'Africa Rise : le montant de chaque émission, entre parenthèses
              value: f.value ? (f.detail ? `${f.value[locale]} (${f.detail[locale]})` : f.value[locale]) : null,
            })),
          ],
          points: [
            `${l.trigger.lead[locale]} ${l.trigger.body[locale]}`,
            (extra?.body ?? l.protection.body)[locale],
            ...(extra?.notes ?? []).map((n) => n[locale]),
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
    docs: ["notice"],
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

  const docCtx: DocCtx = { locale, c, documents };
  const toggle = (id: string) => setSelected(selected === id ? null : id);

  return (
    <div className="mt-6">
      {/* Le chapô à gauche, les trois grands chiffres à droite : deux sur une
          ligne et le troisième dessous au téléphone. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{lead}</p>
        <dl className="grid grid-cols-2 border-y border-foreground/10 sm:grid-cols-3 lg:w-[35rem]">
          {c.headline.map((f, i) => (
            <div
              key={f.label}
              className={`py-4 ${i === 1 ? "border-l border-foreground/10 pl-5" : ""} ${
                i === 2 ? "border-foreground/10 max-sm:col-span-2 max-sm:border-t sm:border-l sm:pl-5" : ""
              } ${i < 2 ? "pr-4" : ""}`}
            >
              <dd className="whitespace-nowrap text-3xl font-semibold tracking-tight tabular-nums text-marsala">{f.value}</dd>
              <dt className="mt-1 text-sm leading-5 text-neutral-700">{f.label}</dt>
              <dd className="mt-1 text-xs leading-4 text-neutral-600">{f.hint}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Kupanda 1 et Kupanda 2 : la même stratégie, chaque émission dans sa carte. */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-foreground">{c.seriesLabel}</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {series.map((it) => (
            <div key={it.name} className="flex items-baseline gap-4 rounded-xl border border-foreground/10 bg-white/50 px-5 py-4">
              <span className="whitespace-nowrap text-2xl font-semibold tracking-tight tabular-nums text-marsala">{it.amount}</span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{it.name}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                      it.tone === "live"
                        ? "bg-emerald-100 text-emerald-800"
                        : it.tone === "open"
                          ? "bg-brand/10 text-marsala"
                          : "bg-neutral-200/70 text-neutral-700"
                    }`}
                  >
                    {it.tone === "live" && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                    {it.status}
                  </span>
                </span>
                <span className="mt-0.5 block text-sm leading-5 text-neutral-600">{it.body}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 01, au cœur de l'opération : les onglets, puis la scène */}
      <section className="mt-14">
        <SectionTitle n="01">{c.dealTitle}</SectionTitle>
      <div role="tablist" aria-label={c.tabsLabel} className="mt-5 flex gap-1 overflow-x-auto border-b border-foreground/10">
        {tabs.map((t) => (
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
            className={`-mb-px shrink-0 cursor-pointer whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t ? "border-brand text-foreground" : "border-transparent text-neutral-600 hover:text-foreground"
            }`}
          >
            <span className="max-sm:hidden">{tabLabel(t, false)}</span>
            <span className="sm:hidden">{tabLabel(t, true)}</span>
          </button>
        ))}
      </div>

      {tab === "simulation" || tab === "pays" ? (
        // Les onglets simulation et pays (souscripteurs) : pas de scène ni de
        // panneau, le contenu prend le cadre.
        <div
          role="tabpanel"
          className="mt-4 rounded-xl border border-foreground/10 bg-[radial-gradient(ellipse_at_60%_35%,#fffdfa_0%,#f7f3ec_70%)] px-5 py-6 sm:px-8 sm:py-8"
        >
          {tab === "simulation" ? <Simulator locale={locale} k1Closed={k1Closed} /> : <Markets locale={locale} />}
        </div>
      ) : (
      <>
      <p className="mt-3 text-sm text-neutral-600 lg:hidden">{tab === "flux" ? c.hintFlow : hintRisk}</p>

      {/* La scène : elle tient dans l'écran ; au large, le panneau glisse
          depuis la droite et la scène se resserre à côté. */}
      <div
        role="tabpanel"
        className="relative mt-4 overflow-hidden rounded-xl border border-foreground/10 bg-[radial-gradient(ellipse_at_60%_35%,#fffdfa_0%,#f7f3ec_70%)] lg:grid lg:h-[min(780px,calc(100dvh-10.5rem))] lg:min-h-[520px] lg:grid-cols-[236px_minmax(0,1fr)]"
      >
        {/* Les étapes : un clic met en lumière la partie du schéma. */}
        <Steps
          title={tab === "flux" ? c.steps : c.stepsRisk}
          groups={groups.map((g) => ({
            id: g.id,
            label: g.label[locale],
            items: g.steps.map((id) =>
              id === MORE
                ? { id, n: 0, label: "[…]", more: c.moreCases }
                : {
                    id,
                    n: order.indexOf(id) + 1,
                    label:
                      tab === "flux" || id === "socle" ? (details.get(id)?.title ?? id) : (details.get(id)?.tag ?? id),
                  }
            ),
          }))}
          selected={selected}
          onSelect={toggle}
        />
        <div className="relative max-lg:mx-auto max-lg:aspect-[2/3] max-lg:max-h-[80dvh]">
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
                focus={!tall ? (groupOf(selected)?.id ?? null) : null}
                cover={open && large ? DRAWER_W : 0}
              />
            ) : (
              <RiskScene
                key={layout}
                locale={locale}
                layout={layout}
                selected={!tall ? selected : null}
                onSelect={toggle}
                motion={motion}
                cover={open && large ? DRAWER_W : 0}
              />
            )}
          </div>
          <p
            className={`pointer-events-none absolute right-4 top-4 rounded-lg border border-foreground/10 bg-white/80 px-3 py-1.5 text-xs text-neutral-600 backdrop-blur transition-opacity duration-300 max-lg:hidden ${
              open ? "opacity-0" : "opacity-100"
            }`}
          >
            {tab === "flux" ? c.hintFlow : hintRisk}
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

      {/* Sous le flux : les repères. Sous le risque : la rotation du capital,
          puis les scénarios. */}
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
        <div className="mt-8 space-y-8">
          <RotationChart locale={locale} />
          {/* Les scénarios du mémo, chacun renvoyé vers l'étage de la cascade
              qui joue. La note « à l'étude » reste dans les panneaux des
              niveaux 1 et 2, elle n'est pas répétée ici. */}
          <section>
            <h3 className="text-sm font-semibold text-foreground">{c.scenarios}</h3>
            <div className="mt-2 grid gap-4 lg:grid-cols-2">
              {SCENARIOS.map((sc) => (
                <article key={sc.q.fr} className="rounded-xl border border-foreground/10 bg-white/50 px-5 py-4">
                  <h4 className="text-sm font-semibold text-foreground">{sc.q[locale]}</h4>
                  <p className="mt-1.5 text-sm leading-6 text-neutral-700">{sc.a[locale]}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
      </>
      )}
      </section>

      {/* 02, les documents, par niveau d'accès */}
      {documents.length > 0 && (
        <section className="mt-16">
          <SectionTitle n="02">{c.s3}</SectionTitle>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.docsLead}</p>
          <div className="mt-6 grid gap-x-10 gap-y-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{c.level1}</h3>
              <ul className="mt-2 divide-y divide-foreground/10 border-y border-foreground/10">
                <DocList ids={documents.filter((d) => d.level === 1).map((d) => d.id)} ctx={docCtx} />
              </ul>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">{c.level2}</h3>
                {!level2 && <LockChip label={c.locked} />}
              </div>
              {level2 ? (
                <ul className="mt-2 divide-y divide-foreground/10 border-y border-foreground/10">
                  <DocList ids={documents.filter((d) => d.level === 2).map((d) => d.id)} ctx={docCtx} />
                </ul>
              ) : (
                // Verrouillé : cadre gris, titres sans lien (les liens ne
                // quittent pas le serveur).
                <>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">{c.level2Note}</p>
                  <ul className="mt-2 divide-y divide-neutral-300/70 rounded-xl border border-neutral-300/70 bg-neutral-200/40 px-4">
                    <DocList ids={documents.filter((d) => d.level === 2).map((d) => d.id)} ctx={docCtx} quiet />
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

type Tab = "flux" | "risque" | "simulation" | "pays";

// Colonne des étapes, à gauche de la scène ; au téléphone, une rangée qui
// défile au-dessus.
function Steps({
  title,
  groups,
  selected,
  onSelect,
}: {
  title: string;
  groups: { id: string; label: string; items: { id: string; n: number; label: string; more?: string }[] }[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <nav aria-label={title} className="border-foreground/10 max-lg:border-b lg:overflow-y-auto lg:border-r lg:bg-white/40">
      <h3 className="px-4 pt-4 text-sm font-semibold text-foreground max-lg:sr-only">{title}</h3>
      <div className="flex gap-4 overflow-x-auto px-3 py-3 lg:block lg:space-y-4 lg:px-2 lg:pt-3 lg:pb-4">
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
                className="relative flex gap-1.5 lg:block lg:space-y-0.5"
              >
                {g.items.map((it) => {
                  if (it.more)
                    return (
                      <li key={it.id} className="shrink-0">
                        <MoreCases text={it.more} />
                      </li>
                    );
                  const on = selected === it.id;
                  return (
                    <li key={it.id} className="shrink-0">
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => onSelect(it.id)}
                        className={`flex w-full cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-lg px-2 py-1.5 text-left text-sm transition-colors max-lg:border lg:whitespace-normal ${
                          on
                            ? "bg-brand/10 font-semibold text-marsala max-lg:border-brand/30"
                            : "text-neutral-700 hover:bg-foreground/[0.04] hover:text-foreground max-lg:border-foreground/10 max-lg:bg-white/60"
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
                          // Sous-étape sans numéro : un exemple de PME.
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

// « […] » entre les deux exemples : au survol, au focus ou au toucher, une
// bulle dit qu'il y en a beaucoup d'autres. Posée à la racine de la page, en
// position fixe : la colonne des étapes défile et la rognerait.
function MoreCases({ text }: { text: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const show = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setPos({ x: Math.max(8, Math.min(r.left, window.innerWidth - 296)), y: r.bottom + 6 });
  };
  const hide = () => setPos(null);
  return (
    <>
      <button
        type="button"
        aria-label={text}
        onMouseEnter={(e) => show(e.currentTarget)}
        onMouseLeave={hide}
        onFocus={(e) => show(e.currentTarget)}
        onBlur={hide}
        onClick={(e) => show(e.currentTarget)}
        className="flex w-full cursor-help items-center gap-2.5 rounded-lg px-2 py-1 text-left text-sm text-neutral-600 max-lg:border max-lg:border-foreground/10 max-lg:bg-white/60 max-lg:py-1.5"
      >
        <span aria-hidden className="ml-4 h-6 w-3 shrink-0 max-lg:hidden" />
        <span aria-hidden className="leading-snug">[…]</span>
      </button>
      {pos &&
        createPortal(
          <p
            role="tooltip"
            style={{ left: pos.x, top: pos.y }}
            className="pointer-events-none fixed z-[70] w-72 rounded-lg border border-foreground/10 bg-white px-3 py-2 text-sm leading-5 text-neutral-700 shadow-lg"
          >
            {text}
          </p>,
          document.body
        )}
    </>
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


// --- Le panneau de détail ---------------------------------------------------------

type DocCtx = {
  locale: Locale;
  c: Copy;
  documents: KupandaDoc[];
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
                      <dd className="whitespace-pre-line text-sm font-semibold leading-5 tabular-nums text-foreground">
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
              {shown.docs.some((id) => docCtx.documents.some((d) => d.id === id)) && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{c.docs}</h4>
                  <ul className="mt-2 divide-y divide-foreground/10 border-y border-foreground/10">
                    <DocList ids={shown.docs} ctx={docCtx} compact />
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

function LockChip({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-neutral-200/70 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      {label}
    </span>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

// L'action d'un document : l'ouvrir sur DocSend (nouvel onglet), lien à venir,
// ou verrouillé (niveau 2). Le lien est celui de la langue de la page ; sinon
// celui de l'autre langue, signalée par un badge (« EN » sur la page française).
function DocAction({ doc, ctx, quiet }: { doc: KupandaDoc; ctx: DocCtx; quiet: boolean }) {
  const { locale, c } = ctx;
  if (doc.state === "locked") return quiet ? null : <LockChip label={c.locked} />;
  const other = locale === "fr" ? "en" : "fr";
  const lang = doc.links[locale] ? locale : doc.links[other] ? other : null;
  if (doc.state === "soon" || !lang) {
    return <span className="shrink-0 whitespace-nowrap text-xs text-neutral-600">{c.linkSoon}</span>;
  }
  return (
    <a
      href={doc.links[lang]}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium text-marsala underline decoration-marsala/30 underline-offset-4 hover:decoration-marsala"
    >
      {c.open}
      {lang !== locale && (
        <span className="rounded border border-marsala/30 px-1 text-[11px] font-semibold leading-4 no-underline">
          {lang.toUpperCase()}
        </span>
      )}
      <span aria-hidden>→</span>
    </a>
  );
}

function DocRow({
  doc,
  ctx,
  compact,
  grouped,
  quiet,
}: {
  doc: KupandaDoc;
  ctx: DocCtx;
  compact: boolean;
  /** Pièce d'un document à plusieurs pièces : sous l'intitulé commun, sans
      icône ; `"joined"` quand une autre pièce suit, sans filet entre les deux. */
  grouped: false | "joined" | "last";
  quiet: boolean;
}) {
  const { locale } = ctx;
  const locked = doc.state === "locked";
  return (
    <li
      className={`flex items-center justify-between gap-4 ${
        grouped ? `pb-2 pl-7 pt-1 ${grouped === "joined" ? "!border-b-0" : ""}` : compact ? "py-2.5" : "py-3"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        {!grouped && <FileIcon />}
        <span className={`min-w-0 text-sm leading-5 ${locked ? "text-neutral-600" : "text-neutral-800"}`}>
          {doc.title[locale]}
          {doc.detail && <span className="block text-neutral-600">{doc.detail[locale]}</span>}
        </span>
      </span>
      <DocAction doc={doc} ctx={ctx} quiet={quiet} />
    </li>
  );
}

// La liste des documents : les pièces d'un même document (`group`) se suivent
// sous un seul intitulé, un lien par pièce.
function DocList({
  ids,
  ctx,
  compact = false,
  quiet = false,
}: {
  ids: string[];
  ctx: DocCtx;
  compact?: boolean;
  /** Liste déjà présentée comme verrouillée : pas de pastille à chaque ligne. */
  quiet?: boolean;
}) {
  const { locale, documents } = ctx;
  const docs = ids.flatMap((id) => documents.find((d) => d.id === id) ?? []);
  const rows: React.ReactNode[] = [];
  docs.forEach((doc, i) => {
    const group = doc.group?.[locale] ?? null;
    const prev = docs[i - 1]?.group?.[locale] ?? null;
    if (group && group !== prev) {
      rows.push(
        // Tailwind 4 pose le filet de divide-y sous chaque ligne : on le
        // retire sous l'intitulé et entre les pièces.
        <li key={`g:${doc.id}`} className={`flex items-center gap-3 !border-b-0 pb-1 ${compact ? "pt-2.5" : "pt-3"}`}>
          <FileIcon />
          <span className={`text-sm leading-5 ${doc.state === "locked" ? "text-neutral-600" : "text-neutral-800"}`}>{group}</span>
        </li>
      );
    }
    const next = docs[i + 1]?.group?.[locale] ?? null;
    rows.push(
      <DocRow key={doc.id} doc={doc} ctx={ctx} compact={compact} grouped={group ? (next === group ? "joined" : "last") : false} quiet={quiet} />
    );
  });
  return rows;
}

// Montant ou précision à renseigner, absent de nos données : surligné.
function Placeholder({ children }: { children: React.ReactNode }) {
  return <mark className="whitespace-nowrap rounded-sm bg-yellow-200 px-1 text-foreground">{children}</mark>;
}
