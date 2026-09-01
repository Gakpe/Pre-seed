"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deal } from "@/lib/deal";

export function InterestForm() {
  const router = useRouter();
  const [tranche, setTranche] = useState<string>(deal.tranches[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tranche }),
    }).catch(() => null);
    if (res?.ok) {
      router.refresh();
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <select
        value={tranche}
        onChange={(e) => setTranche(e.target.value)}
        className="rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        {deal.tranches.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending" ? "Envoi…" : "Manifester mon intérêt"}
      </button>
      {status === "error" && (
        <p className="self-center text-sm text-red-600 dark:text-red-400">
          Échec, réessayez.
        </p>
      )}
    </form>
  );
}
