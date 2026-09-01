"use client";

import { useEffect, useRef, useState } from "react";

// Cinématique du logo à l'arrivée dans l'espace connecté.
// Jouée une fois par session (sessionStorage), fondu de sortie, filet de
// sécurité à 6 s si la vidéo ne se lance pas.
export function Splash() {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("minah_splash_seen")) return;
    window.sessionStorage.setItem("minah_splash_seen", "1");
    setShow(true);
    const failsafe = setTimeout(() => end(), 6000);
    return () => clearTimeout(failsafe);
  }, []);

  function end() {
    if (doneRef.current) return;
    doneRef.current = true;
    setFading(true);
    setTimeout(() => setShow(false), 700);
  }

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <video
        src="/brand/logo-anim.mp4"
        autoPlay
        muted
        playsInline
        onEnded={end}
        onError={end}
        className="w-56 md:w-72"
      />
    </div>
  );
}
