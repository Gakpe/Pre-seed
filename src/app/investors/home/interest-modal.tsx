"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deal, dealFor } from "@/lib/deal";
import { t, type Locale } from "@/lib/i18n";

// Bouton + pop-up de manifestation d'intérêt (fond flouté).
// Valider notifie l'équipe (event + notification Yao) et débloque le niveau 2.
export function InterestModal({
  locale,
  demo = false,
}: {
  locale: Locale;
  demo?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // La valeur enregistrée reste le libellé français : c'est elle que l'admin
  // relit dans la fiche investisseur. Seul l'affichage est traduit.
  const [tranche, setTranche] = useState<string>(deal.tranches[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const trancheLabels = dealFor(locale).tranches;

  async function submit() {
    setStatus("sending");
    // En démo, l'intérêt vit dans le cookie de démo : rien en base, aucune
    // notification à l'équipe, mais le parcours reste identique à l'écran. Et
    // le niveau 2 s'ouvre dans la foulée : en vrai l'équipe le fait à la main
    // dans l'heure, en démo on montre tout de suite ce que ça ouvre.
    const res = await fetch(demo ? "/api/demo" : "/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(demo ? { tranche, level2: true } : { tranche }),
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
        {t(locale, "interest.cta")}
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
            <h3 className="text-base font-semibold">
              {t(locale, "interest.title")}
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {t(locale, "interest.body")}
            </p>
            <label htmlFor="tranche" className="mt-5 block text-sm font-medium">
              {t(locale, "interest.tranche")}
            </label>
            <select
              id="tranche"
              value={tranche}
              onChange={(e) => setTranche(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm"
            >
              {deal.tranches.map((value, i) => (
                <option key={value} value={value}>
                  {trancheLabels[i]}
                </option>
              ))}
            </select>
            {status === "error" && (
              <p className="mt-3 text-sm text-red-600">
                {t(locale, "interest.error")}
              </p>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={submit}
                disabled={status === "sending"}
                className="flex-1 rounded-md bg-marsala py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending"
                  ? t(locale, "interest.sending")
                  : t(locale, "interest.submit")}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
              >
                {t(locale, "common.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
