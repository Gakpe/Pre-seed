import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "./section-title";

// Fiche « Scénarios de sortie » (niveau 2). Même contenu que le texte en base,
// mis en forme comme les autres fiches : chapô, deux familles de sorties en
// sections numérotées. Le texte de la base reste en place, simplement plus
// affiché (voir `richOnly` dans page.tsx) : toute retouche de fond se fait ici.
// Aucun état, aucune interaction.

type Example = { name: string; logo: string };

type Exit = {
  title: string;
  body: string;
  when?: string;
  figure?: { value: string; label: string };
  /** Acquéreurs types, à titre d'illustration : aucune discussion en cours. */
  examples?: Example[];
};

// Logos hébergés dans public/exits (rien n'est chargé depuis un service tiers).
// Pas d'exemples pour les gestionnaires d'actifs (Julien, 08/10/2026).
const EXAMPLES: Record<"banks" | "fintechs" | "web3" | "privateDebt", Example[]> = {
  banks: [
    { name: "Ecobank", logo: "/exits/ecobank.svg" },
    { name: "Standard Bank", logo: "/exits/standardbank.svg" },
    { name: "Access Bank", logo: "/exits/accessbank.png" },
  ],
  fintechs: [
    { name: "Wave", logo: "/exits/wave.svg" },
    { name: "Flutterwave", logo: "/exits/flutterwave.svg" },
    { name: "M-Pesa", logo: "/exits/mpesa.png" },
  ],
  // Ajoutés le 08/10/2026 (Julien).
  web3: [
    { name: "Maple Finance", logo: "/exits/maple.svg" },
    { name: "Centrifuge", logo: "/exits/centrifuge.svg" },
    { name: "Ondo Finance", logo: "/exits/ondo.svg" },
  ],
  privateDebt: [
    { name: "TLG Capital", logo: "/exits/tlg.png" },
    { name: "Cauris", logo: "/exits/cauris.png" },
    { name: "Lendable", logo: "/exits/lendable.svg" },
  ],
};

const copy: Record<
  Locale,
  {
    lead: string;
    examplesLabel: string;
    industrialTitle: string;
    industrial: Exit[];
    financialTitle: string;
    financial: Exit[];
  }
> = {
  fr: {
    lead: "Deux familles de sorties identifiées : des acquéreurs industriels, pour qui Minah est une brique à intégrer, et des sorties financières, échelonnées avec la croissance de la société. Un document de travail, que nous affinons avec l'équipe.",
    examplesLabel: "Par exemple",
    industrialTitle: "Sorties industrielles",
    industrial: [
      {
        title: "Banques panafricaines",
        body: "À la recherche d'une plateforme de crédit digitale clé en main : la distribution et l'infrastructure.",
        examples: EXAMPLES.banks,
      },
      {
        title: "Gestionnaires d'actifs globaux",
        body: "Spécialistes du private credit, qui veulent une porte d'entrée structurée sur les rendements africains.",
        figure: { value: "~2 000 Md$", label: "d'encours en private credit" },
      },
      {
        title: "Fintechs de première génération",
        body: "Acteurs du paiement aux rails déjà déployés, qui intègrent la brique investissement pour monétiser leur base.",
        examples: EXAMPLES.fintechs,
      },
      {
        title: "Acteurs du Web3",
        body: "Protocoles on-chain qui veulent se rapprocher de la finance traditionnelle et de l'économie réelle, avec Minah pour passerelle.",
        examples: EXAMPLES.web3,
      },
      {
        title: "Acteurs de la dette privée",
        body: "Fonds et plateformes de dette privée qui veulent s'équiper de notre couche technologique : structuration, traçabilité on-chain, distribution.",
        examples: EXAMPLES.privateDebt,
      },
    ],
    financialTitle: "Sorties financières",
    financial: [
      {
        when: "À la série A ou B",
        title: "Cession secondaire partielle",
        body: "Une partie des titres cédée lors d'un tour suivant.",
      },
      {
        when: "Après la licence d'établissement de crédit",
        title: "Rachat par un fonds de private equity",
        body: "Une fois la licence obtenue, en phase 2 de la roadmap.",
      },
    ],
  },
  en: {
    lead: "Two families of exits identified: industrial acquirers, for whom Minah is a building block to integrate, and financial exits, staged along the company's growth. A working document that we are refining with the team.",
    examplesLabel: "For example",
    industrialTitle: "Industrial exits",
    industrial: [
      {
        title: "Pan-African banks",
        body: "Looking for a turnkey digital credit platform: distribution and infrastructure.",
        examples: EXAMPLES.banks,
      },
      {
        title: "Global asset managers",
        body: "Private credit specialists who want a structured gateway to African yields.",
        figure: { value: "~$2Tn", label: "of private credit AUM" },
      },
      {
        title: "First-generation fintechs",
        body: "Payment players with rails already deployed, adding the investment layer to monetise their base.",
        examples: EXAMPLES.fintechs,
      },
      {
        title: "Web3 players",
        body: "On-chain protocols that want to move closer to traditional finance and the real economy, with Minah as their gateway.",
        examples: EXAMPLES.web3,
      },
      {
        title: "Private debt players",
        body: "Private debt funds and platforms that want to adopt our technology layer: structuring, on-chain traceability, distribution.",
        examples: EXAMPLES.privateDebt,
      },
    ],
    financialTitle: "Financial exits",
    financial: [
      {
        when: "At Series A or B",
        title: "Partial secondary sale",
        body: "Part of the shares sold during a later round.",
      },
      {
        when: "After the credit institution licence",
        title: "Buyout by a private equity fund",
        body: "Once the licence is obtained, in phase 2 of the roadmap.",
      },
    ],
  },
};

const CARD = "rounded-xl border border-foreground/10 bg-white/50 p-5";

export function ExitScenarios({ locale }: { locale: Locale }) {
  const c = copy[locale];

  return (
    <div className="mt-8">
      <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.lead}</p>

      <section className="mt-12">
        <SectionTitle n="01">{c.industrialTitle}</SectionTitle>
        {/* Cinq cartes : trois sur la première ligne, deux plus larges sur la
            seconde, plutôt qu'une rangée à moitié vide. */}
        <ul className="mt-6 grid gap-4 md:grid-cols-6">
          {c.industrial.map((e, i) => (
            <li
              key={e.title}
              className={`${CARD} flex flex-col ${i < 3 ? "md:col-span-2" : "md:col-span-3"}`}
            >
              <h3 className="text-sm font-semibold text-foreground">{e.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-neutral-700">{e.body}</p>
              <div className="mt-auto pt-5">
                {e.figure && (
                  <p className="border-t border-foreground/10 pt-4">
                    <span className="block text-2xl font-semibold tracking-tight tabular-nums text-marsala">
                      {e.figure.value}
                    </span>
                    <span className="text-sm text-neutral-600">{e.figure.label}</span>
                  </p>
                )}
                {e.examples && (
                  <div className={`border-t border-foreground/10 pt-4 ${e.figure ? "mt-4" : ""}`}>
                    <p className="text-sm text-neutral-600">{c.examplesLabel}</p>
                    <ul
                      className={`mt-3 flex flex-wrap items-center gap-y-3 lg:flex-nowrap ${
                        // Cartes étroites : les trois logos occupent la ligne.
                        // Cartes larges : alignés à gauche, sinon trop écartés.
                        i < 3 ? "gap-x-4 lg:justify-between" : "gap-x-4 lg:gap-x-10"
                      }`}
                    >
                      {e.examples.map((x) => (
                        <li key={x.name}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={x.logo}
                            alt={x.name}
                            className="h-5 w-auto max-w-[96px] object-contain"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <SectionTitle n="02">{c.financialTitle}</SectionTitle>
        {/* Une frise : les sorties financières s'échelonnent avec la
            croissance de la société, de la série A au rachat après licence.
            Distribution sans sortie et introduction en bourse retirées le
            08/10/2026 (Julien). */}
        <ol className="relative mt-6 grid gap-4 sm:grid-cols-2">
          <span
            aria-hidden
            className="absolute top-[11px] right-6 left-6 hidden h-px bg-foreground/15 sm:block"
          />
          {c.financial.map((e, i) => (
            <li key={e.title} className="relative flex flex-col">
              <span className="relative z-10 grid h-6 w-6 place-items-center rounded-lg bg-brand/10 font-mono text-[11px] font-semibold text-marsala ring-4 ring-background">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={`${CARD} mt-3 flex-1`}>
                <p className="text-sm text-neutral-600">{e.when}</p>
                <h3 className="mt-1 text-sm font-semibold text-foreground">{e.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-neutral-700">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
