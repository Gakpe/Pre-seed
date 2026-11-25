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
// La langue passe dans l'adresse du cadre, et le cadre est recréé quand elle
// change (`key`) : le sélecteur FR / EN rafraîchit la page sans la recharger,
// un cadre à l'adresse inchangée gardait donc l'ancienne langue.
//
// Les étapes (Hervé, 25/11/2026) vivent dans la marge gauche de la page, hors
// du cadre du contenu, et restent au milieu de l'écran pendant le défilement.
// Elles sont rendues ici, dans la page, et non dans la fiche : c'est la page
// qui défile, et seul un élément de la page peut être réellement sticky. La
// fiche envoie la liste des étapes et l'étape choisie (`minah-captable`), la
// page lui renvoie le clic (`__cap.go`). Aucun chiffre ne transite : des noms
// d'étape et des dates. Sans marge (téléphone), la fiche garde ses étapes en
// barre au-dessus du graphique.

// Colonne des étapes : pleine (176 px) ou numéros seuls (44 px), à 20 px du contenu.
const RAIL_FULL = 176;
const RAIL_COMPACT = 44;
const GAP = 20;

type Step = { label: string; date: string; done: boolean };
type CapWindow = Window & { __cap?: { go: (i: number) => void } };

export function CapTableInteractive({ title, locale }: { title: string; locale: Locale }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const nav = useRef<HTMLDivElement>(null);
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

  // La place que la marge laisse aux étapes : pleine (numéro, nom, date) dès
  // 150 px, noms seuls dès 110 px, numéros seuls au-dessous, rien sans marge.
  const [rail, setRail] = useState<{ w: number; mode: "full" | "names" | "compact" } | null>(null);
  useEffect(() => {
    const box = frame.current?.parentElement?.parentElement;
    if (!box) return;
    const check = () => {
      const avail = box.getBoundingClientRect().left + parseFloat(getComputedStyle(box).paddingLeft) - 12 - GAP;
      if (avail >= 150) setRail({ w: Math.min(RAIL_FULL, avail), mode: "full" });
      else if (avail >= 110) setRail({ w: avail, mode: "names" });
      else if (avail >= RAIL_COMPACT) setRail({ w: RAIL_COMPACT, mode: "compact" });
      else setRail(null);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [locale]);

  // La fiche range ses propres étapes quand la page les affiche (classe `ext`).
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const apply = () => el.contentDocument?.body?.classList.toggle("ext", rail !== null);
    apply();
    el.addEventListener("load", apply);
    return () => el.removeEventListener("load", apply);
  }, [rail, locale]);

  // Les étapes et l'étape choisie, envoyées par la fiche à chaque rendu.
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || e.data?.type !== "minah-captable") return;
      setSteps(e.data.steps);
      setStage(e.data.stage);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  const go = (i: number) => (frame.current?.contentWindow as CapWindow | null)?.__cap?.go(i);

  // Centrée dans l'écran une fois collée : on retient sa hauteur.
  const [navH, setNavH] = useState(280);
  useEffect(() => {
    const el = nav.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNavH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [rail, steps]);

  return (
    <div className="relative mt-6">
      {rail && steps && (
        <nav
          aria-label={locale === "en" ? "Steps" : "Étapes"}
          className="absolute top-0 bottom-0"
          style={{ left: -(rail.w + GAP), width: rail.w }}
        >
          <div ref={nav} className="sticky flex flex-col gap-1.5" style={{ top: `calc(50vh - ${navH / 2}px)` }}>
            {steps.map((s, i) => {
              const on = i === stage;
              return (
                <button
                  key={i}
                  type="button"
                  title={s.label}
                  aria-pressed={on}
                  onClick={() => go(i)}
                  className={`flex w-full cursor-pointer items-center rounded-[10px] border text-left transition-colors ${
                    rail.mode === "compact" ? "justify-center p-2" : rail.mode === "names" ? "gap-[7px] px-1.5 py-2" : "gap-2.5 py-[9px] pl-2 pr-2.5"
                  } ${
                    on
                      ? "border-[rgb(242_100_4/0.35)] bg-[rgb(242_100_4/0.1)] text-[#61100d]"
                      : `bg-white/60 text-foreground/75 hover:border-foreground/30 hover:text-foreground ${
                          s.done ? "border-foreground/10" : "border-dashed border-foreground/15"
                        }`
                  }`}
                >
                  <span
                    className={`grid shrink-0 place-items-center rounded-[7px] font-mono text-[11px] font-semibold ${
                      rail.mode === "names" ? "size-[22px]" : "size-[26px]"
                    } ${on ? "bg-[#61100d] text-white" : "bg-background text-[#61100d] shadow-[inset_0_0_0_1px_rgb(242_100_4/0.25)]"}`}
                  >
                    {i + 1}
                  </span>
                  {rail.mode !== "compact" && (
                    <span className="flex min-w-0 flex-col leading-tight">
                      <b className={`font-semibold ${rail.mode === "names" ? "text-[13px]" : "text-sm"}`}>{s.label}</b>
                      {rail.mode === "full" && <i className="text-xs not-italic text-foreground/60">{s.date}</i>}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
      <iframe
        key={locale}
        ref={frame}
        src={`/api/captable?lang=${locale}`}
        title={title}
        className="block min-h-[640px] w-full"
        style={height === null ? undefined : { height }}
      />
    </div>
  );
}
