"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/tracking";
import { docFields, t, type Locale } from "@/lib/i18n";
import type { DocumentRow } from "@/lib/types";

// Regroupe par catégorie (ordre dicté par sort_order) et numérote 01, 02, …
export function DataRoom({
  docs,
  locale,
  startIndex = 1,
  columns = 1,
}: {
  docs: DocumentRow[];
  locale: Locale;
  startIndex?: number;
  columns?: 1 | 2;
}) {
  const pathname = usePathname();

  // Le regroupement suit la catégorie française (identifiant stable), seul
  // l'intitulé affiché est traduit.
  const categories: { name: string; label: string; docs: DocumentRow[] }[] = [];
  for (const doc of docs) {
    const last = categories[categories.length - 1];
    if (last && last.name === doc.category) last.docs.push(doc);
    else
      categories.push({
        name: doc.category,
        label: docFields(doc, locale).category,
        docs: [doc],
      });
  }

  return (
    <div
      className={
        columns === 2 ? "grid gap-x-8 gap-y-7 md:grid-cols-2" : "space-y-8"
      }
    >
      {categories.map((cat, i) => (
        <section key={cat.name}>
          <h3 className="flex items-baseline gap-3 text-sm font-semibold">
            <span className="font-mono text-xs text-neutral-400">
              {String(startIndex + i).padStart(2, "0")}
            </span>
            {cat.label}
          </h3>
          <ul className="mt-2 divide-y divide-neutral-200 rounded-md border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {cat.docs.map((doc) => {
              const { title, docsendUrl } = docFields(doc, locale);
              return docsendUrl ? (
                <li key={doc.slug}>
                  <a
                    href={docsendUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track({
                        type: "docsend_click",
                        path: pathname,
                        label: doc.title,
                      })
                    }
                    className="halo-hover flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <span>{title}</span>
                    <span className="text-xs text-neutral-400">
                      {t(locale, "docs.docsend")}
                    </span>
                  </a>
                </li>
              ) : (
                <li key={doc.slug}>
                  <Link
                    href={`/investors/docs/${doc.slug}`}
                    className="halo-hover flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <span>{title}</span>
                    <span className="text-xs text-neutral-400">
                      {t(locale, "home.docs.read")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
