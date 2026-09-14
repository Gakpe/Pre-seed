-- Retour à la validation manuelle des inscriptions.
--
-- La migration 20260830000001_auto_approve avait supprimé cette étape : tout
-- nouvel inscrit était approuvé d'office. On la rétablit, sans toucher aux
-- investisseurs déjà approuvés, qui gardent leur accès.
--
-- L'enum `investor_status` porte déjà les trois états nécessaires :
--   pending  : inscrit, en attente de validation, ne voit aucun document
--   approved : validé, accès complet selon son niveau
--   blocked  : refusé ou révoqué, ne voit rien
-- La RLS de 20260829000001 applique déjà ces règles, rien à y changer.

alter table public.investors alter column status set default 'pending';

-- Un compte en attente ne doit voir aucun document. Trois fiches étaient
-- ouvertes aux `pending` (deck, équipe, pourquoi Minah) : elles ne le sont plus,
-- sans quoi la validation manuelle ne protégerait rien.
update public.documents set visible_to_pending = false where visible_to_pending;

-- L'alerte d'inscription appelle désormais une action : le dire.
create or replace function public.notify_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform queue_notification(
    new.id,
    'signup',
    '📥 Nouvelle inscription à valider : ' || investor_label(new)
      || ', @' || coalesce(new.email_domain, '?')
      || coalesce(' · ref ' || new.ref, ''),
    jsonb_build_object('email', new.email, 'entity', new.entity, 'ref', new.ref)
  );
  return new;
end;
$$;
