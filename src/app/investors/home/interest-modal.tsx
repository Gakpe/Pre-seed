"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deal } from "@/lib/deal";

// Bouton + pop-up de manifestation d'intérêt (fond flouté).
// Valider notifie l'équipe (event + notification Yao) et débloque le niveau 2.
export function InterestModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tranche, setTranche] = useState<string>(deal.tranches[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function submit() {
    setStatus("sending");
    const res = await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tranche }),
    }).catch(() => null);
    if (res?.ok) {
      setOpen(false);
      router.refresh();
    } else {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-marsala px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Manifester mon intérêt
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/25 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-foreground/10 bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold">Manifester mon intérêt</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Indiquez la tranche envisagée — indicatif et non engageant.
              L&apos;équipe est prévenue et le niveau 2 de la data room
              s&apos;ouvre immédiatement.
            </p>
            <label htmlFor="tranche" className="mt-5 block text-sm font-medium">
              Tranche envisagée
            </label>
            <select
              id="tranche"
              value={tranche}
              onChange={(e) => setTranche(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm"
            >
              {deal.tranches.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {status === "error" && (
              <p className="mt-3 text-sm text-red-600">Échec, réessayez.</p>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={submit}
                disabled={status === "sending"}
                className="flex-1 rounded-md bg-marsala py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending" ? "Envoi…" : "Valider mon intérêt"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
