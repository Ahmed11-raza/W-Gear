"use client";
import type { TeamwearConfiguration } from "@/types";
import type { Action } from "@/lib/teamwear-state";
import { Uploader } from "../Uploader";

export function UploadStep({ state, dispatch }: { state: TeamwearConfiguration; dispatch: (a: Action) => void }) {
  return (
    <div className="flex max-w-xl flex-col gap-10">
      <Uploader
        label="Team logo or crest"
        hint="PNG, JPG, SVG or WebP. Up to 5 MB. Vector or a transparent PNG prints best."
        asset={state.logo}
        onChange={(asset) => dispatch({ type: "setLogo", asset })}
      />
      <Uploader
        label="Sponsor artwork (optional)"
        hint="If a sponsor goes on the kit, add their mark here."
        asset={state.sponsor}
        onChange={(asset) => dispatch({ type: "setSponsor", asset })}
      />
      <p className="border-l-2 border-line-strong pl-4 text-[0.8125rem] text-muted">
        Files stay in your browser until you send the request. Nothing is
        uploaded while you are still configuring.
      </p>
    </div>
  );
}
