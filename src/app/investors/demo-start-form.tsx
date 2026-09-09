"use client";

import { useState } from "react";

// Entrée en démo : pas de code, pas d'email, juste de quoi personnaliser
// l'en-tête devant l'investisseur, puis on entre avec la cinématique.
export function DemoStartForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [entity, setEntity] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-400";

  async function start(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        entity: entity.trim(),
      }),
    }).catch(() => null);

    if (!res?.ok) {
      setBusy(false);
      setError("Session admin expirée, reconnectez-vous sur /admin/login.");
      return;
    }

    // Même déclencheur que la vraie entrée après saisie du code.
    window.sessionStorage.setItem("minah_splash_pending", "1");
    window.location.href = "/investors/home";
  }

  return (
    <form onSubmit={start} className="mt-8 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="demo_first" className="mb-1 block text-sm font-medium">
            Prénom
          </label>
          <input
            id="demo_first"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="demo_last" className="mb-1 block text-sm font-medium">
            Nom
          </label>
          <input
            id="demo_last"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="demo_entity" className="mb-1 block text-sm font-medium">
          Entité / fonds{" "}
          <span className="font-normal text-neutral-400">(facultatif)</span>
        </label>
        <input
          id="demo_entity"
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-marsala py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {busy ? "Ouverture…" : "Entrer dans l'espace investisseurs"}
      </button>
      <p className="pt-1 text-xs leading-5 text-neutral-500">
        Démonstration : aucune donnée n&apos;est enregistrée, aucune visite
        n&apos;est tracée, et l&apos;équipe ne reçoit aucune notification.
      </p>
    </form>
  );
}
