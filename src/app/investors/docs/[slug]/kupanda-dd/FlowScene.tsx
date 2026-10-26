"use client";

import { useMemo, useRef } from "react";
import { FRANCE_OUTLINE, GEO_LAT0, GEO_LON0, GEO_RUNS, GEO_STEP, ZAMBIA_OUTLINE } from "@/lib/kupanda-geo";
import type { Locale } from "@/lib/i18n";
import { arcPoints, project, toPath, type Camera, type Pt } from "./projection";
import { boxOf, useViewBox } from "./zoom";
import { ZambiaZoom, zambiaBox } from "./ZambiaZoom";

// La scène du flux : une carte du monde en points, inclinée comme un plateau.
// Les souscripteurs, d'un peu partout, convergent vers Paris (Minah SAS) ;
// l'argent part ensuite vers Lusaka (Africa Rise), et un encart montre ce qui
// se passe en Zambie : les PME, l'État qui paie. Le retour redescend en
// pointillés. Chaque élément est cliquable et ouvre le panneau de détail.

export type Layout = "wide" | "tall";

const CAMERAS: Record<Layout, Camera> = {
  wide: { W: 1200, H: 860, lon0: 16, lat0: 18, k: 9, tilt: 44, yaw: -4, D: 1400, cx: 470, cy: 425, fs: 1.15 },
  tall: { W: 600, H: 900, lon0: 16, lat0: 18, k: 7.6, tilt: 40, yaw: -4, D: 1300, cx: 320, cy: 330, fs: 1.75 },
};

const PARIS: [number, number] = [2.35, 48.85];
const LUSAKA: [number, number] = [28.28, -15.42];

// Villes des souscripteurs : institutionnels et fonds en Europe et dans le
// Golfe, family offices, diaspora, détenteurs d'actifs numériques. Une seule
// en Afrique, Dakar : plus de points y brouillaient la carte (Julien,
// 24/10/2026).
const CITIES: { name: string; at: [number, number] }[] = [
  { name: "New York", at: [-74, 40.7] },
  { name: "Montréal", at: [-73.6, 45.5] },
  { name: "Londres", at: [-0.1, 51.5] },
  { name: "Bruxelles", at: [4.35, 50.85] },
  { name: "Genève", at: [6.1, 46.2] },
  { name: "Francfort", at: [8.7, 50.1] },
  { name: "Dubaï", at: [55.3, 25.3] },
  { name: "Riyad", at: [46.7, 24.7] },
  { name: "Doha", at: [51.5, 25.3] },
  { name: "Dakar", at: [-17.4, 14.7] },
  { name: "Singapour", at: [103.8, 1.35] },
  { name: "Hong Kong", at: [114.2, 22.3] },
];

// Encart « En Zambie », en coordonnées du viewBox.
const INSET: Record<Layout, { x: number; y: number; w: number; h: number }> = {
  wide: { x: 24, y: 590, w: 400, h: 250 },
  tall: { x: 20, y: 516, w: 560, h: 372 },
};

const copy = {
  fr: {
    alt: "Carte du monde : des souscripteurs de plusieurs continents investissent auprès de Minah SAS à Paris, qui déploie les fonds vers Africa Rise à Lusaka, en Zambie, où ils financent des PME sous contrat public.",
    investors: "Souscripteurs",
    investorsSub: "Europe, Golfe, Afrique, Amériques, Asie",
    investorsShort: "Partout dans le monde",
    minah: "Minah SAS",
    minahSub: "Émetteur, Paris",
    africaRise: "Africa Rise",
    africaRiseSub: "Lusaka, Zambie",
    zambia: "En Zambie",
    zambiaSub: "Le portefeuille d'Africa Rise",
    state: "État zambien",
    stateSub: "2 ministères",
    smes: [
      { id: "uc-infrastructure", t: "Infrastructure", s: "Cantines scolaires" },
      { id: "uc-energie", t: "Énergie", s: "Contrat ZESCO" },
    ],
    pme: "PME sous contrat",
    zoomZambia: "Les PME en Zambie",
    americas: "Amériques",
    asia: "Asie",
  },
  en: {
    alt: "World map: subscribers from several continents invest with Minah SAS in Paris, which deploys the funds to Africa Rise in Lusaka, Zambia, where they finance SMEs under public contracts.",
    investors: "Subscribers",
    investorsSub: "Europe, Gulf, Africa, Americas, Asia",
    investorsShort: "From around the world",
    minah: "Minah SAS",
    minahSub: "Issuer, Paris",
    africaRise: "Africa Rise",
    africaRiseSub: "Lusaka, Zambia",
    zambia: "In Zambia",
    zambiaSub: "Africa Rise's portfolio",
    state: "Zambian State",
    stateSub: "2 ministries",
    smes: [
      { id: "uc-infrastructure", t: "Infrastructure", s: "School canteens" },
      { id: "uc-energie", t: "Energy", s: "ZESCO contract" },
    ],
    pme: "SMEs under contract",
    zoomZambia: "The SMEs in Zambia",
    americas: "Americas",
    asia: "Asia",
  },
} as const;

// Acteurs reliés à un flux : ils restent nets quand le flux est sélectionné.
export const SCENE_LINKS: Record<string, string[]> = {
  pme: ["uc-infrastructure", "uc-energie"],
  souscription: ["souscripteurs", "minah"],
  deploiement: ["minah", "africa-rise"],
  financement: ["africa-rise", "pme", "uc-infrastructure", "uc-energie"],
  reglement: ["etat", "pme", "uc-infrastructure", "uc-energie"],
  retour: ["pme", "africa-rise", "minah", "souscripteurs"],
};

function lit(selected: string | null, id: string): boolean {
  if (!selected || selected === id) return true;
  if (SCENE_LINKS[selected]) return SCENE_LINKS[selected].includes(id);
  if (SCENE_LINKS[id]) return SCENE_LINKS[id].includes(selected);
  return false;
}

export function FlowScene({
  locale,
  layout,
  selected,
  onSelect,
  labels,
  motion,
  focus,
  cover,
}: {
  locale: Locale;
  layout: Layout;
  selected: string | null;
  onSelect: (id: string) => void;
  /** Groupe d'étapes sur lequel zoomer, ou rien pour la scène entière. */
  focus: string | null;
  /** Largeur en pixels masquée à droite par le panneau de détail. */
  cover: number;
  /** Libellés des flux, lus dans les données de la fiche. */
  labels: Record<string, string>;
  /** Faux si la personne a demandé moins d'animations. */
  motion: boolean;
}) {
  const c = copy[locale];
  const cam = CAMERAS[layout];
  const fs = cam.fs;
  const inset = INSET[layout];

  // Le semis de points et les contours ne changent qu'avec la caméra.
  const ground = useMemo(() => {
    const dots: { p: Pt; t: number }[] = [];
    for (const [j, i0, i1, t] of GEO_RUNS) {
      const lat = GEO_LAT0 + j * GEO_STEP;
      const off = j % 2 ? GEO_STEP / 2 : 0;
      for (let i = i0; i <= i1; i++) {
        const lon = GEO_LON0 + i * GEO_STEP + off;
        // Les Amériques sortent du cadre : seule la pointe du Brésil restait.
        if (lon < -28) continue;
        const p = project(cam, lon, lat);
        // Marge large : un zoom décentré découvre le pourtour du cadre.
        if (p.x < -cam.W * 0.4 || p.x > cam.W * 1.4 || p.y < -cam.H * 0.3 || p.y > cam.H * 1.3) continue;
        dots.push({ p, t });
      }
    }
    const outline = (rings: [number, number][][]) =>
      rings.map((r) => toPath(r.map(([lo, la]) => project(cam, lo, la))) + "Z").join("");
    // Graticule tous les 15 degrés : c'est elle qui donne la profondeur.
    const grid: string[] = [];
    for (let lon = -120; lon <= 150; lon += 15) {
      const pts = [];
      for (let lat = -45; lat <= 70; lat += 5) pts.push(project(cam, lon, lat));
      grid.push(toPath(pts));
    }
    for (let lat = -45; lat <= 70; lat += 15) {
      const pts = [];
      for (let lon = -130; lon <= 160; lon += 5) pts.push(project(cam, lon, lat));
      grid.push(toPath(pts));
    }
    return { dots, grid, zambia: outline(ZAMBIA_OUTLINE), france: outline(FRANCE_OUTLINE) };
  }, [cam]);

  const geo = useMemo(() => {
    const paris = project(cam, ...PARIS);
    const lusaka = project(cam, ...LUSAKA);
    const cities = CITIES.map((ct) => ({
      ...ct,
      p: project(cam, ...ct.at),
      arc: toPath(arcPoints(cam, ct.at, PARIS, 0.22)),
      back: toPath(arcPoints(cam, PARIS, ct.at, 0.12)),
    }));
    // Où les arcs lointains entrent dans le cadre : on y nomme le continent.
    const edge = (at: [number, number], side: "left" | "right") => {
      const pts = arcPoints(cam, at, PARIS, 0.22, 80);
      const q = pts.find((p) => (side === "left" ? p.x > 8 : p.x < cam.W - 8));
      return q ?? null;
    };
    const americas = edge([-74, 40.7], "left");
    const asia = edge([103.8, 1.35], "right");
    const deployPts = arcPoints(cam, PARIS, LUSAKA, 0.3);
    const returnPts = arcPoints(cam, LUSAKA, PARIS, 0.16);
    return {
      paris,
      lusaka,
      cities,
      deploy: toPath(deployPts),
      deployTop: deployPts[18],
      ret: toPath(returnPts),
      retMid: returnPts[18],
      americas,
      asia,
    };
  }, [cam]);

  // Au large, les sous-jacents se lisent dans un zoom sur la Zambie : la
  // carte du monde et ses étiquettes s'effacent, le calque du pays apparaît.
  const zambia = layout === "wide" && focus === "sous-jacents";
  const pick = (id: string, label: string, scope: "world" | "zoom" = "world") => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    "aria-pressed": selected === id,
    onClick: () => onSelect(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(id);
      }
    },
    className: "cursor-pointer outline-none",
    style:
      zambia && scope === "world"
        ? { opacity: 0, pointerEvents: "none" as const, transition: "opacity 300ms" }
        : { opacity: lit(selected, id) ? 1 : 0.28, transition: "opacity 300ms" },
  });

  const on = (id: string) => selected === id;
  // Peu de points en mouvement : au repos, quelques-uns sur la souscription
  // et un sur le déploiement ; une sélection n'anime que son flux.
  const flows = (id: string) =>
    motion && !zambia && (selected === null ? id !== "retour" : selected === id || (SCENE_LINKS[id] ?? []).includes(selected) && id !== "retour");
  const ACCENT = "var(--bm-accent)";
  const INK = "var(--bm-minah)";
  const PIN = 60 * (layout === "tall" ? 1.2 : 1);

  // Zones de zoom, une par groupe d'étapes.
  const svgRef = useRef<SVGSVGElement>(null);
  const boxes = useMemo(() => {
    const parisCard = [
      { x: geo.paris.x - 90 * fs, y: geo.paris.y - PIN * geo.paris.s - 62 * fs },
      { x: geo.paris.x + 90 * fs, y: geo.paris.y + 30 * fs },
    ];
    const lusakaCard = [
      { x: geo.lusaka.x - 230 * fs, y: geo.lusaka.y - PIN * 0.8 * geo.lusaka.s - 84 * fs },
      { x: geo.lusaka.x + 40 * fs, y: geo.lusaka.y + 30 * fs },
    ];
    const inFrame = geo.cities.map((ct) => ct.p).filter((p) => p.x > 0 && p.x < cam.W && p.y > 0 && p.y < cam.H);
    const inset4 = [
      { x: inset.x, y: inset.y },
      { x: inset.x + inset.w, y: inset.y + inset.h },
    ];
    return {
      emission: boxOf([...inFrame, ...parisCard], 30),
      partenaire: boxOf([...parisCard, ...lusakaCard, { x: geo.deployTop.x + 140 * fs, y: geo.deployTop.y }], 40),
      "sous-jacents": layout === "wide" ? zambiaBox(cam) : boxOf([...inset4, ...lusakaCard], 30),
      retour: boxOf([...inFrame, ...parisCard, ...lusakaCard, { x: geo.retMid.x + 120 * fs, y: geo.retMid.y }], 30),
    } as Record<string, ReturnType<typeof boxOf>>;
  }, [geo, cam, fs, PIN, inset, layout]);
  const { viewBox, k } = useViewBox(
    svgRef,
    cam.W,
    cam.H,
    focus ? (boxes[focus] ?? null) : null,
    cover,
    zambia ? 9 : 2.2
  );

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={c.alt}
    >
      <defs>
        <radialGradient id="dd-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f26404" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f26404" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dd-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f26404" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#f26404" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="dd-horizon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9f6f0" stopOpacity="1" />
          <stop offset="100%" stopColor="#f9f6f0" stopOpacity="0" />
        </linearGradient>
        <filter id="dd-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#2b1a16" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Le plateau : la terre en points, plus pâle au loin. */}
      <g aria-hidden style={{ opacity: zambia ? 0 : 1, transition: "opacity 400ms" }}>
        {ground.grid.map((d, i) => (
          <path key={`g${i}`} d={d} fill="none" stroke="#2b1a16" strokeOpacity="0.06" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        {ground.dots.map(({ p, t }, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={(t ? 2.6 : 2.2) * p.s * (layout === "tall" ? 1.15 : 1)}
            fill={t === 2 ? ACCENT : t === 1 ? INK : "#2b1a16"}
            fillOpacity={t ? 0.9 : 0.2 + 0.16 * Math.min(1, Math.max(0, (p.s - 0.8) * 2.5))}
          />
        ))}
        <path d={ground.france} fill={INK} fillOpacity="0.1" stroke={INK} strokeOpacity="0.5" strokeWidth="1" />
        <path d={ground.zambia} fill={ACCENT} fillOpacity="0.14" stroke={ACCENT} strokeOpacity="0.7" strokeWidth="1.2" />
        <ellipse cx={geo.lusaka.x} cy={geo.lusaka.y} rx={46} ry={20} fill="url(#dd-glow)" />
        {/* le lointain se perd dans la brume */}
        <rect x="0" y="0" width={cam.W} height={cam.H * 0.14} fill="url(#dd-horizon)" />
        <ellipse cx={geo.paris.x} cy={geo.paris.y} rx={36} ry={14} fill="url(#dd-glow)" />
      </g>

      {/* La souscription : un arc par ville, vers Paris. */}
      <g {...pick("souscription", labels.souscriptionAria)}>
        {geo.cities.map((ct) => (
          <path
            key={ct.name}
            id={`dd-arc-${ct.name}`}
            d={ct.arc}
            fill="none"
            stroke={on("souscription") ? ACCENT : "#2b1a16"}
            strokeOpacity={on("souscription") ? 0.95 : 0.28}
            strokeWidth={on("souscription") ? 1.8 : 1.1}
            vectorEffect="non-scaling-stroke"
            className={on("souscription") ? "flow-dash" : ""}
          />
        ))}
        {/* zone de clic plus large que le trait */}
        {geo.cities.map((ct) => (
          <path key={`h-${ct.name}`} d={ct.arc} fill="none" stroke="transparent" strokeWidth="12" />
        ))}
        {flows("souscription") &&
          geo.cities
            .filter((_, i) => selected !== null || i % 3 === 0)
            .map((ct, i) => (
            <circle key={`m-${ct.name}`} r={2.4 * fs} fill={ACCENT}>
              <animateMotion dur={`${3.2 + (i % 5) * 0.35}s`} begin={`-${(i * 0.37) % 3}s`} repeatCount="indefinite">
                <mpath href={`#dd-arc-${ct.name}`} />
              </animateMotion>
            </circle>
          ))}
      </g>

      {/* Le retour : coupons et principal, en pointillés. */}
      <g {...pick("retour", labels.retourAria)}>
        <path
          id="dd-ret"
          d={geo.ret}
          fill="none"
          stroke={on("retour") ? INK : "#2b1a16"}
          strokeOpacity={on("retour") ? 0.9 : 0.35}
          strokeWidth={on("retour") ? 2 : 1.3}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="3 5"
          className={on("retour") ? "flow-dash" : ""}
        />
        {on("retour") &&
          geo.cities.map((ct) => (
            <path
              key={`b-${ct.name}`}
              d={ct.back}
              fill="none"
              stroke={INK}
              strokeOpacity="0.55"
              strokeWidth="1.1"
              strokeDasharray="3 5"
              className="flow-dash"
            />
          ))}
        <path d={geo.ret} fill="none" stroke="transparent" strokeWidth="14" />
        {motion && on("retour") && (
          <circle r={3 * fs} fill={INK}>
            <animateMotion dur="3.6s" repeatCount="indefinite">
              <mpath href="#dd-ret" />
            </animateMotion>
          </circle>
        )}
        <Chip x={geo.retMid.x + 14 * fs} y={geo.retMid.y + 16 * fs} text={labels.retour} fs={fs} active={on("retour")} tone="ink" anchor="start" />
      </g>

      {/* Le déploiement : Paris vers Lusaka, l'arc principal. */}
      <g {...pick("deploiement", labels.deploiementAria)}>
        <path
          id="dd-deploy"
          d={geo.deploy}
          fill="none"
          stroke={ACCENT}
          strokeOpacity={on("deploiement") ? 1 : 0.75}
          strokeWidth={on("deploiement") ? 3.2 : 2.4}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          className={on("deploiement") ? "flow-dash" : ""}
        />
        <path d={geo.deploy} fill="none" stroke="transparent" strokeWidth="16" />
        {flows("deploiement") &&
          (selected ? [0, 1.65] : [0]).map((b) => (
            <circle key={b} r={3.6 * fs} fill={ACCENT}>
              <animateMotion dur="3.3s" begin={`-${b}s`} repeatCount="indefinite">
                <mpath href="#dd-deploy" />
              </animateMotion>
            </circle>
          ))}
        <Chip x={geo.deployTop.x + 12 * fs} y={geo.deployTop.y - 6 * fs} text={labels.deploiement} fs={fs} active={on("deploiement")} anchor="start" />
      </g>

      {/* Les souscripteurs : une épingle par ville, et leur étiquette. */}
      <g {...pick("souscripteurs", c.investors)}>
        {geo.cities.map((ct) => (
          <g key={ct.name}>
            <title>{ct.name}</title>
            <line x1={ct.p.x} y1={ct.p.y} x2={ct.p.x} y2={ct.p.y - 14 * ct.p.s * fs} stroke="#2b1a16" strokeOpacity="0.45" strokeWidth="1" />
            <circle
              cx={ct.p.x}
              cy={ct.p.y - 14 * ct.p.s * fs}
              r={(on("souscripteurs") ? 4.2 : 3.4) * ct.p.s * fs}
              fill="#fff"
              stroke={ACCENT}
              strokeWidth={on("souscripteurs") ? 2.4 : 1.8}
            />
          </g>
        ))}
        {geo.americas && (
          <text x={geo.americas.x + 6} y={geo.americas.y + 16 * fs} fontSize={11 * fs} fill="#57534e">
            {c.americas}
          </text>
        )}
        {geo.asia && (
          <text x={geo.asia.x - 6} y={geo.asia.y + 16 * fs} textAnchor="end" fontSize={11 * fs} fill="#57534e">
            {c.asia}
          </text>
        )}

      </g>
      {/* La souscription a aussi son étiquette, près de Paris. */}
      <g {...pick("souscription", labels.souscriptionAria)}>
        <Chip
          x={geo.paris.x - 20 * fs}
          y={geo.paris.y + 26 * fs}
          text={labels.souscription}
          fs={fs}
          active={on("souscription")}
          anchor="end"
        />
      </g>

      {/* Minah SAS, à Paris */}
      <g {...pick("minah", c.minah)}>
        <Pin p={geo.paris} h={PIN} color={INK} active={on("minah")} fs={fs} />
        <Card
          x={layout === "wide" ? geo.paris.x : 20}
          y={geo.paris.y - PIN * geo.paris.s - (layout === "wide" ? 62 : 40) * fs}
          title={c.minah}
          sub={c.minahSub}
          fig={labels.minahFig}
          fs={fs}
          dark
          active={on("minah")}
          center={layout === "wide"}
        />
      </g>

      {/* Le fil de Lusaka vers l'encart, au téléphone */}
      {layout === "tall" && (
        <line
          aria-hidden
          x1={geo.lusaka.x}
          y1={geo.lusaka.y}
          x2={inset.x + inset.w / 2}
          y2={inset.y}
          stroke={ACCENT}
          strokeOpacity="0.45"
          strokeWidth="1.2"
          strokeDasharray="2 4"
        />
      )}

      {/* Africa Rise, à Lusaka */}
      <g {...pick("africa-rise", c.africaRise)}>
        <Pin p={geo.lusaka} h={PIN * 0.8} color={ACCENT} active={on("africa-rise")} fs={fs} />
        {/* Au large, l'étiquette monte au-dessus de l'épingle : à côté,
            l'encart « En Zambie » ou le panneau de détail la recouvraient. */}
        <Card
          x={layout === "wide" ? geo.lusaka.x + 10 * fs : geo.lusaka.x - 18 * fs}
          y={
            layout === "wide"
              ? geo.lusaka.y - PIN * 0.8 * geo.lusaka.s - 84 * fs
              : geo.lusaka.y - PIN * 0.8 * geo.lusaka.s - 52 * fs
          }
          title={c.africaRise}
          sub={c.africaRiseSub}
          fig={labels.africaRiseFig}
          fs={fs}
          active={on("africa-rise")}
          alignRight
        />
      </g>

      {layout === "tall" ? (
        <ZambiaInset box={inset} fs={1.38} c={c} labels={labels} pick={pick} on={on} motion={motion} />
      ) : (
        <>
          {/* Au repos, une invitation à zoomer sur le pays. */}
          <g {...pick("pme", c.zoomZambia)}>
            <Chip
              x={geo.lusaka.x - 40 * fs}
              y={geo.lusaka.y + 46 * fs}
              text={`${c.zoomZambia} →`}
              fs={fs}
              active={false}
              anchor="end"
            />
          </g>
          <ZambiaZoom
            cam={cam}
            k={k}
            locale={locale}
            visible={zambia}
            pick={(id, label) => pick(id, label, "zoom")}
            on={on}
            labels={labels}
            motion={motion}
          />
        </>
      )}
    </svg>
  );
}

type PickFn = (id: string, label: string) => Record<string, unknown>;

// Encart « En Zambie » : l'État en haut, les PME au milieu, Africa Rise en
// bas. Africa Rise finance les PME (flèches montantes), l'État les paie
// (flèches descendantes).
function ZambiaInset({
  box,
  fs,
  c,
  labels,
  pick,
  on,
  motion,
}: {
  box: { x: number; y: number; w: number; h: number };
  fs: number;
  c: (typeof copy)[Locale];
  labels: Record<string, string>;
  pick: PickFn;
  on: (id: string) => boolean;
  motion: boolean;
}) {
  const { x, y, w, h } = box;
  const pad = 16 * fs;
  const tileH = 40 * fs;
  const gap = 10 * fs;
  const smeW = (w - pad * 2 - gap) / 2;
  const stateH = tileH * 1.55;
  const rowState = y + 50 * fs;
  const rowSme = rowState + stateH + 30 * fs;
  const rowAr = y + h - pad - tileH;
  const midW = Math.min(w * 0.46, 200 * fs);
  const stateW = Math.min(w - pad * 2, 380 * fs);

  const smeX = (i: number) => x + pad + i * (smeW + gap);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#fffdfb" stroke="rgb(43 26 22 / 0.12)" filter="url(#dd-shadow)" />
      <text x={x + pad} y={y + 26 * fs} fontSize={13 * fs} fontWeight={600} fill="var(--bm-ink)">
        {c.zambia}
      </text>
      <text x={x + pad} y={y + 42 * fs} fontSize={11 * fs} fill="#57534e">
        {c.zambiaSub}
      </text>

      {/* Règlement : l'État paie les PME */}
      <g {...pick("reglement", labels.reglementAria)}>
        {[0, 1].map((i) => (
          <Arrow
            key={i}
            x1={x + w / 2}
            y1={rowState + stateH}
            x2={smeX(i) + smeW / 2}
            y2={rowSme - 2}
            active={on("reglement")}
            motion={motion}
            delay={i * 0.4}
          />
        ))}
        <rect x={x + w / 2 - 4} y={rowState + stateH} width={w / 2} height={rowSme - rowState - stateH} fill="transparent" />
        <Chip x={x + w - pad} y={(rowState + stateH + rowSme) / 2 + 4 * fs} text={labels.reglement} fs={fs * 0.92} active={on("reglement")} anchor="end" />
      </g>

      {/* Financement : Africa Rise vers les PME */}
      <g {...pick("financement", labels.financementAria)}>
        {[0, 1].map((i) => (
          <Arrow
            key={i}
            x1={x + w / 2}
            y1={rowAr}
            x2={smeX(i) + smeW / 2}
            y2={rowSme + tileH + 2}
            active={on("financement")}
            motion={motion}
            delay={i * 0.4}
          />
        ))}
        <rect x={x} y={rowSme + tileH} width={w / 2} height={rowAr - rowSme - tileH} fill="transparent" />
        <Chip x={x + pad} y={(rowSme + tileH + rowAr) / 2 + 4 * fs} text={labels.financement} fs={fs * 0.92} active={on("financement")} anchor="start" />
      </g>

      <g {...pick("etat", c.state)}>
        <rect x={x + w / 2 - stateW / 2} y={rowState} width={stateW} height={stateH} rx={8} fill="#fff" stroke={on("etat") ? "var(--bm-accent)" : "rgb(43 26 22 / 0.18)"} strokeWidth={on("etat") ? 2 : 1} />
        <text x={x + w / 2} y={rowState + 18 * fs} textAnchor="middle" fontSize={12.5 * fs} fontWeight={600} fill="var(--bm-ink)">
          {c.state}
        </text>
        <image href="/partners/zambia-msmed.png" x={x + w / 2 - stateW / 2 + 10 * fs} y={rowState + 26 * fs} width={stateW / 2 - 16 * fs} height={stateH - 32 * fs} preserveAspectRatio="xMidYMid meet" />
        <image href="/partners/zambia-mlgrd.png" x={x + w / 2 + 6 * fs} y={rowState + 26 * fs} width={stateW / 2 - 16 * fs} height={stateH - 32 * fs} preserveAspectRatio="xMidYMid meet" />
      </g>
      {c.smes.map((sm, i) => (
        <g key={sm.id} {...pick(sm.id, `${sm.t}, ${sm.s}`)}>
          <Tile x={smeX(i)} y={rowSme} w={smeW} h={tileH} title={sm.t} sub={sm.s} fs={fs * 0.92} active={on("pme") || on(sm.id)} />
        </g>
      ))}
      <g {...pick("africa-rise", c.africaRise)}>
        <Tile x={x + w / 2 - midW / 2} y={rowAr} w={midW} h={tileH} title={c.africaRise} sub={c.africaRiseSub} fs={fs} active={on("africa-rise")} accent />
      </g>
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  active,
  motion,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  motion: boolean;
  delay: number;
}) {
  const d = `M${x1} ${y1}C${x1} ${(y1 + y2) / 2},${x2} ${(y1 + y2) / 2},${x2} ${y2}`;
  const ang = Math.atan2(y2 - y1, 0);
  const s = 5;
  const tip = `M${x2 - s} ${y2 - s * Math.sign(Math.sin(ang))}L${x2} ${y2}L${x2 + s} ${y2 - s * Math.sign(Math.sin(ang))}`;
  const id = `dd-in-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}`;
  return (
    <g>
      <path id={id} d={d} fill="none" stroke={active ? "var(--bm-accent)" : "#2b1a16"} strokeOpacity={active ? 1 : 0.32} strokeWidth={active ? 1.8 : 1.2} className={active ? "flow-dash" : ""} />
      <path d={tip} fill="none" stroke={active ? "var(--bm-accent)" : "#2b1a16"} strokeOpacity={active ? 1 : 0.4} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      {motion && active && (
        <circle r="2.6" fill="var(--bm-accent)">
          <animateMotion dur="1.8s" begin={`-${delay}s`} repeatCount="indefinite">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      )}
    </g>
  );
}

function Tile({
  x,
  y,
  w,
  h,
  title,
  sub,
  fs,
  active,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  fs: number;
  active: boolean;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={accent ? "#fdf0e6" : "#fff"}
        stroke={active ? "var(--bm-accent)" : "rgb(43 26 22 / 0.18)"}
        strokeWidth={active ? 2 : 1}
      />
      <text x={x + w / 2} y={y + h / 2 - 2 * fs} textAnchor="middle" fontSize={12.5 * fs} fontWeight={600} fill="var(--bm-ink)">
        {title}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 13 * fs} textAnchor="middle" fontSize={10.5 * fs} fill="#57534e">
        {sub}
      </text>
    </g>
  );
}

// Épingle : une tige et une tête, plantées dans le plateau.
function Pin({ p, h, color, active, fs }: { p: Pt; h: number; color: string; active: boolean; fs: number }) {
  const top = p.y - h * p.s;
  return (
    <g>
      <ellipse cx={p.x} cy={p.y} rx={9 * fs} ry={3.5 * fs} fill="#2b1a16" fillOpacity="0.18" />
      <line x1={p.x} y1={p.y} x2={p.x} y2={top} stroke={color} strokeWidth={active ? 2.4 : 1.8} />
      <circle cx={p.x} cy={top} r={(active ? 7.5 : 6) * fs} fill={color} stroke="#fff" strokeWidth={2} />
    </g>
  );
}

// Étiquette d'un acteur : titre, sous-titre, chiffre.
function Card({
  x,
  y,
  title,
  sub,
  fig,
  fs,
  active,
  dark = false,
  center = false,
  alignRight = false,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  fig?: string;
  fs: number;
  active: boolean;
  dark?: boolean;
  center?: boolean;
  alignRight?: boolean;
}) {
  const pad = 12 * fs;
  const w = Math.max(title.length * 7.6, sub.length * 6.2, (fig?.length ?? 0) * 6.8 + 16) * fs + pad * 2;
  const h = (fig ? 66 : 46) * fs;
  const left = center ? x - w / 2 : alignRight ? x - w : x;
  return (
    <g filter="url(#dd-shadow)">
      <rect
        x={left}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={dark ? "var(--bm-minah)" : "#fff"}
        stroke={active ? "var(--bm-accent)" : dark ? "transparent" : "rgb(43 26 22 / 0.14)"}
        strokeWidth={active ? 2.4 : 1}
      />
      <text x={left + pad} y={y + 20 * fs} fontSize={13.5 * fs} fontWeight={600} fill={dark ? "#fff" : "var(--bm-ink)"}>
        {title}
      </text>
      <text x={left + pad} y={y + 36 * fs} fontSize={11 * fs} fill={dark ? "rgb(255 255 255 / 0.75)" : "#57534e"}>
        {sub}
      </text>
      {fig && (
        <>
          <rect x={left + pad} y={y + 44 * fs} width={fig.length * 6.8 * fs + 12 * fs} height={16 * fs} rx={4} fill={dark ? "rgb(255 255 255 / 0.16)" : "rgb(242 100 4 / 0.1)"} />
          <text x={left + pad + 6 * fs} y={y + 56 * fs} fontSize={10.5 * fs} fontWeight={600} fill={dark ? "#fff" : "#7a2e1f"}>
            {fig}
          </text>
        </>
      )}
    </g>
  );
}

// Libellé posé sur un flux.
function Chip({
  x,
  y,
  text,
  fs,
  active,
  anchor = "middle",
  tone = "accent",
}: {
  x: number;
  y: number;
  text: string;
  fs: number;
  active: boolean;
  anchor?: "start" | "middle" | "end";
  tone?: "accent" | "ink";
}) {
  const w = text.length * 6.6 * fs + 16 * fs;
  const h = 20 * fs;
  const left = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect
        x={left}
        y={y - h + 5 * fs}
        width={w}
        height={h}
        rx={6}
        fill={active ? (tone === "ink" ? "#f3e8e6" : "#fdf0e6") : "#fbfaf7"}
        stroke={active ? (tone === "ink" ? "var(--bm-minah)" : "var(--bm-accent)") : "rgb(43 26 22 / 0.18)"}
        strokeWidth={active ? 1.6 : 1}
      />
      <text x={left + w / 2} y={y} textAnchor="middle" fontSize={11.5 * fs} fontWeight={600} fill={active ? "#7a2e1f" : "#3f3a36"}>
        {text}
      </text>
    </g>
  );
}
