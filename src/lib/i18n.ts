export type Locale = "fr" | "en";
export const LOCALE_COOKIE = "minah_locale";

// Dictionnaire de la zone investisseurs (l'admin reste en français).
// Clés plates par section : layout.*, auth.*, home.*, docs.*, widget.*
const dict = {
  fr: {
    // layout / chrome
    "layout.signout": "Se déconnecter",
    "layout.admin": "Admin",
    "layout.confidential": "Espace confidentiel",
    "layout.confidential.tooltip":
      "Espace confidentiel. Merci de ne pas le partager, sauf aux personnes explicitement concernées ou sur demande de l'équipe Minah.",

    // data room fermée ou en maintenance (état piloté depuis l'admin)
    "dataroom.closed.title": "Data room fermée",
    "dataroom.closed.body": "Come back bientôt.",
    "dataroom.maintenance.title": "Mise à jour en cours",
    "dataroom.maintenance.body":
      "La data room est en cours de mise à jour. Vous recevrez un email dès que les changements seront disponibles.",

    "meta.title": "Espace investisseurs · Minah",

    // page /investors (connexion)
    "auth.title": "Espace investisseurs",
    "auth.subtitle":
      "Accès sur invitation. Première visite : renseignez vos coordonnées. Déjà connecté : votre email suffit. Vous recevez un code d'accès à usage unique par email.",
    "auth.error.invalidLink":
      "Ce lien d'accès est invalide ou expiré. Redemandez un code ci-dessous.",
    "auth.tab.new": "Nouvel investisseur",
    "auth.tab.returning": "Déjà connecté",
    "auth.firstName": "Prénom",
    "auth.lastName": "Nom",
    "auth.entity": "Entité / fonds",
    "auth.email": "Email",
    "auth.submit": "Recevoir mon code d'accès",
    "auth.submitting": "Envoi…",
    "auth.unknownEmail":
      "Cet email ne nous est pas connu. Passez par « Nouvel investisseur ».",
    "auth.sendFailed": "L'envoi a échoué :",
    "auth.codeSent": "Code envoyé ✓",
    "auth.codeSentDetail":
      "Saisissez le code à {n} chiffres reçu sur {email} (le lien dans l'email fonctionne aussi).",
    "auth.codeLabel": "Code d'accès",
    "auth.codeSubmit": "Accéder à l'espace investisseurs",
    "auth.codeVerifying": "Vérification…",
    "auth.codeInvalid": "Code invalide ou expiré. Vérifiez, ou redemandez un code.",
    "auth.codeBack": "← Modifier l'email ou redemander un code",
    "auth.rgpd":
      "En demandant l'accès à l'espace investisseurs, vous acceptez que Minah SAS enregistre vos informations de contact et votre navigation dans cet espace (pages consultées, documents ouverts, durée des visites) à des fins de suivi de la relation investisseur. Vous pouvez demander l'accès ou la suppression de ces données à",

    // home
    "home.banner.overline": "Espace investisseurs · Confidentiel",
    "home.banner.title": "Opportunité d'investissement en pre-seed",
    "home.banner.subtitle": "Tour de {target} · {period} · L'investissement africain, next gen.",
    "home.level1.badge": "Niveau 1 · vous êtes ici",
    "home.level2.unlocked": "Niveau 2 débloqué ✓",
    "home.level2.pending": "Niveau 2 · ouverture en cours…",
    "home.level2.locked": "Niveau 2 verrouillé 🔒",
    "home.pitch.title": "La plateforme de dette privée pour l'Afrique.",
    "home.pitch.body":
      "La première génération de la fintech africaine a gagné les paiements. La prochaine gagnera l'investissement. Minah en construit les rails : dette senior sécurisée, coupons fixes, infrastructure on-chain. Le tour de pre-seed est ouvert.",
    "home.photo.alt":
      "L'équipe fondatrice de Minah : Julien Gakpé, Coralie Lolliot et Hervé Gakpé.",
    "home.photo.caption": "Julien Gakpé · Coralie Lolliot · Hervé Gakpé",
    "home.deal.title": "La levée en cours",
    "home.deal.target": "Objectif",
    "home.deal.minTicket": "Ticket minimum",
    "home.deal.lead": "Lead recherché",
    "home.deal.matching": "Matching fund",
    "home.deal.of": "objectif {target}",
    "home.dataroom.level1": "Data room · Niveau 1",
    "home.dataroom.currentLevel": "votre niveau d'accès actuel",
    "home.dataroom.level2": "Data room · Niveau 2",
    "home.dataroom.level2.locked": "Data room · Niveau 2 🔒",
    "home.dataroom.unlockedInterest": "débloqué · intérêt {tranche}",
    "home.dataroom.unlockedTeam": "débloqué par l'équipe",
    "home.dataroom.lockedIntro":
      "Gestion des risques, table de capitalisation, contrats cadres : ce niveau se débloque en manifestant un intérêt pour une tranche. La démarche est indicative et non engageante.",
    "home.dataroom.interestRecorded":
      "Intérêt enregistré ({tranche}) ✓. L'équipe est prévenue et vous ouvre le niveau 2 très rapidement.",
    "home.dataroom.adding": "Documents en cours d'ajout.",
    "home.docs.empty": "Aucun document disponible pour le moment.",
    "home.docs.read": "Lire →",
    "home.closing.title": "Parlons-en de vive voix",
    "home.closing.body":
      "Ces documents méritent mieux qu'une lecture seule : l'équipe vous les présente volontiers en amont pour donner le contexte de chacun. Et une fois votre deep dive terminé, n'hésitez pas à prendre rendez-vous. Que vous envisagiez d'investir ou non, vos retours nous sont précieux.",
    "home.pending.title": "Accès en cours de validation",
    "home.pending.body":
      "Merci {name}, votre email est confirmé. Nous validons votre accès et vous préviendrons rapidement.",
    "home.blocked.title": "Accès indisponible",
    "home.blocked.body":
      "Votre accès à l'espace investisseurs n'est pas actif. Pour toute question :",
    "home.profileError": "Votre profil n'a pas pu être chargé. Contactez",

    // rdv / intérêt
    "meeting.cta": "Prendre rendez-vous",
    "interest.cta": "Manifester mon intérêt",
    "interest.title": "Manifester mon intérêt",
    "interest.body":
      "Indiquez la tranche envisagée. La démarche est indicative et non engageante. L'équipe est prévenue et vous ouvre rapidement le niveau 2 de la data room.",
    "interest.tranche": "Tranche envisagée",
    "interest.submit": "Valider mon intérêt",
    "interest.sending": "Envoi…",
    "interest.error": "Échec, réessayez.",
    "common.cancel": "Annuler",
    "common.close": "Fermer",

    // widget questions
    "widget.hover": "Posez-nous vos questions",
    "widget.title": "Posez-nous vos questions",
    "widget.intro":
      "Une question par champ, avec le contexte utile. L'équipe les prépare pour le rendez-vous ou y répond par écrit.",
    "widget.questionLabel": "Question {n}",
    "widget.placeholder": "Votre question et son contexte…",
    "widget.add": "Ajouter une question",
    "widget.send.one": "Envoyer ma question",
    "widget.send.many": "Envoyer mes {n} questions",
    "widget.sending": "Envoi…",
    "widget.error": "Échec de l'envoi, réessayez.",
    "widget.thanks.title": "Merci pour vos questions ✓",
    "widget.thanks.body":
      "Le plus simple pour y répondre : prenez un rendez-vous avec l'équipe. Sinon, nous reviendrons vers vous avec l'ensemble des réponses par écrit.",

    // page document
    "docs.back": "← Data room",
    "docs.docsend": "DocSend ↗",
    "docs.captable": "Cap table interactive Minah",
  },
  en: {
    "layout.signout": "Sign out",
    "layout.admin": "Admin",
    "layout.confidential": "Confidential space",
    "layout.confidential.tooltip":
      "Confidential space. Please do not share it, except with people explicitly involved or upon request from the Minah team.",
    "dataroom.closed.title": "Data room closed",
    "dataroom.closed.body": "Come back soon.",
    "dataroom.maintenance.title": "Update in progress",
    "dataroom.maintenance.body":
      "The data room is being updated. You will receive an email as soon as the changes are available.",

    "meta.title": "Investor space · Minah",

    "auth.title": "Investor space",
    "auth.subtitle":
      "Access by invitation. First visit: fill in your details. Already connected: your email is enough. You will receive a one-time access code by email.",
    "auth.error.invalidLink":
      "This access link is invalid or has expired. Request a new code below.",
    "auth.tab.new": "New investor",
    "auth.tab.returning": "Already connected",
    "auth.firstName": "First name",
    "auth.lastName": "Last name",
    "auth.entity": "Entity / fund",
    "auth.email": "Email",
    "auth.submit": "Receive my access code",
    "auth.submitting": "Sending…",
    "auth.unknownEmail": "We do not know this email. Please use “New investor”.",
    "auth.sendFailed": "Sending failed:",
    "auth.codeSent": "Code sent ✓",
    "auth.codeSentDetail":
      "Enter the {n}-digit code sent to {email} (the link in the email works too).",
    "auth.codeLabel": "Access code",
    "auth.codeSubmit": "Enter the investor space",
    "auth.codeVerifying": "Verifying…",
    "auth.codeInvalid": "Invalid or expired code. Check it, or request a new one.",
    "auth.codeBack": "← Change email or request a new code",
    "auth.rgpd":
      "By requesting access to the investor space, you agree that Minah SAS records your contact information and your activity in this space (pages viewed, documents opened, time spent) for investor-relations purposes. You can request access to or deletion of this data at",

    "home.banner.overline": "Investor space · Confidential",
    "home.banner.title": "Pre-seed investment opportunity",
    "home.banner.subtitle": "{target} round · {period} · African investment, next gen.",
    "home.level1.badge": "Level 1 · you are here",
    "home.level2.unlocked": "Level 2 unlocked ✓",
    "home.level2.pending": "Level 2 · opening in progress…",
    "home.level2.locked": "Level 2 locked 🔒",
    "home.pitch.title": "The private debt platform for Africa.",
    "home.pitch.body":
      "African fintech's first generation won payments. The next one wins investment. Minah is building its rails: senior secured debt, fixed coupons, on-chain infrastructure. The pre-seed round is now open.",
    "home.photo.alt":
      "Minah's founding team: Julien Gakpé, Coralie Lolliot and Hervé Gakpé.",
    "home.photo.caption": "Julien Gakpé · Coralie Lolliot · Hervé Gakpé",
    "home.deal.title": "The current round",
    "home.deal.target": "Target",
    "home.deal.minTicket": "Minimum ticket",
    "home.deal.lead": "Lead wanted",
    "home.deal.matching": "Matching fund",
    "home.deal.of": "target {target}",
    "home.dataroom.level1": "Data room · Level 1",
    "home.dataroom.currentLevel": "your current access level",
    "home.dataroom.level2": "Data room · Level 2",
    "home.dataroom.level2.locked": "Data room · Level 2 🔒",
    "home.dataroom.unlockedInterest": "unlocked · interest {tranche}",
    "home.dataroom.unlockedTeam": "unlocked by the team",
    "home.dataroom.lockedIntro":
      "Risk management, cap table, framework agreements: this level unlocks once you express interest in a tranche. The step is indicative and non-binding.",
    "home.dataroom.interestRecorded":
      "Interest recorded ({tranche}) ✓. The team has been notified and will open level 2 for you very soon.",
    "home.dataroom.adding": "Documents being added.",
    "home.docs.empty": "No documents available yet.",
    "home.docs.read": "Read →",
    "home.closing.title": "Let's talk it through",
    "home.closing.body":
      "These documents deserve more than a solo read: the team is happy to walk you through each of them upfront. And once your deep dive is done, do not hesitate to book a meeting. Whether you plan to invest or not, your feedback is valuable to us.",
    "home.pending.title": "Access being validated",
    "home.pending.body":
      "Thank you {name}, your email is confirmed. We are validating your access and will let you know shortly.",
    "home.blocked.title": "Access unavailable",
    "home.blocked.body":
      "Your access to the investor space is not active. For any question:",
    "home.profileError": "Your profile could not be loaded. Contact",

    "meeting.cta": "Book a meeting",
    "interest.cta": "Express my interest",
    "interest.title": "Express my interest",
    "interest.body":
      "Indicate the tranche you have in mind. The step is indicative and non-binding. The team is notified and will quickly open level 2 of the data room for you.",
    "interest.tranche": "Tranche in mind",
    "interest.submit": "Confirm my interest",
    "interest.sending": "Sending…",
    "interest.error": "Failed, please retry.",
    "common.cancel": "Cancel",
    "common.close": "Close",

    "widget.hover": "Ask us your questions",
    "widget.title": "Ask us your questions",
    "widget.intro":
      "One question per field, with any useful context. The team prepares them for the meeting or answers in writing.",
    "widget.questionLabel": "Question {n}",
    "widget.placeholder": "Your question and its context…",
    "widget.add": "Add a question",
    "widget.send.one": "Send my question",
    "widget.send.many": "Send my {n} questions",
    "widget.sending": "Sending…",
    "widget.error": "Sending failed, please retry.",
    "widget.thanks.title": "Thank you for your questions ✓",
    "widget.thanks.body":
      "The easiest way to get answers: book a meeting with the team. Otherwise, we will come back to you with all the answers in writing.",

    "docs.back": "← Data room",
    "docs.docsend": "DocSend ↗",
    "docs.captable": "Minah interactive cap table",
  },
} as const;

export type TranslationKey = keyof (typeof dict)["fr"];

// Champs traduisibles d'un document. Tant que la colonne _en est nulle,
// l'affichage retombe silencieusement sur le français.
type DocFields = {
  title: string;
  title_en: string | null;
  category: string;
  category_en: string | null;
  content?: string | null;
  content_en?: string | null;
  docsend_url?: string | null;
  docsend_url_en?: string | null;
};

export function docFields(doc: DocFields, locale: Locale) {
  const pick = (fr: string | null | undefined, en: string | null | undefined) =>
    locale === "en" && en ? en : (fr ?? null);
  return {
    title: pick(doc.title, doc.title_en) ?? doc.title,
    category: pick(doc.category, doc.category_en) ?? doc.category,
    content: pick(doc.content, doc.content_en),
    docsendUrl: pick(doc.docsend_url, doc.docsend_url_en),
  };
}

// t("home.deal.of", locale, {target: "1,5 M€"}), {slots} interpolés.
export function t(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  let out: string = dict[locale][key] ?? dict.fr[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}
