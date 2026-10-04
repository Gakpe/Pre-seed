"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Phase } from "@/lib/roadmap/types";
import { STATUS_STYLE } from "@/lib/roadmap/labels";
import { ArchitectureBoard, CapacityLine, type BoardItem } from "../roadmap/ArchitectureBoard";
import { ECO_ITEMS, ECO_LAYERS, ECO_META, ecoStatuses, type EcoItem } from "@/lib/ecosystem/seed";
import { ecoCopy } from "@/lib/ecosystem/i18n";

// Roadmap écosystème : même frise, mêmes trois couleurs que la roadmap
// technique, d'autres couches. La technique dit ce qu'on construit ; celle-ci
// dit avec qui, et pour quel volume. Brouillon du 04/10/2026.

const INK = "#2C1716";
const MUTED = "#766962";
const FAINT = "#A39A8E";
const LINE = "#E6E1D4";

export function EcosystemRoadmap({ locale, draft = false }: { locale: Locale; draft?: boolean }) {
  const c = ecoCopy(locale);
  const l = locale === "en" ? "en" : "fr";
  const [phase, setPhase] = useState<Phase>("b2b");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items: BoardItem[] = useMemo(
    () => ECO_ITEMS.map((it) => ({ id: it.id, titre: it.titre[l], couche: it.couche, ordre: it.ordre, livreEn: it.depuis, statutsParPhase: ecoStatuses(it) })),
    [l]
  );
  const experience = useMemo(
    () => Object.fromEntries(Object.entries(ECO_META.experienceParPhase).map(([p, t]) => [p, t[l]])) as Record<Phase, string>,
    [l]
  );
  const cap = ECO_META.capacitesParPhase[phase];
  const selected = selectedId ? ECO_ITEMS.find((it) => it.id === selectedId) ?? null : null;

  return (
    <div className="mt-8">
      {draft && (
        <p style={{ margin: "0 0 20px", padding: "10px 14px", borderRadius: 8, background: "#FCE6D3", color: "#6B3A0E", fontSize: 13 }}>{c.draftBanner}</p>
      )}
      <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 30, fontWeight: 400, color: INK, lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 10px", maxWidth: 820 }}>
        {ECO_META.vision[l]}
      </p>
      <p style={{ fontSize: 15, color: MUTED, margin: "0 0 28px", maxWidth: 640, lineHeight: 1.6 }}>{c.intro}</p>

      <ul style={{ listStyle: "none", margin: "0 0 14px", padding: 0, display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: 12.5, color: MUTED }}>
        {(["livre", "en_cours", "prevu"] as const).map((status) => {
          const st = STATUS_STYLE[status];
          return (
            <li key={status} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden style={{ width: 22, height: 14, borderRadius: 4, background: st.bg, border: `1px ${status === "prevu" ? "dashed" : "solid"} ${st.border}`, display: "inline-block" }} />
              <span style={{ color: INK, fontWeight: 600 }}>{c.labels.statuses[status]}</span>
              <span>{c.legend[status]}</span>
            </li>
          );
        })}
      </ul>

      <section style={{ background: "#FFFFFE", border: `1px solid ${LINE}`, borderRadius: 16, padding: "26px 28px 26px" }}>
        <ArchitectureBoard
          objectifs={items}
          layers={ECO_LAYERS}
          layerLabels={c.layers}
          phase={phase}
          onPhaseChange={setPhase}
          onSelect={setSelectedId}
          selectedId={selectedId}
          labels={c.labels}
          experience={experience}
          locale={locale === "fr" ? "fr-FR" : "en-US"}
          todayLabel={c.today}
          highlightExperience
        />
        <CapacityLine cap={{ capacite: cap.capacite[l], volume: cap.volume[l] }} labels={c.labels} />
      </section>

      <p style={{ marginTop: 28, fontSize: 12, color: FAINT }}>{c.footer}</p>

      {selected && <EcoCardModal item={selected} locale={l} copy={c} onClose={() => setSelectedId(null)} />}
    </div>
  );
}

// La carte d'un partenaire : quatre champs, toujours les mêmes. Statut dans la
// hiérarchie de validation, ce qu'il apporte, depuis quand, prochaine étape.
function EcoCardModal({ item, locale, copy, onClose }: { item: EcoItem; locale: "fr" | "en"; copy: ReturnType<typeof ecoCopy>; onClose: () => void }) {
  const st = STATUS_STYLE[ecoStatuses(item)[item.depuis]];
  const dt: React.CSSProperties = { color: FAINT, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 2 };
  const dd: React.CSSProperties = { margin: 0, color: INK, lineHeight: 1.5 };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(44,23,22,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFFFFE", borderRadius: 16, width: "100%", maxWidth: 560, padding: "26px 28px 22px", boxShadow: "0 8px 40px rgba(44,23,22,.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, color: INK }}>{item.titre[locale]}</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
            {copy.validation[item.validation]}
          </span>
          {item.aConfirmer && (
            <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, border: "1px dashed #C9C1B3", color: MUTED }}>{copy.toConfirm}</span>
          )}
        </div>
        <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 10, columnGap: 16, fontSize: 13.5 }}>
          <dt style={dt}>{copy.card.brings}</dt>
          <dd style={dd}>{item.apporte[locale]}</dd>
          <dt style={dt}>{copy.card.since}</dt>
          <dd style={dd}>{copy.labels.phases[item.depuis]}</dd>
          {item.preuve && (<><dt style={dt}>{copy.card.proof}</dt><dd style={dd}>{item.preuve[locale]}</dd></>)}
          {item.prochaineEtape && (<><dt style={dt}>{copy.card.next}</dt><dd style={{ ...dd, color: MUTED }}>{item.prochaineEtape[locale]}</dd></>)}
        </dl>
        <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer noopener" style={{ fontSize: 12.5, color: INK, whiteSpace: "nowrap" }}>
              {copy.card.link} ↗
            </a>
          ) : <span />}
          <button type="button" onClick={onClose} style={{ background: "none", border: `1px solid ${LINE}`, borderRadius: 8, padding: "7px 14px", fontSize: 12.5, color: MUTED, cursor: "pointer" }}>
            {copy.card.close}
          </button>
        </div>
      </div>
    </div>
  );
}
