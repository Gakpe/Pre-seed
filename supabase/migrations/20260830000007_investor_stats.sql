-- Agrégats de navigation par investisseur pour /admin (temps total, sessions,
-- documents ouverts). security_invoker : soumis à RLS pour les utilisateurs
-- normaux (events n'a pas de policy select → invisible), lisible via service role.

create or replace view public.investor_stats
with (security_invoker = true)
as
select
  investor_id,
  count(distinct session_id) filter (where session_id is not null) as sessions,
  coalesce(sum(duration_ms) filter (where type = 'page_leave'), 0)::bigint as total_duration_ms,
  count(*) filter (where type = 'docsend_click') as docsend_clicks,
  count(*) filter (where type = 'page_view') as page_views
from public.events
where investor_id is not null
group by investor_id;
