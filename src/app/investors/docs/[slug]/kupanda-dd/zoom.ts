"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Zoom d'une scène SVG sur une zone : le viewBox glisse vers la boîte visée,
// recentrée dans la partie de la scène que le panneau de détail laisse
// visible. Sans boîte, la scène entière, centrée.

export type Box = { x: number; y: number; w: number; h: number };
type VB = { x: number; y: number; w: number; h: number };

/** Boîte englobant des points, avec une marge. */
export function boxOf(points: { x: number; y: number }[], pad = 24): Box {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y };
}

export function useViewBox(
  svg: React.RefObject<SVGSVGElement | null>,
  W: number,
  H: number,
  box: Box | null,
  /** Largeur en pixels masquée à droite par le panneau. */
  cover: number,
  /** Zoom maximal, en multiple de la vue d'ensemble. */
  maxZoom = 2.2
): { viewBox: string; k: number } {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [svg]);

  const target = useMemo<VB>(() => {
    if (!size || !size.w || !size.h) return { x: 0, y: 0, w: W, h: H };
    const { w: ew, h: eh } = size;
    // Échelle où la scène entière tient dans l'élément.
    const k0 = Math.min(ew / W, eh / H);
    if (!box) {
      const w = ew / k0;
      const h = eh / k0;
      return { x: W / 2 - w / 2, y: H / 2 - h / 2, w, h };
    }
    const vw = Math.max(ew - cover, ew * 0.35);
    const k = Math.min(Math.max(Math.min(vw / box.w, eh / box.h), k0 * 0.7), k0 * maxZoom);
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    return { x: cx - vw / 2 / k, y: cy - eh / 2 / k, w: ew / k, h: eh / k };
  }, [size, W, H, box, cover, maxZoom]);

  // Glissement vers la cible, en 650 ms.
  const [vb, setVb] = useState<VB>({ x: 0, y: 0, w: W, h: H });
  const from = useRef<VB>(vb);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 1 : 650;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      const next = {
        x: a.x + (target.x - a.x) * e,
        y: a.y + (target.y - a.y) * e,
        w: a.w + (target.w - a.w) * e,
        h: a.h + (target.h - a.h) * e,
      };
      from.current = next;
      setVb(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return {
    viewBox: `${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`,
    // Échelle de la cible, en pixels par unité : fixe pendant le glissement.
    k: size ? size.w / target.w : 1,
  };
}
