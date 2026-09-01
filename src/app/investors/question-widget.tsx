"use client";

import { useState } from "react";
import { deal } from "@/lib/deal";
import { track } from "@/lib/tracking";

// Pastille Minah en bas à droite : au survol « Posez-nous vos questions »,
// au clic un pop-up permet d'envoyer ses questions en amont du RDV.
export function QuestionWidget() {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function submit() {
    setStatus("sending");
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    }).catch(() => null);
    if (res?.ok) {
      setStatus("sent");
      track({ type: "cta_click", path: "/investors/home", label: "questions" });
    } else {
      setStatus("error");
    }
  }

  function close() {
    setOpen(false);
    if (status === "sent") {
      setBody("");
      setStatus("idle");
    }
  }

  return (
    <>
      <div className="group fixed right-5 bottom-5 z-40 flex items-center gap-2">
        <span className="pointer-events-none translate-x-1 rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 shadow transition-all group-hover:translate-x-0 group-hover:opacity-100">
          Posez-nous vos questions
        </span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Posez-nous vos questions"
          className="rounded-full shadow-md transition-transform hover:scale-105"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/icon.png"
            alt=""
            className="h-11 w-11 rounded-full"
          />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/25 p-6 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-xl border border-foreground/10 bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "sent" ? (
              <>
                <h3 className="text-base font-semibold">
                  Merci pour vos questions ✓
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Le plus simple pour y répondre : prenez un rendez-vous avec
                  l&apos;équipe. Sinon, nous reviendrons vers vous avec
                  l&apos;ensemble des réponses par écrit.
                </p>
                <div className="mt-5 flex gap-3">
                  <a
                    href={deal.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track({
                        type: "cta_click",
                        path: "/investors/home",
                        label: "rdv-equipe",
                      })
                    }
                    className="flex-1 rounded-md bg-marsala py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Prendre rendez-vous
                  </a>
                  <button
                    onClick={close}
                    className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
                  >
                    Fermer
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold">
                  Posez-nous vos questions
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Envoyez toutes vos questions en amont de notre échange —
                  l&apos;équipe les prépare pour le rendez-vous ou y répond par
                  écrit.
                </p>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Vos questions…"
                  className="mt-4 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500"
                />
                {status === "error" && (
                  <p className="mt-2 text-sm text-red-600">
                    Échec de l&apos;envoi, réessayez.
                  </p>
                )}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={submit}
                    disabled={status === "sending" || !body.trim()}
                    className="flex-1 rounded-md bg-marsala py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {status === "sending" ? "Envoi…" : "Envoyer"}
                  </button>
                  <button
                    onClick={close}
                    className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
                  >
                    Annuler
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
