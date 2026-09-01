import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDuration } from "@/lib/format";
import { buildDailyBuckets } from "@/lib/activity";
import type { Investor, InvestorStats } from "@/lib/types";
import { setInvestorStatus, setLevel2Access } from "../../actions";
import { StatusBadge } from "../../status-badge";
import { ActivityHistogram } from "../../activity-histogram";

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
  const [{ data }, { data: statsData }, { data: eventsData }, { data: leaves }] =
    await Promise.all([
      admin.from("investors").select("*").eq("id", id).maybeSingle(),
      admin.from("investor_stats").select("*").eq("investor_id", id).maybeSingle(),
      admin
        .from("events")
        .select(
          "id, session_id, type, path, label, duration_ms, scroll_depth, created_at"
        )
        .eq("investor_id", id)
        .order("id", { ascending: false })
        .limit(200),
      admin
        .from("events")
        .select("path, duration_ms, created_at")
        .eq("investor_id", id)
        .eq("type", "page_leave"),
    ]);

  const investor = data as Investor | null;
  if (!investor) notFound();
  const stats = statsData as InvestorStats | null;
  const events = (eventsData ?? []) as EventRow[];

  const leaveRows = (leaves ?? []) as {
    path: string | null;
    duration_ms: number | null;
    created_at: string;
  }[];

  // Temps cumulé par page, trié décroissant
  const byPage = new Map<string, number>();
  for (const l of leaveRows) {
    const key = l.path ?? "?";
    byPage.set(key, (byPage.get(key) ?? 0) + (l.duration_ms ?? 0));
  }
  const dailyBuckets = buildDailyBuckets(leaveRows, 30);
  const topPages = [...byPage.entries()].sort((a, b) => b[1] - a[1]);
  const maxPageMs = topPages[0]?.[1] ?? 0;

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
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <StatusBadge status={investor.status} />
            {investor.interest_tranche && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                intention : {investor.interest_tranche}
                {investor.interest_expressed_at &&
                  ` (${dateFmt.format(new Date(investor.interest_expressed_at))})`}
              </span>
            )}
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
              niveau 2 : {investor.level2_access ? "oui" : "non"}
            </span>
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
          <form action={setLevel2Access.bind(null, investor.id, !investor.level2_access)}>
            <button className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900">
              {investor.level2_access ? "Retirer le niveau 2" : "Donner le niveau 2"}
            </button>
          </form>
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

      {/* Stats de temps */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Temps total" value={formatDuration(stats?.total_duration_ms ?? 0)} />
        <Stat label="Sessions" value={String(stats?.sessions ?? 0)} />
        <Stat label="Pages vues" value={String(stats?.page_views ?? 0)} />
        <Stat label="Docs ouverts" value={String(stats?.docsend_clicks ?? 0)} />
      </div>

      <h2 className="mt-10 text-sm font-semibold">
        Temps passé par jour (30 derniers jours)
      </h2>
      <div className="mt-3 rounded-md border border-foreground/10 p-4">
        <ActivityHistogram buckets={dailyBuckets} size="large" />
      </div>

      {topPages.length > 0 && (
        <>
          <h2 className="mt-10 text-sm font-semibold">Temps par page</h2>
          <ul className="mt-3 space-y-2">
            {topPages.map(([path, ms]) => (
              <li key={path} className="text-sm">
                <div className="flex items-baseline justify-between">
                  <span className="truncate">{path}</span>
                  <span className="ml-4 shrink-0 tabular-nums text-neutral-500">
                    {formatDuration(ms)}
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                  <div
                    className="h-full rounded-full bg-neutral-400 dark:bg-neutral-600"
                    style={{ width: `${maxPageMs ? Math.max(3, (ms / maxPageMs) * 100) : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
