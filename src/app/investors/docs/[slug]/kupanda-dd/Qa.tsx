"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/kupanda-client";
import { QA, QA_META } from "@/lib/kupanda-qa";

// Onglet « Q&A » de la due diligence, version souscripteurs : les dix
// questions d'un family office et nos réponses, en accordéon. Une question
// ouverte à la fois, la première par défaut. Le contenu vit dans
// src/lib/kupanda-qa.ts.

const copy = {
  fr: { list: "Questions et réponses", open: "Ouvrir", close: "Fermer" },
  en: { list: "Questions and answers", open: "Open", close: "Close" },
} as const;

export function Qa({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [open, setOpen] = useState<number | null>(0);
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(QA_META.docsSubject[locale])}`;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="max-w-3xl text-[15px] leading-[1.8] text-neutral-700">{QA_META.source[locale]}</p>
        <p className="text-sm text-neutral-600">{QA_META.date[locale]}</p>
      </div>

      <ol aria-label={c.list} className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
        {QA.map((item, i) => {
          const on = open === i;
          return (
            <li key={i}>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`dd-qa-${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="group flex w-full cursor-pointer items-start gap-4 py-4 text-left"
              >
                <span
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px] font-semibold transition-colors ${
                    on ? "bg-marsala text-white" : "bg-brand/10 text-marsala"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`min-w-0 flex-1 text-[15px] leading-6 ${on ? "font-semibold text-foreground" : "text-neutral-800 group-hover:text-foreground"}`}>
                  {item.q[locale]}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`mt-1 h-4 w-4 shrink-0 text-neutral-600 transition-transform ${on ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {on && (
                <div id={`dd-qa-${i}`} className="dd-stagger space-y-3 pb-5 pl-10 pr-8">
                  {item.a.map((block, j) =>
                    Array.isArray(block) ? (
                      <ul key={j} className="space-y-2">
                        {block.map((b) => (
                          <li key={b.fr} className="flex gap-3 text-sm leading-6 text-neutral-700">
                            <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-marsala" />
                            <span>{b[locale]}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j} className="max-w-4xl text-sm leading-6 text-neutral-700">
                        {block[locale]}
                      </p>
                    )
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Les pièces citées : sur demande, comme le reste des documents. */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-3xl text-sm leading-6 text-neutral-600">{QA_META.docs[locale]}</p>
        <a
          href={mailto}
          className="whitespace-nowrap rounded-lg border border-foreground/15 bg-white/70 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/35"
        >
          {QA_META.docsCta[locale]}
        </a>
      </div>
    </div>
  );
}
