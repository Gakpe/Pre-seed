"use client";

// Logo d'un partenaire, ou son nom en typographie à défaut.
// Partagé par le bandeau écosystème et les cartes d'objectif.
//
// Rien n'est chargé depuis un service tiers : une dataroom ne doit pas signaler à
// l'extérieur qui la consulte. Le fichier vit dans `public/partners/` et son chemin est
// renseigné dans `partners.ts`. Si le champ est vide ou le fichier manquant, on retombe
// sur le nom — déposer un logo n'est donc jamais bloquant.

import { useState } from "react";
import type { Partner } from "@/lib/roadmap/partners";

const INK = "#2C1716";

export function PartnerLogo({ p, height = 20, maxWidth = 130 }: { p: Partner; height?: number; maxWidth?: number }) {
  const [broken, setBroken] = useState(false);

  if (!p.logo || broken) {
    return (
      <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: height * 0.78, color: INK, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
        {p.nom}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={p.logo} alt={p.nom} onError={() => setBroken(true)} style={{ height, width: "auto", maxWidth, objectFit: "contain", display: "block" }} />;
}
