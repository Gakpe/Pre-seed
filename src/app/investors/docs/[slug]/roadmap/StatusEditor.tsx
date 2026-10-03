"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Status } from "@/lib/roadmap/types";
import { STATUS_STYLE } from "@/lib/roadmap/labels";

// Réservé à Julien : forcer l'état d'une brique depuis la carte elle-même,
// dans la data room, là où il voit ce que voit l'investisseur. « Automatique »
// retire le forçage.
export function StatusEditor({
  id,
  current,
  labels,
}: {
  id: string;
  /** Forçage en place, ou null si l'état est calculé. */
  current: Status | null;
  labels: Record<Status, string>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function set(status: Status | null) {
    setBusy(true);
    setError(false);
    const res = await fetch("/api/roadmap-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setError(true);
      return;
    }
    router.refresh();
  }

  const options: Array<{ value: Status | null; label: string }> = [
    { value: "livre", label: labels.livre },
    { value: "en_cours", label: labels.en_cours },
    { value: "prevu", label: labels.prevu },
    { value: null, label: "Automatique" },
  ];

  return (
    <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed #E6E1D4" }}>
      <div style={{ fontSize: 11, color: "#766962", marginBottom: 8 }}>
        Admin, visible de vous seul : état de cette brique côté investisseurs
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map((o) => {
          const active = o.value === current;
          const st = o.value ? STATUS_STYLE[o.value] : null;
          return (
            <button
              key={String(o.value)}
              type="button"
              disabled={busy || active}
              onClick={() => set(o.value)}
              style={{
                fontSize: 12, padding: "5px 10px", borderRadius: 8, cursor: active ? "default" : "pointer",
                background: st ? st.bg : "#FFFFFE", color: st ? st.color : "#766962",
                border: `${active ? 2 : 1}px ${o.value === "prevu" ? "dashed" : "solid"} ${active ? "#2C1716" : st ? st.border : "#E6E1D4"}`,
                opacity: busy ? 0.6 : 1,
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {error && <div style={{ marginTop: 8, fontSize: 12, color: "#8A2620" }}>Échec, réessayez.</div>}
    </div>
  );
}
