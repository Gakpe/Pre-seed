-- Réglages applicatifs (clé/valeur jsonb). Utilisé pour les paramètres de la
-- cap table interactive, sauvegardés depuis /admin/captable.
-- Aucune policy : accès service role uniquement.

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;
