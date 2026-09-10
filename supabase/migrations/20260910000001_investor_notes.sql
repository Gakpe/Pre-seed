-- Notes et relances sur un investisseur, saisies depuis /admin.
--
-- Deux natures dans une seule table plutôt que deux tables : c'est le même
-- objet (un texte daté, signé par un admin), seule la colonne de suivi change.
-- `fomo` marque une relance faite pendant l'audit de l'investisseur.
--
-- Aucune policy RLS : la table reste invisible aux clients et n'est lue et
-- écrite que par le service role, comme `events`.

create table public.investor_notes (
  id bigint generated always as identity primary key,
  investor_id uuid not null references public.investors (id) on delete cascade,
  kind text not null default 'note' check (kind in ('note', 'fomo')),
  body text not null,
  -- email de l'admin auteur, tel que connu au moment de la saisie
  author text,
  created_at timestamptz not null default now()
);

create index investor_notes_investor_idx
  on public.investor_notes (investor_id, created_at desc);

alter table public.investor_notes enable row level security;
