import type { Locale } from "@/lib/i18n";
import { SectionTitle } from "./section-title";
import { ScrollReveal } from "./scroll-reveal";

// Fiche « Impact » (niveau 1, brouillon). Performance financière et
// performance d'impact se pilotent ensemble : chaque stratégie porte des KPI
// rattachés à des cibles des ODD (les « sous-ODD »).
//
// Les cibles ODD citées sont des cibles officielles de l'ONU ; le choix de
// celles que Minah retient est à valider. Tous les chiffres d'impact sont des
// emplacements à renseigner (surlignés en jaune) : aucun n'est encore publié.

type Kpi = { target: string; label: string };
type Goal = { n: string; title: string; targets: { id: string; text: string }[] };

const copy: Record<
  Locale,
  {
    lead: string;
    s1: string;
    financial: string;
    financialItems: string[];
    impactCol: string;
    impactItems: string[];
    s2: string;
    goals: Goal[];
    s3: string;
    s3Lead: string;
    kpis: Kpi[];
    s4: string;
    s4Lead: string;
    action: string;
    photo: string;
    closing: string;
    toFill: string;
    toValidate: string;
  }
> = {
  fr: {
    lead: "Chez Minah, la performance financière et la performance d'impact se mesurent ensemble. Chaque stratégie porte, à côté de son rendement, des KPI d'impact rattachés à des cibles précises des Objectifs de développement durable, suivis et publiés comme ses chiffres financiers.",
    s1: "Deux performances, un même suivi",
    financial: "Performance financière",
    financialItems: ["Coupon versé aux investisseurs", "Taux de défaut et pertes", "Protection du capital"],
    impactCol: "Performance d'impact",
    impactItems: [
      "Des KPI par stratégie, choisis avant la levée",
      "Chacun rattaché à une cible ODD",
      "Un rapport d'impact publié avec le reporting financier",
    ],
    s2: "Les ODD que nous ciblons",
    goals: [
      {
        n: "8",
        title: "Travail décent et croissance économique",
        targets: [
          { id: "8.3", text: "Favoriser la croissance des PME, y compris par l'accès aux services financiers" },
          { id: "8.10", text: "Renforcer la capacité des institutions financières nationales à élargir l'accès au crédit" },
        ],
      },
      {
        n: "9",
        title: "Industrie, innovation et infrastructure",
        targets: [{ id: "9.3", text: "Accroître l'accès des petites entreprises aux services financiers, y compris au crédit" }],
      },
      {
        n: "5",
        title: "Égalité entre les sexes",
        targets: [{ id: "5.a", text: "Donner aux femmes l'accès aux ressources économiques et aux services financiers" }],
      },
      {
        n: "17",
        title: "Partenariats pour la réalisation des objectifs",
        targets: [{ id: "17.3", text: "Mobiliser des ressources financières supplémentaires pour les pays en développement" }],
      },
    ],
    s3: "Kupanda, le rapport d'impact",
    s3Lead: "Les premiers KPI suivis sur Kupanda, des PME titulaires de marchés publics en Zambie.",
    kpis: [
      { target: "9.3", label: "PME financées" },
      { target: "8.3", label: "emplois soutenus" },
      { target: "5.a", label: "des PME dirigées par des femmes" },
      { target: "17.3", label: "injectés dans l'économie locale" },
    ],
    s4: "Financé par notre première stratégie",
    s4Lead: "Quelques actions financées directement au travers de notre première stratégie.",
    action: "Action financée, à renseigner",
    photo: "Photo à fournir",
    closing: "Rendement et impact se mesurent sur les mêmes opérations, avec la même exigence.",
    toFill: "X",
    toValidate: "Choix des cibles à valider",
  },
  en: {
    lead: "At Minah, financial performance and impact performance are measured together. Alongside its return, each strategy carries impact KPIs mapped to specific targets of the Sustainable Development Goals, tracked and published like its financial figures.",
    s1: "Two performances, one tracking",
    financial: "Financial performance",
    financialItems: ["Coupon paid to investors", "Default rate and losses", "Capital protection"],
    impactCol: "Impact performance",
    impactItems: [
      "KPIs per strategy, chosen before the raise",
      "Each mapped to an SDG target",
      "An impact report published with the financial reporting",
    ],
    s2: "The SDGs we target",
    goals: [
      {
        n: "8",
        title: "Decent work and economic growth",
        targets: [
          { id: "8.3", text: "Encourage the growth of SMEs, including through access to financial services" },
          { id: "8.10", text: "Strengthen the capacity of domestic financial institutions to expand access to credit" },
        ],
      },
      {
        n: "9",
        title: "Industry, innovation and infrastructure",
        targets: [{ id: "9.3", text: "Increase the access of small enterprises to financial services, including credit" }],
      },
      {
        n: "5",
        title: "Gender equality",
        targets: [{ id: "5.a", text: "Give women access to economic resources and financial services" }],
      },
      {
        n: "17",
        title: "Partnerships for the goals",
        targets: [{ id: "17.3", text: "Mobilise additional financial resources for developing countries" }],
      },
    ],
    s3: "Kupanda, the impact report",
    s3Lead: "The first KPIs tracked on Kupanda, SMEs holding public contracts in Zambia.",
    kpis: [
      { target: "9.3", label: "SMEs financed" },
      { target: "8.3", label: "jobs supported" },
      { target: "5.a", label: "of SMEs led by women" },
      { target: "17.3", label: "injected into the local economy" },
    ],
    s4: "Financed by our first strategy",
    s4Lead: "A few actions financed directly through our first strategy.",
    action: "Financed action, to be filled in",
    photo: "Photo to be provided",
    closing: "Return and impact are measured on the same deals, with the same rigour.",
    toFill: "X",
    toValidate: "Choice of targets to be validated",
  },
};

// Chiffre à renseigner, absent de nos données : surligné pour la relecture.
function Placeholder({ children }: { children: React.ReactNode }) {
  return <mark className="whitespace-nowrap rounded-sm bg-yellow-200 px-1 text-foreground">{children}</mark>;
}

const KPI_UNIT: Record<string, (v: string, fr: boolean) => string> = {
  "5.a": (v, fr) => (fr ? `${v} %` : `${v}%`),
  "17.3": (v, fr) => (fr ? `${v} M€` : `€${v}M`),
};

export function Impact({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const fr = locale === "fr";

  return (
    <div className="mt-8">
      <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.lead}</p>

      {/* 01, les deux colonnes côte à côte, séparées d'un filet */}
      <section className="mt-12">
        <SectionTitle n="01">{c.s1}</SectionTitle>
        <div className="mt-6 grid border-y border-foreground/10 sm:grid-cols-2 sm:divide-x sm:divide-foreground/10">
          {[
            { title: c.financial, items: c.financialItems },
            { title: c.impactCol, items: c.impactItems },
          ].map((col) => (
            <div key={col.title} className="py-6 max-sm:border-t max-sm:border-foreground/10 max-sm:first:border-t-0 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-neutral-700">
                {col.items.map((it) => (
                  <li key={it} className="flex gap-3">
                    <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-marsala" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 02, les ODD et leurs cibles */}
      <section className="mt-14">
        <SectionTitle n="02">{c.s2}</SectionTitle>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-xl bg-foreground/10 sm:grid-cols-2">
          {c.goals.map((g, i) => (
            <ScrollReveal key={g.n} delay={i * 80} className="h-full">
              <li className="h-full bg-[#fbfaf7] p-5">
                <p className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 font-mono text-sm font-semibold text-marsala">
                    {g.n}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {fr ? "ODD" : "SDG"} {g.n}, {g.title}
                  </span>
                </p>
                <ul className="mt-4 space-y-2.5">
                  {g.targets.map((t) => (
                    <li key={t.id} className="flex gap-3 text-sm leading-6 text-neutral-700">
                      <span className="w-9 shrink-0 font-mono text-[13px] font-semibold text-marsala">{t.id}</span>
                      {t.text}
                    </li>
                  ))}
                </ul>
              </li>
            </ScrollReveal>
          ))}
        </ul>
        <p className="mt-2 text-xs text-neutral-600">
          <Placeholder>{c.toValidate}</Placeholder>
        </p>
      </section>

      {/* 03, les KPI de Kupanda, en bandeau */}
      <section className="mt-14">
        <SectionTitle n="03">{c.s3}</SectionTitle>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.s3Lead}</p>
        <dl className="mt-6 grid border-y border-foreground/10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-foreground/10">
          {c.kpis.map((k) => (
            <div key={k.target} className="py-5 max-lg:border-t max-lg:border-foreground/10 max-lg:first:border-t-0 lg:px-5 lg:first:pl-0 lg:last:pr-0">
              <dd className="text-3xl font-semibold tracking-tight tabular-nums text-marsala">
                <Placeholder>{(KPI_UNIT[k.target] ?? ((v: string) => v))(c.toFill, fr)}</Placeholder>
              </dd>
              <dt className="mt-1 text-sm text-neutral-600">{k.label}</dt>
              <p className="mt-2 font-mono text-[11px] font-semibold text-marsala">
                {fr ? "ODD" : "SDG"} {k.target}
              </p>
            </div>
          ))}
        </dl>
      </section>

      {/* 04, des actions financées, en images */}
      <section className="mt-14">
        <SectionTitle n="04">{c.s4}</SectionTitle>
        <p className="mt-4 max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{c.s4Lead}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <li key={i} className="overflow-hidden rounded-xl border border-foreground/10 bg-white/50">
              <div className="grid aspect-[4/3] place-items-center border-b border-dashed border-neutral-300 bg-foreground/[0.03] text-sm text-neutral-600">
                <Placeholder>{c.photo}</Placeholder>
              </div>
              <p className="p-4 text-sm leading-6 text-neutral-700">
                <Placeholder>{c.action}</Placeholder>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Clôture : carte blanche des citations, sans guillemets */}
      <p className="mt-14 rounded-xl border border-foreground/10 bg-white/60 p-6 text-center text-[17px] font-semibold leading-[1.5] tracking-tight text-foreground">
        {c.closing}
      </p>
    </div>
  );
}
