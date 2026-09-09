"use client";

import { useEffect, useRef } from "react";

// Entrée par la droite au défilement. Un IntersectionObserver pose la classe
// une fois, sans la retirer : une note d'investissement se relit, et un bloc
// qui rejoue son animation à chaque passage devient une gêne.
//
// La classe est posée directement sur le nœud plutôt que par un état React :
// c'est une décoration, elle n'a aucune raison de déclencher un rendu. Et
// l'animation vit en CSS (`.sr` / `.sr-in`), ce qui laisse
// prefers-reduced-motion la neutraliser sans passer par le JavaScript.
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Décalage en ms, pour que deux blocs voisins n'entrent pas ensemble. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sans IntersectionObserver, le contenu s'affiche simplement.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("sr-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("sr-in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sr ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
