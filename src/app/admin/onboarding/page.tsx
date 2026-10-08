import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_FOCUS,
  listOnboardings,
  onboardingMessage,
  welcomeSteps,
} from "@/lib/onboarding";
import { listPreapproved } from "@/lib/preapproved";
import { RETIRED_SLUGS } from "@/lib/retired-docs";
import type { DocumentRow, InvestorStatus } from "@/lib/types";
import { OnboardingPanel, type DocOption, type OnboardingView } from "./onboarding-panel";

export const metadata = { title: "Onboarding, Minah" };

export default async function OnboardingPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [list, preapproved, { data: docRows }, { data: investors }] = await Promise.all([
    listOnboardings(),
    listPreapproved(),
    admin.from("documents").select("*").order("sort_order"),
    admin.from("investors").select("email, status, level2_access"),
  ]);
  const docs = ((docRows ?? []) as DocumentRow[]).filter((d) => !RETIRED_SLUGS.has(d.slug));
  const byEmail = new Map(
    ((investors ?? []) as { email: string; status: InvestorStatus; level2_access: boolean }[]).map(
      (i) => [i.email.toLowerCase(), i]
    )
  );
  const preapprovedSet = new Set(preapproved.map((p) => p.email));

  // L'aperçu rejoue ce que la personne verra : son niveau, plus ce qu'on lui
  // ouvre. Pour une adresse pas encore inscrite, le niveau 1.
  const views: OnboardingView[] = list.map((o) => {
    const inv = byEmail.get(o.email);
    const level2 = inv?.level2_access ?? false;
    const visible = docs.filter(
      (d) => d.access_level === 1 || level2 || o.unlocked_slugs.includes(d.slug)
    );
    return {
      onboarding: o,
      status: inv?.status ?? null,
      preapproved: preapprovedSet.has(o.email),
      preview: {
        message: onboardingMessage(o, "fr"),
        steps: welcomeSteps(visible, o, level2, "fr"),
      },
    };
  });

  const options: DocOption[] = docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    category: d.category,
    level: d.access_level,
  }));

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <Link href="/admin" className="text-sm text-neutral-500 hover:underline">
        ← Investisseurs
      </Link>
      <h1 className="mt-6 text-xl font-semibold tracking-tight">Onboarding</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
        Par défaut, chaque investisseur arrive sur la même visite guidée : un
        mot d&apos;accueil, «&nbsp;Pourquoi Minah&nbsp;?&nbsp;» mis en lumière,
        puis l&apos;invitation à prendre rendez-vous. Un onboarding sur mesure
        la remplace pour une adresse : un message à son intention, les fiches
        mises en avant dans l&apos;ordre choisi, et
        des fiches de niveau 2 ouvertes pour elle seule, sans ouvrir le reste du
        niveau. L&apos;ouverture est appliquée en base, pas seulement à
        l&apos;affichage.
      </p>
      <OnboardingPanel views={views} docs={options} defaultFocus={DEFAULT_FOCUS} />
    </main>
  );
}
