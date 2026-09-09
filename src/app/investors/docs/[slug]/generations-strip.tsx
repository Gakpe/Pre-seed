import { ScrollReveal } from "./scroll-reveal";

// Première direction pour la fiche « Pourquoi Minah » : la thèse en trois
// temps, dans une bande qui défile latéralement. Le mouvement horizontal dit
// la même chose que le texte, une génération succède à une autre, et il donne
// à la page le rythme qui lui manquait.
//
// Bande volontairement courte : le raisonnement complet reste dans le corps de
// la fiche, la bande n'en est que l'ouverture.

type Panel = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  proof: string;
  tone: "past" | "now";
};

const PANELS: Panel[] = [
  {
    index: "01",
    eyebrow: "Première génération",
    title: "Le mouvement de l'argent",
    body: "Faire circuler la valeur, à bas coût, à l'échelle. Un problème d'infrastructure, résolu.",
    proof: "M-Pesa · Wave · Flutterwave · Paystack",
    tone: "past",
  },
  {
    index: "02",
    eyebrow: "Deuxième génération",
    title: "L'usage de l'argent",
    body: "Non plus déplacer l'argent, mais l'employer : le structurer, le tarifer, l'allouer, le tracer.",
    proof: "Le passage du paiement à l'investissement",
    tone: "past",
  },
  {
    index: "03",
    eyebrow: "Notre place",
    title: "La couche de structuration",
    body: "Relier le capital international à l'économie réelle africaine, avec les standards de traçabilité et de reporting qu'exige un investisseur institutionnel.",
    proof: "Minah",
    tone: "now",
  },
];

export function GenerationsStrip() {
  return (
    <section className="mt-12">
      <ScrollReveal>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
          La thèse en trois temps
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
          Faites défiler la bande horizontalement.
        </p>
      </ScrollReveal>

      {/* Le débordement est assumé : la bande sort de la colonne de lecture,
          c'est ce qui signale qu'elle se parcourt sur un autre axe. */}
      <div className="-mx-6 mt-5 overflow-x-auto pb-3 [scrollbar-width:thin]">
        <ol className="flex snap-x snap-mandatory gap-4 px-6">
          {PANELS.map((panel, i) => (
            <li key={panel.index} className="snap-start">
              <ScrollReveal delay={i * 90}>
                <article
                  className={`flex h-full w-[19rem] flex-col rounded-xl border p-6 sm:w-[22rem] ${
                    panel.tone === "now"
                      ? "border-brand/35 bg-brand/[0.05]"
                      : "border-foreground/10 bg-white/60"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-xs text-neutral-400">
                      {panel.index}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        panel.tone === "now" ? "text-brand" : "text-neutral-400"
                      }`}
                    >
                      {panel.eyebrow}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
                    {panel.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600">
                    {panel.body}
                  </p>
                  <p className="mt-5 border-t border-foreground/10 pt-3 text-[11px] tracking-wide text-neutral-500">
                    {panel.proof}
                  </p>
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
