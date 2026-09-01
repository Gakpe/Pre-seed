"use client";

import { useEffect, useState } from "react";

// Cinématique d'entrée : l'icône Minah surgit (spring), puis le wordmark se
// révèle par balayage, halo orange en fond. Une fois par session.
export function Splash() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"icon" | "logo" | "out">("icon");

  useEffect(() => {
    if (window.sessionStorage.getItem("minah_splash_seen")) return;
    window.sessionStorage.setItem("minah_splash_seen", "1");
    setShow(true);
    const t1 = setTimeout(() => setPhase("logo"), 850);
    const t2 = setTimeout(() => setPhase("out"), 2500);
    const t3 = setTimeout(() => setShow(false), 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ease-out ${
        phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* halo */}
      <div className="absolute h-64 w-64 rounded-full bg-brand/15 blur-3xl splash-halo" />

      {/* 1. l'icône surgit */}
      {phase === "icon" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/icon.png"
          alt=""
          className="splash-pop h-16 w-16 rounded-full shadow-lg"
        />
      )}

      {/* 2. le wordmark se révèle */}
      {phase !== "icon" && (
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
