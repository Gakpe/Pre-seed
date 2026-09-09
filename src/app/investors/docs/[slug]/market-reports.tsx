import type { Locale } from "@/lib/i18n";

// Bibliographie de la note de marché. Les liens vivent ici (et pas en base)
// parce qu'ils sont vérifiés à la main : un lien mort dans une data room
// investisseur coûte plus cher qu'un aller-retour par le code.
// Vérifiés le 5 septembre 2026.
type Report = {
  source: string;
  year: string;
  url: string;
  title: { fr: string; en: string };
  takeaway: { fr: string; en: string };
};

const REPORTS: Report[] = [
  {
    source: "AVCA",
    year: "2025",
    url: "https://www.avca.africa/data-intelligence/research-publications/2025-african-private-capital-activity-report/",
    title: {
      fr: "African Private Capital Activity Report 2025",
      en: "African Private Capital Activity Report 2025",
    },
    takeaway: {
      fr: "Le panorama annuel de référence : 5,1 Md$ investis sur 530 opérations, et une dette privée qui progresse nettement plus vite que le capital-investissement.",
      en: "The annual reference panorama: US$5.1bn invested across 530 deals, with private debt growing markedly faster than private equity.",
    },
  },
  {
    source: "AVCA",
    year: "2025",
    url: "https://www.avca.africa/data-intelligence/research-publications/q3-2025-private-capital-activity-in-africa",
    title: {
      fr: "Private Capital Activity in Africa, Q3 2025",
      en: "Private Capital Activity in Africa, Q3 2025",
    },
    takeaway: {
      fr: "Le suivi trimestriel : la dette privée atteint dès le troisième trimestre le volume d'opérations de toute l'année précédente.",
      en: "The quarterly tracker: by Q3, private debt had nearly matched the full prior-year deal count.",
    },
  },
  {
    source: "AVCA",
    year: "2025",
    url: "https://www.avca.africa/news-insights/afri-spective-blog/private-credit-funds-the-opportunity-for-africa/",
    title: {
      fr: "Private Credit Funds, the opportunity for Africa",
      en: "Private Credit Funds, the opportunity for Africa",
    },
    takeaway: {
      fr: "Pourquoi la structure de dette, et pas l'equity, correspond au profil de risque et à l'horizon des PME africaines.",
      en: "Why a debt structure, rather than equity, fits the risk profile and time horizon of African SMEs.",
    },
  },
  {
    source: "IFC · Banque mondiale",
    year: "Référence",
    url: "https://documents1.worldbank.org/curated/en/653831510568517947/pdf/121264-WP-PUBLIC-MSMEReportFINAL.pdf",
    title: {
      fr: "MSME Finance Gap, l'étude fondatrice (PDF)",
      en: "MSME Finance Gap, the founding study (PDF)",
    },
    takeaway: {
      fr: "La méthodologie qui fait autorité pour chiffrer le déficit de financement des PME en marchés émergents. C'est la source de tous les chiffres qui suivent.",
      en: "The authoritative methodology for sizing the SME financing shortfall in emerging markets, the source behind every figure that follows.",
    },
  },
  {
    source: "FinDev Gateway",
    year: "2025",
    url: "https://www.findevgateway.org/news/ifc-sme-finance-forum-target-solutions-africas-usd-331-billion-sme-finance-gap",
    title: {
      fr: "Les 331 Md$ de déficit de financement des PME africaines",
      en: "Africa's US$331bn SME finance gap",
    },
    takeaway: {
      fr: "Le chiffre clé : l'IFC estime à 331 Md$ le besoin de financement non couvert des PME d'Afrique subsaharienne. C'est le marché que la dette privée adresse.",
      en: "The headline number: the IFC puts unmet Sub-Saharan African SME financing needs at US$331bn, the market private debt addresses.",
    },
  },
  {
    source: "IFC",
    year: "En continu",
    url: "https://www.ifc.org/en/what-we-do/sector-expertise/financial-institutions/msme-finance",
    title: {
      fr: "MSME Finance, le programme IFC",
      en: "MSME Finance, the IFC programme",
    },
    takeaway: {
      fr: "Comment l'institution la plus active du secteur déploie concrètement ses financements PME, et par quels canaux.",
      en: "How the sector's most active institution actually deploys SME financing, and through which channels.",
    },
  },
  {
    source: "IFC",
    year: "Fiche",
    url: "https://www.ifc.org/content/dam/ifc/doclink/latest/msme-s-factsheet-ifc-financial-institutions-group.pdf",
    title: {
      fr: "MSME Factsheet, Financial Institutions Group (PDF)",
      en: "MSME Factsheet, Financial Institutions Group (PDF)",
    },
    takeaway: {
      fr: "Deux pages de chiffres bruts : nombre de PME formelles, part contrainte par l'accès au crédit, ventilation par région.",
      en: "Two pages of raw figures: formal SME counts, the share constrained by credit access, regional breakdown.",
    },
  },
  {
    source: "BusinessDay",
    year: "2026",
    url: "https://businessday.ng/news/legal-business/article/private-credit-africas-new-engine-of-growth-in-2026/",
    title: {
      fr: "Private Credit: Africa's new engine of growth in 2026",
      en: "Private Credit: Africa's new engine of growth in 2026",
    },
    takeaway: {
      fr: "La lecture juridique et structurelle du basculement : les banques se retirent du crédit PME, les fonds de dette prennent le relais.",
      en: "The legal and structural reading of the shift: banks retreat from SME lending, debt funds step in.",
    },
  },
  {
    source: "CNBC Africa",
    year: "2025",
    url: "https://www.cnbcafrica.com/media/7777478325498/africas-2-billion-private-credit-surge-financing-growth-amidst-global-market-tightening",
    title: {
      fr: "Africa's $2 billion private credit surge (vidéo)",
      en: "Africa's $2 billion private credit surge (video)",
    },
    takeaway: {
      fr: "Le pipeline de 2 Md$ de fonds de dette privée à déployer d'ici 2027, commenté par les acteurs du marché.",
      en: "The US$2bn pipeline of private debt funds due to deploy by 2027, discussed by market participants.",
    },
  },
  {
    source: "Informa Connect",
    year: "2025",
    url: "https://informaconnect.com/private-credit-in-africa-opportunities-challenges-and-lp-views/",
    title: {
      fr: "Private credit in Africa, le point de vue des LPs",
      en: "Private credit in Africa, the LP view",
    },
    takeaway: {
      fr: "Ce que les investisseurs institutionnels regardent réellement avant d'allouer : liquidité, devise, qualité de la structuration.",
      en: "What institutional investors actually scrutinise before allocating: liquidity, currency, structuring quality.",
    },
  },
  {
    source: "Qbera Capital",
    year: "2025",
    url: "https://qberacapital.com/the-case-for-private-credit-investment-in-africa/",
    title: {
      fr: "The Case for Private Credit Investment in Africa",
      en: "The Case for Private Credit Investment in Africa",
    },
    takeaway: {
      fr: "La thèse d'investissement côté gérant : prime de rendement, corrélation faible aux marchés cotés, protections contractuelles.",
      en: "The manager-side investment thesis: yield premium, low correlation to public markets, contractual protections.",
    },
  },
];

const copy = {
  fr: {
    heading: "Les rapports de référence",
    intro:
      "Onze sources publiques, vérifiées et à jour, pour se faire une opinion sans passer par nous. Elles convergent toutes vers la même conclusion : le besoin est massif, les banques se retirent, et la dette est l'instrument qui correspond au risque réel.",
  },
  en: {
    heading: "The reference reports",
    intro:
      "Eleven public sources, verified and current, so you can form your own view without going through us. They converge on the same conclusion: the need is massive, banks are retreating, and debt is the instrument that matches the actual risk.",
  },
};

export function MarketReports({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <section className="mt-12">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
        {c.heading}
      </h2>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{c.intro}</p>

      <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
        {REPORTS.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <div className="w-32 shrink-0 pl-1">
                <p className="text-xs font-medium text-marsala">{r.source}</p>
                <p className="text-[11px] text-neutral-400">{r.year}</p>
              </div>
              <div className="min-w-0 flex-1 pr-1">
                <p className="text-sm font-medium group-hover:underline">
                  {r.title[locale]}
                  <span className="ml-1.5 text-xs text-neutral-400">↗</span>
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  {r.takeaway[locale]}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
