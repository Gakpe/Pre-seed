// Projection en perspective d'une carte plane : la terre est un plateau
// incliné vu de biais, le nord s'éloigne. Un point peut avoir une hauteur
// au-dessus du plateau (sommet d'un arc, tête d'une épingle).

export type Camera = {
  /** Taille du viewBox. */
  W: number;
  H: number;
  /** Centre de la carte, en degrés. */
  lon0: number;
  lat0: number;
  /** Unités de viewBox par degré, au centre. */
  k: number;
  /** Inclinaison du regard sur le plateau, en degrés (90 = vue de dessus). */
  tilt: number;
  /** Rotation du plateau autour de la verticale, en degrés. */
  yaw: number;
  /** Distance de la caméra, en unités de viewBox. */
  D: number;
  /** Position du centre de la carte à l'écran. */
  cx: number;
  cy: number;
  /** Échelle des textes. */
  fs: number;
};

export type Pt = { x: number; y: number; s: number };

const RAD = Math.PI / 180;

export function project(cam: Camera, lon: number, lat: number, h = 0): Pt {
  const u0 = (lon - cam.lon0) * cam.k;
  const v0 = (lat - cam.lat0) * cam.k;
  const cy = Math.cos(cam.yaw * RAD);
  const sy = Math.sin(cam.yaw * RAD);
  const u = u0 * cy - v0 * sy;
  const v = u0 * sy + v0 * cy;
  const a = cam.tilt * RAD;
  const yCam = v * Math.sin(a) + h * Math.cos(a);
  const depth = cam.D + v * Math.cos(a) - h * Math.sin(a);
  const s = cam.D / depth;
  return { x: cam.cx + u * s, y: cam.cy - yCam * s, s };
}

/** Arc qui s'élève entre deux points du plateau, échantillonné. */
export function arcPoints(
  cam: Camera,
  a: [number, number],
  b: [number, number],
  lift: number,
  n = 36
): Pt[] {
  const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const H = dist * cam.k * lift;
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push(
      project(cam, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, H * Math.sin(Math.PI * t))
    );
  }
  return out;
}

export function toPath(pts: Pt[]): string {
  return pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");
}
