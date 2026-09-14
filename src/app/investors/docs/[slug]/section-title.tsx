// Titre de section des fiches investisseurs : pastille orangée à picto et
// libellé (voir AGENTS.md). Partagé entre les fiches, pour qu'un picto ou une
// taille changés le soient partout.

export type SectionIconName =
  | "search"
  | "trend"
  | "chip"
  | "layers"
  | "route"
  | "percent"
  | "repeat"
  | "document";

export function SectionIcon({ name }: { name: SectionIconName }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

const ICONS: Record<SectionIconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M10 10h4v4h-4zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </>
  ),
  layers: (
    <>
      <path d="M12 2 2 7l10 5 10-5-10-5z" />
      <path d="m2 12 10 5 10-5" />
      <path d="m2 17 10 5 10-5" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5" />
    </>
  ),
  percent: (
    <>
      <path d="M19 5 5 19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
};

// Picto quand la fiche se lit comme un raisonnement, numéro quand elle se lit
// comme une suite de chapitres : passer `icon` ou `n`, pas les deux.
export function SectionTitle({
  icon,
  n,
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: React.ReactNode;
  as?: "h2" | "h3";
  className?: string;
} & (
  | { icon: SectionIconName; n?: never }
  | { n: string; icon?: never }
)) {
  return (
    <Tag
      className={`flex items-center gap-3 text-2xl font-semibold leading-tight tracking-tight ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 font-mono text-sm font-semibold text-marsala">
        {icon ? <SectionIcon name={icon} /> : n}
      </span>
      {children}
    </Tag>
  );
}
