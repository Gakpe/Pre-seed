// Envoi d'emails applicatifs via l'API Resend. Les codes d'accès, eux, partent
// de Supabase Auth qui utilise Resend en SMTP, voir docs/emails-auth.md.
const ENDPOINT = "https://api.resend.com/emails/batch";
const FROM = "Minah <access@minah.io>";
const BATCH = 100;

export type Mail = { to: string; subject: string; html: string };

// Un envoi par destinataire : personne ne doit découvrir la liste des autres
// investisseurs dans un champ de destinataires.
export async function sendBatch(
  mails: Mail[]
): Promise<{ sent: number; failed: number }> {
  const key = process.env.RESEND_API_KEY;
  if (!key || mails.length === 0) return { sent: 0, failed: mails.length };

  let sent = 0;
  let failed = 0;
  for (let i = 0; i < mails.length; i += BATCH) {
    const chunk = mails.slice(i, i + BATCH);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          chunk.map((m) => ({
            from: FROM,
            to: [m.to],
            subject: m.subject,
            html: m.html,
          }))
        ),
      });
      if (res.ok) sent += chunk.length;
      else failed += chunk.length;
    } catch {
      failed += chunk.length;
    }
  }
  return { sent, failed };
}
