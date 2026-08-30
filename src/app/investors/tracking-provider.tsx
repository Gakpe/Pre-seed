"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { track } from "@/lib/tracking";

type InvestorLite = {
  id: string;
  email: string;
  full_name: string | null;
  entity: string | null;
};

let posthogInitialized = false;

function scrollDepth(): number {
  const el = document.documentElement;
  const total = el.scrollHeight - window.innerHeight;
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
}

export function TrackingProvider({ investor }: { investor: InvestorLite }) {
  const pathname = usePathname();
  const startRef = useRef(0);
  const maxScrollRef = useRef(0);
  const pathRef = useRef<string | null>(null);
  const leftRef = useRef(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    if (!posthogInitialized) {
      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      });
      posthogInitialized = true;
    }
    posthog.identify(investor.id, {
      email: investor.email,
      full_name: investor.full_name,
      entity: investor.entity,
    });
  }, [investor]);

  useEffect(() => {
    function sendLeave() {
      if (leftRef.current || !pathRef.current) return;
      leftRef.current = true;
      track({
        type: "page_leave",
        path: pathRef.current,
        duration_ms: Date.now() - startRef.current,
        scroll_depth: maxScrollRef.current,
      });
    }

    // Navigation SPA : clôt la page précédente avant d'ouvrir la nouvelle.
    if (pathRef.current && pathRef.current !== pathname) sendLeave();
    pathRef.current = pathname;
    startRef.current = Date.now();
    maxScrollRef.current = scrollDepth();
    leftRef.current = false;
    track({ type: "page_view", path: pathname });

    const onScroll = () => {
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollDepth());
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        sendLeave();
      } else {
        // Retour sur l'onglet : nouveau segment de temps.
        leftRef.current = false;
        startRef.current = Date.now();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", sendLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", sendLeave);
    };
  }, [pathname]);

  return null;
}
