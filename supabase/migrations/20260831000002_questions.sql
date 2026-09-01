-- Questions posées par les investisseurs (widget en bas à droite).
-- Posées en amont du RDV ; réponse en RDV ou par écrit. Alerte Yao à chaque question.

create table public.questions (
  id bigint generated always as identity primary key,
  investor_id uuid not null references public.investors (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

alter table public.questions enable row level security;

alter table public.notifications drop constraint notifications_kind_check;
alter table public.notifications add constraint notifications_kind_check
  check (kind in ('signup', 'first_login', 'docsend_click', 'long_session', 'return_visit', 'interest', 'question'));

create or replace function public.notify_question()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.investors;
begin
  select * into inv from investors where id = new.investor_id;
  if inv.id is not null then
    perform queue_notification(
      new.investor_id,
      'question',
      '📩 ' || investor_label(inv) || ' pose une question : « ' || left(new.body, 300) || ' »',
      jsonb_build_object('question_id', new.id)
    );
  end if;
  return new;
end;
$$;

create trigger on_question_created
  after insert on public.questions
  for each row execute function public.notify_question();
