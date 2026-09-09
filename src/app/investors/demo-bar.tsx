"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Commandes de la démo, dans l'en-tête à la place de « Se déconnecter ».
// Volontairement sobres : elles restent visibles en partage d'écran.
export function DemoBar({ level2 }: { level2: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setLevel2(next: boolean) {
    setBusy(true);
    await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level2: next }),
    }).catch(() => null);
    setBusy(false);
    router.refresh();
  }

  async function exit() {
    setBusy(true);
    await fetch("/api/demo", { method: "DELETE" }).catch(() => null);
    window.location.href = "/admin";
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs">
      <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 font-medium text-marsala">
        Démo
      </span>
      <button
        onClick={() => setLevel2(!level2)}
        disabled={busy}
        className="text-neutral-500 hover:underline disabled:opacity-50"
      >
        {level2 ? "Reverrouiller le niveau 2" : "Ouvrir le niveau 2"}
      </button>
      <button
        onClick={exit}
        disabled={busy}
        className="text-neutral-500 hover:underline disabled:opacity-50"
      >
        Quitter la démo
      </button>
    </div>
  );
}
