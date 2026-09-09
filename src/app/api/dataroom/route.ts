import { getAdminEmail } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBatch, type Mail } from "@/lib/email";
import {
  DATAROOM_STATUSES,
  getDataRoomStatus,
  setDataRoomStatus,
  type DataRoomStatus,
} from "@/lib/dataroom";

// Email de réouverture. Bilingue dans le même message : la langue choisie vit
// dans un cookie du navigateur, elle n'est pas connue côté serveur d'envoi.
function reopenMail(to: string, origin: string): Mail {
  const url = `${origin}/investors`;
  return {
    to,
    subject:
      "La data room Minah est à jour · The Minah data room has been updated",
    html:
      "<h2>Minah, Espace investisseurs / Investor space</h2>" +
      "<p><strong>FR</strong>, La mise à jour est terminée : la data room est de nouveau accessible. " +
      `<a href="${url}">Reprendre votre lecture</a>.</p>` +
      "<p><strong>EN</strong>, The update is complete: the data room is accessible again. " +
      `<a href="${url}">Pick up where you left off</a>.</p>` +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0">' +
      '<p style="color:#888;font-size:12px">Vous recevez cet email parce que vous avez accès à l\'espace investisseurs de Minah.<br>' +
      "You are receiving this email because you have access to Minah's investor space.</p>",
  };
}

export async function POST(request: Request) {
  if (!(await getAdminEmail())) return new Response(null, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const next = body.status as DataRoomStatus;
  if (!DATAROOM_STATUSES.includes(next)) {
    return new Response(null, { status: 400 });
  }

  const current = await getDataRoomStatus();
  await setDataRoomStatus(next);

  // Seule la sortie de maintenance déclenche la notification : c'est la seule
  // transition où on a promis un email aux investisseurs.
  let emailed = 0;
  if (current === "maintenance" && next === "open") {
    const { data } = await createAdminClient()
      .from("investors")
      .select("email")
      .eq("status", "approved");
    const origin = new URL(request.url).origin;
    const mails = (data ?? [])
      .map((i) => i.email as string | null)
      .filter((e): e is string => !!e)
      .map((e) => reopenMail(e, origin));
    emailed = (await sendBatch(mails)).sent;
  }

  return Response.json({ status: next, emailed });
}
