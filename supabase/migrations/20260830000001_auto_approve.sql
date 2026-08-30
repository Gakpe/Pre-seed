-- Changement de flux : plus de validation manuelle à l'inscription.
-- Les nouveaux investisseurs sont directement approuvés ; les admins peuvent
-- toujours bloquer (ou repasser en pending) depuis /admin.

alter table public.investors alter column status set default 'approved';

update public.investors set status = 'approved' where status = 'pending';
