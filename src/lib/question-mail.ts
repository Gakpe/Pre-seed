import { listAdmins } from "@/lib/admin";
import { buildVisitRhythm, formatGap, type VisitRhythm } from "@/lib/activity";
import { sendBatch } from "@/lib/email";
import { formatDuration } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Investor, InvestorStats } from "@/lib/types";

// Une question posée depuis le widget part aussi par email aux fondateurs
// (socle ADMIN_EMAILS), avec le texte complet et un brief de la personne :
// qui elle est, depuis quand elle est là, ce qu'elle a regardé. Slack et
// Telegram reçoivent l'alerte courte par la file notifications, voir docs/yao.md.

const PORTAL = "https://portail.minah.io";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export type QuestionBrief = {
  investor: Investor;
  stats: InvestorStats | null;
  rhythm: VisitRhythm;
  /** Libellés distincts des documents ouverts, du plus récent au plus ancien. */
  documents: string[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function label(inv: Investor): string {
  return (inv.full_name ?? inv.email) + (inv.entity ? ` (${inv.entity})` : "");
}

function statusLabel(status: Investor["status"]): string {
  switch (status) {
    case "pending":
      return "en attente de validation";
    case "approved":
      return "validé";
    case "blocked":
      return "bloqué";
  }
}

// Le corps de l'email, sans accès réseau : composable et vérifiable à part.
export function buildQuestionMail(
  brief: QuestionBrief,
  questions: string[]
): { subject: string; html: string } {
  const { investor, stats, rhythm, documents } = brief;
  const who = label(investor);
  const n = questions.length;

  const visits =
    rhythm.visits === 0
      ? "aucune visite enregistrée"
      : rhythm.visits === 1
        ? "1 visite"
        : `${rhythm.visits} visites, dont ${rhythm.returns} retour${rhythm.returns > 1 ? "s" : ""}` +
          (rhythm.averageGapMs !== null
            ? `, ${formatGap(rhythm.averageGapMs)} d'écart en moyenne`
            : "");

  const interest = investor.interest_expressed_at
    ? `${investor.interest_tranche ?? "tranche non précisée"}, le ${dateFmt.format(new Date(investor.interest_expressed_at))}`
    : "pas encore manifesté";

  const rows: [string, string][] = [
    ["Nom", investor.full_name ?? "non renseigné"],
    ["Entité", investor.entity ?? "non renseignée"],
    ["Email", investor.email],
    ["Statut", statusLabel(investor.status)],
    ["Inscription", dateFmt.format(new Date(investor.created_at))],
    [
      "Dernière visite",
      investor.last_seen_at
        ? dateFmt.format(new Date(investor.last_seen_at))
        : "jamais",
    ],
    ["Visites", visits],
    ["Temps passé", formatDuration(stats?.total_duration_ms ?? 0)],
    [
      "Documents ouverts",
      documents.length > 0 ? documents.join(", ") : "aucun",
    ],
    ["Intérêt", interest],
    ["Niveau 2", investor.level2_access ? "ouvert" : "fermé"],
  ];
  if (investor.ref) rows.push(["Ref", investor.ref]);
  if (investor.tags.length > 0) rows.push(["Tags", investor.tags.join(", ")]);

  const questionsHtml =
    n === 1
      ? `<blockquote style="margin:0;padding:0 0 0 12px;border-left:3px solid #ccc">${escapeHtml(questions[0])}</blockquote>`
      : `<ol>${questions.map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ol>`;

  const briefHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:2px 12px 2px 0;color:#666;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:2px 0">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const fiche = `${PORTAL}/admin/investors/${investor.id}`;

  return {
    subject:
      n === 1 ? `Question de ${who}` : `${n} questions de ${who}`,
    html: `<p>${escapeHtml(who)} a posé ${n === 1 ? "une question" : `${n} questions`} depuis l'espace investisseurs.</p>
${questionsHtml}
<h3 style="margin:24px 0 8px;font-size:14px">Qui pose la question</h3>
<table style="border-collapse:collapse;font-size:14px">${briefHtml}</table>
<p style="margin-top:24px"><a href="${fiche}">Fiche investisseur</a><br>
<a href="mailto:${escapeHtml(investor.email)}">Répondre à ${escapeHtml(investor.full_name ?? investor.email)}</a></p>`,
  };
}

// Lit le brief en base et envoie l'email aux fondateurs. Ne lève jamais :
// la question est déjà enregistrée, un email manqué ne doit pas la faire
// passer pour perdue côté investisseur.
export async function mailQuestionsToTeam(
  investorId: string,
  questions: string[]
): Promise<void> {
  try {
    const recipients = (await listAdmins())
      .filter((a) => a.source === "env")
      .map((a) => a.email);
    if (recipients.length === 0) return;

    const admin = createAdminClient();
    const [{ data: investor }, { data: stats }, { data: sessions }, { data: clicks }] =
      await Promise.all([
        admin.from("investors").select("*").eq("id", investorId).maybeSingle(),
        admin
          .from("investor_stats")
          .select("*")
          .eq("investor_id", investorId)
          .maybeSingle(),
        admin
          .from("events")
          .select("session_id, created_at")
          .eq("investor_id", investorId)
          .order("created_at"),
        admin
          .from("events")
          .select("label, created_at")
          .eq("investor_id", investorId)
          .eq("type", "docsend_click")
          .order("created_at", { ascending: false }),
      ]);
    if (!investor) return;

    const documents = [
      ...new Set(
        ((clicks ?? []) as { label: string | null }[])
          .map((c) => c.label)
          .filter((l): l is string => Boolean(l))
      ),
    ];

    const mail = buildQuestionMail(
      {
        investor: investor as Investor,
        stats: (stats as InvestorStats | null) ?? null,
        rhythm: buildVisitRhythm(
          (sessions ?? []) as { session_id: string | null; created_at: string }[]
        ),
        documents,
      },
      questions
    );

    const { failed } = await sendBatch(
      recipients.map((to) => ({ to, ...mail }))
    );
    if (failed > 0) {
      console.error(`question-mail : ${failed} envoi(s) en échec pour ${investorId}`);
    }
  } catch (e) {
    console.error("question-mail :", e instanceof Error ? e.message : e);
  }
}
