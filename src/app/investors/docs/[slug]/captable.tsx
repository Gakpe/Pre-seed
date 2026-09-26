"use client";

import { useEffect, useRef, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

// Cap table interactive (vue investisseur) : HTML autonome servi par
// /api/captable avec les paramètres officiels enregistrés depuis /admin/captable.
// Les hypothèses internes n'y sont ni visibles ni modifiables.
//
// Le cadre prend toute la hauteur de la fenêtre, et un bouton passe le bloc en
// plein écran (API Fullscreen sur le conteneur, pas sur l'iframe : le bouton
// de sortie reste accessible). Repli : ouvrir la cap table seule dans un
// onglet, la session suit par le cookie.
export function CapTableInteractive({
  title,
  locale,
}: {
  title: string;
  locale: Locale;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function toggle() {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => null);
    } else {
      await box.current?.requestFullscreen().catch(() => null);
    }
  }

  return (
    <div
      ref={box}
      className={`mt-8 flex flex-col bg-background ${full ? "h-screen p-4" : ""}`}
    >
      <div className="flex items-center justify-end gap-4 pb-3 text-sm">
        <a
          href="/api/captable"
          target="_blank"
          rel="noopener"
          className="whitespace-nowrap text-neutral-600 hover:underline"
        >
          {t(locale, "docs.captable.newtab")} ↗
        </a>
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 font-medium transition-colors hover:border-neutral-500"
        >
          {full
            ? t(locale, "docs.captable.exitFullscreen")
            : t(locale, "docs.captable.fullscreen")}
        </button>
      </div>
      <iframe
        src="/api/captable"
        title={title}
        className={`w-full flex-1 rounded-md border border-neutral-200 dark:border-neutral-800 ${
          full ? "" : "h-[calc(100dvh-9rem)] min-h-[640px]"
        }`}
      />
    </div>
  );
}
