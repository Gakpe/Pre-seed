import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "./section-title";

// Fiche « Scénarios de sortie » (niveau 2). Même contenu que le texte en base,
// mis en forme comme les autres fiches : chapô, deux familles de sorties en
// sections numérotées. Le texte de la base reste en place, simplement plus
// affiché (voir `richOnly` dans page.tsx) : toute retouche de fond se fait ici.
// Aucun état, aucune interaction.

type Exit = { title: string; body: string; when?: string; figure?: { value: string; label: string } };

const copy: Record<
  Locale,
  { lead: string; industrialTitle: string; industrial: Exit[]; financialTitle: string; financial: Exit[] }
> = {
  fr: {
    lead: "Deux familles de sorties identifiées : des acquéreurs industriels, pour qui Minah est une brique à intégrer, et des sorties financières, échelonnées avec la croissance de la société. Un document de travail, que nous affinons avec l'équipe.",
    industrialTitle: "Sorties industrielles",
    industrial: [
      {
        title: "Banques panafricaines",
        body: "À la recherche d'une plateforme de crédit digitale clé en main : la distribution et l'infrastructure.",
      },
      {
        title: "Gestionnaires d'actifs globaux",
        body: "Spécialistes du private credit, qui veulent une porte d'entrée structurée sur les rendements africains.",
        figure: { value: "~2 000 Md$", label: "d'encours en private credit" },
      },
      {
        title: "Fintechs de première génération",
        body: "Acteurs du paiement aux rails déjà déployés, qui intègrent la brique investissement pour monétiser leur base.",
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
      {
        when: "Dès que le modèle génère du cash",
        title: "Distribution sans sortie",
        body: "La marge sur encours rend envisageable une politique de distribution, sans cession.",
      },
      {
        when: "À long terme",
        title: "Introduction en bourse",
        body: "Portée par la liquidité on-chain.",
      },
    ],
  },
  en: {
    lead: "Two families of exits identified: industrial acquirers, for whom Minah is a building block to integrate, and financial exits, staged along the company's growth. A working document that we are refining with the team.",
    industrialTitle: "Industrial exits",
    industrial: [
      {
        title: "Pan-African banks",
        body: "Looking for a turnkey digital credit platform: distribution and infrastructure.",
      },
      {
        title: "Global asset managers",
        body: "Private credit specialists who want a structured gateway to African yields.",
        figure: { value: "~$2Tn", label: "of private credit AUM" },
      },
      {
        title: "First-generation fintechs",
        body: "Payment players with rails already deployed, adding the investment layer to monetise their base.",
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
      {
        when: "As soon as the model generates cash",
        title: "Distribution without an exit",
        body: "The margin on outstanding volume makes a distribution policy possible, without a sale.",
      },
      {
        when: "Long term",
        title: "IPO",
        body: "Supported by on-chain liquidity.",
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
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {c.industrial.map((e) => (
            <li key={e.title} className={`${CARD} flex flex-col`}>
              <h3 className="text-sm font-semibold text-foreground">{e.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-neutral-700">{e.body}</p>
              {e.figure && (
                <p className="mt-auto pt-5">
                  <span className="block border-t border-foreground/10 pt-4">
                    <span className="block text-2xl font-semibold tracking-tight tabular-nums text-marsala">
                      {e.figure.value}
                    </span>
                    <span className="text-sm text-neutral-600">{e.figure.label}</span>
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <SectionTitle n="02">{c.financialTitle}</SectionTitle>
        {/* Une frise : les sorties financières s'échelonnent avec la
            croissance de la société, de la série A à l'introduction en bourse. */}
        <ol className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute top-[11px] right-6 left-6 hidden h-px bg-foreground/15 lg:block"
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
