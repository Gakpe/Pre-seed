"use client";

import { useEffect, useState } from "react";

// Vrai quand la ligne horizontale située à `fromBottom` pixels du bas de
// l'écran traverse une section sombre (`data-note-dark`, la carte des taux de
// la note de marché). Sert aux éléments flottants du bas d'écran, bouton de
// questions et retour en haut, pour que leurs infobulles restent lisibles.
export function useOverDark(fromBottom: number) {
  const [over, setOver] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const y = window.innerHeight - fromBottom;
      setOver(
        Array.from(document.querySelectorAll("[data-note-dark]")).some((el) => {
          const r = el.getBoundingClientRect();
          return r.top < y && r.bottom > y;
        })
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [fromBottom]);

  return over;
}
