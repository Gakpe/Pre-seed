"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "@/lib/market-note";

// Fil d'Ariane vertical de la note de marché : le titre, les trois chapitres et
// la conclusion. Le trait se remplit à mesure qu'on descend, et chaque entrée
// ramène à sa section.
//
// Il vit dans la marge gauche, hors de la colonne de lecture, et n'apparaît
// qu'au-delà de 1340 px : en deçà, la marge ne suffit pas et il viendrait
// mordre sur le texte.
//
// La position est lue au défilement plutôt que par IntersectionObserver : ce
// qu'on veut n'est pas « la section est visible » mais « la section que je suis
// en train de lire », c'est-à-dire celle qui couvre le tiers haut du cadre.

export function NoteRail({ title }: { title: string }) {
  const [active, setActive] = useState<string>(CHAPTERS[0].id);
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const read = () => {
      frame.current = null;
      const marker = window.innerHeight * 0.34;

      let current: string = CHAPTERS[0].id;
      for (const chapter of CHAPTERS) {
        const el = document.getElementById(chapter.id);
        if (el && el.getBoundingClientRect().top <= marker) current = chapter.id;
      }
      setActive(current);

      // Avancée dans la note, bornée : le trait ne recule pas sous zéro et ne
      // déborde pas en fin de page.
      const first = document.getElementById(CHAPTERS[0].id);
      const last = document.getElementById(CHAPTERS[CHAPTERS.length - 1].id);
      if (first && last) {
        const start = first.offsetTop;
        const end = last.offsetTop + last.offsetHeight;
        const here = window.scrollY + marker;
        const ratio = (here - start) / Math.max(end - start, 1);
        setProgress(Math.min(1, Math.max(0, ratio)));
      }
    };

    const onScroll = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav
      aria-label={title}
      className="fixed top-1/2 left-[calc((100vw-880px)/2-206px)] z-20 hidden w-[182px] -translate-y-1/2 min-[1340px]:block"
    >
      <p className="font-[family-name:var(--font-serif)] text-[13px] leading-snug font-semibold text-note-ink">
        {title}
      </p>

      <div className="relative mt-4 pl-5">
        {/* Rail : un trait clair, et par-dessus le trait accent qui descend. */}
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-0 w-px bg-note-border-strong"
        />
        <span
          aria-hidden
          className="absolute top-1 left-0 w-px origin-top bg-note-accent transition-transform duration-200 ease-out"
          style={{
            bottom: "0.25rem",
            transform: `scaleY(${progress})`,
          }}
        />

        <ol className="space-y-3.5">
          {CHAPTERS.map((chapter) => {
            const on = active === chapter.id;
            return (
              <li key={chapter.id} className="relative">
                {/* Puce du chapitre en cours, posée sur le rail. */}
                <span
                  aria-hidden
                  className={`absolute top-[7px] -left-5 h-1.5 w-1.5 -translate-x-[3px] rounded-full transition-colors duration-200 ${
                    on ? "bg-note-accent" : "bg-transparent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => goTo(chapter.id)}
                  aria-current={on ? "true" : undefined}
                  className="group block w-full rounded text-left outline-none ring-brand/60 ring-offset-2 ring-offset-background focus-visible:ring-2"
                >
                  <span
                    className={`block font-mono text-[10px] tracking-widest transition-colors ${
                      on ? "text-note-accent" : "text-note-muted"
                    }`}
                  >
                    {chapter.num}
                  </span>
                  <span
                    className={`mt-0.5 block text-[12px] leading-[1.35] transition-colors ${
                      on
                        ? "font-medium text-note-ink"
                        : "text-note-muted group-hover:text-note-ink"
                    }`}
                  >
                    {chapter.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
