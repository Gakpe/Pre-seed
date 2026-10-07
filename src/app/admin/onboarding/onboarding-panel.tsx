"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { InterestState, Onboarding, WelcomeStep } from "@/lib/onboarding";
import type { InvestorStatus } from "@/lib/types";
import { Welcome } from "@/app/investors/home/welcome";

export type DocOption = { slug: string; title: string; category: string; level: number };

export type OnboardingView = {
  onboarding: Onboarding;
  status: InvestorStatus | null;
  preapproved: boolean;
  preview: { message: string | null; steps: WelcomeStep[]; interest: InterestState };
};

const STATUS: Record<InvestorStatus, string> = {
  pending: "inscrit, en attente",
  approved: "inscrit, validé",
  blocked: "inscrit, bloqué",
};

type Form = {
  email: string;
  note: string;
  message_fr: string;
  message_en: string;
  focus_slugs: string[];
  unlocked_slugs: string[];
  preapprove: boolean;
};

const EMPTY: Form = {
  email: "",
  note: "",
  message_fr: "",
  message_en: "",
  focus_slugs: [],
  unlocked_slugs: [],
  preapprove: true,
};

const INPUT =
  "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500";

export function OnboardingPanel({
  views,
  docs,
  defaultFocus,
}: {
  views: OnboardingView[];
  docs: DocOption[];
  defaultFocus: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const titleOf = (slug: string) => docs.find((d) => d.slug === slug)?.title ?? slug;

  async function call(method: "POST" | "DELETE", payload: unknown) {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/onboardings", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    setBusy(false);
    const data = await res?.json().catch(() => null);
    if (!res?.ok) {
      setError(data?.error ?? "Échec, réessayez.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await call("POST", form)) setForm(EMPTY);
  }

  function edit(o: Onboarding) {
    setForm({
      email: o.email,
      note: o.note ?? "",
      message_fr: o.message_fr ?? "",
      message_en: o.message_en ?? "",
      focus_slugs: o.focus_slugs,
      unlocked_slugs: o.unlocked_slugs,
      preapprove: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // L'ordre des fiches mises en avant est l'ordre dans lequel on les coche.
  function toggle(key: "focus_slugs" | "unlocked_slugs", slug: string) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(slug) ? f[key].filter((s) => s !== slug) : [...f[key], slug],
    }));
  }

  return (
    <>
      <form onSubmit={save} className="mt-8 space-y-5 rounded-lg border border-foreground/10 bg-white/50 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Adresse</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="prenom@fonds.com"
              className={`mt-1.5 font-mono text-[13px] ${INPUT}`}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Note interne</span>
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="ses interrogations, d'où vient le contact…"
              className={`mt-1.5 ${INPUT}`}
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Message d&apos;accueil, français</span>
            <textarea
              value={form.message_fr}
              onChange={(e) => setForm({ ...form, message_fr: e.target.value })}
              rows={5}
              placeholder="Vide : le texte de l'accueil par défaut."
              className={`mt-1.5 ${INPUT}`}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Message d&apos;accueil, anglais</span>
            <textarea
              value={form.message_en}
              onChange={(e) => setForm({ ...form, message_en: e.target.value })}
              rows={5}
              placeholder="Vide : le message français."
              className={`mt-1.5 ${INPUT}`}
            />
          </label>
          <p className="text-xs leading-5 text-neutral-600 sm:col-span-2">
            Le message arrive en visite guidée, un paragraphe par étape (une
            ligne vide entre deux) : le premier au centre de l&apos;écran, les
            suivants sur la première fiche mise en avant, dans la data room, avec
            un bouton pour l&apos;ouvrir sur la dernière étape. Deux paragraphes
            suffisent.
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Fiches mises en avant, dans l&apos;ordre coché</legend>
          <p className="mt-0.5 text-xs text-neutral-600">
            Aucune cochée : celles de l&apos;accueil par défaut ({defaultFocus.map(titleOf).join(", ")}).
            L&apos;étape « Manifester un intérêt » s&apos;ajoute toujours en dernier.
          </p>
          <ul className="mt-2 grid gap-x-6 sm:grid-cols-2">
            {docs.map((d) => {
              const rank = form.focus_slugs.indexOf(d.slug);
              return (
                <li key={d.slug}>
                  <label className="flex items-center gap-2 py-1 text-sm">
                    <input
                      type="checkbox"
                      checked={rank >= 0}
                      onChange={() => toggle("focus_slugs", d.slug)}
                    />
                    <span className="w-5 font-mono text-[11px] text-marsala">
                      {rank >= 0 ? String(rank + 1).padStart(2, "0") : ""}
                    </span>
                    <span className="truncate">{d.title}</span>
                    {d.level > 1 && <span className="text-xs text-neutral-500">niv. {d.level}</span>}
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">Fiches de niveau 2 ouvertes pour cette personne</legend>
          <p className="mt-0.5 text-xs text-neutral-600">
            Elle les voit avec le niveau 1, marquées « Ouvert pour vous ». Le reste du niveau 2 reste fermé.
          </p>
          <ul className="mt-2 grid gap-x-6 sm:grid-cols-2">
            {docs
              .filter((d) => d.level > 1)
              .map((d) => (
                <li key={d.slug}>
                  <label className="flex items-center gap-2 py-1 text-sm">
                    <input
                      type="checkbox"
                      checked={form.unlocked_slugs.includes(d.slug)}
                      onChange={() => toggle("unlocked_slugs", d.slug)}
                    />
                    <span className="truncate">{d.title}</span>
                  </label>
                </li>
              ))}
          </ul>
        </fieldset>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.preapprove}
            onChange={(e) => setForm({ ...form, preapprove: e.target.checked })}
          />
          Pré-approuver l&apos;adresse, pour qu&apos;elle arrive directement sur cet accueil
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy || !form.email.trim()}
            className="rounded-md bg-marsala px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "…" : "Enregistrer"}
          </button>
          {form !== EMPTY && (
            <button
              type="button"
              onClick={() => setForm(EMPTY)}
              className="text-sm text-neutral-600 hover:underline"
            >
              Vider le formulaire
            </button>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>

      <h2 className="mt-10 text-sm font-semibold">
        {views.length} onboarding{views.length > 1 ? "s" : ""} sur mesure
      </h2>
      {views.length === 0 ? (
        <p className="mt-3 rounded-md border border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
          Aucun pour l&apos;instant : tout le monde reçoit l&apos;accueil par défaut.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-neutral-200 rounded-md border border-neutral-200">
          {views.map(({ onboarding: o, status, preapproved, preview }) => (
            <li key={o.email} className="px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-mono text-[13px]">{o.email}</div>
                  <div className="text-xs text-neutral-600">
                    {status ? STATUS[status] : "pas encore inscrit"}
                    {preapproved ? ", pré-approuvé" : ""}
                    {o.unlocked_slugs.length
                      ? `, ouvert : ${o.unlocked_slugs.map(titleOf).join(", ")}`
                      : ""}
                    {o.note ? `, ${o.note}` : ""}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-xs">
                  <button
                    onClick={() => setOpen(open === o.email ? null : o.email)}
                    className="text-neutral-700 hover:underline"
                  >
                    {open === o.email ? "Masquer l'aperçu" : "Aperçu"}
                  </button>
                  <button onClick={() => edit(o)} className="text-neutral-700 hover:underline">
                    Modifier
                  </button>
                  <button
                    onClick={() => call("DELETE", { email: o.email })}
                    disabled={busy}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              {open === o.email && (
                <div className="mt-4 rounded-lg bg-background p-5">
                  <Welcome
                    locale="fr"
                    message={preview.message}
                    steps={preview.steps}
                    interest={preview.interest}
                    preview
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
