export type InvestorStatus = "pending" | "approved" | "blocked";

export type Investor = {
  id: string;
  email: string;
  full_name: string | null;
  entity: string | null;
  email_domain: string | null;
  status: InvestorStatus;
  tags: string[];
  ref: string | null;
  created_at: string;
  last_seen_at: string | null;
  interest_expressed_at: string | null;
  interest_tranche: string | null;
  level2_access: boolean;
};

export type InvestorStats = {
  investor_id: string;
  sessions: number;
  total_duration_ms: number;
  docsend_clicks: number;
  page_views: number;
};

export type DocumentRow = {
  slug: string;
  title: string;
  docsend_url: string | null;
  visible_to_pending: boolean;
  category: string;
  sort_order: number;
  access_level: number;
  content: string | null;
  // Versions anglaises, nulles tant que la traduction n'est pas saisie,
  // auquel cas l'affichage retombe sur la version française.
  title_en: string | null;
  content_en: string | null;
  docsend_url_en: string | null;
  category_en: string | null;
};

// Note ou relance saisie depuis /admin. `fomo` marque une relance faite
// pendant l'audit de l'investisseur.
export type NoteKind = "note" | "fomo";

export type InvestorNote = {
  id: number;
  investor_id: string;
  kind: NoteKind;
  body: string;
  author: string | null;
  created_at: string;
};

export type EventType =
  | "login"
  | "page_view"
  | "page_leave"
  | "docsend_click"
  | "cta_click";
