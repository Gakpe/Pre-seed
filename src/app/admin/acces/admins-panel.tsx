"use client";

import { useState } from "react";
import type { AdminEntry } from "@/lib/admin";

export function AdminsPanel({
  initial,
  me,
}: {
  initial: AdminEntry[];
  me: string;
}) {
  const [admins, setAdmins] = useState(initial);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(method: "POST" | "DELETE", value: string) {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admins", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value }),
    }).catch(() => null);
    setBusy(false);

    if (!res?.ok) {
      const data = await res?.json().catch(() => null);
      setError(data?.error ?? "Échec, réessayez.");
      return false;
    }
    const data = (await res.json()) as { admins: AdminEntry[] };
    setAdmins(data.admins);
    return true;
  }

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await call("POST", email)) setEmail("");
  }

  return (
    <>
      <ul className="mt-8 divide-y divide-neutral-200 rounded-md border border-neutral-200">
        {admins.map((a) => (
          <li
            key={a.email}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <span className="text-sm">{a.email}</span>
              {a.email === me && (
                <span className="ml-2 text-xs text-neutral-400">(vous)</span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  a.source === "env"
                    ? "bg-salvia text-marsala"
                    : "border border-neutral-200 text-neutral-500"
                }`}
                title={
                  a.source === "env"
                    ? "Défini dans ADMIN_EMAILS, côté serveur, non retirable ici."
                    : "Ajouté depuis cette page."
                }
              >
                {a.source === "env" ? "socle serveur" : "ajouté ici"}
              </span>
              {a.source === "db" && a.email !== me ? (
                <button
                  onClick={() => call("DELETE", a.email)}
                  disabled={busy}
                  className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  Retirer
                </button>
              ) : (
                <span aria-hidden className="w-12" />
              )}
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="prenom.nom@minah.io"
          className="flex-1 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-marsala px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "…" : "Ajouter un admin"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <p className="mt-8 text-xs leading-5 text-neutral-500">
        Les adresses marquées « socle serveur » viennent de la variable
        d&apos;environnement <code>ADMIN_EMAILS</code>. Elles ne sont pas
        retirables depuis cette page : c&apos;est ce qui garantit qu&apos;une
        fausse manœuvre ne peut verrouiller tout le monde dehors. Pour en
        retirer une, il faut passer par la configuration Vercel.
      </p>
    </>
  );
}
