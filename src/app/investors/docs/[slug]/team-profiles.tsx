"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

// Fiche équipe : trois portraits verticaux qui se révèlent au survol.
//
// Chaque carte superpose deux images issues de deux prises de vue :
//  - `rest`  : découpe de la photo d'équipe (public/brand/team.jpg), les trois
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
  academic: BilingualList;
  career: BilingualList;
  likes: BilingualList;
  dislikes: BilingualList;
};

// ⚠️ À VALIDER PAR LES INTÉRESSÉS avant mise en ligne : les « aime / n'aime pas »
// sont une proposition de rédaction, tenue dans un registre professionnel et
// dérivée des bios déjà validées.
const PEOPLE: Person[] = [
  {
    id: "julien-gakpe",
    name: "Julien Gakpé",
    rest: "/brand/team/julien-rest.jpg",
    photo: "/brand/team/julien.jpg",
    role: {
      fr: "Co-fondateur, Directeur général",
      en: "Co-founder, CEO",
    },
    tagline: {
      fr: "Le financement public, vu de l'intérieur.",
      en: "Public financing, seen from the inside.",
    },
    academic: {
      fr: ["École Polytechnique (X)"],
      en: ["École Polytechnique (X)"],
    },
    career: {
      fr: [
        "Bpifrance, financement d'entreprise",
        "Avolta, corporate finance",
        "Minah, direction générale, structuration et origination",
      ],
      en: [
        "Bpifrance, corporate financing",
        "Avolta, corporate finance",
        "Minah, general management, structuring and origination",
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
        "Les audits menés trop tard",
        "L'optimisme non chiffré",
      ],
      en: [
        "The word “disruption”",
        "A yield without its risk",
        "Due diligence run too late",
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
      fr: "Co-fondatrice, Chief Ecosystems & Partnerships",
      en: "Co-founder, Chief Ecosystems & Partnerships",
    },
    tagline: {
      fr: "Celle par qui le capital arrive.",
      en: "The one the capital comes through.",
    },
    academic: {
      fr: [
        "Université d'Oxford — Master, économie et études africaines",
        "Harvard Business School — Leading with Finance, certificat",
        "Université de Manchester — Bachelor, économie et sciences politiques",
      ],
      en: [
        "University of Oxford — Master's degree, Economics & African Studies",
        "Harvard Business School — Leading with Finance, certificate",
        "University of Manchester — Bachelor's degree, Economics & Politics",
      ],
    },
    career: {
      fr: [
        "Sciences Po Paris (Executive), Africa Director — passerelle avec les grands dirigeants & ministres africains venus en formation",
        "Africa CEO Forum, Director — co-création de l'écosystème des principaux CEO et acteurs tech du continent",
        "UNESCO (siège), Consultante — politiques publiques auprès des États",
        "Minah, co-fondatrice — capital-in, relation investisseurs et écosystème",
      ],
      en: [
        "Sciences Po Paris (Executive), Africa Director — bridge to Africa's senior leaders and ministers in executive programmes",
        "Africa CEO Forum, Director — co-creating the ecosystem of the continent's leading CEOs and tech players",
        "UNESCO (HQ), Consultant — public policy advisory to governments",
        "Minah, co-founder — capital-in, investor relations and ecosystem",
      ],
    },
    likes: {
      fr: [
        "Les rendez-vous préparés",
        "Les relations de long terme",
        "Les mises en relation chaleureuses",
        "Les partenariats qui capitalisent",
        "Faire avancer les choses",
      ],
      en: [
        "Prepared meetings",
        "Long-term relationships",
        "Warm introductions",
        "Partnerships that compound",
        "Getting things done",
      ],
    },
    dislikes: {
      fr: [
        "La prospection de masse",
        "Les accords sur poignée de main",
        "Les promesses non écrites",
        "Les intermédiaires sans engagement réel",
        "Les annonces prématurées",
      ],
      en: [
        "Mass prospecting",
        "Handshake deals",
        "Unwritten promises",
        "Intermediaries without skin in the game",
        "Premature announcements",
      ],
    },
  },
  {
    id: "herve-gakpe",
    name: "Hervé Gakpé",
    rest: "/brand/team/herve-rest.jpg",
    photo: "/brand/team/herve.jpg",
    role: {
      fr: "Co-fondateur, Directeur financier",
      en: "Co-founder, CFO",
    },
    tagline: {
      fr: "Trente bilans de PME avant celui-ci.",
      en: "Thirty SME balance sheets before this one.",
    },
    academic: {
      fr: ["ESSEC Business School"],
      en: ["ESSEC Business School"],
    },
    career: {
      fr: [
        "Crédit Agricole, financement de projets",
        "SMASH, puis direction financière externalisée pour plus de trente startups et PME",
        "Minah, finance, trésorerie, cap table et reporting",
      ],
      en: [
        "Crédit Agricole, project finance",
        "SMASH, then outsourced CFO for more than thirty startups and SMEs",
        "Minah, finance, treasury, cap table and reporting",
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
        "Les modèles sans hypothèses explicites",
        "Le rendement maximal affiché",
      ],
      en: [
        "Hard-coded assumptions",
        "Working capital found in March",
        "Models with no explicit assumptions",
        "The maximum headline yield",
      ],
    },
  },
];

const copy = {
  fr: {
    intro: "Survolez un portrait pour ouvrir le profil, au doigt, touchez-le.",
    academic: "Formation",
    career: "Parcours",
    likes: "Aime",
    dislikes: "N'aime pas",
    reveal: "Voir le profil de",
    support:
      "Autour des fondateurs, huit profils support, tech, communication, juridique. Bios détaillées sur demande.",
  },
  en: {
    intro: "Hover a portrait to open the profile, on touch, tap it.",
    academic: "Education",
    career: "Career",
    likes: "Likes",
    dislikes: "Dislikes",
    reveal: "See the profile of",
    support:
      "Around the founders, eight support profiles, tech, communications, legal. Detailed bios on request.",
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

      <ul className="mt-6 flex flex-col gap-4 lg:h-[min(560px,calc((100vw-80px)/2))] lg:flex-row">
        {PEOPLE.map((p) => {
          const open = openId === p.id;
          // Un portrait ouvert : les deux autres se replient.
          const dim = openId !== null && !open;
          return (
            <li
              key={p.id}
              className={`tp-item ${dim ? "tp-dim" : ""}`}
              style={
                { "--tp-grow": open ? 3 : dim ? 0.12 : 1 } as React.CSSProperties
              }
            >
              <button
                type="button"
                aria-expanded={open}
                aria-label={`${c.reveal} ${p.name}`}
                className={`${open ? "tp-open" : ""} group relative block h-full w-full overflow-hidden rounded-xl bg-[#f7ecdd] text-left outline-none ring-brand/60 ring-offset-2 ring-offset-background focus-visible:ring-2`}
                onPointerEnter={canHover ? () => setOpenId(p.id) : undefined}
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
                <div className="flex h-full w-full flex-col lg:flex-row">
                  {/* Le portrait garde son cadrage : il ne s'étire pas quand la
                      carte s'élargit, sinon le visage se déforme. */}
                  <div className="relative aspect-[2/3] w-full shrink-0 lg:aspect-[2/3] lg:h-full lg:w-auto">
                    {/* repos : la découpe de la photo d'équipe, nette */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.rest} alt={p.name} className="tp-layer tp-rest" />
                    {/* révélé : le portrait studio individuel */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.photo}
                      alt=""
                      aria-hidden
                      decoding="async"
                      className="tp-layer tp-sharp"
                    />

                    {/* voile permanent, pour que l'identité reste lisible */}
                    <div
                      aria-hidden
                      className="tp-scrim absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, #f7ecdd 0%, rgba(247,236,221,.92) 22%, rgba(247,236,221,.35) 44%, rgba(247,236,221,0) 64%)",
                      }}
                    />
                    {/* affordance : plus au repos, moins une fois ouvert */}
                    <span
                      aria-hidden
                      className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-foreground/20 bg-white/40 backdrop-blur-[2px]"
                    >
                      <span className="absolute h-px w-2.5 bg-foreground/60" />
                      <span className="tp-plus-v absolute h-px w-2.5 rotate-90 bg-foreground/60" />
                    </span>

                    {/* identité : toujours visible, en bas du portrait */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-base font-semibold leading-tight tracking-tight text-foreground">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-medium leading-snug text-neutral-600">
                        {p.role[locale]}
                      </p>
                      <p className="mt-1.5 text-[11px] italic leading-snug text-neutral-500">
                        {p.tagline[locale]}
                      </p>
                    </div>
                  </div>

                  {/* Les informations prennent la place libérée par les deux
                      autres portraits : à côté du portrait au large, dépliées
                      sous lui au doigt, pour ne pas masquer le visage. */}
                  <div className="tp-panel">
                    <div className="space-y-3 p-4 lg:space-y-5 lg:p-9">
                      <div className="tp-field tp-field-1">
                        <Label>{c.academic}</Label>
                        <ul className="mt-1 space-y-1">
                          {p.academic[locale].map((line) => (
                            <li
                              key={line}
                              className="border-l border-neutral-300 pl-3 text-[11.5px] leading-snug text-neutral-700 lg:text-sm lg:leading-6"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="tp-field tp-field-2">
                        <Label>{c.career}</Label>
                        <ul className="mt-1 space-y-1">
                          {p.career[locale].map((line) => (
                            <li
                              key={line}
                              className="border-l border-neutral-300 pl-3 text-[11.5px] leading-snug text-neutral-700 lg:text-sm lg:leading-6"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="tp-field tp-field-3 grid max-w-2xl grid-cols-2 gap-3 lg:gap-10">
                        <div>
                          <Label>{c.likes}</Label>
                          <ul className="mt-1 space-y-0.5">
                            {p.likes[locale].map((l) => (
                              <li
                                key={l}
                                className="text-[11px] leading-snug text-neutral-700 lg:text-[13px] lg:leading-6"
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
                                className="text-[11px] leading-snug text-neutral-500 lg:text-[13px] lg:leading-6"
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
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
      {children}
    </p>
  );
}
