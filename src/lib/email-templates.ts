import { createAdminClient } from "@/lib/supabase/admin";
import { deal } from "@/lib/deal";

// Mails types du back-office : des textes à copier-coller dans un vrai client
// mail, pas des envois automatiques. Rangés dans app_settings sous une seule
// clé, comme la liste des admins : trois personnes les modifient, un tableau
// en jsonb suffit. Les textes ci-dessous ne servent que tant que rien n'a été
// enregistré ; dès la première sauvegarde, c'est la base qui fait foi.

export type Bilingual = { fr: string; en: string };

export type EmailTemplate = {
  id: string;
  /** Libellé interne, affiché en tête de carte. */
  title: string;
  subject: Bilingual;
  body: Bilingual;
};

const SETTING_KEY = "email_templates";
const PORTAL = "https://portail.minah.io/investors/home";
// Deck pré-seed sur DocSend, le même que la fiche « Deck pré-seed Minah ».
const DECK = "https://docsend.com/view/qcid4q2ik98tkr82";

export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "bienvenue",
    title: "Bienvenue, accès validé",
    subject: {
      fr: "Bienvenue dans l'espace investisseurs Minah",
      en: "Welcome to the Minah investor space",
    },
    body: {
      fr: `Bonjour [Prénom],

Bienvenue chez Minah, et merci de l'intérêt que vous portez au projet. C'est un plaisir de vous ouvrir l'espace investisseurs.

Vous y trouverez le mémo d'investissement, la note de marché, le business model, la term sheet Kupanda, le track record et les conditions de la levée en cours :
${PORTAL}

Pour une première lecture, le deck pré-seed donne l'essentiel :
${DECK}

Nous vous présentons volontiers ces documents de vive voix, avant votre lecture ou une fois celle-ci terminée. Vous pouvez réserver un créneau ici :
${deal.meetingUrl}

Une question entre-temps ? Répondez simplement à cet email.

Au plaisir d'échanger avec vous,
[Prénom Nom]
Minah`,
      en: `Hello [First name],

Welcome to Minah, and thank you for your interest in the project. It is a pleasure to open the investor space to you.

You will find the investment memo, the market note, the business model, the Kupanda term sheet, the track record and the terms of the current round:
${PORTAL}

For a first read, the pre-seed deck gives the essentials:
${DECK}

We are happy to walk you through these documents, before or after your reading. You can book a slot here:
${deal.meetingUrl}

Any question in the meantime? Just reply to this email.

Looking forward to speaking with you,
[First name Last name]
Minah`,
    },
  },
  {
    id: "niveau-2",
    title: "Bienvenue au niveau 2",
    subject: {
      fr: "Le niveau 2 de la data room Minah vous est ouvert",
      en: "Level 2 of the Minah data room is now open to you",
    },
    body: {
      fr: `Bonjour [Prénom],

Merci pour votre marque d'intérêt, elle compte beaucoup pour nous. C'est avec plaisir que nous vous ouvrons le niveau 2 de la data room, la partie du dossier que nous réservons aux investisseurs qui avancent avec nous.

Vous y trouverez le go-to-market complet, l'architecture de risque et les scénarios de protection, le deck risk Kupanda, le contrat cadre avec la République de Zambie, le pacte d'associés (draft), la table de capitalisation interactive et les scénarios de sortie :
${PORTAL}

Ces documents se lisent mieux avec leur contexte. Nous vous proposons un échange dédié pour les parcourir ensemble et répondre à vos questions :
${deal.meetingUrl}

Au plaisir de poursuivre avec vous,
[Prénom Nom]
Minah`,
      en: `Hello [First name],

Thank you for expressing your interest, it means a great deal to us. We are pleased to open level 2 of the data room to you, the part of the file we reserve for investors moving forward with us.

You will find the full go-to-market, the risk architecture and protection scenarios, the Kupanda risk deck, the framework agreement with the Republic of Zambia, the shareholders' agreement (draft), the interactive cap table and the exit scenarios:
${PORTAL}

These documents read better with their context. We suggest a dedicated call to go through them together and answer your questions:
${deal.meetingUrl}

Looking forward to the next steps with you,
[First name Last name]
Minah`,
    },
  },
  {
    id: "relance",
    title: "Relance",
    subject: {
      fr: "Minah, où en êtes-vous de votre lecture ?",
      en: "Minah, how is your review going?",
    },
    body: {
      fr: `Bonjour [Prénom],

J'espère que vous allez bien. Je reviens vers vous au sujet de Minah : votre accès à l'espace investisseurs est ouvert depuis le [date], et je voulais m'assurer que vous avez pu y entrer sans difficulté :
${PORTAL}

Si le temps vous manque, le deck pré-seed donne l'essentiel en quelques pages :
${DECK}

Le plus direct reste un échange de trente minutes avec l'équipe : le contexte du tour, les points clés de la term sheet Kupanda, et vos premières questions. Vous pouvez réserver un créneau ici :
${deal.meetingUrl}

Le tour se clôture d'ici la fin de l'année. Si Minah ne correspond pas à votre thèse, un mot de votre part nous aidera aussi.

Bien à vous,
[Prénom Nom]
Minah`,
      en: `Hello [First name],

I hope you are well. I am getting back to you about Minah: your access to the investor space has been open since [date], and I wanted to make sure you were able to get in without difficulty:
${PORTAL}

If you are short on time, the pre-seed deck gives the essentials in a few pages:
${DECK}

The most direct route is a thirty-minute call with the team: the context of the round, the key points of the Kupanda term sheet, and your first questions. You can book a slot here:
${deal.meetingUrl}

The round closes by the end of the year. If Minah does not fit your thesis, a short note from you would help us as well.

Best regards,
[First name Last name]
Minah`,
    },
  },
];

const MAX_TITLE = 120;
const MAX_SUBJECT = 300;
const MAX_BODY = 20_000;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

// Remet en forme ce qui arrive du client ou de la base : bornes, types,
// identifiant présent. Null si ce n'est pas un mail type.
export function normalizeTemplate(input: unknown): EmailTemplate | null {
  if (!input || typeof input !== "object") return null;
  const t = input as Record<string, unknown>;
  const id = typeof t.id === "string" ? t.id.trim().slice(0, 64) : "";
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  const subject = (t.subject ?? {}) as Record<string, unknown>;
  const body = (t.body ?? {}) as Record<string, unknown>;
  return {
    id,
    title: text(t.title, MAX_TITLE).trim() || "Sans titre",
    subject: { fr: text(subject.fr, MAX_SUBJECT), en: text(subject.en, MAX_SUBJECT) },
    body: { fr: text(body.fr, MAX_BODY), en: text(body.en, MAX_BODY) },
  };
}

export async function listEmailTemplates(): Promise<EmailTemplate[]> {
  const { data } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", SETTING_KEY)
    .maybeSingle();
  const list = (data?.value as { templates?: unknown } | null)?.templates;
  if (!Array.isArray(list)) return DEFAULT_TEMPLATES;
  return list
    .map(normalizeTemplate)
    .filter((t): t is EmailTemplate => t !== null);
}

export async function saveEmailTemplates(templates: EmailTemplate[]): Promise<void> {
  const { error } = await createAdminClient()
    .from("app_settings")
    .upsert(
      {
        key: SETTING_KEY,
        value: { templates },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  if (error) throw new Error(error.message);
}
