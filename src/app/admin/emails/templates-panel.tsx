"use client";

import { useState } from "react";
import type { EmailTemplate } from "@/lib/email-templates";

type Lang = "fr" | "en";

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500";

const LANGS: { value: Lang; label: string }[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

function slug(): string {
  return `mail-${Date.now().toString(36)}`;
}

export function TemplatesPanel({ initial }: { initial: EmailTemplate[] }) {
  // `saved` est l'état connu du serveur, `drafts` ce que l'admin édite. La
  // différence des deux dit quels mails ont des changements non enregistrés.
  const [saved, setSaved] = useState(initial);
  const [drafts, setDrafts] = useState(initial);
  const [active, setActive] = useState<string | null>(initial[0]?.id ?? null);
  const [lang, setLang] = useState<Lang>("fr");
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(method: "PUT" | "DELETE", payload: unknown) {
    setError(null);
    const res = await fetch("/api/email-templates", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    if (!res?.ok) {
      const data = await res?.json().catch(() => null);
      setError(data?.error ?? "Échec, réessayez.");
      return null;
    }
    const data = (await res.json()) as { templates: EmailTemplate[] };
    return data.templates;
  }

  function edit(id: string, patch: (t: EmailTemplate) => EmailTemplate) {
    setDrafts((list) => list.map((t) => (t.id === id ? patch(t) : t)));
  }

  async function save(id: string) {
    const template = drafts.find((t) => t.id === id);
    if (!template) return;
    setBusy(id);
    const list = await call("PUT", { template });
    setBusy(null);
    if (!list) return;
    setSaved(list);
    // Les autres brouillons restent tels quels, seul celui-ci est aligné.
    setDrafts((current) =>
      list.map((t) => (t.id === id ? t : (current.find((d) => d.id === t.id) ?? t)))
    );
  }

  async function add() {
    const template: EmailTemplate = {
      id: slug(),
      title: "Nouveau mail type",
      subject: { fr: "", en: "" },
      body: { fr: "", en: "" },
    };
    setBusy(template.id);
    const list = await call("PUT", { template });
    setBusy(null);
    if (!list) return;
    setSaved(list);
    setDrafts((current) => [...current, template]);
    setActive(template.id);
  }

  async function remove(id: string) {
    const template = drafts.find((t) => t.id === id);
    if (!template) return;
    if (!window.confirm(`Supprimer « ${template.title} » ?`)) return;
    setBusy(id);
    const list = await call("DELETE", { id });
    setBusy(null);
    if (!list) return;
    setSaved(list);
    const remaining = drafts.filter((t) => t.id !== id);
    setDrafts(remaining);
    setActive(remaining[0]?.id ?? null);
  }

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch {
      setError("Copie impossible, sélectionnez le texte à la main.");
    }
  }

  function isDirty(t: EmailTemplate): boolean {
    const s = saved.find((x) => x.id === t.id);
    return !s || JSON.stringify(s) !== JSON.stringify(t);
  }

  const current = drafts.find((t) => t.id === active) ?? null;

  return (
    <>
      {/* Onglets : un par mail type, l'ajout à gauche. Un point signale un
          mail modifié mais pas encore enregistré, même s'il n'est pas ouvert. */}
      <div className="mt-8 flex items-end gap-1 overflow-x-auto border-b border-neutral-200">
        <button
          type="button"
          onClick={add}
          disabled={busy !== null}
          title="Ajouter un mail type"
          className="mb-2 mr-2 shrink-0 rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium transition-colors hover:border-neutral-500 disabled:opacity-50"
        >
          + Ajouter
        </button>
        {drafts.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-marsala font-medium text-foreground"
                  : "border-transparent text-neutral-500 hover:text-foreground"
              }`}
            >
              {t.title || "Sans titre"}
              {isDirty(t) && (
                <span
                  aria-label="Modifications non enregistrées"
                  className="h-1.5 w-1.5 rounded-full bg-brand"
                />
              )}
            </button>
          );
        })}
      </div>

      {current ? (
        <section className="mt-6 rounded-md border border-neutral-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              value={current.title}
              onChange={(e) =>
                edit(current.id, (x) => ({ ...x, title: e.target.value }))
              }
              aria-label="Titre du mail type"
              className="min-w-0 flex-1 border-b border-transparent bg-transparent text-sm font-semibold outline-none focus:border-neutral-400"
            />
            {/* Langue : un seul réglage pour tous les mails, on copie en série. */}
            <div className="flex shrink-0 rounded-md border border-neutral-300 p-0.5">
              {LANGS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLang(l.value)}
                  className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                    lang === l.value
                      ? "bg-marsala text-white"
                      : "text-neutral-600 hover:text-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between">
              <label
                htmlFor="template-subject"
                className="text-xs font-medium text-neutral-600"
              >
                Objet
              </label>
              <button
                type="button"
                onClick={() => copy("subject", current.subject[lang])}
                className="text-xs text-neutral-500 hover:underline"
              >
                {copied === "subject" ? "Copié" : "Copier l'objet"}
              </button>
            </div>
            <input
              id="template-subject"
              value={current.subject[lang]}
              onChange={(e) =>
                edit(current.id, (x) => ({
                  ...x,
                  subject: { ...x.subject, [lang]: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <label
                htmlFor="template-body"
                className="text-xs font-medium text-neutral-600"
              >
                Corps
              </label>
              <button
                type="button"
                onClick={() => copy("body", current.body[lang])}
                className="text-xs text-neutral-500 hover:underline"
              >
                {copied === "body" ? "Copié" : "Copier le corps"}
              </button>
            </div>
            <textarea
              id="template-body"
              value={current.body[lang]}
              onChange={(e) =>
                edit(current.id, (x) => ({
                  ...x,
                  body: { ...x.body, [lang]: e.target.value },
                }))
              }
              rows={Math.min(
                28,
                Math.max(10, current.body[lang].split("\n").length + 1)
              )}
              className={`${inputClass} font-mono text-[13px] leading-5`}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => remove(current.id)}
              disabled={busy === current.id}
              className="text-xs text-red-600 hover:underline disabled:opacity-50"
            >
              Supprimer ce mail type
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">
                {isDirty(current) ? "Modifications non enregistrées" : "Enregistré"}
              </span>
              <button
                type="button"
                onClick={() => save(current.id)}
                disabled={!isDirty(current) || busy === current.id}
                className="rounded-md bg-marsala px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {busy === current.id ? "…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <p className="mt-6 text-sm text-neutral-500">
          Aucun mail type. Ajoutez-en un avec le bouton ci-dessus.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <p className="mt-8 text-xs leading-5 text-neutral-500">
        Les deux langues d&apos;un mail sont enregistrées ensemble : éditez le
        français, basculez, éditez l&apos;anglais, puis enregistrez une fois.
        Ces textes ne partent jamais tout seuls, ils sont faits pour être
        collés dans votre messagerie.
      </p>
    </>
  );
}
