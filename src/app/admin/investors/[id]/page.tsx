import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Investor } from "@/lib/types";
import { setInvestorStatus } from "../../actions";
import { StatusBadge } from "../../status-badge";

type EventRow = {
  id: number;
  session_id: string | null;
  type: string;
  path: string | null;
  label: string | null;
  duration_ms: number | null;
  scroll_depth: number | null;
  created_at: string;
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function eventLine(e: EventRow): string {
  switch (e.type) {
    case "login":
      return "🔑 Connexion";
    case "page_view":
      return `👁 ${e.path ?? "?"}`;
    case "page_leave": {
      const secs = Math.round((e.duration_ms ?? 0) / 1000);
      const dur = secs >= 60 ? `${Math.round(secs / 60)} min` : `${secs} s`;
      return `⏱ ${e.path ?? "?"} — ${dur}, scroll ${e.scroll_depth ?? 0}%`;
    }
    case "docsend_click":
      return `📄 A ouvert « ${e.label ?? "document"} »`;
    case "cta_click":
      return `🎯 ${e.label ?? "CTA"}`;
    default:
      return e.type;
  }
}

export default async function InvestorDetailPage({
  params,
}: PageProps<"/admin/investors/[id]">) {
  await requireAdmin();
  const { id } = await params;

  const admin = createAdminClient();
  const { data } = await admin
    .from("investors")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const investor = data as Investor | null;
  if (!investor) notFound();

  const { data: eventsData } = await admin
    .from("events")
    .select("id, session_id, type, path, label, duration_ms, scroll_depth, created_at")
    .eq("investor_id", id)
    .order("id", { ascending: false })
    .limit(200);
  const events = (eventsData ?? []) as EventRow[];

  const posthogUrl = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_URL;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-neutral-500 hover:underline">
        ← Investisseurs
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {investor.full_name ?? investor.email}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {investor.entity ?? "entité inconnue"} · {investor.email}
            {investor.ref ? ` · ref ${investor.ref}` : ""}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <StatusBadge status={investor.status} />
            {investor.interest_tranche && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                intérêt : {investor.interest_tranche}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {investor.status === "blocked" ? (
            <form action={setInvestorStatus.bind(null, investor.id, "approved")}>
              <button className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950">
                Rétablir l&apos;accès
              </button>
            </form>
          ) : (
            <form action={setInvestorStatus.bind(null, investor.id, "blocked")}>
              <button className="rounded-md border border-red-300 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950">
                Bloquer l&apos;accès
              </button>
            </form>
          )}
          {posthogUrl && (
            <a
              href={`${posthogUrl}/person/${investor.id}#activeTab=sessionRecordings`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:underline"
            >
              Replays PostHog ↗
            </a>
          )}
        </div>
      </div>

      <h2 className="mt-10 text-sm font-semibold">
        Timeline ({events.length} derniers events)
      </h2>
      <ul className="mt-3 space-y-0 border-l border-neutral-200 pl-4 dark:border-neutral-800">
        {events.map((e) => (
          <li key={e.id} className="py-1.5 text-sm">
            <span className="mr-3 text-xs tabular-nums text-neutral-400">
              {dateFmt.format(new Date(e.created_at))}
            </span>
            {eventLine(e)}
          </li>
        ))}
        {events.length === 0 && (
          <li className="py-2 text-sm text-neutral-500">
            Aucune activité enregistrée.
          </li>
        )}
      </ul>
    </main>
  );
}
