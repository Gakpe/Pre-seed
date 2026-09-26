"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Commandes clavier de la démonstration, sans rien à l'écran : l'invité
// regarde le partage d'écran, l'admin pilote depuis le clavier.
//   ⌥⇧2  ouvre ou reverrouille le niveau 2
//   ⌥⇧Q  quitte la démo et revient sur l'admin
// Les mêmes commandes existent en boutons dans la barre admin (DemoBar).
export function DemoHotkeys({ level2 }: { level2: boolean }) {
  const router = useRouter();
  const busy = useRef(false);

  useEffect(() => {
    async function onKey(event: KeyboardEvent) {
      if (!event.altKey || !event.shiftKey || busy.current) return;
      if (event.code === "Digit2") {
        event.preventDefault();
        busy.current = true;
        await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level2: !level2 }),
        }).catch(() => null);
        busy.current = false;
        router.refresh();
      } else if (event.code === "KeyQ") {
        event.preventDefault();
        busy.current = true;
        await fetch("/api/demo", { method: "DELETE" }).catch(() => null);
        window.location.href = "/admin";
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level2, router]);

  return null;
}
