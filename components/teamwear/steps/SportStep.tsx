"use client";
import { SPORTS } from "@/data/teamwear";
import type { TeamwearConfiguration, SportId } from "@/types";
import type { Action } from "@/lib/teamwear-state";
import { OptionGrid, OptionCard } from "../controls";

export function SportStep({ state, dispatch }: { state: TeamwearConfiguration; dispatch: (a: Action) => void }) {
  return (
    <OptionGrid legend="Choose your sport">
      {SPORTS.map((s) => (
        <OptionCard
          key={s.id}
          name="sport"
          value={s.id}
          checked={state.sport === s.id}
          onChange={(v) => dispatch({ type: "setSport", sport: v as SportId })}
          title={s.name}
          note={s.note}
        />
      ))}
    </OptionGrid>
  );
}
