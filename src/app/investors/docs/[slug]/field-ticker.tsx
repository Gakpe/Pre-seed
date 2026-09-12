"use client";

import { useEffect, useRef } from "react";

const SLOW = 0.4; // vitesse de croisière (px/frame)
const FAST = 7; // vitesse quand on maintient la flèche

// Bandeau photos « sur le terrain ». Défilé auto continu (scrollLeft animé en
// rAF, en boucle sur une série dupliquée). L'auto se met en pause au survol et
// s'efface pendant un scroll manuel (molette/trackpad/tactile) pour ne pas
// lutter contre l'utilisateur. La flèche : un clic avance d'un cran ; la
// maintenir accélère le défilé. prefers-reduced-motion coupe l'auto mais laisse
// le scroll natif et la flèche utilisables.
export function FieldTicker({
  items,
  advanceLabel,
}: {
  items: { src: string; t: string; d?: string }[];
  advanceLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useRef(false);
  const speed = useRef(SLOW);
  const manualUntil = useRef(0); // horodatage jusqu'auquel l'auto s'efface
  const pressAt = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const step = () => {
      if (!hover.current && performance.now() >= manualUntil.current) {
        el.scrollLeft += speed.current;
        const half = el.scrollWidth / 2; // une série : boucle sans couture
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const holdManual = () => {
    manualUntil.current = performance.now() + 1400;
  };

  const advance = () => {
    const el = ref.current;
    if (!el) return;
    manualUntil.current = performance.now() + 900; // laisse le smooth finir
    el.scrollBy({ left: Math.max(260, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="mt-5">
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          aria-label={advanceLabel}
          title={advanceLabel}
          onPointerDown={() => {
            pressAt.current = performance.now();
            speed.current = FAST;
            manualUntil.current = 0; // accélérer prime sur tout
          }}
          onPointerUp={() => {
            speed.current = SLOW;
            if (performance.now() - pressAt.current < 180) advance(); // clic bref
          }}
          onPointerLeave={() => (speed.current = SLOW)}
          onPointerCancel={() => (speed.current = SLOW)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              advance();
            }
          }}
          className="halo-hover inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-[12px] font-semibold text-marsala transition-colors hover:bg-brand/15 active:bg-brand/20"
        >
          {advanceLabel}
          <span aria-hidden className="text-sm">
            →
          </span>
        </button>
      </div>
      <div
        ref={ref}
        onMouseEnter={() => (hover.current = true)}
        onMouseLeave={() => (hover.current = false)}
        onWheel={holdManual}
        onTouchStart={holdManual}
        onTouchMove={holdManual}
        className="field-scroll flex"
      >
        {[...items, ...items].map((it, i) => (
          <figure key={i} className="mr-4 flex-none">
            {/* Cadre paysage uniforme. Fond = la même image floutée pour remplir
                sans laisser de vide ; l'image nette est posée entière par-dessus
                (object-contain), donc les portraits ne sont pas coupés. */}
            <div className="relative h-44 w-64 overflow-hidden rounded-lg bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                alt={it.d ? `${it.t} — ${it.d}` : it.t}
                className="relative h-full w-full object-contain"
              />
            </div>
            <figcaption className="mt-1.5 w-64 text-[11px] leading-4 text-neutral-500">
              <span className="font-semibold text-neutral-700">{it.t}</span>
              {it.d ? <> — {it.d}</> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
