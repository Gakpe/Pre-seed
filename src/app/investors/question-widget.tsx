"use client";

import { useState } from "react";
import { deal } from "@/lib/deal";
import { track } from "@/lib/tracking";
import { t, type Locale } from "@/lib/i18n";
import { useOverDark } from "@/lib/use-over-dark";

const MAX_QUESTIONS = 8;

// Pastille Minah en bas à droite : au survol « Posez-nous vos questions »,
// au clic un pop-up permet d'envoyer plusieurs questions distinctes (bouton +),
// chacune avec son contexte, en amont du RDV.
export function QuestionWidget({
  locale,
  demo = false,
}: {
  locale: Locale;
  demo?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // Infobulle en crème sur la section sombre de la note de marché : en brun,
  // elle s'y fondait.
  const overDark = useOverDark(42);
  const [questions, setQuestions] = useState<string[]>([""]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const filled = questions.map((q) => q.trim()).filter(Boolean);

  async function submit() {
    setStatus("sending");
    // En démo on montre l'écran de confirmation sans rien envoyer à l'équipe.
    if (demo) {
      setStatus("sent");
      return;
    }
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: filled }),
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
      setQuestions([""]);
      setStatus("idle");
    }
  }

  function setQuestion(i: number, value: string) {
    setQuestions((qs) => qs.map((q, j) => (j === i ? value : q)));
  }

  return (
    <>
      {/* z-50 : son infobulle passe devant le bouton retour en haut (z-40), posé
          sur la même ligne dans la marge. Le conteneur laisse passer les clics
          (pointer-events-none) : sa zone couvre aussi l'infobulle invisible, et
          rendait le bouton retour en haut incliquable. */}
      <div className="group pointer-events-none fixed right-4 bottom-4 z-50 flex items-center gap-2 sm:right-5 sm:bottom-5">
        <span
          className={`pointer-events-none translate-x-1 rounded-md px-2.5 py-1 text-xs opacity-0 shadow transition-all group-hover:translate-x-0 group-hover:opacity-100 ${
            overDark ? "bg-background text-foreground" : "bg-foreground text-background"
          }`}
        >
          {t(locale, "widget.hover")}
        </span>
        <button
          onClick={() => setOpen(true)}
          aria-label={t(locale, "widget.hover")}
          className="pointer-events-auto rounded-full shadow-md transition-transform hover:scale-105"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/icon.png" alt="" className="h-9 w-9 rounded-full sm:h-11 sm:w-11" />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/25 p-6 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl border border-foreground/10 bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "sent" ? (
              <>
                <h3 className="text-base font-semibold">
                  {t(locale, "widget.thanks.title")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {t(locale, "widget.thanks.body")}
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
                    {t(locale, "meeting.cta")}
                  </a>
                  <button
                    onClick={close}
                    className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
                  >
                    {t(locale, "common.close")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold">
                  {t(locale, "widget.title")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {t(locale, "widget.intro")}
                </p>

                <div className="mt-4 space-y-3">
                  {questions.map((q, i) => (
                    <div key={i}>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">
                        {t(locale, "widget.questionLabel", { n: i + 1 })}
                      </label>
                      <textarea
                        value={q}
                        onChange={(e) => setQuestion(i, e.target.value)}
                        rows={2}
                        placeholder={t(locale, "widget.placeholder")}
                        className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500"
                      />
                    </div>
                  ))}
                </div>

                {questions.length < MAX_QUESTIONS && (
                  <button
                    onClick={() => setQuestions((qs) => [...qs, ""])}
                    className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-foreground"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-400 text-xs leading-none">
                      +
                    </span>
                    {t(locale, "widget.add")}
                  </button>
                )}

                {status === "error" && (
                  <p className="mt-2 text-sm text-red-600">
                    {t(locale, "widget.error")}
                  </p>
                )}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={submit}
                    disabled={status === "sending" || filled.length === 0}
                    className="flex-1 rounded-md bg-marsala py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {status === "sending"
                      ? t(locale, "widget.sending")
                      : filled.length > 1
                        ? t(locale, "widget.send.many", { n: filled.length })
                        : t(locale, "widget.send.one")}
                  </button>
                  <button
                    onClick={close}
                    className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
                  >
                    {t(locale, "common.cancel")}
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
