"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

// Fiche équipe : trois portraits verticaux qui se révèlent au survol.
//
// Chaque carte superpose deux images issues de deux prises de vue :
//  - `rest`  : découpe de la photo d'équipe (public/brand/team.jpg) — les trois
//              découpes partagent distance, lumière et fond noir, c'est ce qui
//              fait tenir l'effet comme un système et pas comme trois bricolages ;
//  - `photo` : le portrait studio individuel, recadré sur la même géométrie
//              (même hauteur de visage, même ligne des yeux à 25 % du cadre).
// Repères de recadrage et coordonnées exactes : docs/photos-equipe.md. Un écart
// de quelques pour cent sur la ligne des yeux se voit : le visage saute au lieu
// de se résoudre.
type Bilingual = { fr: string; en: string };
type BilingualList = { fr: string[]; en: string[] };

type Person = {
  id: string;
  name: string;
  rest: string;
  photo: string;
  role: Bilingual;
  tagline: Bilingual;
  academic: Bilingual;
  career: BilingualList;
  likes: BilingualList;
  dislikes: BilingualList;
};

// ⚠️ À VALIDER PAR LES INTÉRESSÉS avant mise en ligne : les « aime / n'aime pas »
// sont une proposition de rédaction, tenue dans un registre professionnel et
// dérivée des bios déjà validées. Le parcours de Coralie et sa formation
// restent à compléter (marqués TODO ci-dessous).
const PEOPLE: Person[] = [
  {
    id: "julien-gakpe",
    name: "Julien Gakpé",
    rest: "/brand/team/julien-rest.jpg",
    photo: "/brand/team/julien.jpg",
    role: {
      fr: "Co-fondateur — Directeur général",
      en: "Co-founder — CEO",
    },
    tagline: {
      fr: "Le financement public, vu de l'intérieur.",
      en: "Public financing, seen from the inside.",
    },
    academic: {
      fr: "École Polytechnique (X)",
      en: "École Polytechnique (X)",
    },
    career: {
      fr: [
        "Bpifrance — financement d'entreprise",
        "Avolta — corporate finance",
        "Minah — direction générale, structuration et origination",
      ],
      en: [
        "Bpifrance — corporate financing",
        "Avolta — corporate finance",
        "Minah — general management, structuring and origination",
      ],
    },
    likes: {
      fr: [
        "Les montages qui tiennent sur une page",
        "Les échéanciers connus",
        "Le risque nommé",
        "Les partenaires qui répondent vite",
      ],
      en: [
        "Structures that fit on one page",
        "Known repayment schedules",
        "Risk that is named",
        "Counterparts who answer fast",
      ],
    },
    dislikes: {
      fr: [
        "Le mot « disruption »",
        "Un rendement sans son risque",
        "Les due diligences tardives",
        "L'optimisme non chiffré",
      ],
      en: [
        "The word “disruption”",
        "A yield without its risk",
        "Late-stage due diligence",
        "Optimism with no numbers under it",
      ],
    },
  },
  {
    id: "coralie-lolliot",
    name: "Coralie Lolliot",
    rest: "/brand/team/coralie-rest.jpg",
    photo: "/brand/team/coralie.jpg",
    role: {
      fr: "Co-fondatrice — Ecosystems & Partnerships",
      en: "Co-founder — Ecosystems & Partnerships",
    },
    tagline: {
      fr: "Celle par qui le capital arrive.",
      en: "The one the capital comes through.",
    },
    // TODO — formation à renseigner (école / diplôme).
    academic: {
      fr: "À compléter",
      en: "To be completed",
    },
    career: {
      fr: [
        // TODO — compléter par les employeurs et les dates.
        "Réseau prescripteurs — brokers, banquiers privés, asset managers",
        "Partenariats bancaires et institutionnels",
        "Minah — relation investisseurs, capital-in et écosystème",
      ],
      en: [
        "Prescriber network — brokers, private bankers, asset managers",
        "Banking and institutional partnerships",
        "Minah — investor relations, capital-in and ecosystem",
      ],
    },
    likes: {
      fr: [
        "Les rendez-vous préparés",
        "Les réseaux entretenus hors levée",
        "La question gênante",
        "Les partenariats qui durent",
      ],
      en: [
        "Meetings that were prepared",
        "Networks kept warm between raises",
        "The awkward question",
        "Partnerships that last",
      ],
    },
    dislikes: {
      fr: [
        "Le cold outreach de masse",
        "Les promesses non écrites",
        "Les intermédiaires sans engagement",
        "Les levées annoncées trop tôt",
      ],
      en: [
        "Mass cold outreach",
        "Promises never written down",
        "Intermediaries with no stake",
        "Raises announced too early",
      ],
    },
  },
  {
    id: "herve-gakpe",
    name: "Hervé Gakpé",
    rest: "/brand/team/herve-rest.jpg",
    photo: "/brand/team/herve.jpg",
    role: {
      fr: "Co-fondateur — Directeur financier",
      en: "Co-founder — CFO",
    },
    tagline: {
      fr: "Trente bilans de PME avant celui-ci.",
      en: "Thirty SME balance sheets before this one.",
    },
    academic: {
      fr: "ESSEC Business School",
      en: "ESSEC Business School",
    },
    career: {
      fr: [
        "Crédit Agricole — financement de projets",
        "SMASH, puis DAF externalisé — 30+ startups et PME",
        "Minah — finance, trésorerie, cap table et reporting",
      ],
      en: [
        "Crédit Agricole — project finance",
        "SMASH, then outsourced CFO — 30+ startups and SMEs",
        "Minah — finance, treasury, cap table and reporting",
      ],
    },
    likes: {
      fr: [
        "Un prévisionnel qui tient",
        "Les maturités courtes",
        "Les sûretés empilées",
        "Le reporting en avance",
      ],
      en: [
        "A forecast that holds",
        "Short maturities",
        "Stacked securities",
        "Reporting that lands early",
      ],
    },
    dislikes: {
      fr: [
        "Les hypothèses écrites en dur",
        "Le BFR découvert en mars",
        "Les tableurs opaques",
        "Le rendement maximal affiché",
      ],
      en: [
        "Hard-coded assumptions",
        "Working capital found in March",
        "Opaque spreadsheets",
        "The maximum headline yield",
      ],
    },
  },
];

const copy = {
  fr: {
    intro: "Survolez un portrait pour ouvrir le profil — au doigt, touchez-le.",
    academic: "Formation",
    career: "Parcours",
    likes: "Aime",
    dislikes: "N'aime pas",
    reveal: "Voir le profil de",
    support:
      "Autour des fondateurs, huit profils support — tech, communication, juridique. Bios détaillées sur demande.",
  },
  en: {
    intro: "Hover a portrait to open the profile — on touch, tap it.",
    academic: "Education",
    career: "Career",
    likes: "Likes",
    dislikes: "Dislikes",
    reveal: "See the profile of",
    support:
      "Around the founders, eight support profiles — tech, communications, legal. Detailed bios on request.",
  },
};

export function TeamProfiles({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [openId, setOpenId] = useState<string | null>(null);

  // Survol sur les pointeurs fins, appui ailleurs : sur tactile, un tap émet
  // aussi un mouseenter et la carte s'ouvrirait puis se refermerait aussitôt.
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const close = (id: string) =>
    setOpenId((current) => (current === id ? null : current));

  return (
    <section className="mt-10">
      <p className="text-sm leading-6 text-neutral-500">{c.intro}</p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-3">
        {PEOPLE.map((p) => {
          const open = openId === p.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                aria-expanded={open}
                aria-label={`${c.reveal} ${p.name}`}
                className={`${open ? "tp-open" : ""} group relative block w-full overflow-hidden rounded-xl bg-[#140d0b] text-left outline-none ring-brand/60 ring-offset-2 ring-offset-background focus-visible:ring-2`}
                onPointerEnter={
                  canHover ? () => setOpenId(p.id) : undefined
                }
                onPointerLeave={canHover ? () => close(p.id) : undefined}
                // Au clavier seulement : un tap tactile pose aussi le focus, et
                // ouvrir ici referait basculer la carte au clic qui suit.
                onFocus={(e) => {
                  if (e.currentTarget.matches(":focus-visible")) setOpenId(p.id);
                }}
                onBlur={() => close(p.id)}
                onClick={() => {
                  if (!canHover) setOpenId((cur) => (cur === p.id ? null : p.id));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenId(open ? null : p.id);
                  }
                }}
              >
                <div className="relative aspect-[2/3] w-full">
                  {/* état de repos : la découpe de la photo d'équipe, floutée */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.rest}
                    alt=""
                    aria-hidden
                    className="tp-layer tp-rest"
                  />
                  {/* état révélé : le portrait studio, net */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photo}
                    alt={p.name}
                    decoding="async"
                    className="tp-layer tp-sharp"
                  />

                  {/* voiles de lecture */}
                  <div
                    aria-hidden
                    className="tp-scrim absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(20,13,11,.92) 0%, rgba(20,13,11,.62) 20%, rgba(20,13,11,.12) 44%, rgba(20,13,11,0) 64%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="tp-scrim tp-scrim-open absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(18,11,9,.97) 0%, rgba(18,11,9,.93) 46%, rgba(18,11,9,.62) 72%, rgba(18,11,9,.14) 92%, rgba(18,11,9,0) 100%)",
                    }}
                  />

                  {/* affordance : + au repos, − une fois ouvert */}
                  <span
                    aria-hidden
                    className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/25 backdrop-blur-[2px]"
                  >
                    <span className="absolute h-px w-2.5 bg-white/80" />
                    <span className="tp-plus-v absolute h-px w-2.5 rotate-90 bg-white/80" />
                  </span>

                  {/* Identité en bas, données au-dessus : flex-col-reverse garde
                      l'ordre de lecture (nom puis détail) tout en empilant le
                      panneau vers le haut, sans déplacer quoi que ce soit. */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col-reverse p-4">
                    <div>
                      <h3 className="text-base font-semibold leading-tight tracking-tight text-white">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-medium leading-snug text-white/70">
                        {p.role[locale]}
                      </p>
                      <p className="mt-1.5 text-[11px] italic leading-snug text-white/45">
                        {p.tagline[locale]}
                      </p>
                    </div>

                    <div className="mb-3 space-y-3">
                      <div className="tp-field tp-field-1">
                        <Label>{c.academic}</Label>
                        <p
                          className={`mt-1 text-[11.5px] leading-snug ${
                            p.academic.fr === "À compléter"
                              ? "text-brand/90 underline decoration-dashed underline-offset-2"
                              : "text-white/85"
                          }`}
                        >
                          {p.academic[locale]}
                        </p>
                      </div>

                      <div className="tp-field tp-field-2">
                        <Label>{c.career}</Label>
                        <ul className="mt-1 space-y-1">
                          {p.career[locale].map((line) => (
                            <li
                              key={line}
                              className="border-l border-white/15 pl-2 text-[11.5px] leading-snug text-white/80"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="tp-field tp-field-3 grid grid-cols-2 gap-3">
                        <div>
                          <Label>{c.likes}</Label>
                          <ul className="mt-1 space-y-0.5">
                            {p.likes[locale].map((l) => (
                              <li
                                key={l}
                                className="text-[11px] leading-snug text-white/80"
                              >
                                {l}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <Label>{c.dislikes}</Label>
                          <ul className="mt-1 space-y-0.5">
                            {p.dislikes[locale].map((d) => (
                              <li
                                key={d}
                                className="text-[11px] leading-snug text-white/55"
                              >
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-sm leading-6 text-neutral-500">{c.support}</p>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/40">
      {children}
    </p>
  );
}
