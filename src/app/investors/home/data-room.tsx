"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/tracking";
import type { DocumentRow } from "@/lib/types";

// Regroupe par catégorie (ordre dicté par sort_order) et numérote 01, 02, …
export function DataRoom({
  docs,
  startIndex = 1,
  columns = 1,
}: {
  docs: DocumentRow[];
  startIndex?: number;
  columns?: 1 | 2;
}) {
  const pathname = usePathname();

  const categories: { name: string; docs: DocumentRow[] }[] = [];
  for (const doc of docs) {
    const last = categories[categories.length - 1];
    if (last && last.name === doc.category) last.docs.push(doc);
    else categories.push({ name: doc.category, docs: [doc] });
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
            {cat.name}
          </h3>
          <ul className="mt-2 divide-y divide-neutral-200 rounded-md border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
            {cat.docs.map((doc) =>
              doc.docsend_url ? (
                <li key={doc.slug}>
                  <a
                    href={doc.docsend_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track({
                        type: "docsend_click",
                        path: pathname,
                        label: doc.title,
                      })
                    }
                    className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <span>{doc.title}</span>
                    <span className="text-xs text-neutral-400">DocSend ↗</span>
                  </a>
                </li>
              ) : (
                <li key={doc.slug}>
                  <Link
                    href={`/investors/docs/${doc.slug}`}
                    className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <span>{doc.title}</span>
                    <span className="text-xs text-neutral-400">Lire →</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}
