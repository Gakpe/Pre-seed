"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/tracking";

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-400";

type Mode = "new" | "returning";
type Step = "form" | "code";

export function RequestAccessForm({ refCode }: { refCode: string | null }) {
  const [mode, setMode] = useState<Mode>("new");
  const [step, setStep] = useState<Step>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [entity, setEntity] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=/investors/home`;

  async function sendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error } =
      mode === "new"
        ? await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: {
              emailRedirectTo: callbackUrl(),
              data: {
                full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                entity: entity.trim(),
                ref: refCode ?? undefined,
              },
            },
          })
        : await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: { shouldCreateUser: false, emailRedirectTo: callbackUrl() },
          });

    setBusy(false);
    if (error) {
      if (/signup|not allowed|not found/i.test(error.message)) {
        setError(
          "Cet email ne nous est pas connu — passez par « Nouvel investisseur »."
        );
      } else {
        setError(`L'envoi a échoué : ${error.message}`);
      }
    } else {
      setStep("code");
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });

    if (error) {
      setBusy(false);
      setError("Code invalide ou expiré. Vérifiez, ou redemandez un code.");
      return;
    }

    track({ type: "login", path: "/investors" });
    window.location.href = "/investors/home";
  }

  if (step === "code") {
    return (
      <form onSubmit={verifyCode} className="mt-8 space-y-4">
        <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="font-medium">Code envoyé ✓</p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Saisissez le code à 6 chiffres reçu sur {email.trim()} (le lien
            dans l&apos;email fonctionne aussi).
          </p>
        </div>
        <div>
          <label htmlFor="code" className="mb-1 block text-sm font-medium">
            Code d&apos;accès
          </label>
          <input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${inputClass} text-center text-lg tracking-[6px]`}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy || code.trim().length < 6}
          className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {busy ? "Vérification…" : "Accéder à l'espace investisseurs"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("form");
            setCode("");
            setError(null);
          }}
          className="w-full text-center text-xs text-neutral-500 hover:underline"
        >
          ← Modifier l&apos;email ou redemander un code
        </button>
      </form>
    );
  }

  return (
    <div className="mt-8">
      {/* Choix nouveau / déjà inscrit */}
      <div className="grid grid-cols-2 gap-1 rounded-md border border-neutral-200 p-1 dark:border-neutral-800">
        {(
          [
            ["new", "Nouvel investisseur"],
            ["returning", "Déjà connecté"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-foreground text-background"
                : "text-neutral-500 hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={sendCode} className="mt-6 space-y-4">
        {mode === "new" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="mb-1 block text-sm font-medium">
                  Prénom
                </label>
                <input
                  id="first_name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="mb-1 block text-sm font-medium">
                  Nom
                </label>
                <input
                  id="last_name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="entity" className="mb-1 block text-sm font-medium">
                Entité / fonds
              </label>
              <input
                id="entity"
                required
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                className={inputClass}
                autoComplete="organization"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {busy ? "Envoi…" : "Recevoir mon code d'accès"}
        </button>

        {mode === "new" && (
          <p className="pt-2 text-xs leading-5 text-neutral-500">
            En demandant l&apos;accès à l&apos;espace investisseurs, vous
            acceptez que Minah SAS enregistre vos informations de contact et
            votre navigation dans cet espace (pages consultées, documents
            ouverts, durée des visites) à des fins de suivi de la relation
            investisseur. Vous pouvez demander l&apos;accès ou la suppression de
            ces données à{" "}
            <a href="mailto:contact@minah.io" className="underline">
              contact@minah.io
            </a>
            .
          </p>
        )}
      </form>
    </div>
  );
}
