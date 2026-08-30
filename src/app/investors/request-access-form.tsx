"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-400";

export function RequestAccessForm({ refCode }: { refCode: string | null }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [entity, setEntity] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/investors/home`,
        data: {
          full_name: fullName.trim(),
          entity: entity.trim(),
          ref: refCode ?? undefined,
        },
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-8 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-6 text-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="font-medium">Lien envoyé ✓</p>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          Consultez votre boîte mail ({email.trim()}) et cliquez sur le lien
          pour accéder à l&apos;espace investisseurs.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium">
          Nom complet
        </label>
        <input
          id="full_name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
      </div>
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

      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          L&apos;envoi a échoué : {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending" ? "Envoi…" : "Recevoir mon lien d'accès"}
      </button>

      <p className="pt-2 text-xs leading-5 text-neutral-500">
        En demandant l&apos;accès à l&apos;espace investisseurs, vous acceptez
        que Minah SAS enregistre vos informations de contact et votre navigation
        dans cet espace (pages consultées, documents ouverts, durée des visites)
        à des fins de suivi de la relation investisseur. Vous pouvez demander
        l&apos;accès ou la suppression de ces données à{" "}
        <a href="mailto:contact@minah.io" className="underline">
          contact@minah.io
        </a>
        .
      </p>
    </form>
  );
}
