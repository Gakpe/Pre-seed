"use client";

import { useEffect, useRef, useState } from "react";

// Cinématique d'entrée, jouée uniquement au moment où la personne entre
// vraiment dans l'espace : après validation du code (flag posé par le
// formulaire) ou arrivée par le lien email (?welcome=1 posé par le callback).
// Séquence : fondu d'entrée → icône (spring) → wordmark révélé → fondu de sortie.
export function Splash() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"fadein" | "icon" | "logo" | "out">(
    "fadein"
  );
  // Le déclencheur est à usage unique : on l'efface dès qu'on l'a lu. Or en
  // développement React monte l'effet deux fois, sans cette mémoire, le
  // second passage ne retrouverait rien, n'armerait plus les minuteries, et
  // le voile resterait affiché pour toujours.
  const playRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (playRef.current === null) {
      const fromCode =
        window.sessionStorage.getItem("minah_splash_pending") === "1";
      const params = new URLSearchParams(window.location.search);
      const fromLink = params.has("welcome");
      playRef.current = fromCode || fromLink;

      if (playRef.current) {
        window.sessionStorage.removeItem("minah_splash_pending");
        if (fromLink) {
          params.delete("welcome");
          const qs = params.toString();
          window.history.replaceState(
            null,
            "",
            window.location.pathname + (qs ? `?${qs}` : "")
          );
        }
      }
    }
    if (!playRef.current) return;

    setShow(true);
    setPhase("fadein");
    const timers = [
      setTimeout(() => setPhase("icon"), 60),
      setTimeout(() => setPhase("logo"), 1050),
      setTimeout(() => setPhase("out"), 2800),
      setTimeout(() => setShow(false), 3700),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!show) return null;

  return (
    <div
      // Filet de sécurité : un clic passe la cinématique. Si une minuterie
      // saute, l'espace ne reste jamais inaccessible derrière le voile.
      onClick={() => setShow(false)}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-[900ms] ease-out ${
        phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* halo */}
      <div className="splash-halo absolute h-64 w-64 rounded-full bg-brand/15 blur-3xl" />

      {/* 1. l'icône surgit en douceur */}
      {phase !== "logo" && phase !== "out" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/icon.png"
          alt=""
          className={`h-16 w-16 rounded-full shadow-lg ${
            phase === "icon" ? "splash-pop" : "opacity-0"
          }`}
        />
      )}

      {/* 2. le wordmark se révèle */}
      {(phase === "logo" || phase === "out") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/logo.png"
          alt="Minah"
          className="splash-reveal h-10 w-auto md:h-12"
        />
      )}
    </div>
  );
}
