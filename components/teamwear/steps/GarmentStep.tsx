"use client";
import { garmentsForSport } from "@/data/teamwear";
import type { TeamwearConfiguration, GarmentId } from "@/types";
import type { Action } from "@/lib/teamwear-state";
import { OptionGrid, OptionCard } from "../controls";

export function GarmentStep({ state, dispatch }: { state: TeamwearConfiguration; dispatch: (a: Action) => void }) {
  const garments = garmentsForSport(state.sport);

  if (garments.length === 0) {
    return (
      <p className="text-muted">
        We have not listed a standard garment for that sport yet. Choose
        &ldquo;Something else&rdquo; on the previous step and describe it in your
        message &mdash; we build to spec.
      </p>
    );
  }

  return (
    <OptionGrid legend="Choose a garment">
      {garments.map((g) => (
        <OptionCard
          key={g.id}
          name="garment"
          value={g.id}
          checked={state.garment === g.id}
          onChange={(v) => dispatch({ type: "setGarment", garment: v as GarmentId })}
          title={g.name}
          note={`Minimum ${g.minimumOrder} units`}
        />
      ))}
    </OptionGrid>
  );
}
