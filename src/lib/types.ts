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
};

export type EventType =
  | "login"
  | "page_view"
  | "page_leave"
  | "docsend_click"
  | "cta_click";
