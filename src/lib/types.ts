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
};

export type DocumentRow = {
  slug: string;
  title: string;
  docsend_url: string;
  visible_to_pending: boolean;
  sort_order: number;
};
