"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

// Cap table interactive (vue investisseur) : HTML autonome servi par
// /api/captable avec les paramètres officiels enregistrés depuis /admin/captable.
// Les hypothèses internes n'y sont ni visibles ni modifiables. Tout son
// contenu, chapô compris, vit en base (voir la route) : le dépôt est public.
//
// Le cadre se fond dans la page : pas de bordure, et sa hauteur suit celle de
// son contenu (même origine, on la lit directement), si bien qu'il n'y a qu'un
// seul défilement, celui de la page. Les boutons « Ouvrir dans un onglet » et
// « Plein écran » ont été retirés le 25/11/2026 (Julien) : la fiche tient
// dans la page.
//
// Les étapes sont dans la fiche, au-dessus du graphique (Julien, 25/11/2026).
// Elles ont vécu quelques heures dans la marge gauche de la page, sticky (PR
// 64) : cette colonne est retirée, la page ne rend plus que le cadre.
//
// La langue passe dans l'adresse du cadre, et le cadre est recréé quand elle
// change (`key`) : le sélecteur FR / EN rafraîchit la page sans la recharger,
// un cadre à l'adresse inchangée gardait donc l'ancienne langue.
export function CapTableInteractive({ title, locale }: { title: string; locale: Locale }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  // La hauteur du contenu, relue à chaque fois qu'il change (étape choisie,
  // largeur de la fenêtre).
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let observer: ResizeObserver | null = null;
    const watch = () => {
      observer?.disconnect();
      const body = el.contentDocument?.body;
      if (!body) return;
      const measure = () => setHeight(Math.ceil(body.scrollHeight));
      observer = new ResizeObserver(measure);
      observer.observe(body);
      measure();
    };
    el.addEventListener("load", watch);
    // Déjà chargé avant l'hydratation : on mesure tout de suite.
    if (el.contentDocument?.readyState === "complete") watch();
    return () => {
      el.removeEventListener("load", watch);
      observer?.disconnect();
    };
  }, [locale]);

  return (
    <iframe
      key={locale}
      ref={frame}
      src={`/api/captable?lang=${locale}`}
      title={title}
      className="mt-6 min-h-[640px] w-full"
      style={height === null ? undefined : { height }}
    />
  );
}
