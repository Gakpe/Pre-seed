"use client";

import { useState } from "react";
import { kupanda, kupandaTrancheLabels } from "@/lib/kupanda";
import { t, type Locale } from "@/lib/i18n";

// Bas de la term sheet Kupanda : un cadre qui invite à se déclarer intéressé,
// et un pop-up pour choisir une tranche. Même mécanique que la manifestation
// d'intérêt pour le tour (home/interest-modal.tsx), mais un autre objet :
// l'obligation, pas la levée. Rien ne se débloque, l'équipe est prévenue.
export function KupandaInterest({
  locale,
  existing,
  demo = false,
}: {
  locale: Locale;
  /** Dernier intérêt enregistré, pour ne pas redemander à qui l'a déjà dit. */
  existing: { tranche: string; created_at: string } | null;
  demo?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tranche, setTranche] = useState<string>(kupanda.tranches[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [sent, setSent] = useState<string | null>(null);
  const labels = kupandaTrancheLabels(locale);

  // Libellé traduit d'une tranche enregistrée en français.
  const label = (value: string) => {
    const i = (kupanda.tranches as readonly string[]).indexOf(value);
    return i === -1 ? value : labels[i];
  };

  async function submit() {
    setStatus("sending");
    if (demo) {
      // Démo : le parcours se joue à l'écran, rien ne part.
      setSent(tranche);
      setOpen(false);
      setStatus("idle");
      return;
    }
    const res = await fetch("/api/kupanda-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tranche }),
    }).catch(() => null);
    if (res?.ok) {
      setSent(tranche);
      setOpen(false);
      setStatus("idle");
    } else {
      setStatus("error");
    }
  }

  const done = sent ?? existing?.tranche ?? null;

  return (
    <section className="mt-12 rounded-xl border border-foreground/10 bg-white/60 px-6 py-8 text-center">
      <h2 className="text-2xl font-semibold leading-tight tracking-tight">
        {t(locale, "kupanda.title")}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[15px] leading-[1.8] text-neutral-700">
        {t(locale, "kupanda.body")}
      </p>

      {done ? (
        <div className="mt-6">
          <p className="text-sm font-medium">
            {t(locale, "kupanda.done")} {label(done)}.
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            {t(locale, "kupanda.doneBody")}
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 text-sm text-neutral-600 underline-offset-2 hover:underline"
          >
            {t(locale, "kupanda.change")}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mt-6 rounded-md bg-marsala px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t(locale, "kupanda.cta")}
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/25 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-foreground/10 bg-background p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold">{t(locale, "kupanda.cta")}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {t(locale, "kupanda.modalBody")}
            </p>
            <label htmlFor="kupanda-tranche" className="mt-5 block text-sm font-medium">
              {t(locale, "kupanda.tranche")}
            </label>
            <select
              id="kupanda-tranche"
              value={tranche}
              onChange={(e) => setTranche(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm"
            >
              {kupanda.tranches.map((value, i) => (
                <option key={value} value={value}>
                  {labels[i]}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-5 text-neutral-500">
              {t(locale, "kupanda.minimum")}
            </p>
            {status === "error" && (
              <p className="mt-3 text-sm text-red-600">{t(locale, "interest.error")}</p>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={submit}
                disabled={status === "sending"}
                className="flex-1 rounded-md bg-marsala py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending"
                  ? t(locale, "interest.sending")
                  : t(locale, "kupanda.submit")}
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
    </section>
  );
}
