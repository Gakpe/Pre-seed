import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureInvestor } from "@/lib/investors";
import { dealFor } from "@/lib/deal";
import { getLocale } from "@/lib/i18n-server";
import { docFields, t } from "@/lib/i18n";
import { demoInvestor, getDemoSession } from "@/lib/demo";
import type { DocumentRow, Investor } from "@/lib/types";
import { DataRoom } from "./data-room";
import { InterestModal } from "./interest-modal";
import { MeetingButton } from "./meeting-button";
import { MatchingFundTooltip } from "../matching-fund-tooltip";

export async function generateMetadata() {
  return { title: t(await getLocale(), "meta.title") };
}

export default async function InvestorHomePage() {
  const locale = await getLocale();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <Main>
        <p className="text-sm text-neutral-500">
          Supabase n&apos;est pas encore configuré (NEXT_PUBLIC_SUPABASE_URL
          manquant dans .env.local).
        </p>
      </Main>
    );
  }

  const deal = dealFor(locale);
  const demo = await getDemoSession();

  let investor: Investor | null;
  if (demo) {
    investor = demoInvestor(demo);
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/investors");

    const { data } = await supabase
      .from("investors")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    investor = (data as Investor | null) ?? (await ensureInvestor(user));
  }

  if (!investor) {
    return (
      <Main>
        <p className="text-sm text-neutral-600">
          {t(locale, "home.profileError")}{" "}
          <a href="mailto:contact@minah.io" className="underline">
            contact@minah.io
          </a>
          .
        </p>
      </Main>
    );
  }

  if (investor.status === "blocked") {
    return (
      <Main>
        <h1 className="text-xl font-semibold tracking-tight">
          {t(locale, "home.blocked.title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {t(locale, "home.blocked.body")}{" "}
          <a href="mailto:contact@minah.io" className="underline">
            contact@minah.io
          </a>
          .
        </p>
      </Main>
    );
  }

  // En démo il n'y a pas de session Supabase : on lit via le service role en
  // rejouant nous-mêmes le filtrage de niveau que ferait la RLS.
  let documents: DocumentRow[] | null = null;
  if (demo) {
    const { data } = await createAdminClient()
      .from("documents")
      .select("*")
      .lte("access_level", demo.level2 ? 2 : 1)
      .order("sort_order");
    documents = data as DocumentRow[] | null;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("sort_order");
    documents = data as DocumentRow[] | null;
  }
  const docs = documents ?? [];
  const level1 = docs.filter((d) => d.access_level === 1);
  const level2 = docs.filter((d) => d.access_level === 2);
  const level2Unlocked = investor.level2_access;

  let lockedTitles: {
    title: string;
    title_en: string | null;
    category: string;
    category_en: string | null;
  }[] = [];
  if (!level2Unlocked && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: locked } = await createAdminClient()
      .from("documents")
      .select("title, title_en, category, category_en, sort_order")
      .eq("access_level", 2)
      .order("sort_order");
    lockedTitles = locked ?? [];
  }

  if (investor.status === "pending") {
    return (
      <Main>
        <h1 className="text-xl font-semibold tracking-tight">
          {t(locale, "home.pending.title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {t(locale, "home.pending.body", { name: investor.full_name ?? "" })}
        </p>
        {level1.length > 0 && (
          <div className="mt-10">
            <DataRoom docs={level1} locale={locale} />
          </div>
        )}
      </Main>
    );
  }

  return (
    <>
      {/* Bandeau pleine largeur, le message doit être explicite */}
      <section className="relative h-56 w-full overflow-hidden md:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/cover.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-5xl flex-col justify-center px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-white/80">
            {t(locale, "home.banner.overline")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {t(locale, "home.banner.title")}
          </h1>
          <p className="mt-2 text-sm text-white/90 md:text-base">
            {t(locale, "home.banner.subtitle", {
              target: deal.target,
              period: deal.period,
            })}
          </p>
        </div>
      </section>

      <Main>
        {/* Actions + fil d'Ariane des niveaux */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label={t(locale, "home.dataroom.level1")}
            className="flex items-center gap-2 text-xs"
          >
            <span className="rounded-full bg-foreground px-3 py-1 font-medium text-background">
              {t(locale, "home.level1.badge")}
            </span>
            <span className="text-neutral-400">→</span>
            {level2Unlocked ? (
              <span className="rounded-full bg-salvia px-3 py-1 font-medium text-foreground">
                {t(locale, "home.level2.unlocked")}
              </span>
            ) : investor.interest_expressed_at ? (
              <span className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-foreground">
                {t(locale, "home.level2.pending")}
              </span>
            ) : (
              <span className="rounded-full border border-dashed border-neutral-400 px-3 py-1 text-neutral-500">
                {t(locale, "home.level2.locked")}
              </span>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {!level2Unlocked && !investor.interest_expressed_at && (
              <InterestModal locale={locale} demo={!!demo} />
            )}
            <MeetingButton locale={locale} />
          </div>
        </div>

        {/* Présentation */}
        <section className="mt-10 grid gap-8 md:grid-cols-[1fr_300px] md:items-start">
          <div>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">
              {t(locale, "home.pitch.title")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {t(locale, "home.pitch.body")}
            </p>
          </div>
          {/* Photo des fondateurs, en vignette : les trois sont de front, la
              bande large de la prise de vue est conservée telle quelle. */}
          <figure className="overflow-hidden rounded-lg bg-[#050505]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/team.jpg"
              alt={t(locale, "home.photo.alt")}
              className="w-full object-cover"
            />
            <figcaption className="px-3 py-2 text-[10px] tracking-wide text-white/45">
              {t(locale, "home.photo.caption")}
            </figcaption>
          </figure>
        </section>

        {/* Conditions du deal */}
        <section className="mt-10 rounded-lg border border-foreground/10 bg-white/50 p-6">
          <h2 className="text-sm font-semibold">{t(locale, "home.deal.title")}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <Term label={t(locale, "home.deal.target")} value={deal.target} />
            <Term
              label={t(locale, "home.deal.minTicket")}
              value={deal.minTicket}
            />
            <Term label={t(locale, "home.deal.lead")} value={deal.leadWanted} />
            {/* Le montant est un total pondéré : l'infobulle en donne le détail. */}
            <Term label={t(locale, "home.deal.matching")}>
              <MatchingFundTooltip locale={locale} align="right">
                {deal.matchingFund}
              </MatchingFundTooltip>
            </Term>
          </dl>
          <div className="mt-6">
            <div className="flex items-baseline justify-between text-xs text-neutral-500">
              <MatchingFundTooltip locale={locale}>
                {deal.engagedLabel}
              </MatchingFundTooltip>
              <span>{t(locale, "home.deal.of", { target: deal.target })}</span>
            </div>
            {/* Tirets fins : montants identifiés en soft commit, pas encore signés */}
            <div className="mt-2 h-1 rounded-full bg-neutral-200/80">
              <div
                className="relative h-full"
                style={{
                  width: `${deal.progressPct}%`,
                  backgroundImage:
                    "repeating-linear-gradient(90deg, var(--brand) 0 10px, transparent 10px 17px)",
                }}
              >
                <span className="absolute -top-[3px] right-0 h-2.5 w-2.5 rounded-full bg-brand" />
              </div>
            </div>
          </div>
        </section>

        {/* Data room niveau 1, deux colonnes */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
            {t(locale, "home.dataroom.level1")}
          </h2>
          <div className="mt-4">
            <DataRoom docs={level1} locale={locale} columns={2} />
          </div>
        </section>

        {/* Niveau 2 */}
        <section className="mt-10 rounded-lg border border-foreground/10 bg-white/50 p-6">
          {level2Unlocked ? (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
                {t(locale, "home.dataroom.level2")}
                <span className="ml-2 rounded-full bg-salvia px-2 py-0.5 text-xs font-normal normal-case tracking-normal text-foreground">
                  {investor.interest_tranche
                    ? t(locale, "home.dataroom.unlockedInterest", {
                        tranche: investor.interest_tranche,
                      })
                    : t(locale, "home.dataroom.unlockedTeam")}
                </span>
              </h2>
              <div className="mt-4">
                {level2.length > 0 ? (
                  <DataRoom
                    docs={level2}
                    locale={locale}
                    startIndex={8}
                    columns={2}
                  />
                ) : (
                  <p className="text-sm text-neutral-500">
                    {t(locale, "home.dataroom.adding")}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
                {t(locale, "home.dataroom.level2.locked")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {t(locale, "home.dataroom.lockedIntro")}
              </p>
              {lockedTitles.length > 0 && (
                <ul className="mt-4 grid gap-x-6 md:grid-cols-2">
                  {lockedTitles.map((doc) => {
                    const { title, category } = docFields(doc, locale);
                    return (
                      <li
                        key={doc.title}
                        className="flex items-center justify-between border-b border-dashed border-neutral-300 px-1 py-2.5 text-sm text-neutral-400"
                      >
                        <span>
                          <span className="mr-2 text-xs uppercase tracking-wide text-neutral-300">
                            {category}
                          </span>
                          {title}
                        </span>
                        <span>🔒</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-5">
                {investor.interest_expressed_at ? (
                  <p className="text-sm text-neutral-600">
                    {t(locale, "home.dataroom.interestRecorded", {
                      tranche: investor.interest_tranche ?? "",
                    })}
                  </p>
                ) : (
                  <InterestModal locale={locale} demo={!!demo} />
                )}
              </div>
            </>
          )}
        </section>

        {/* Clôture : contexte + invitation au rendez-vous */}
        <section className="mt-12 rounded-lg border border-marsala/20 bg-white/60 p-8 text-center">
          <h2 className="text-base font-semibold tracking-tight">
            {t(locale, "home.closing.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-600">
            {t(locale, "home.closing.body")}
          </p>
          <div className="mt-5 flex justify-center">
            <MeetingButton locale={locale} />
          </div>
        </section>
      </Main>
    </>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      {children}
    </main>
  );
}

function Term({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{children ?? value}</dd>
    </div>
  );
}
