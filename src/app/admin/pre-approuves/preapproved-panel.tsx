"use client";

import { useState } from "react";
import type { Preapproved } from "@/lib/preapproved";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const STATUS: Record<NonNullable<Preapproved["investor_status"]>, string> = {
  pending: "inscrit, en attente",
  approved: "inscrit, validé",
  blocked: "inscrit, bloqué",
};

export function PreapprovedPanel({ initial }: { initial: Preapproved[] }) {
  const [list, setList] = useState(initial);
  const [input, setInput] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(method: "POST" | "DELETE", payload: unknown) {
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/preapproved", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    setBusy(false);
    const data = await res?.json().catch(() => null);
    if (!res?.ok) {
      setError(data?.error ?? "Échec, réessayez.");
      return null;
    }
    return data as { list: Preapproved[]; added?: number; rejected?: string[] };
  }

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = await call("POST", { emails: input, note });
    if (!data) return;
    setList(data.list);
    setInput("");
    const parts = [`${data.added} adresse${data.added === 1 ? "" : "s"} ajoutée${data.added === 1 ? "" : "s"}`];
    if (data.rejected?.length) parts.push(`ignoré : ${data.rejected.join(", ")}`);
    setMessage(parts.join(". "));
  }

  async function remove(email: string) {
    const data = await call("DELETE", { email });
    if (data) setList(data.list);
  }

  return (
    <>
      <form onSubmit={add} className="mt-8 space-y-3">
        <label htmlFor="emails" className="block text-sm font-medium">
          Adresses à ajouter
        </label>
        <textarea
          id="emails"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder={"une adresse par ligne, ou séparées par des virgules"}
          className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 font-mono text-[13px] outline-none focus:border-neutral-500"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note, facultative (origine de la liste, événement…)"
            className="flex-1 rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-md bg-marsala px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "…" : "Ajouter"}
          </button>
        </div>
      </form>
      {message && <p className="mt-3 text-sm text-neutral-600">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <h2 className="mt-10 text-sm font-semibold">
        {list.length} adresse{list.length > 1 ? "s" : ""} pré-approuvée{list.length > 1 ? "s" : ""}
      </h2>
      {list.length === 0 ? (
        <p className="mt-3 rounded-md border border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
          Aucune adresse pour l&apos;instant.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-neutral-200 rounded-md border border-neutral-200">
          {list.map((p) => (
            <li
              key={p.email}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm">{p.email}</div>
                <div className="text-xs text-neutral-500">
                  {dateFmt.format(new Date(p.created_at))}
                  {p.source === "minah_os" ? ", depuis Minah_OS" : ""}
                  {p.note ? `, ${p.note}` : ""}
                  {p.investor_status ? `, ${STATUS[p.investor_status]}` : ""}
                </div>
              </div>
              <button
                onClick={() => remove(p.email)}
                disabled={busy}
                className="shrink-0 text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
