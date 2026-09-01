"use client";

import { track } from "@/lib/tracking";
import { deal } from "@/lib/deal";

export function MeetingButton() {
  return (
    <a
      href={deal.meetingUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        track({ type: "cta_click", path: "/investors/home", label: "rdv-equipe" })
      }
      className="inline-block rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
    >
      Prendre rendez-vous
    </a>
  );
}
